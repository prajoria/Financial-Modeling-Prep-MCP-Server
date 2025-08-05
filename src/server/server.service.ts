// src/server.ts

import express from 'express';
import type { Server as HttpServer } from 'node:http';
import { createStatefulServer, type CreateServerArg } from "@smithery/sdk/server/stateful.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SessionCache, type CacheOptions } from '../session-cache/SessionCache.js';
import { parseCommaSeparatedToolSets, validateDynamicToolDiscoveryConfig, validateToolSets } from '../utils/validation.js';
import { ToolSet } from '../constants/toolSets.js';
import { DynamicToolsetManager, getDynamicToolsetManager } from '../dynamic-toolset-manager/index.js';
import { registerMetaTools } from '../tools/meta-tools.js';
import { registerAllTools, registerToolsBySet } from '../tools/index.js';

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
        FMP_TOOL_SETS: {
          type: "string",
          title: "Tool Sets (Optional)",
          description: "Comma-separated list of tool sets to load (e.g., 'search,company,quotes'). If not specified, all tools will be loaded.",
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
  private _getSessionResources(params: CreateServerArg): any {
    const { sessionId, config: sessionConfig } = params;

    const cached = this.cache.get(sessionId);
    if (cached) {
      console.log(`[Server] Reusing cached resources for session: ${sessionId}`);
      return cached.mcpServer;
    }

    console.log(`[Server] Creating new resources for session: ${sessionId}`);
    const mcpServer = createMcpServer({ sessionId, config: sessionConfig });
    const accessToken = resolveAccessToken(this.serverOptions.accessToken, sessionConfig);

    // NEW: Determine mode and register tools accordingly
    const mode = resolveSessionMode(sessionConfig);
    let toolManager: DynamicToolsetManager | undefined = undefined;

    console.log(`[Server] Session ${sessionId} operating in ${mode} mode.`);

    switch (mode) {
      case 'DYNAMIC_TOOL_DISCOVERY':
            // For dynamic mode, create a manager and register meta-tools
        // TODO: Fix in Phase 4 - DynamicToolsetManager still uses singleton pattern
        toolManager = getDynamicToolsetManager(mcpServer, accessToken);
        registerMetaTools(mcpServer, accessToken);
        break;
      
      case 'STATIC_TOOL_SETS':
        // For static mode, parse the list and register only those toolsets
        const toolSetsString = (sessionConfig?.FMP_TOOL_SETS as string) || '';
        const toolSets = parseCommaSeparatedToolSets(toolSetsString);
        console.log(`[Server] Loading static toolsets for session ${sessionId}: ${toolSets.join(', ')}`);
        registerToolsBySet(mcpServer, toolSets, accessToken);
        break;

      case 'ALL_TOOLS':
      default:
        // For legacy mode, register all available tools
        console.log(`[Server] Loading all tools for session ${sessionId} (Legacy Mode).`);
        registerAllTools(mcpServer, accessToken);
        break;
    }

    // Cache the resources. Note that toolManager will be undefined for non-dynamic modes.
    this.cache.set(sessionId, { mcpServer, toolManager });

    return mcpServer;
  }

}


  
  /**
   * Parses tool sets with priority: server parameter > session config
   * Uses validation utilities for consistent validation and sanitization
   * @param toolSets - Tool sets provided directly to server
   * @param config - Configuration object from session or environment
   * @returns Array of parsed tool sets, empty array if none specified
   */
  function parseToolSets(
    toolSets?: ToolSet[],
    config?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string; DYNAMIC_TOOL_DISCOVERY?: string }
  ): ToolSet[] {
    // Use server-provided tool sets if available and validate them
    let finalToolSets = toolSets || [];
    
    // Validate server-provided tool sets using validation utilities
    if (finalToolSets.length > 0) {
      const validation = validateToolSets(finalToolSets);
      
      // Log warnings for invalid toolsets
      if (validation.invalid.length > 0) {
        console.warn(`Invalid tool sets found in server config, ignoring:`, validation.invalid);
      }
      
      finalToolSets = validation.valid;
    }
    
    // Parse tool sets from session config if provided and no server tool sets were specified
    if (config?.FMP_TOOL_SETS && finalToolSets.length === 0) {
      finalToolSets = parseCommaSeparatedToolSets(config.FMP_TOOL_SETS);
    }
    
    return finalToolSets;
  }

  /**
 * Server mode enumeration
 */
type ServerMode = 'DYNAMIC_TOOL_DISCOVERY' | 'STATIC_TOOL_SETS' | 'ALL_TOOLS';

/**
 * Determine the server mode based on session configuration
 * @param sessionConfig - Configuration object from session
 * @returns The determined server mode
 */
function resolveSessionMode(sessionConfig?: any): ServerMode {
  // Check for dynamic tool discovery in session config
  const isDynamic = validateDynamicToolDiscoveryConfig(sessionConfig?.DYNAMIC_TOOL_DISCOVERY);
  
  if (isDynamic === true) {
    return 'DYNAMIC_TOOL_DISCOVERY';
  }
  
  // Check if specific toolsets are provided in session config
  if (sessionConfig?.FMP_TOOL_SETS && typeof sessionConfig.FMP_TOOL_SETS === 'string') {
    return 'STATIC_TOOL_SETS';
  }
  
  // Default to legacy mode (all tools)
  return 'ALL_TOOLS';
}
  
  /**
   * Determine the server mode based on startup configuration
   * Server-level configuration takes precedence over client configuration
   * @param serverDynamicToolDiscovery - Dynamic tool discovery from server startup
   * @param serverToolSets - Tool sets from server startup
   * @returns The determined server mode
   */
  function resolveServerMode(
    serverDynamicToolDiscovery?: boolean,
    serverToolSets?: ToolSet[]
  ): ServerMode {
    // Validate and normalize dynamic tool discovery setting
    const isDynamic = validateDynamicToolDiscoveryConfig(serverDynamicToolDiscovery);
    
    // Server explicitly requested dynamic mode
    if (isDynamic === true) {
      return 'DYNAMIC_TOOL_DISCOVERY';
    }
    
    // Server specified specific toolsets (static mode)
    if (serverToolSets && serverToolSets.length > 0) {
      return 'STATIC_TOOL_SETS';
    }
    
    // Default to legacy mode (all tools) 
    return 'ALL_TOOLS';
  }
  
