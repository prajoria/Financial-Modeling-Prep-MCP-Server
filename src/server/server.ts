import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createStatelessServer } from "@smithery/sdk/server/stateless.js";
import { createStatefulServer } from "@smithery/sdk/server/stateful.js";
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
}

/**
 * Create MCP server function used by the stateless server
 * Note: Server mode is determined at startup, not per-client
 */
function createMcpServer({
  config,
  toolSets,
  accessToken: serverAccessToken,
  dynamicToolDiscovery: serverDynamicToolDiscovery,
}: {
  config?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string; DYNAMIC_TOOL_DISCOVERY?: string };
  toolSets?: ToolSet[];
  accessToken?: string;
  dynamicToolDiscovery?: boolean;
}) {
  const accessToken = resolveAccessToken(serverAccessToken, config);
  const finalToolSets = parseToolSets(toolSets, config); // Still need to parse and validate toolSets
  const dynamicToolDiscovery = serverDynamicToolDiscovery; // No client override

  const mcpServer = new McpServer({
    name: "Financial Modeling Prep MCP",
    version: VERSION,
    capabilities: {
      // Enable dynamic tool list changes when in dynamic mode
      tools: { listChanged: dynamicToolDiscovery === true },
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

  // Three-mode tool registration: Dynamic, Static, or Legacy
  if (dynamicToolDiscovery === true) {
    // Dynamic Mode: Get singleton DynamicToolsetManager for runtime toolset management
    registerMetaTools(mcpServer, accessToken);
    console.log("MCP Server Mode: DYNAMIC_TOOL_DISCOVERY - Runtime toolset management enabled");
  } else if (finalToolSets && finalToolSets.length > 0) {
    // Static Mode: Register specified toolsets at startup
    registerToolsBySet(mcpServer, finalToolSets, accessToken);
    console.log(`MCP Server Mode: STATIC_TOOL_SETS - Pre-configured toolsets (${finalToolSets.length}): ${finalToolSets.join(', ')}`);
  } else {
    // Legacy Mode: Register all tools for backward compatibility (current default)
    registerAllTools(mcpServer, accessToken);
    console.log("MCP Server Mode: ALL_TOOLS - All tools registered at startup (250+ tools)");
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
  const { port, toolSets, accessToken, dynamicToolDiscovery } = config;

  // Determine server mode at startup - this decision applies to ALL connections
  const serverMode = resolveServerMode(dynamicToolDiscovery, toolSets);

  // Global server instance for dynamic mode (singleton required for state persistence)
  let dynamicMcpServerInstance: ReturnType<typeof createMcpServer> | null = null;
  
  const { app } = createStatelessServer((params) => {
    if (serverMode === 'DYNAMIC_TOOL_DISCOVERY') {
      // DYNAMIC MODE: Use singleton pattern (required for persistent toolset state)
      if (!dynamicMcpServerInstance) {
        console.log("✅ Creating persistent DYNAMIC server instance...");
        dynamicMcpServerInstance = createMcpServer({
          ...params,
          toolSets: undefined, // Dynamic mode starts with no toolsets
          accessToken: resolveAccessToken(accessToken, params.config),
          dynamicToolDiscovery: true,
        });
      }
      return dynamicMcpServerInstance;
      
    } else {
      // STATIC/LEGACY MODE: Create fresh instances (truly stateless)
      // Smithery and other clients get fresh instances per connection
      console.log(`⚙️ Creating fresh ${serverMode} server instance...`);
      return createMcpServer({
        ...params,
        toolSets: serverMode === 'STATIC_TOOL_SETS' ? toolSets : undefined,
        accessToken: resolveAccessToken(accessToken, params.config),
        dynamicToolDiscovery: false,
      });
    }
  });

  app.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: VERSION,
      message: "Financial Modeling Prep MCP server is running",
      serverMode: serverMode,
      toolSets: serverMode === 'STATIC_TOOL_SETS' ? toolSets : serverMode === 'DYNAMIC_TOOL_DISCOVERY' ? 'dynamic-tool-discovery' : 'all-tools',
    });
  });

  const server = app.listen(port, () => {
    console.log(`Financial Modeling Prep MCP server started on port ${port}`);
    console.log(`Server Mode: ${serverMode}`);
    console.log(`Health endpoint available at http://localhost:${port}/healthcheck`);
    console.log(`MCP endpoint available at http://localhost:${port}/mcp`);
  });

  return server;
}

/**
 * Resolves the access token with priority: server parameter > Smithery config
 * @param serverAccessToken - Access token provided directly to server
 * @param config - Configuration object from Smithery or environment
 * @returns The resolved access token or undefined if not found
 */
function resolveAccessToken(
  serverAccessToken?: string,
  config?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string; DYNAMIC_TOOL_DISCOVERY?: string }
): string | undefined {
  return serverAccessToken || config?.FMP_ACCESS_TOKEN;
}

/**
 * Parses tool sets with priority: server parameter > Smithery config
 * Uses validation utilities for consistent validation and sanitization
 * @param toolSets - Tool sets provided directly to server
 * @param config - Configuration object from Smithery or environment
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
  
  // Parse tool sets from Smithery config if provided and no server tool sets were specified
  if (config?.FMP_TOOL_SETS && finalToolSets.length === 0) {
    finalToolSets = parseCommaSeparatedToolSets(config.FMP_TOOL_SETS);
  }
  
  return finalToolSets;
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

