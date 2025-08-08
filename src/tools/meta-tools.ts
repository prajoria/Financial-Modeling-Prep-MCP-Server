import { z } from "zod";
import { TOOL_SETS } from "../constants/toolSets.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DynamicToolsetManager } from "../dynamic-toolset-manager/DynamicToolsetManager.js";
import type { ToolSet } from "../types/index.js";

/**
 * Register meta-tools for dynamic toolset management
 * These tools allow AI to enable and disable toolsets at runtime
 * @param server The MCP server instance
 * @param toolsetManager The DynamicToolsetManager instance for this session
 */
export function registerMetaTools(server: McpServer, toolsetManager: DynamicToolsetManager): void {
  console.log('Server starting in DYNAMIC mode - Registering meta-tools');

  // Use the provided toolset manager instance (per-session isolation)
  const availableToolsets = toolsetManager.getAvailableToolsets();
  
  console.log(`Available toolsets: ${availableToolsets.join(', ')}`);

  const toolsetDescriptionList = generateToolsetDescriptionList(availableToolsets);

  // Register enable_toolset meta-tool
  server.tool(
    'enable_toolset',
    `Enables a specific group of tools (a toolset). Available toolsets:\n• ${toolsetDescriptionList}`,
    {
      toolsetName: z.enum(availableToolsets as [ToolSet, ...ToolSet[]]).describe('The name of the toolset to enable.')
    },
    async ({ toolsetName }: { toolsetName: ToolSet }) => {
      try {
        console.log(`Meta-tool called: enable_toolset(${toolsetName})`);
        
        // Use the per-session manager to enable the toolset
        const result = await toolsetManager.enableToolset(toolsetName);
        
        if (result.success) {
          console.log(`Successfully enabled toolset: ${toolsetName}`);
          return {
            content: [
              {
                type: "text",
                text: result.message
              }
            ]
          };
        } else {
          console.log(`Failed to enable toolset: ${toolsetName} - ${result.message}`);
          return {
            content: [
              {
                type: "text", 
                text: result.message
              }
            ],
            isError: true
          };
        }
      } catch (error) {
        const errorMessage = `Unexpected error enabling toolset '${toolsetName}': ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`${errorMessage}`, error);
        return {
          content: [
            {
              type: "text",
              text: errorMessage
            }
          ],
          isError: true
        };
      }
    }
  );

  // Register disable_toolset meta-tool
  server.tool(
    'disable_toolset',
    `Disables a specific group of tools (a toolset). Active toolsets:\n• ${toolsetDescriptionList}`,
    {
      toolsetName: z.enum(availableToolsets as [ToolSet, ...ToolSet[]]).describe('The name of the toolset to disable.')
    },
    async ({ toolsetName }: { toolsetName: ToolSet }) => {
      try {
        console.log(`Meta-tool called: disable_toolset(${toolsetName})`);
        
        // Use the per-session manager to disable the toolset
        const result = await toolsetManager.disableToolset(toolsetName);
        
        if (result.success) {
          console.log(`Successfully disabled toolset: ${toolsetName}`);
          return {
            content: [
              {
                type: "text",
                text: result.message
              }
            ]
          };
        } else {
          console.log(`Failed to disable toolset: ${toolsetName} - ${result.message}`);
          return {
            content: [
              {
                type: "text", 
                text: result.message
              }
            ],
            isError: true
          };
        }
      } catch (error) {
        const errorMessage = `Unexpected error disabling toolset '${toolsetName}': ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`${errorMessage}`, error);
        return {
          content: [
            {
              type: "text",
              text: errorMessage
            }
          ],
          isError: true
        };
      }
    }
  );

  // Register get_toolset_status meta-tool for debugging and status checking
  server.tool(
    'get_toolset_status',
    'Get current status of dynamic toolset manager including active and available toolsets',
    {},
    async () => {
      try {
        const status = toolsetManager.getStatus();
        
        const statusReport = [
          `📊 Dynamic Toolset Manager Status:`,
          ``,
          `🟢 Active Toolsets (${status.activeCount}/${status.totalToolsets}):`,
          status.activeToolsets.length > 0 
            ? status.activeToolsets.map(ts => `  • ${ts}`).join('\n')
            : '  (none currently active)',
          ``,
          `📚 Available Toolsets (${status.totalToolsets}):`,
          status.availableToolsets.map(ts => {
            const isActive = status.activeToolsets.includes(ts);
            const toolsetDef = TOOL_SETS[ts];
            return `  ${isActive ? '🟢' : '⚪'} ${ts} - ${toolsetDef.name} (${toolsetDef.modules.length} modules)`;
          }).join('\n'),
          ``,
          `🔧 Registered Modules (${status.registeredModules.length}):`,
          status.registeredModules.length > 0
            ? status.registeredModules.map(mod => `  • ${mod}`).join('\n')
            : '  (none currently registered)'
        ].join('\n');

        return {
          content: [
            {
              type: "text",
              text: statusReport
            }
          ]
        };
      } catch (error) {
        const errorMessage = `Error getting toolset status: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`${errorMessage}`, error);
        return {
          content: [
            {
              type: "text",
              text: errorMessage
            }
          ],
          isError: true
        };
      }
    }
  );

  console.log(`Meta-tools registered: enable_toolset, disable_toolset, get_toolset_status`);
}

/**
 * Builds a decision-focused list of toolset descriptions optimized for LLM understanding
 * Uses "IF you need to" format to help LLMs make better toolset selection decisions
 * @param toolsets - Array of toolset names to format
 * @returns Formatted string with decision-focused descriptions and capability details
 * 
 * @example
 * ```typescript
 * const toolsets = ['search', 'quotes'];
 * const result = generateToolsetDescriptionList(toolsets);
 * // Returns: "search - IF you need to: Find companies, lookup symbols, discover investments → INCLUDES: Company search, symbol lookup, exchange directory (2 modules)\n• quotes - IF you need to: Check current prices, monitor market activity → INCLUDES: Real-time quotes, price changes, trading volumes (1 module)"
 * ```
 */
function generateToolsetDescriptionList(toolsets: ToolSet[]): string {
  return toolsets.map(toolset => {
    const def = TOOL_SETS[toolset];
    const moduleCount = def.modules.length;
    
    return `${toolset} - IF you need to: ${def.decisionCriteria} → INCLUDES: ${def.description} (${moduleCount} module${moduleCount !== 1 ? 's' : ''})`;
  }).join('\n• ');
}
