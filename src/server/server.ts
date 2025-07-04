import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createStatelessServer } from "@smithery/sdk/server/stateless.js";
import { registerAllTools } from "../tools/index.js";
import { getServerVersion } from "../utils/getServerVersion.js";
import type { Request, Response } from "express";
import type { Server } from "node:http";

const VERSION = getServerVersion();

/**
 * ServerConfig interface for configuring the MCP server
 */
interface ServerConfig {
  port: number;
}

/**
 * Create MCP server function used by the stateless server
 */
function createMcpServer({
  config,
}: {
  config?: { FMP_ACCESS_TOKEN?: string };
}) {
  const accessToken = config?.FMP_ACCESS_TOKEN;

  const mcpServer = new McpServer({
    name: "Financial Modeling Prep MCP",
    version: VERSION,
    configSchema: {
      type: "object",
      required: ["FMP_ACCESS_TOKEN"],
      properties: {
        FMP_ACCESS_TOKEN: {
          type: "string",
          title: "FMP Access Token",
          description: "Financial Modeling Prep API access token",
        },
      },
    },
  });

  registerAllTools(mcpServer, accessToken);

  return mcpServer.server;
}

/**
 * Start the server with the given configuration
 * @param config - Server configuration
 * @returns HTTP server instance
 */
export function startServer(config: ServerConfig): Server {
  const { port } = config;

  // Create the stateless server
  const { app } = createStatelessServer(createMcpServer);

  app.get("/healthcheck", (req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: VERSION,
      message: "Financial Modeling Prep MCP server is running",
    });
  });

  const server = app.listen(port, () => {
    console.log(`Financial Modeling Prep MCP server started on port ${port}`);
    console.log(`Health endpoint available at http://localhost:${port}/health`);
    console.log(`MCP endpoint available at http://localhost:${port}/mcp`);
  });

  return server;
}
