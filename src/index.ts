#!/usr/bin/env node

import minimist from "minimist";
import { startServer } from "./server/server.js";

// Parse command line arguments
const argv = minimist(process.argv.slice(2));
const accessToken: string | undefined =
  argv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Access token is now optional for server startup
// It will be required later when making API calls
startServer({ port, accessToken });

console.log(
  accessToken
    ? "Financial Modeling Prep MCP initialized successfully with provided token"
    : "Financial Modeling Prep MCP initialized in tool discovery mode - API calls will require a token"
);
