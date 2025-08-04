// src/server.ts

import express from 'express';
import type { Server as HttpServer } from 'node:http';
import { createStatefulServer, type StatefulServerParams } from "@smithery/sdk/server/stateful.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SessionCache, type CacheOptions } from './cache'; // Assuming cache.ts is in the same directory
import { DynamicToolsetManager } from './dynamic-toolset-manager'; // Assuming this is the refactored, non-singleton class
import { registerMetaTools } from './meta-tools'; // Assuming this is adapted to accept a manager instance

// --- Helper Function Implementations ---
// (These were previously declared placeholders)

/**
 * Creates a new, isolated McpServer instance for a session.
 * This includes the configuration schema that clients can inspect.
 */
function createMcpServer(options: { sessionId: string; config?: any }): McpServer {
  const mcpServer = new McpServer({
    name: "Financial Modeling Prep MCP (Stateful)",
    version: "2.0.0", // Example version
    capabilities: {
      tools: { listChanged: true }, // Essential for dynamic mode
    },
    // Define the configuration that clients can provide when they initialize a session.
    configSchema: {
      type: "object",
      properties: {
        FMP_ACCESS_TOKEN: {
          type: "string",
          title: "FMP Access Token",
          description: "Financial Modeling Prep API access token",
        },
        DYNAMIC_TOOL_DISCOVERY: {
          type: "string",
          title: "Dynamic Tool Discovery (Optional)",
          description: "Enable dynamic toolset management. Set to 'true' to use meta-tools.",
        },
      },
    },
  });
  return mcpServer;
}

/**
 * Resolves the access token, giving priority to the session-provided token.
 */
function resolveAccessToken(serverToken?: string, sessionConfig?: any): string | undefined {
  return sessionConfig?.FMP_ACCESS_TOKEN || serverToken;
}


// --- Main Server Class ---

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

  constructor(options: ServerOptions = {}) {
    this.serverOptions = options;
    this.cache = new SessionCache(options.cacheOptions);
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
  private _getSessionResources(params: StatefulServerParams): McpServer {
    const { sessionId, config: sessionConfig } = params;

    // 1. Try to get existing resources from the cache
    const cached = this.cache.get(sessionId);
    if (cached) {
      console.log(`[Server] Reusing cached resources for session: ${sessionId}`);
      return cached.mcpServer;
    }

    // 2. If not cached (or expired), create brand new resources
    console.log(`[Server] Creating new resources for session: ${sessionId}`);
    
    // Create a new, isolated McpServer for this session
    const mcpServer = createMcpServer({ sessionId, config: sessionConfig });
    
    // Determine the correct access token for this session
    const accessToken = resolveAccessToken(this.serverOptions.accessToken, sessionConfig);
    
    // Create a new, non-singleton manager specifically for this session's server instance
    const toolManager = new DynamicToolsetManager(mcpServer, accessToken);

    // Register the meta-tools (enable_toolset, etc.) on the session's server.
    // These tools will operate on this session's dedicated toolManager.
    // This assumes `registerMetaTools` is adapted to accept a manager instance.
    registerMetaTools(mcpServer, toolManager);

    // 3. Store the newly created resources in the cache for future requests
    this.cache.set(sessionId, { mcpServer, toolManager });

    return mcpServer;
  }
}
