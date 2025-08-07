import express from 'express';
import type { Server as HttpServer } from 'node:http';
import { createStatefulServer, type CreateServerArg } from "@smithery/sdk/server/stateful.js";
import { SessionCache, type CacheOptions } from '../session-cache/SessionCache.js';
import { McpServerFactory, type SessionConfig } from '../mcp-server-factory/McpServerFactory.js';

export interface ServerOptions {
  accessToken?: string;
  cacheOptions?: CacheOptions;
}

/**
 * A stateful MCP Server service that manages isolated sessions using a dedicated cache.
 * Each session gets its own McpServer instance and its own DynamicToolsetManager,
 * allowing for unique, per-session tool configurations.
 */
export class McpServer {
  private app: express.Application;
  private httpServer: HttpServer | null = null;
  private cache: SessionCache;
  private serverOptions: ServerOptions;
  private serverFactory: McpServerFactory;

  constructor(options: ServerOptions = {}) {
    this.serverOptions = options;
    this.cache = new SessionCache(options.cacheOptions);
    this.serverFactory = new McpServerFactory();
    this.app = express();
    this._setupRoutes();
  }

  /**
   * Starts the HTTP server on the specified port.
   * @param port - The port number to listen on
   */
  public start(port: number): void {
    if (this.httpServer) {
      console.warn("[McpServer] ⚠️  Server is already running.");
      return;
    }

    if (!this.serverOptions.accessToken) {
      console.warn("[McpServer] ⚠️ Server access token is required for operations - running dummy server");
    }
    
    try {
      this.httpServer = this.app.listen(port, () => {
        console.log(`[McpServer] 🚀 MCP Server started successfully on port ${port}`);
        console.log(`[McpServer] 🧠 Session cache configured with maxSize: ${this.cache['maxSize']}, ttl: ${this.cache['ttl']}ms`);
        console.log(`[McpServer] 🏥 Health endpoint available at http://localhost:${port}/healthcheck`);
        console.log(`[McpServer] 🔌 MCP endpoint available at http://localhost:${port}/mcp`);
      });

      this.httpServer.on('error', (error) => {
        console.error(`[McpServer] ❌ Server failed to start:`, error);
        this.httpServer = null;
      });

    } catch (error) {
      console.error(`[McpServer] ❌ Failed to start server on port ${port}:`, error);
      throw error;
    }
  }

  /**
   * Stops the HTTP server and the cache's background cleanup tasks.
   * Performs graceful shutdown with proper cleanup.
   */
  public stop(): void {
    try {
      console.log("[McpServer] 🛑 Initiating server shutdown...");
      
      // Stop the cache's background cleanup tasks first
      this.cache.stop();
      console.log("[McpServer] ✅ Session cache stopped");
      
      // Close the HTTP server
      if (this.httpServer) {
        this.httpServer.close(() => {
          console.log("[McpServer] ✅ Stateful MCP Server stopped successfully");
        });
        this.httpServer = null;
      } else {
        console.log("[McpServer] ℹ️  Server was not running");
      }
      
    } catch (error) {
      console.error("[McpServer] ❌ Error during server shutdown:", error);
      // Ensure cleanup even if errors occur
      this.httpServer = null;
      throw error;
    }
  }

  /**
   * Sets up the Express routes, including the main stateful MCP handler.
   */
  private _setupRoutes(): void {
    try {
      // createStatefulServer provides the middleware that handles session creation and routing.
      // We pass it our core logic function for handling session resources.
      const { app: mcpApp } = createStatefulServer(
        (params) => this._getSessionResources(params)
      );
      this.app.use(mcpApp); // Mount the stateful server middleware

      // Add comprehensive health check endpoint
      this.app.get('/healthcheck', (req, res) => {
        try {
          const cacheSize = this.cache['cache']?.size || 0;
          const uptime = process.uptime();
          
          res.status(200).json({ 
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: uptime,
            sessionManagement: 'stateful',
            activeCachedSessions: cacheSize,
            cache: {
              size: cacheSize,
              maxSize: this.cache['maxSize'],
              ttl: this.cache['ttl']
            },
            server: {
              type: 'McpServer',
              version: process.env.npm_package_version || 'unknown'
            }
          });
        } catch (error) {
          console.error('[McpServer] ❌ Health check error:', error);
          res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
          });
        }
      });

      console.log('[McpServer] ✅ Routes configured successfully');
      
    } catch (error) {
      console.error('[McpServer] ❌ Failed to setup routes:', error);
      throw error;
    }
  }

  /**
   * The core logic for getting or creating session resources.
   * This function is passed to the stateful server handler and is called for each request.
   * Implements proper error handling and logging for session management.
   * Compatible with SDK's CreateServerFn<SessionConfig> signature.
   */
  private _getSessionResources(params: CreateServerArg<SessionConfig>): any {
    const { sessionId, config: sessionConfig} = params;

    try {
      // Check cache first
      const cached = this.cache.get(sessionId);
      if (cached) {
        console.log(`[McpServer] ✅ Reusing cached resources for session: ${sessionId}`);
        return cached.mcpServer;
      }

      // Create new server using factory's SDK-compatible method
      console.log(`[McpServer] 🔧 Creating new resources for session: ${sessionId}`);
      const mcpServer = this.serverFactory.createServerFromSdkArg(params);

      // Get the creation result for caching (we need to recreate it for the toolManager)
      const result = this.serverFactory.createServer({
        sessionId,
        config: sessionConfig,
        serverAccessToken: this.serverOptions.accessToken
      });

      console.log(`[McpServer] ✅ Session ${sessionId} created successfully with mode: ${result.mode}`);

      // Cache the resources
      this.cache.set(sessionId, { 
        mcpServer, 
        toolManager: result.toolManager 
      });

      return mcpServer;

    } catch (error) {
      console.error(`[McpServer] ❌ Failed to create resources for session ${sessionId}:`, error);
      
      // Log detailed error information for debugging
      if (error instanceof Error) {
        console.error(`[McpServer] Error details: ${error.message}`);
        console.error(`[McpServer] Stack trace:`, error.stack);
      }
      
      // Re-throw to let the stateful server handle the error appropriately
      throw error;
    }
  }

  /**
   * Gets the current server status and statistics
   * @returns Server status information
   */
  public getStatus() {
    return {
      running: this.httpServer !== null,
      activeSessions: this.cache['cache']?.size || 0,
      cacheConfig: {
        maxSize: this.cache['maxSize'],
        ttl: this.cache['ttl']
      },
      serverOptions: {
        hasAccessToken: !!this.serverOptions.accessToken
      }
    };
  }

  /**
   * Gets the Express application instance (useful for testing)
   * @returns Express application
   */
  public getApp(): express.Application {
    return this.app;
  }

  /**
   * Checks if the server is currently running
   * @returns True if server is running
   */
  public isRunning(): boolean {
    return this.httpServer !== null;
  }

}
