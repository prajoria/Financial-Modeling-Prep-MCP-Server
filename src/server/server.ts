import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createStatelessServer } from "@smithery/sdk/server/stateless.js";
import { registerAllTools, registerToolsBySet } from "../tools/index.js";
import { getServerVersion } from "../utils/getServerVersion.js";
import type { Request, Response } from "express";
import type { Server } from "node:http";
import type { ToolSet } from "../constants/index.js";
import { getDynamicToolsetManager } from "../dynamic-toolset-manager/index.js";
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
  // Parse configuration using helper functions
  const accessToken = resolveAccessToken(serverAccessToken, config);
  const finalToolSets = parseToolSets(toolSets, config);
  const dynamicToolDiscovery = parseDynamicToolDiscovery(serverDynamicToolDiscovery, config);

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
    const dynamicToolsetManager = getDynamicToolsetManager(mcpServer, accessToken);
    console.log("Dynamic mode enabled - DynamicToolsetManager singleton initialized");
    console.log(`Available toolsets: ${dynamicToolsetManager.getAvailableToolsets().join(', ')}`);
    
    // Register meta-tools for dynamic toolset management
    registerMetaTools(mcpServer, accessToken);
    
    // Store manager instance for access by meta-tools (for compatibility/debugging)
    (mcpServer as any)._dynamicToolsetManager = dynamicToolsetManager;
  } else if (finalToolSets && finalToolSets.length > 0) {
    // Static Mode: Register specified toolsets at startup
    registerToolsBySet(mcpServer, finalToolSets, accessToken);
  } else {
    // Legacy Mode: Register all tools for backward compatibility (current default)
    registerAllTools(mcpServer, accessToken);
  }

  return mcpServer.server;
}

/**
 * Start the server with the given configuration
 * @param config - Server configuration
 * @returns HTTP server instance
 */
export function startServer(config: ServerConfig): Server {
  const { port, toolSets, accessToken, dynamicToolDiscovery } = config;

  // Create the stateless server with tool sets configuration
  const { app } = createStatelessServer((params) =>
    createMcpServer({
      ...params,
      toolSets,
      accessToken,
      dynamicToolDiscovery,
    })
  );

  app.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: VERSION,
      message: "Financial Modeling Prep MCP server is running",
      toolSets: toolSets || "all",
    });
  });

  const server = app.listen(port, () => {
    console.log(`Financial Modeling Prep MCP server started on port ${port}`);
    console.log(`Health endpoint available at http://localhost:${port}/health`);
    console.log(`MCP endpoint available at http://localhost:${port}/mcp`);

    if (dynamicToolDiscovery) {
      console.log("Dynamic tool discovery enabled");
    } else if (toolSets && toolSets.length > 0) {
      console.log(`Tool sets enabled: ${toolSets.join(", ")}`);
    } else {
      console.log("All tool sets enabled (default)");
    }
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
 * @param toolSets - Tool sets provided directly to server
 * @param config - Configuration object from Smithery or environment
 * @returns Array of parsed tool sets, empty array if none specified
 */
function parseToolSets(
  toolSets?: ToolSet[],
  config?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string; DYNAMIC_TOOL_DISCOVERY?: string }
): ToolSet[] {
  // Use server-provided tool sets if available
  let finalToolSets = toolSets || [];
  
  // Parse tool sets from Smithery config if provided and no server tool sets were specified
  if (config?.FMP_TOOL_SETS && finalToolSets.length === 0) {
    finalToolSets = config.FMP_TOOL_SETS.split(",").map((s) =>
      s.trim()
    ) as ToolSet[];
  }
  
  return finalToolSets;
}

/**
 * Parses dynamic tool discovery setting with priority: server parameter > Smithery config
 * @param serverDynamicToolDiscovery - Dynamic tool discovery setting provided directly to server
 * @param config - Configuration object from Smithery or environment
 * @returns Boolean indicating if dynamic tool discovery is enabled
 */
function parseDynamicToolDiscovery(
  serverDynamicToolDiscovery?: boolean,
  config?: { FMP_ACCESS_TOKEN?: string; FMP_TOOL_SETS?: string; DYNAMIC_TOOL_DISCOVERY?: string }
): boolean {
  return serverDynamicToolDiscovery ?? (config?.DYNAMIC_TOOL_DISCOVERY === "true");
}
