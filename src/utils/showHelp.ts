import type { ToolSet, ToolSetDefinition } from "../constants/index.js";

/**
 * Display help information for the Financial Modeling Prep MCP Server
 * 
 * Shows comprehensive usage information including:
 * - Command line options and their descriptions
 * - Available tool sets with names and descriptions
 * - Usage examples for different scenarios
 * - Environment variable configuration options
 * 
 * @param availableToolSets - Array of available tool sets with their definitions
 * 
 * @example
 * ```typescript
 * import { getAvailableToolSets } from "../constants/index.js";
 * import { showHelp } from "./showHelp.js";
 * 
 * const toolSets = getAvailableToolSets();
 * showHelp(toolSets);
 * ```
 */
export function showHelp(availableToolSets: Array<{ key: ToolSet; definition: ToolSetDefinition }>): void {
  console.log(`
Financial Modeling Prep MCP Server

Usage: npm start [options]

Options:
  --port <number>              Server port (default: 3000)
  --fmp-token <token>          FMP API access token
  --help, -h                   Show this help message

Available Tool Sets:
`);

  availableToolSets.forEach(({ key, definition }) => {
    console.log(`  ${key.padEnd(20)} ${definition.name}`);
    console.log(`  ${" ".repeat(20)} ${definition.description}`);
    console.log();
  });

  console.log(`
Examples:
  npm start
  npm start -- --port 4000 # Custom port

Environment Variables:
  PORT                     Server port
  FMP_ACCESS_TOKEN         Financial Modeling Prep API access token
`);
}
