import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * FMP Context type
 */
export type FMPContext = {
  config?: {
    FMP_ACCESS_TOKEN?: string;
  };
}; 

/**
 * Type definition for tool registration functions
 * All registration functions follow this pattern: (server, accessToken?) => void
 */
export type ToolRegistrationFunction = (server: McpServer, accessToken?: string) => void;


/**
 * Type definition for module loader functions
 * Each module loader returns a Promise that resolves to a registration function
 */
export type ModuleLoader = () => Promise<ToolRegistrationFunction>;

/**
 * Tool sets configuration based on Financial Modeling Prep API categories
 * Each set contains related functionality that users might want to access together
 */

export type ToolSet =
  | "search"
  | "company"
  | "quotes"
  | "statements"
  | "calendar"
  | "charts"
  | "news"
  | "analyst"
  | "market-performance"
  | "insider-trades"
  | "institutional"
  | "indexes"
  | "economics"
  | "crypto"
  | "forex"
  | "commodities"
  | "etf-funds"
  | "esg"
  | "technical-indicators"
  | "senate"
  | "sec-filings"
  | "earnings"
  | "dcf"
  | "bulk";

/**
 * Tool set definition
 */
export interface ToolSetDefinition {
  name: string;
  description: string;
  decisionCriteria: string;
  modules: string[];
}
