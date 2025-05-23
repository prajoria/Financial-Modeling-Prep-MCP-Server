#!/usr/bin/env node

import minimist from "minimist";
import { startServer } from "./server/server.js";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));
const accessToken = argv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

if (!accessToken) {
  console.error(
    "Error: Financial Modeling Prep access token is required. Provide it with --fmp-token or FMP_ACCESS_TOKEN environment variable."
  );
  process.exit(1);
}

startServer({ port, accessToken });

console.log(
  "Financial Modeling Prep MCP initialized successfully with provided token"
);
