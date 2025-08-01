# GOAL - Implementing Dynamic Toolset Pattern as an option in our node MCP server.

## General Background
- MCP servers with large amount of tools can be very confusing, lack performant and token heavey for llm clients.
- Our MCP server has more than 250 tools. 
- Our MCP server already supports the Static Toolset Pattern - fetching a set of tools given configuration for allowing better performance - see readme for tool sets.
- We are using Github MCP Server as a point of reference for handling large tool nombers in MCP servers.

## Deconstructing the Toolset Pattern (Already Implemented)
As platforms and their corresponding APIs grow in complexity, the number of tools required to interact with them can become overwhelmingly large. The GitHub API, with its vast surface area covering everything from repositories and issues to security alerts and organization management, is a prime example of this challenge. A naive implementation of an MCP server for GitHub could result in hundreds of individual tools being presented to the LLM simultaneously, degrading its ability to select the correct tool for a given task. To solve this problem of scale and complexity, the GitHub MCP Server implements a sophisticated architectural design known as the toolset pattern.
Defining the "Toolset" Abstraction
A toolset, within the context of the GitHub MCP Server, is formally defined as a cohesive, domain-oriented, and configurable package of related functionalities. This is a higher-order abstraction that goes beyond a simple list of tools. A crucial aspect of this definition is that toolsets are not limited to just tools; they also encompass relevant MCP resources and prompts where applicable. This means a toolset represents a complete, self-contained unit of capability for a specific functional domain of the GitHub platform.  

## Our Next Step Forward - The Evolution of the Pattern: Dynamic Tool Discovery
While the static toolset pattern provides a significant leap forward in managing complexity, the GitHub MCP Server is already pioneering its next evolution: Dynamic Tool Discovery. This feature, noted as being in a beta stage, represents a fundamental shift from pre-configured, static capabilities to context-aware, on-demand tool activation.  
Contrasting Static Configuration with Dynamic Discovery
The standard toolset pattern operates on a static model. An administrator defines the agent's capabilities at the moment the server is launched, and this set of enabled toolsets remains fixed for the entire lifecycle of that server process. This is a coarse-grained filter that, while effective, lacks the ability to adapt to the fluid nature of a user's conversation.
Dynamic Tool Discovery introduces a dynamic model. Instead of starting with a predefined set of enabled toolsets, the MCP host can "dynamically list and enable toolsets in response to a user prompt". This means the agent's available tools can change  
within a single conversational session based on the immediate context of the user's request. The LLM itself, in collaboration with the host application, can participate in the decision of which toolsets to load into its context at any given moment.
The stated benefit of this approach is to further "prevent the model from being confused" and to "help with tool choice" by ensuring that only the most relevant tools for the immediate task are present in the model's context window. This leads to an even more focused and accurate tool selection process.  
Towards Just-in-Time (JIT) Context Provisioning
This dynamic model is more than an incremental improvement; it is an architectural pattern for Just-in-Time (JIT) context provisioning for LLMs. It represents a sophisticated, intelligent strategy for optimizing the contents of the model's limited context window.
Consider a typical developer workflow within a chat session. A user might begin by asking, "Are there any open issues assigned to me in the webapp repository?" In a dynamic model, the system would recognize the intent to interact with issues and dynamically load only the issues toolset into the context. The LLM would then use the tools from that set to answer the question.
The user might then follow up with, "Okay, for issue #123, show me the contents of the auth.js file mentioned in the description." The system would detect the shift in intent from managing issues to inspecting code. In response, it could dynamically load the repos toolset (which contains file-reading tools) into the context. To further optimize, it might simultaneously unload the issues toolset if it determines it is no longer relevant to the immediate conversational path.
This JIT approach has profound implications. By keeping the context window lean and populated only with immediately relevant tools, it can:
Dramatically Improve Reasoning: The LLM's reasoning and tool selection capabilities are sharpened by removing irrelevant distractions.
Reduce Token Consumption: The cost of API calls to the LLM is often proportional to the size of the input context. By minimizing the number of tools described in the context, dynamic discovery can lead to significant cost savings, especially in long and complex conversations.
Enable More Complex Workflows: With a static context window, there is a hard limit on the number of tools an agent can effectively handle. Dynamic discovery breaks this barrier, allowing an agent to potentially access a vast library of toolsets over the course of a conversation by loading them only when needed.
Dynamic Tool Discovery thus represents the maturation of the toolset pattern from a static configuration tool into a dynamic, intelligent context management system, paving the way for more powerful and efficient AI agents.

