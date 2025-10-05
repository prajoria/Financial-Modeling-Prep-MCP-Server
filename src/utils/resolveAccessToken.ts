import type { SessionConfig } from "../mcp-server-factory/McpServerFactory.js";

/**
 * Resolves access token with precedence: server-level token overrides session config.
 * Returns undefined if neither is present.
 */
export function resolveAccessToken(
  serverToken?: string,
  sessionConfig?: SessionConfig
): string | undefined {
  return serverToken || sessionConfig?.FMP_ACCESS_TOKEN;
}


