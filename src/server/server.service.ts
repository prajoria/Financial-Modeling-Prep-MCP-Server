import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createStatefulServer } from "@smithery/sdk/server/stateful.js";
import type { StatefulServerOptions } from "@smithery/sdk/server/stateful.js";
import { registerAllTools, registerToolsBySet } from "../tools/index.js";
import { getServerVersion } from "../utils/getServerVersion.js";
import { 
  validateToolSets, 
  validateDynamicToolDiscoveryConfig,
  parseCommaSeparatedToolSets 
} from "../utils/validation.js";
import type { Request, Response } from "express";
import type { Server } from "node:http";
import type { ToolSet } from "../constants/index.js";
import { registerMetaTools } from "../tools/meta-tools.js";

const VERSION = getServerVersion();

/**
 * ServerConfig interface for configuring the MCP server
 */
interface ServerConfig {
  port: number;
  toolSets?: ToolSet[];
  accessToken?: string;
  dynamicToolDiscovery?: boolean;
  sessionStore?: StatefulServerOptions['sessionStore'];
}

// Session metadata storage
const sessionMetadata = new Map<string, { mode: ServerMode; toolSets?: ToolSet[]; timestamp: Date }>();

/**
 * Create MCP server function used by the stateful server
 * Note: Server mode can now be determined per-session based on session config
 * Each session gets its own server instance with potentially different modes
 */
function createMcpServer({
  sessionId,
  config,
  toolSets,
  accessToken: serverAccessToken,
  dynamicToolDiscovery: serverDynamicToolDiscovery,
}: {
  sessionId: string;
  config?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string; DYNAMIC_TOOL_DISCOVERY?: string };
  toolSets?: ToolSet[];
  accessToken?: string;
  dynamicToolDiscovery?: boolean;
}) {
  const accessToken = resolveAccessToken(serverAccessToken, config);
  const finalToolSets = parseToolSets(toolSets, config);
  
  // Determine session-specific mode (can override server defaults)
  const sessionMode = resolveSessionMode(serverDynamicToolDiscovery, config, toolSets, finalToolSets);
  const sessionDynamicToolDiscovery = sessionMode === 'DYNAMIC_TOOL_DISCOVERY';

  // Store session metadata
  sessionMetadata.set(sessionId, {
    mode: sessionMode,
    toolSets: sessionMode === 'STATIC_TOOL_SETS' ? finalToolSets : undefined,
    timestamp: new Date(),
  });

  console.log(`🔗 Creating MCP server instance for session: ${sessionId} with mode: ${sessionMode}`);

  const mcpServer = new McpServer({
    name: "Financial Modeling Prep MCP",
    version: VERSION,
    capabilities: {
      // Enable dynamic tool list changes when in dynamic mode
      tools: { listChanged: sessionDynamicToolDiscovery === true },
    },
    configSchema: {
      type: "object",
      required: ["FMP_ACCESS_TOKEN"],
      properties: {
        FMP_ACCESS_TOKEN: {
          type: "string",
          title: "FMP Access Token",
          description: "Financial Modeling Prep API access token",
        },
        FMP_TOOL_SETS: {
          type: "string",
          title: "Tool Sets (Optional)",
          description:
            "Comma-separated list of tool sets to load (e.g., 'search,company,quotes'). If not specified, all tools will be loaded.",
        },
        DYNAMIC_TOOL_DISCOVERY: {
          type: "string",
          title: "Dynamic Tool Discovery (Optional)",
          description:
            "Enable dynamic toolset management. Set to 'true' to use meta-tools for runtime toolset loading. Default is 'false'.",
        },
      },
    },
  });

  // Three-mode tool registration: Dynamic, Static, or Legacy (per session)
  if (sessionDynamicToolDiscovery === true) {
    // Dynamic Mode: Each session gets its own dynamic toolset manager
    registerMetaTools(mcpServer, accessToken);
    console.log(`Session ${sessionId} - Mode: DYNAMIC_TOOL_DISCOVERY - Runtime toolset management enabled`);
  } else if (finalToolSets && finalToolSets.length > 0) {
    // Static Mode: Register specified toolsets at startup for this session
    registerToolsBySet(mcpServer, finalToolSets, accessToken);
    console.log(`Session ${sessionId} - Mode: STATIC_TOOL_SETS - Pre-configured toolsets (${finalToolSets.length}): ${finalToolSets.join(', ')}`);
  } else {
    // Legacy Mode: Register all tools for backward compatibility for this session
    registerAllTools(mcpServer, accessToken);
    console.log(`Session ${sessionId} - Mode: ALL_TOOLS - All tools registered at startup (250+ tools)`);
  }

  return mcpServer.server;
}

/**
 * Server mode enumeration
 */
type ServerMode = 'DYNAMIC_TOOL_DISCOVERY' | 'STATIC_TOOL_SETS' | 'ALL_TOOLS';

/**
 * Start the server with the given configuration
 * @param config - Server configuration
 * @returns HTTP server instance
 */
