#!/usr/bin/env node

import minimist from "minimist";
import { getAvailableToolSets, ToolSet } from "./constants/index.js";
import { showHelp } from "./utils/showHelp.js";
import { McpServer } from "./server/server.js";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Show help if requested
if (argv.help || argv.h) {
  const availableToolSets = getAvailableToolSets();
  showHelp(availableToolSets);
  process.exit(0);
}

function main() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const fmpToken = argv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;

  const mcpServer = new McpServer(
    {
      accessToken: fmpToken,
      cacheOptions: {
        maxSize: 100,
        ttl: 1000 * 60 * 60 * 24, // 24 hours
      },
    }
  )

  mcpServer.start(PORT);

  const handleShutdown = () => {
    console.log('\n🔌 Shutting down server...');
    mcpServer.stop();
    process.exit(0);
  };

  process.on("SIGINT", handleShutdown); // Catches Ctrl+C
  process.on("SIGTERM", handleShutdown); // Catches kill signals
}

main();
