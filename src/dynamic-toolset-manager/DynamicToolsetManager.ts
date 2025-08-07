import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TOOL_SETS, type ToolSet, type ToolSetDefinition } from "../constants/toolSets.js";
import { getModulesForToolSets } from "../constants/index.js";
import { 
  validateAndSanitizeToolsetName, 
  validateToolsetModules 
} from "../utils/validation.js";
import { ModuleLoader } from "../types/index.js";
import { loadModuleWithTimeout } from "../utils/loadModuleWithTimeout.js";


/**
 * Module registration function mapping - imported from tools/index.ts pattern
 * Each entry maps a module name to a function that dynamically imports and returns the registration function
 */
const MODULE_REGISTRATIONS: Record<string, ModuleLoader> = {
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
};

/**
 * Dynamic Toolset Manager following GitHub MCP Server pattern
 * Wraps existing FMP toolset system to provide runtime enable/disable functionality
 * Per-session instance pattern for proper session isolation
 */
export class DynamicToolsetManager {
  private server: McpServer;
  private accessToken?: string;
  private activeToolsets: Set<ToolSet>;
  private registeredModules: Set<string>;

  constructor(server: McpServer, accessToken?: string) {
    this.server = server;
    this.accessToken = accessToken;
    this.activeToolsets = new Set();
    this.registeredModules = new Set();
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
    const validation = validateAndSanitizeToolsetName(toolsetName, this.getAvailableToolsets());
    
    if (!validation.isValid || !validation.sanitized) {
      return {
        success: false,
        message: validation.error || 'Unknown validation error'
      };
    }

    const sanitizedToolsetName = validation.sanitized;
    
    // Check if toolset is already active
    if (this.activeToolsets.has(sanitizedToolsetName)) {
      return {
        success: false,
        message: `Toolset '${sanitizedToolsetName}' is already enabled.`
      };
    }

    try {
      // Validate that modules exist for this toolset
      const moduleValidation = validateToolsetModules([sanitizedToolsetName], getModulesForToolSets);
      
      if (!moduleValidation.isValid || !moduleValidation.modules) {
        return {
          success: false,
          message: moduleValidation.error || 'Unknown module validation error'
        };
      }

      const modulesToLoad = moduleValidation.modules;
      
      const moduleLoadPromises = modulesToLoad.map(async (moduleName) => {
        // Skip if module is already registered
        if (this.registeredModules.has(moduleName)) {
          return;
        }

        const moduleLoader = MODULE_REGISTRATIONS[moduleName];
        if (moduleLoader) {
          try {
            const registrationFunction = await loadModuleWithTimeout(moduleLoader, moduleName);
            
            registrationFunction(this.server, this.accessToken);
            this.registeredModules.add(moduleName);
          } catch (moduleError) {
            console.error(`Failed to load module ${moduleName}:`, moduleError);
            throw new Error(`Module loading failed for ${moduleName}: ${moduleError instanceof Error ? moduleError.message : 'Unknown error'}`);
          }
        } else {
          console.warn(`Unknown module: ${moduleName} for toolset: ${sanitizedToolsetName}`);
        }
      });

      // Wait for all modules to load
      await Promise.all(moduleLoadPromises);

      // Mark toolset as active
      this.activeToolsets.add(sanitizedToolsetName);

      // Send notification that tool list has changed
      try {
        await this.server.server.notification({
          method: "notifications/tools/list_changed"
        });
      } catch (notificationError) {
        console.warn(`Failed to send tool list change notification:`, notificationError);
        // Don't fail the entire operation for notification errors
      }

      console.log(`Dynamic toolset enabled: ${sanitizedToolsetName} (${modulesToLoad.length} modules)`);
      
      return {
        success: true,
        message: `Toolset '${sanitizedToolsetName}' enabled successfully. Loaded ${modulesToLoad.length} modules: ${modulesToLoad.join(', ')}`
      };

    } catch (error) {
      console.error(`Failed to enable toolset ${sanitizedToolsetName}:`, error);
      
      // Cleanup on failure - remove from active toolsets if it was added
      this.activeToolsets.delete(sanitizedToolsetName);
      
      return {
        success: false,
        message: `Failed to enable toolset '${sanitizedToolsetName}': ${error instanceof Error ? error.message : 'Unknown error'}`
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
    const validation = validateAndSanitizeToolsetName(toolsetName, this.getAvailableToolsets());
    
    if (!validation.isValid || !validation.sanitized) {
      const activeToolsets = Array.from(this.activeToolsets).join(', ') || 'none';
      const baseMessage = validation.error || 'Unknown validation error';
      return {
        success: false,
        message: baseMessage.includes('Available toolsets:') 
          ? baseMessage.replace('Available toolsets:', `Active toolsets: ${activeToolsets}. Available toolsets:`)
          : `${baseMessage} Active toolsets: ${activeToolsets}`
      };
    }

    const sanitizedToolsetName = validation.sanitized;
    
    // Check if toolset is active
    if (!this.activeToolsets.has(sanitizedToolsetName)) {
      return {
        success: false,
        message: `Toolset '${sanitizedToolsetName}' is not currently active. Active toolsets: ${Array.from(this.activeToolsets).join(', ') || 'none'}`
      };
    }

    try {
      // Get modules for this toolset
      const modulesToDisable = getModulesForToolSets([sanitizedToolsetName]);
      
      // Check if any other active toolsets use these modules
      const otherActiveToolsets = Array.from(this.activeToolsets).filter(ts => ts !== sanitizedToolsetName);
      const otherModules = new Set(getModulesForToolSets(otherActiveToolsets));
      
      // Track which modules can be safely unregistered
      const modulesToUnregister = modulesToDisable.filter(module => !otherModules.has(module));
      
      // LIMITATION: MCP SDK doesn't support unregistering individual tools that were
      // registered during enableToolset(). The tools remain registered with the MCP server
      // but we track them as "disabled" in our internal state for logical consistency.
      // Future: When MCP SDK supports tool unregistration, we would unregister each 
      // individual tool that was registered when this toolset was enabled.
      
      for (const moduleName of modulesToUnregister) {
        this.registeredModules.delete(moduleName);
        console.log(`Module unregistered (state tracking): ${moduleName}`);
      }

      // Mark toolset as inactive
      this.activeToolsets.delete(sanitizedToolsetName);

      // Send notification that tool list has changed
      await this.server.server.notification({
        method: "notifications/tools/list_changed"
      });

      console.log(`Dynamic toolset disabled: ${sanitizedToolsetName} (${modulesToUnregister.length} modules unregistered)`);
      
      return {
        success: true,
        message: `Toolset '${sanitizedToolsetName}' disabled successfully. The toolset is now inactive, but individual tools remain registered with MCP server due to SDK limitations.`
      };

    } catch (error) {
      console.error(`Failed to disable toolset ${sanitizedToolsetName}:`, error);
      return {
        success: false,
        message: `Failed to disable toolset '${sanitizedToolsetName}': ${error instanceof Error ? error.message : 'Unknown error'}`
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


