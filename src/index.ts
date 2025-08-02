#!/usr/bin/env node

import minimist from "minimist";
import { startServer } from "./server/server.js";
import { type ToolSet, getAvailableToolSets } from "./constants/index.js";
import { showHelp } from "./utils/showHelp.js";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Show help if requested
if (argv.help || argv.h) {
  const availableToolSets = getAvailableToolSets();
  showHelp(availableToolSets);
  process.exit(0);
}

// Get configuration from environment variables and command line
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const fmpToken = argv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;

// Parse toolSets argument from command line or environment variable
let toolSets: ToolSet[] = [];
const toolSetsInput =
  argv["fmp-tool-sets"] || argv["tool-sets"] || argv["toolSets"] || process.env.FMP_TOOL_SETS;
if (toolSetsInput && typeof toolSetsInput === "string") {
  toolSets = toolSetsInput.split(",").map((s) => s.trim()) as ToolSet[];
}

// Parse dynamic tool discovery from command line or environment variable
const dynamicToolDiscovery =
  argv["dynamic-tool-discovery"] === true ||
  argv["dynamicToolDiscovery"] === true ||
  process.env.DYNAMIC_TOOL_DISCOVERY === "true";

// Validate tool sets
const availableToolSets = getAvailableToolSets().map(({ key }) => key);
const invalidToolSets = toolSets.filter(
  (ts) => !availableToolSets.includes(ts)
);
if (invalidToolSets.length > 0) {
  console.error(`Invalid tool sets: ${invalidToolSets.join(", ")}`);
  console.error(`Available tool sets: ${availableToolSets.join(", ")}`);
  process.exit(1);
}

startServer({ port, toolSets, accessToken: fmpToken, dynamicToolDiscovery });

// Log startup information
if (fmpToken) {
  console.log(
    "Financial Modeling Prep MCP server initialized successfully with API token"
  );
} else {
  console.log("Financial Modeling Prep MCP server initialized successfully");
  console.log("Note: API token can be provided via:");
  console.log("  - Environment variable: FMP_ACCESS_TOKEN");
  console.log("  - Command line argument: --fmp-token");
  console.log("  - Smithery configuration when using with Smithery");
}
