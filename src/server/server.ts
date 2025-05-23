// server/server.ts
// Main server configuration and setup

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerAllTools } from "../tools/index.js";
import http from "node:http";
import { getServerVersion } from "../utils/getServerVersion.js";

const VERSION = getServerVersion();

/**
 * ServerConfig interface for configuring the MCP server
 */
interface ServerConfig {
  port: number;
  accessToken: string;
}

/**
 * Create and configure the MCP server
 * @param accessToken - FMP access token
 * @returns Configured MCP server instance
 */
export function createServer(accessToken: string): McpServer {
  const server = new McpServer({
    name: "Financial Modeling Prep MCP",
    version: VERSION,
  });

  // Register all tools with the server
  registerAllTools(server, accessToken);

  return server;
}

/**
 * Start the HTTP server and connect it to the MCP server
 * @param config - Server configuration
 * @returns HTTP server instance
 */
export function startServer(config: ServerConfig): http.Server {
  const { port, accessToken } = config;

  const mcpServer = createServer(accessToken);

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // Use stateless mode
  });

  const httpServer = http.createServer((req, res) => {
    // Handle healthcheck
    if (req.url === "/health" || req.url === "/healthcheck") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          version: VERSION,
          message: "Financial Modeling Prep MCP server is running",
        })
      );
    }
    // Handle MCP requests
    else if (req.url === "/mcp") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        let parsedBody;
        try {
          parsedBody = JSON.parse(body);

          // Convert the request to MCP protocol format if needed
          if (
            parsedBody.method &&
            parsedBody.method !== "invokePlugin" &&
            !parsedBody.method.startsWith("tools.")
          ) {
            // Save the original request for debugging
            const originalRequest = { ...parsedBody };

            // Convert to invokePlugin format
            parsedBody = {
              jsonrpc: "2.0",
              id: parsedBody.id,
              method: "invokePlugin",
              params: {
                name: parsedBody.method,
                parameters: parsedBody.params || {},
              },
            };

            console.log(
              "Converted request from:",
              JSON.stringify(originalRequest)
            );
            console.log("To MCP format:", JSON.stringify(parsedBody));
          }
        } catch (e) {
          console.error("Error parsing request:", e);
          // If body is empty or invalid JSON, pass undefined
        }
        transport.handleRequest(req, res, parsedBody);
      });
    } else {
      // Respond with 404 for other paths
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  mcpServer.connect(transport).catch((error) => {
    console.error("Failed to connect to transport:", error);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`Financial Modeling Prep MCP server started on port ${port}`);
    console.log(`Health endpoint available at http://localhost:${port}/health`);
    console.log(`MCP endpoint available at http://localhost:${port}/mcp`);
  });

  return httpServer;
}
