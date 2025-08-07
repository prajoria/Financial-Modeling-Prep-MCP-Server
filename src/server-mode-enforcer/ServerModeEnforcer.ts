import type { ServerMode } from '../mcp-server-factory/McpServerFactory.js';
import { validateDynamicToolDiscoveryConfig, parseCommaSeparatedToolSets } from '../utils/validation.js';
import { getAvailableToolSets, type ToolSet } from '../constants/index.js';

/**
 * Simple server mode enforcer that checks environment variables and CLI arguments
 * for server-level mode overrides.
 * 
 * Precedence: CLI arguments > Environment variables
 * 
 * @example
 * ```typescript
 * const enforcer = new ServerModeEnforcer(process.env, minimist(process.argv.slice(2)));
 * const override = enforcer.serverModeOverride;
 * if (override) {
 *   console.log(`Server mode enforced: ${override}`);
 * }
 * ```
 */
export class ServerModeEnforcer {
  private readonly _serverModeOverride: ServerMode | null;

  constructor(
    envVars: Record<string, string | undefined>,
    cliArgs: Record<string, unknown>
  ) {
    this._serverModeOverride = this._determineOverride(envVars, cliArgs);
  }

  /**
   * Gets the server mode override, or null if no override is needed
   */
  public get serverModeOverride(): ServerMode | null {
    return this._serverModeOverride;
  }

  /**
   * Determines if there's a server-level mode override from CLI args or env vars
   */
  private _determineOverride(
    envVars: Record<string, string | undefined>,
    cliArgs: Record<string, unknown>
  ): ServerMode | null {
    // Check CLI arguments first (highest precedence)
    // Support multiple CLI argument variations for dynamic tool discovery
    const dynamicToolDiscovery =
      cliArgs['dynamic-tool-discovery'] === true ||
      cliArgs['dynamicToolDiscovery'] === true;
    
    if (dynamicToolDiscovery) {
      return 'DYNAMIC_TOOL_DISCOVERY';
    }
    
    // Support multiple CLI argument variations for tool sets
    const toolSetsInput =
      cliArgs["fmp-tool-sets"] || 
      cliArgs["tool-sets"] || 
      cliArgs["toolSets"];
    
    if (toolSetsInput && typeof toolSetsInput === 'string') {
      const toolSets = this._parseAndValidateToolSets(toolSetsInput);
      if (toolSets.length > 0) {
        return 'STATIC_TOOL_SETS';
      }
    }

    // Check environment variables second
    if (envVars.DYNAMIC_TOOL_DISCOVERY && validateDynamicToolDiscoveryConfig(envVars.DYNAMIC_TOOL_DISCOVERY)) {
      return 'DYNAMIC_TOOL_DISCOVERY';
    }
    
    if (envVars.FMP_TOOL_SETS) {
      const toolSets = this._parseAndValidateToolSets(envVars.FMP_TOOL_SETS as string);
      if (toolSets.length > 0) {
        return 'STATIC_TOOL_SETS';
      }
    }

    // No override needed
    return null;
  }

  /**
   * Parses and validates tool sets, with error handling and process exit on invalid sets
   */
  private _parseAndValidateToolSets(input: string): ToolSet[] {
    if (!input || typeof input !== 'string') {
      return [];
    }

    // Parse tool sets (split by comma, trim whitespace)
    const toolSets = input.split(",").map((s) => s.trim()) as ToolSet[];
    
    // Get available tool sets for validation
    const availableToolSets = getAvailableToolSets().map(({ key }) => key);
    
    // Find invalid tool sets
    const invalidToolSets = toolSets.filter(
      (ts) => !availableToolSets.includes(ts)
    );
    
    // Exit process if invalid tool sets found (matches previous behavior)
    if (invalidToolSets.length > 0) {
      console.error(`Invalid tool sets: ${invalidToolSets.join(", ")}`);
      console.error(`Available tool sets: ${availableToolSets.join(", ")}`);
      process.exit(1);
    }

    return toolSets.filter(ts => ts.length > 0);
  }
}
