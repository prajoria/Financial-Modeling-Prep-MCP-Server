import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getDynamicToolsetManager } from "../dynamic-toolset-manager/index.js";
import type { ToolSet } from "../constants/index.js";
import { TOOL_SETS } from "../constants/toolSets.js";

/**
 * Register meta-tools for dynamic toolset management
 * These tools allow AI to enable and disable toolsets at runtime
 * @param server The MCP server instance
 * @param accessToken The Financial Modeling Prep API access token (optional)
 */
export function registerMetaTools(server: McpServer, accessToken?: string): void {
  console.log('Server starting in DYNAMIC mode - Registering meta-tools');
  
  // Get the singleton DynamicToolsetManager instance
  const dynamicToolsetManager = getDynamicToolsetManager(server, accessToken);
  const availableToolsets = dynamicToolsetManager.getAvailableToolsets();
  
  console.log(`Available toolsets: ${availableToolsets.join(', ')}`);

  // Register enable_toolset meta-tool
  server.tool(
    'enable_toolset',
    `Enables a specific group of tools (a toolset). Available toolsets: ${availableToolsets.join(', ')}`,
    {
      toolsetName: z.enum(availableToolsets as [ToolSet, ...ToolSet[]]).describe('The name of the toolset to enable.')
    },
    async ({ toolsetName }: { toolsetName: ToolSet }) => {
      try {
        console.log(`Meta-tool called: enable_toolset(${toolsetName})`);
        
        // Use the singleton manager to enable the toolset
        const result = await dynamicToolsetManager.enableToolset(toolsetName);
        
        if (result.success) {
          console.log(`✅ Successfully enabled toolset: ${toolsetName}`);
          return {
            content: [
              {
                type: "text",
                text: result.message
              }
            ]
          };
        } else {
          console.log(`❌ Failed to enable toolset: ${toolsetName} - ${result.message}`);
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
        console.error(`❌ ${errorMessage}`, error);
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
        const status = dynamicToolsetManager.getStatus();
        
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
        console.error(`❌ ${errorMessage}`, error);
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

  console.log(`✅ Meta-tools registered: enable_toolset, get_toolset_status`);
}