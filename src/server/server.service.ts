// src/server.ts

import express from 'express';
import type { Server as HttpServer } from 'node:http';
import { createStatefulServer, type CreateServerArg } from "@smithery/sdk/server/stateful.js";
import { SessionCache, type CacheOptions } from '../session-cache/SessionCache.js';
import { McpServerFactory } from './McpServerFactory.js';

export interface ServerOptions {
  accessToken?: string; // A default FMP access token
  cacheOptions?: CacheOptions;
}

/**
 * A stateful MCP Server that manages isolated sessions using a dedicated cache.
 * Each session gets its own McpServer instance and its own DynamicToolsetManager,
 * allowing for unique, per-session tool configurations.
 */
export class StatefulMcpServer {
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
   */
  public start(port: number): void {
    if (this.httpServer) {
      console.warn("Server is already running.");
      return;
    }
    this.httpServer = this.app.listen(port, () => {
      console.log(`🚀 Stateful MCP Server started on port ${port}`);
      console.log(`🧠 Cache configured with maxSize: ${this.cache['maxSize']}, ttl: ${this.cache['ttl']}ms`);
    });
  }

  /**
   * Stops the HTTP server and the cache's background cleanup tasks.
   */
  public stop(): void {
    this.cache.stop(); // Stops the periodic pruning interval
    this.httpServer?.close(() => {
      console.log("Stateful MCP Server stopped.");
    });
    this.httpServer = null;
  }

  /**
   * Sets up the Express routes, including the main stateful MCP handler.
   */
  private _setupRoutes(): void {
    // createStatefulServer provides the middleware that handles session creation and routing.
    // We pass it our core logic function for handling session resources.
    const { app: mcpApp } = createStatefulServer(
      (params) => this._getSessionResources(params)
    );
    this.app.use(mcpApp); // Mount the stateful server middleware

    // Add a simple health check endpoint
    this.app.get('/health', (req, res) => {
        res.status(200).json({ 
            status: 'ok', 
            activeCachedSessions: this.cache['cache'].size 
        });
    });
  }

  /**
   * The core logic for getting or creating session resources.
   * This function is passed to the stateful server handler and is called for each request.
   */
  private _getSessionResources(params: CreateServerArg): any {
    const { sessionId, config: sessionConfig } = params;

    // Check cache first
    const cached = this.cache.get(sessionId);
    if (cached) {
      console.log(`[Server] Reusing cached resources for session: ${sessionId}`);
      return cached.mcpServer;
    }

    // Create new server using factory
    console.log(`[Server] Creating new resources for session: ${sessionId}`);
    const result = this.serverFactory.createServer({
      sessionId,
      config: sessionConfig,
      serverAccessToken: this.serverOptions.accessToken
    });

    console.log(`[Server] Session ${sessionId} created with mode: ${result.mode}`);

    // Cache the resources
    this.cache.set(sessionId, { 
      mcpServer: result.mcpServer, 
      toolManager: result.toolManager 
    });

    return result.mcpServer;
  }

}
