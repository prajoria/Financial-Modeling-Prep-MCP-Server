import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerAllTools } from "../tools/index.js";
import http from "node:http";
import { getServerVersion } from "../utils/getServerVersion.js";
import { isValidJsonRpc } from "../utils/isValidJsonRpc.js";

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
function createServer(accessToken: string): McpServer {
  const server = new McpServer({
    name: "Financial Modeling Prep MCP",
    version: VERSION,
  });
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

  const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB
  const REQUEST_TIMEOUT = 30000; // 30 seconds

  const httpServer = http.createServer(async (req, res) => {
    req.setTimeout(REQUEST_TIMEOUT, () => {
      if (!res.headersSent) {
        res.writeHead(408, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32000,
              message: "Request timeout",
            },
            id: null,
          })
        );
      }
    });

    req.on("error", (err) => {
      console.error("Request error:", err);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32603,
              message: "Internal server error",
            },
            id: null,
          })
        );
      }
    });

    res.on("error", (err) => {
      console.error("Response error:", err);
    });

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
      // Handle different HTTP methods
      if (req.method === "GET" || req.method === "DELETE") {
        res.writeHead(405, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32000,
              message: "Method not allowed.",
            },
            id: null,
          })
        );
        return;
      }

      if (req.method === "POST") {
        try {
          // For each request, create new server and transport instances to ensure complete isolation in stateless mode
          const mcpServer = createServer(accessToken);
          const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined, // Use stateless mode
          });

          const cleanup = () => {
            console.log("Cleaning up resources");
            transport.close();
            mcpServer.close();
          };

          res.on("close", cleanup);
          res.on("error", (err) => {
            console.error("Response error:", err);
            cleanup();
          });

          await mcpServer.connect(transport);

          // Parse request body with size limit
          let body = "";
          let size = 0;

          req.on("data", (chunk) => {
            size += chunk.length;
            if (size > MAX_REQUEST_SIZE) {
              res.writeHead(413, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  jsonrpc: "2.0",
                  error: {
                    code: -32000,
                    message: "Request entity too large",
                  },
                  id: null,
                })
              );
              req.destroy();
              return;
            }
            body += chunk.toString();
          });

          req.on("end", () => {
            let parsedBody;
            try {
              parsedBody = JSON.parse(body);

              // Validate JSON-RPC 2.0 format
              if (!isValidJsonRpc(parsedBody)) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    jsonrpc: "2.0",
                    error: {
                      code: -32600,
                      message: "Invalid JSON-RPC 2.0 request",
                    },
                    id: parsedBody?.id || null,
                  })
                );
                return;
              }

              transport.handleRequest(req, res, parsedBody);
            } catch (e) {
              console.error("Error parsing request:", e);
              if (!res.headersSent) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    jsonrpc: "2.0",
                    error: {
                      code: -32700,
                      message: "Parse error",
                    },
                    id: null,
                  })
                );
              }
            }
          });
        } catch (error) {
          console.error("Error handling MCP request:", error);
          if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                jsonrpc: "2.0",
                error: {
                  code: -32603,
                  message: "Internal server error",
                },
                id: null,
              })
            );
          }
        }
      }
    } else {
      // Respond with 404 for other paths
      res.writeHead(404);
      res.end("Not Found");
    }
  });

  // Add server timeout
  httpServer.timeout = REQUEST_TIMEOUT;

  // Handle server errors
  httpServer.on("error", (err) => {
    console.error("Server error:", err);
  });

  httpServer.listen(port, () => {
    console.log(`Financial Modeling Prep MCP server started on port ${port}`);
    console.log(`Health endpoint available at http://localhost:${port}/health`);
    console.log(`MCP endpoint available at http://localhost:${port}/mcp`);
  });

  return httpServer;
}
