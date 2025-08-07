import express from 'express';
import type { Server as HttpServer } from 'node:http';
import { createStatefulServer, type CreateServerArg } from "@smithery/sdk/server/stateful.js";
import { SessionCache, type CacheOptions } from '../session-cache/index.js';
import { McpServerFactory, type SessionConfig } from '../mcp-server-factory/index.js';
import { legacyConfigMiddleware } from '../middleware/index.js';

export interface ServerOptions {
  accessToken?: string;
  cacheOptions?: CacheOptions;
}

/**
 * A stateful MCP Server service that manages isolated sessions using a dedicated cache.
 * Each session gets its own McpServer instance and its own DynamicToolsetManager,
 * allowing for unique, per-session tool configurations.
 */
export class FmpMcpServer {
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
      console.warn("[FmpMcpServer] ⚠️  Server is already running.");
      return;
    }

    if (!this.serverOptions.accessToken) {
      console.warn("[FmpMcpServer] ⚠️ Server access token is required for operations - running dummy server");
    }
    
    try {
      this.httpServer = this.app.listen(port, () => {
        console.log(`[FmpMcpServer] 🚀 MCP Server started successfully on port ${port}`);
        console.log(`[FmpMcpServer] 🧠 Session cache configured with maxSize: ${this.cache['maxSize']}, ttl: ${this.cache['ttl']}ms`);
        console.log(`[FmpMcpServer] 🏥 Health endpoint available at http://localhost:${port}/healthcheck`);
        console.log(`[FmpMcpServer] 🔌 MCP endpoint available at http://localhost:${port}/mcp`);
      });

      this.httpServer.on('error', (error) => {
        console.error(`[FmpMcpServer] ❌ Server failed to start:`, error);
        this.httpServer = null;
      });

    } catch (error) {
      console.error(`[FmpMcpServer] ❌ Failed to start server on port ${port}:`, error);
      throw error;
    }
  }

  /**
   * Stops the HTTP server and the cache's background cleanup tasks.
   * Performs graceful shutdown with proper cleanup.
   */
  public stop(): void {
    try {
      console.log("[FmpMcpServer] 🛑 Initiating server shutdown...");
      
      // Stop the cache's background cleanup tasks first
      this.cache.stop();
      console.log("[FmpMcpServer] ✅ Session cache stopped");
      
      // Close the HTTP server
      if (this.httpServer) {
        this.httpServer.close(() => {
          console.log("[FmpMcpServer] ✅ Stateful MCP Server stopped successfully");
        });
        this.httpServer = null;
      } else {
        console.log("[FmpMcpServer] ℹ️  Server was not running");
      }
      
    } catch (error) {
      console.error("[FmpMcpServer] ❌ Error during server shutdown:", error);
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
      // Add middleware to handle legacy mode - requests without session config
      this.app.use(legacyConfigMiddleware);

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
          const memoryUsage = process.memoryUsage()
          
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
              type: 'FmpMcpServer',
              version: process.env.npm_package_version || 'unknown'
            },
            memoryUsage: {
              rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
              heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
              heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
              external: Math.round(memoryUsage.external / 1024 / 1024) + 'MB'
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
        console.log(`[FmpMcpServer] ✅ Reusing cached resources for session: ${sessionId}`);
        return cached.mcpServer;
      }

      // Create new server using factory's comprehensive method
      console.log(`[FmpMcpServer] 🔧 Creating new resources for session: ${sessionId}`);
      const result = this.serverFactory.createServer({
        sessionId,
        config: sessionConfig,
        serverAccessToken: this.serverOptions.accessToken
      });

      console.log(`[FmpMcpServer] ✅ Session ${sessionId} created successfully with mode: ${result.mode}`);

      // Cache the resources
      this.cache.set(sessionId, { 
        mcpServer: result.mcpServer, 
        toolManager: result.toolManager 
      });

      return result.mcpServer;

    } catch (error) {
      console.error(`[FmpMcpServer] ❌ Failed to create resources for session ${sessionId}:`, error);

      // Log detailed error information for debugging
      if (error instanceof Error) {
        console.error(`[FmpMcpServer] Error details: ${error.message}`);
        console.error(`[FmpMcpServer] Stack trace:`, error.stack);
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
