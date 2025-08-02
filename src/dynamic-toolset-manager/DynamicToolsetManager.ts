import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TOOL_SETS, type ToolSet, type ToolSetDefinition } from "../constants/toolSets.js";
import { getModulesForToolSets } from "../constants/index.js";

/**
 * Module registration function mapping - imported from tools/index.ts pattern
 */
const MODULE_REGISTRATIONS = {
  search: async () => (await import("../tools/search.js")).registerSearchTools,
  directory: async () => (await import("../tools/directory.js")).registerDirectoryTools,
  analyst: async () => (await import("../tools/analyst.js")).registerAnalystTools,
  calendar: async () => (await import("../tools/calendar.js")).registerCalendarTools,
  chart: async () => (await import("../tools/chart.js")).registerChartTools,
  company: async () => (await import("../tools/company.js")).registerCompanyTools,
  cot: async () => (await import("../tools/cot.js")).registerCOTTools,
  esg: async () => (await import("../tools/esg.js")).registerESGTools,
  economics: async () => (await import("../tools/economics.js")).registerEconomicsTools,
  dcf: async () => (await import("../tools/dcf.js")).registerDCFTools,
  fund: async () => (await import("../tools/fund.js")).registerFundTools,
  commodity: async () => (await import("../tools/commodity.js")).registerCommodityTools,
  fundraisers: async () => (await import("../tools/fundraisers.js")).registerFundraisersTools,
  crypto: async () => (await import("../tools/crypto.js")).registerCryptoTools,
  forex: async () => (await import("../tools/forex.js")).registerForexTools,
  statements: async () => (await import("../tools/statements.js")).registerStatementsTools,
  "form-13f": async () => (await import("../tools/form-13f.js")).registerForm13FTools,
  indexes: async () => (await import("../tools/indexes.js")).registerIndexesTools,
  "insider-trades": async () => (await import("../tools/insider-trades.js")).registerInsiderTradesTools,
  "market-performance": async () => (await import("../tools/market-performance.js")).registerMarketPerformanceTools,
  "market-hours": async () => (await import("../tools/market-hours.js")).registerMarketHoursTools,
  news: async () => (await import("../tools/news.js")).registerNewsTools,
  "technical-indicators": async () => (await import("../tools/technical-indicators.js")).registerTechnicalIndicatorsTools,
  quotes: async () => (await import("../tools/quotes.js")).registerQuotesTools,
  "earnings-transcript": async () => (await import("../tools/earnings-transcript.js")).registerEarningsTranscriptTools,
  "sec-filings": async () => (await import("../tools/sec-filings.js")).registerSECFilingsTools,
  "government-trading": async () => (await import("../tools/government-trading.js")).registerGovernmentTradingTools,
  bulk: async () => (await import("../tools/bulk.js")).registerBulkTools,
} as const;

/**
 * Dynamic Toolset Manager following GitHub MCP Server pattern
 * Wraps existing FMP toolset system to provide runtime enable/disable functionality
 * Implements singleton pattern to ensure single instance across the server
 */
export class DynamicToolsetManager {
  private static instance: DynamicToolsetManager | null = null;
  
  private server: McpServer;
  private accessToken?: string;
  private activeToolsets: Set<ToolSet>;
  private registeredModules: Set<string>;

  private constructor(server: McpServer, accessToken?: string) {
    this.server = server;
    this.accessToken = accessToken;
    this.activeToolsets = new Set();
    this.registeredModules = new Set();
  }

