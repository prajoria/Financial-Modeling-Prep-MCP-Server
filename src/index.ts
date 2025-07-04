#!/usr/bin/env node

import minimist from "minimist";
import { startServer } from "./server/server.js";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Get configuration from environment variables and command line
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const fmpToken = argv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;

startServer({ port });

// Log startup information
if (fmpToken) {
  console.log("Financial Modeling Prep MCP server initialized successfully with API token");
} else {
  console.log("Financial Modeling Prep MCP server initialized successfully");
  console.log("Note: API token can be provided via:");
  console.log("  - Environment variable: FMP_ACCESS_TOKEN");
  console.log("  - Command line argument: --fmp-token");
  console.log("  - Smithery configuration when using with Smithery");
}