## References
- Github MCP Server GO file for example implementation - https://github.com/github/github-mcp-server/blob/main/internal/ghmcp/server.go
- Exa MCP server websetsManager implementation - https://github.com/waldzellai/exa-mcp-server-websets/blob/main/src/tools/websetsManager.ts

## Example Implementation
```
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Import our defined toolsets
import { issuesToolset } from './toolsets/issues.js';
import { reposToolset } from './toolsets/repos.js';

interface ServerConfig {
  dynamicToolsets: boolean;
  enabledToolsets: string; // Used only if dynamicToolsets is false
}

class DynamicMcpServer {
  private server: McpServer;
  private allToolsets: Map<string, Tool>;
  private activeToolsets: Set<string>;

  constructor(private config: ServerConfig) {
    this.server = new McpServer({
      name: 'DynamicToolsetServer',
      version: '1.0.0',
      capabilities: {
        // Crucially, we must declare that our tool list can change. [1]
        tools: { listChanged: true },
      },
    });

    this.allToolsets = new Map(,
     );
    this.activeToolsets = new Set();
  }

  /**
   * Registers the meta-tools for enabling and disabling toolsets dynamically.
   */
  private registerMetaTools() {
    console.error('Server starting in DYNAMIC mode.');
    const toolsetNames = Array.from(this.allToolsets.keys());

    // Tool to enable a toolset
    this.server.registerTool({
      name: 'enable_toolset',
      description: `Enables a specific group of tools (a toolset). Available toolsets: ${toolsetNames.join(', ')}`,
      schema: z.object({
        toolsetName: z.enum(toolsetNames as [string,...string]).describe('The name of the toolset to enable.'),
      }),
      handler: async ({ toolsetName }) => {
        if (this.activeToolsets.has(toolsetName)) {
          return { content: `Toolset '${toolsetName}' is already enabled.`, mimeType: 'text/plain' };
        }

        const toolset = this.allToolsets.get(toolsetName);
        if (toolset) {
          toolset.forEach(tool => this.server.registerTool(tool));
          this.activeToolsets.add(toolsetName);
          
          // This notification is the key to the dynamic pattern.
          // It tells the client to re-fetch the list of available tools. [1]
          this.server.notify('notifications/tools/list_changed', undefined);
          console.error(`Enabled toolset: ${toolsetName}`);
          return { content: `Toolset '${toolsetName}' enabled successfully.`, mimeType: 'text/plain' };
        }
        return { content: `Toolset '${toolsetName}' not found.`, mimeType: 'text/plain' };
      },
    });

    // Tool to disable a toolset
    this.server.registerTool({
        name: 'disable_toolset',
        description: 'Disables a specific group of tools (a toolset).',
        schema: z.object({
            toolsetName: z.string().describe('The name of the toolset to disable.'),
        }),
        handler: async ({ toolsetName }) => {
            if (!this.activeToolsets.has(toolsetName)) {
                return { content: `Toolset '${toolsetName}' is not active.`, mimeType: 'text/plain' };
            }

            const toolset = this.allToolsets.get(toolsetName);
            if (toolset) {
                toolset.forEach(tool => this.server.unregisterTool(tool.name));
                this.activeToolsets.delete(toolsetName);
                
                this.server.notify('notifications/tools/list_changed', undefined);
                console.error(`Disabled toolset: ${toolsetName}`);
                return { content: `Toolset '${toolsetName}' disabled successfully.`, mimeType: 'text/plain' };
            }
            return { content: `Toolset '${toolsetName}' not found.`, mimeType: 'text/plain' };
        }
    });
  }

  /**
   * Registers a static list of toolsets at startup.
   */
  private registerStaticToolsets() {
    console.error(`Server starting in STATIC mode with toolsets: ${this.config.enabledToolsets.join(', ')}`);
    this.config.enabledToolsets.forEach(name => {
      const toolset = this.allToolsets.get(name);
      if (toolset) {
        toolset.forEach(tool => this.server.registerTool(tool));
        this.activeToolsets.add(name);
      } else {
        console.error(`Warning: Toolset '${name}' not found.`);
      }
    });
  }

  /**
   * Initializes the server based on the configuration and starts listening.
   */
  public async start() {
    if (this.config.dynamicToolsets) {
      this.registerMetaTools();
    } else {
      this.registerStaticToolsets();
    }

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Dynamic MCP Server is running and connected via stdio.');
  }
}

// --- Main Execution ---
// You can change this configuration to see both modes in action.
const config: ServerConfig = {
  dynamicToolsets: true, // Set to 'false' to test static mode
  enabledToolsets: ['issues'], // Only used when dynamicToolsets is false
};

const mcpServer = new DynamicMcpServer(config);
mcpServer.start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

```