  /**
   * Get the singleton instance of DynamicToolsetManager
   * @param server - MCP server instance (required for first initialization)
   * @param accessToken - Optional access token
   * @returns The singleton instance
   */
  static getInstance(server: McpServer, accessToken?: string): DynamicToolsetManager {
    if (!DynamicToolsetManager.instance) {
      DynamicToolsetManager.instance = new DynamicToolsetManager(server, accessToken);
    } else {
      // Update server and accessToken if provided (for reinitialization scenarios)
      if (server) {
        DynamicToolsetManager.instance.server = server;
      }
      if (accessToken !== undefined) {
        DynamicToolsetManager.instance.accessToken = accessToken;
      }
    }
    return DynamicToolsetManager.instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static resetInstance(): void {
    DynamicToolsetManager.instance = null;
  }

  /**
   * Get all available toolsets
   * @returns Array of available toolset names
   */
  getAvailableToolsets(): ToolSet[] {
    return Object.keys(TOOL_SETS) as ToolSet[];
  }

  /**
   * Get currently active toolsets
   * @returns Array of active toolset names
   */
  getActiveToolsets(): ToolSet[] {
    return Array.from(this.activeToolsets);
  }

  /**
   * Get toolset definition by name
   * @param toolsetName - Name of the toolset
   * @returns Toolset definition or undefined if not found
   */
  getToolsetDefinition(toolsetName: ToolSet): ToolSetDefinition | undefined {
    return TOOL_SETS[toolsetName];
  }

  /**
   * Check if a toolset is currently active
   * @param toolsetName - Name of the toolset
   * @returns True if the toolset is active
   */
  isActive(toolsetName: ToolSet): boolean {
    return this.activeToolsets.has(toolsetName);
  }

  /**
   * Enable a toolset by registering its modules
   * @param toolsetName - Name of the toolset to enable
   * @returns Success status and message
   */
  async enableToolset(toolsetName: ToolSet): Promise<{ success: boolean; message: string }> {
    // Check if toolset is already active
    if (this.activeToolsets.has(toolsetName)) {
      return {
        success: false,
        message: `Toolset '${toolsetName}' is already enabled.`
      };
    }

    // Check if toolset exists
    const toolsetDefinition = TOOL_SETS[toolsetName];
    if (!toolsetDefinition) {
      return {
        success: false,
        message: `Toolset '${toolsetName}' not found. Available toolsets: ${this.getAvailableToolsets().join(', ')}`
      };
    }

    try {
      // Get modules for this toolset
      const modulesToLoad = getModulesForToolSets([toolsetName]);
      
      // Register each required module
      for (const moduleName of modulesToLoad) {
        // Skip if module is already registered
        if (this.registeredModules.has(moduleName)) {
          continue;
        }

        const moduleLoader = MODULE_REGISTRATIONS[moduleName as keyof typeof MODULE_REGISTRATIONS];
        if (moduleLoader) {
          const registrationFunction = await moduleLoader();
          registrationFunction(this.server, this.accessToken);
          this.registeredModules.add(moduleName);
        } else {
          console.warn(`Unknown module: ${moduleName}`);
        }
      }

      // Mark toolset as active
      this.activeToolsets.add(toolsetName);

      // Send notification that tool list has changed
      await this.server.server.notification({
        method: "notifications/tools/list_changed"
      });

      console.log(`Dynamic toolset enabled: ${toolsetName} (${modulesToLoad.length} modules)`);
      
      return {
        success: true,
        message: `Toolset '${toolsetName}' enabled successfully. Loaded ${modulesToLoad.length} modules: ${modulesToLoad.join(', ')}`
      };

    } catch (error) {
      console.error(`Failed to enable toolset ${toolsetName}:`, error);
      return {
        success: false,
        message: `Failed to enable toolset '${toolsetName}': ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Disable a toolset by unregistering its modules
   * Note: Currently MCP SDK doesn't support unregistering tools, so this tracks state only
   * @param toolsetName - Name of the toolset to disable
   * @returns Success status and message
   */
  async disableToolset(toolsetName: ToolSet): Promise<{ success: boolean; message: string }> {
    // Check if toolset is active
    if (!this.activeToolsets.has(toolsetName)) {
      return {
        success: false,
        message: `Toolset '${toolsetName}' is not currently active.`
      };
    }

    try {
      // Get modules for this toolset
      const modulesToDisable = getModulesForToolSets([toolsetName]);
      
      // Check if any other active toolsets use these modules
      const otherActiveToolsets = Array.from(this.activeToolsets).filter(ts => ts !== toolsetName);
      const otherModules = new Set(getModulesForToolSets(otherActiveToolsets));
      
      // Track which modules can be safely unregistered
      const modulesToUnregister = modulesToDisable.filter(module => !otherModules.has(module));
      
      // Note: MCP SDK doesn't currently support tool unregistration
      // For now, we just track the state and log the action
      // In a future version, we would call: this.server.unregisterTool(toolName)
      
      for (const moduleName of modulesToUnregister) {
        this.registeredModules.delete(moduleName);
        console.log(`Module unregistered (state tracking): ${moduleName}`);
      }

      // Mark toolset as inactive
      this.activeToolsets.delete(toolsetName);

      // Send notification that tool list has changed
      await this.server.server.notification({
        method: "notifications/tools/list_changed"
      });

      console.log(`Dynamic toolset disabled: ${toolsetName} (${modulesToUnregister.length} modules unregistered)`);
      
      return {
        success: true,
        message: `Toolset '${toolsetName}' disabled successfully. Note: Tools remain available until server restart due to MCP SDK limitations.`
      };

    } catch (error) {
      console.error(`Failed to disable toolset ${toolsetName}:`, error);
      return {
        success: false,
        message: `Failed to disable toolset '${toolsetName}': ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get status information about the dynamic toolset manager
   * @returns Status information object
   */
  getStatus() {
    return {
      availableToolsets: this.getAvailableToolsets(),
      activeToolsets: this.getActiveToolsets(),
      registeredModules: Array.from(this.registeredModules),
      totalToolsets: Object.keys(TOOL_SETS).length,
      activeCount: this.activeToolsets.size
    };
  }
}

/**
 * Export the getInstance method for singleton access
 */
export const getDynamicToolsetManager = DynamicToolsetManager.getInstance;