export function startServer(config: ServerConfig): Server {
  const { port, toolSets, accessToken, dynamicToolDiscovery, sessionStore } = config;

  // Server mode is now determined per-session, not globally
  console.log(`🚀 Starting STATEFUL server with per-session mode determination`);
  
  const { app } = createStatefulServer((params) => {
    const { sessionId, config: sessionConfig } = params;
    
    console.log(`📦 Creating server instance for session: ${sessionId}`);
    
    return createMcpServer({
      sessionId,
      config: sessionConfig,
      toolSets, // Pass server-level toolsets as default
      accessToken,
      dynamicToolDiscovery, // Pass server-level setting as default
    });
  }, {
    sessionStore, // Pass optional session store
  });

  // Enhanced health check with session information
  app.get("/healthcheck", (req: Request, res: Response) => {
    const activeSessions = Array.from(sessionMetadata.entries()).map(([sessionId, metadata]) => ({
      sessionId,
      mode: metadata.mode,
      toolSets: metadata.toolSets?.length || (metadata.mode === 'ALL_TOOLS' ? '250+' : 'dynamic'),
      timestamp: metadata.timestamp.toISOString(),
    }));

    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: VERSION,
      message: "Financial Modeling Prep MCP server is running (STATEFUL)",
      sessionManagement: "stateful",
      activeSessions: activeSessions.length,
      sessions: activeSessions,
      serverDefaults: {
        toolSets,
        dynamicToolDiscovery,
      },
    });
  });

  // New endpoint to get session-specific information
  app.get("/sessions/:sessionId", (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const sessionInfo = sessionMetadata.get(sessionId);
    
    if (!sessionInfo) {
      return res.status(404).json({
        error: "Session not found",
        sessionId,
      });
    }
    
    res.json({
      sessionId,
      mode: sessionInfo.mode,
      toolSets: sessionInfo.toolSets,
      toolCount: sessionInfo.toolSets?.length || (sessionInfo.mode === 'ALL_TOOLS' ? '250+' : 'dynamic'),
      timestamp: sessionInfo.timestamp.toISOString(),
      uptime: Date.now() - sessionInfo.timestamp.getTime(),
    });
  });

  // New endpoint to list all active sessions
  app.get("/sessions", (req: Request, res: Response) => {
    const sessions = Array.from(sessionMetadata.entries()).map(([sessionId, metadata]) => ({
      sessionId,
      mode: metadata.mode,
      toolSets: metadata.toolSets,
      toolCount: metadata.toolSets?.length || (metadata.mode === 'ALL_TOOLS' ? '250+' : 'dynamic'),
      timestamp: metadata.timestamp.toISOString(),
      uptime: Date.now() - metadata.timestamp.getTime(),
    }));

    res.json({
      totalSessions: sessions.length,
      sessions,
    });
  });

  const server = app.listen(port, () => {
    console.log(`💎 Financial Modeling Prep MCP server (STATEFUL) started on port ${port}`);
    console.log(`🎯 Mode: Per-session determination enabled`);
    console.log(`🏥 Health endpoint: http://localhost:${port}/healthcheck`);
    console.log(`🔌 MCP endpoint: http://localhost:${port}/mcp`);
    console.log(`📋 Sessions endpoint: http://localhost:${port}/sessions`);
    console.log(`🔍 Session info: http://localhost:${port}/sessions/:sessionId`);
    console.log(`📊 Session management: ENABLED`);
  });

  return server;
}

/**
 * Resolves the access token with priority: server parameter > session config
 * @param serverAccessToken - Access token provided directly to server
 * @param config - Configuration object from session or environment
 * @returns The resolved access token or undefined if not found
 */
function resolveAccessToken(
  serverAccessToken?: string,
  config?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string; DYNAMIC_TOOL_DISCOVERY?: string }
): string | undefined {
  return serverAccessToken || config?.FMP_ACCESS_TOKEN;
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
 * Determine the server mode based on session-specific configuration
 * Session configuration can override server defaults
 * @param serverDynamicToolDiscovery - Dynamic tool discovery from server startup (default)
 * @param sessionConfig - Configuration from the session
 * @param serverToolSets - Tool sets from server startup (default)
 * @param sessionToolSets - Parsed tool sets from session config
 * @returns The determined server mode for this session
 */
function resolveSessionMode(
  serverDynamicToolDiscovery?: boolean,
  sessionConfig?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string; DYNAMIC_TOOL_DISCOVERY?: string },
  serverToolSets?: ToolSet[],
  sessionToolSets?: ToolSet[]
): ServerMode {
  // Check for session-specific dynamic tool discovery override
  let isDynamic = validateDynamicToolDiscoveryConfig(serverDynamicToolDiscovery);
  
  // Session config can override server setting
  if (sessionConfig?.DYNAMIC_TOOL_DISCOVERY !== undefined) {
    const sessionDynamic = sessionConfig.DYNAMIC_TOOL_DISCOVERY.toLowerCase() === 'true';
    isDynamic = validateDynamicToolDiscoveryConfig(sessionDynamic);
  }
  
  // Session explicitly requested dynamic mode
  if (isDynamic === true) {
    return 'DYNAMIC_TOOL_DISCOVERY';
  }
  
  // Session has specific toolsets (takes precedence over server toolsets)
  if (sessionToolSets && sessionToolSets.length > 0) {
    return 'STATIC_TOOL_SETS';
  }
  
  // Fall back to server-specified toolsets
  if (serverToolSets && serverToolSets.length > 0) {
    return 'STATIC_TOOL_SETS';
  }
  
  // Default to legacy mode (all tools) 
  return 'ALL_TOOLS';
}

/**
 * Get session mode information
 * @param sessionId - The session ID to look up
 * @returns Session metadata or undefined if not found
 */
export function getSessionMode(sessionId: string) {
  return sessionMetadata.get(sessionId);
}

/**
 * Get all active sessions with their modes
 * @returns Array of session information
 */
export function getAllSessionModes() {
  return Array.from(sessionMetadata.entries()).map(([sessionId, metadata]) => ({
    sessionId,
    ...metadata,
  }));
}