#!/usr/bin/env node

import minimist from "minimist";
import { getAvailableToolSets, ToolSet } from "./constants/index.js";
import { showHelp } from "./utils/showHelp.js";
import { FmpMcpServer } from "./server/index.js";
import { ServerModeEnforcer } from "./server-mode-enforcer/index.js";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Show help if requested
if (argv.help || argv.h) {
  const availableToolSets = getAvailableToolSets();
  showHelp(availableToolSets);
  process.exit(0);
}

function main() {
  // Initialize the ServerModeEnforcer with env vars and CLI args
  // This will also validate tool sets and exit if invalid ones are found
  ServerModeEnforcer.initialize(process.env, argv);
  
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const fmpToken = argv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;

  const mcpServer = new FmpMcpServer(
    {
      accessToken: fmpToken,
      cacheOptions: {
        maxSize: 25,
        ttl: 1000 * 60 * 60 * 2, // 2 hours
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
