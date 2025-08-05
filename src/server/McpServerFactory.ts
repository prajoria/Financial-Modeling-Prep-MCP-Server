import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CreateServerArg } from "@smithery/sdk/server/stateful.js";
import { parseCommaSeparatedToolSets, validateDynamicToolDiscoveryConfig } from '../utils/validation.js';
import { DynamicToolsetManager } from '../dynamic-toolset-manager/DynamicToolsetManager.js';
import { registerMetaTools } from '../tools/meta-tools.js';
import { registerAllTools, registerToolsBySet } from '../tools/index.js';
import { getServerVersion } from '../utils/getServerVersion.js';

/**
 * Server mode enumeration
 */
export type ServerMode = 'DYNAMIC_TOOL_DISCOVERY' | 'STATIC_TOOL_SETS' | 'ALL_TOOLS';

/**
 * Session configuration type matching the SDK's CreateServerArg config
 */
export interface SessionConfig {
  FMP_ACCESS_TOKEN?: string;
  FMP_TOOL_SETS?: string;
  DYNAMIC_TOOL_DISCOVERY?: string;
}

/**
 * Configuration options for server creation
 * Compatible with SDK's CreateServerArg<T> where T = SessionConfig
 */
export interface McpServerOptions {
  sessionId: string;
  config?: SessionConfig;
  serverAccessToken?: string;
}

/**
 * Result of server creation
 */
export interface McpServerCreationResult {
  mcpServer: McpServer;
  toolManager?: DynamicToolsetManager; // Only present in DYNAMIC_TOOL_DISCOVERY mode
  mode: ServerMode;
}

/**
 * Factory class for creating and configuring MCP servers
 * Handles server creation logic and tool registration based on mode
 */
export class McpServerFactory {
  private readonly version: string;

  constructor() {
    this.version = getServerVersion();  
  }

  /**
   * Creates a new MCP server with the appropriate configuration and tools
   * Compatible with SDK's CreateServerFn<SessionConfig> signature
   * @param options - Server creation options
   * @returns Server creation result with server, manager, and mode
   */
  public createServer(options: McpServerOptions): McpServerCreationResult {
    const { sessionId, config, serverAccessToken } = options;

    // Resolve access token and mode first
    const accessToken = this._resolveAccessToken(serverAccessToken, config);
    const mode = this._resolveSessionMode(config);
    
    console.log(`[McpServerFactory] Creating server for session ${sessionId} in ${mode} mode`);

    // Create the base MCP server with appropriate capabilities
    const isDynamicMode = mode === 'DYNAMIC_TOOL_DISCOVERY';
    const mcpServer = this._createMcpServerInstance(isDynamicMode);

    // Register tools based on mode
    const toolManager = this._registerToolsForMode(mcpServer, mode, config, accessToken);

    return {
      mcpServer,
      toolManager,
      mode
    };
  }

  /**
   * Creates a server from SDK's CreateServerArg - for direct SDK compatibility
   * This method matches the SDK's CreateServerFn<SessionConfig> signature
   * @param arg - SDK's CreateServerArg<SessionConfig>
   * @returns McpServer instance
   */ 
  public createServerFromSdkArg(arg: CreateServerArg<SessionConfig>): McpServer {
    const { sessionId, config } = arg;
    
    // Determine mode first to set appropriate capabilities
    const mode = this._resolveSessionMode(config);
    const isDynamicMode = mode === 'DYNAMIC_TOOL_DISCOVERY';
    
    // Create server with appropriate capabilities
    const mcpServer = this._createMcpServerInstance(isDynamicMode);
    
    // Register tools based on mode
    const accessToken = this._resolveAccessToken(undefined, config);
    this._registerToolsForMode(mcpServer, mode, config, accessToken);
    
    return mcpServer;
  }

  /**
   * Creates a new, isolated McpServer instance with proper configuration schema
   * @param isDynamicMode - Whether this server instance supports dynamic tool changes
   * @returns Configured McpServer instance
   */
  private _createMcpServerInstance(isDynamicMode: boolean = false): McpServer {
    return new McpServer({
      name: "Financial Modeling Prep MCP (Stateful)",
      version: this.version,
      capabilities: {
        tools: { 
          listChanged: isDynamicMode // Only enable dynamic tool changes in dynamic mode
        },
      },
      configSchema: {
        type: "object",
        properties: {
          FMP_ACCESS_TOKEN: {
            type: "string",
            title: "FMP Access Token",
            description: "Financial Modeling Prep API access token",
          },
          FMP_TOOL_SETS: {
            type: "string",
            title: "Tool Sets (Optional)",  
            description: "Comma-separated list of tool sets to load (e.g., 'search,company,quotes'). If not specified, all tools will be loaded.",
          },
          DYNAMIC_TOOL_DISCOVERY: {
            type: "string",
            title: "Dynamic Tool Discovery (Optional)",
            description: "Enable dynamic toolset management. Set to 'true' to use meta-tools.",
          },
        },
      },
    });
  }

  /**
   * Resolves the access token with priority: server token > session config
   * @param serverToken - Access token from server configuration
   * @param sessionConfig - Configuration from session
   * @returns Resolved access token or undefined
   */
  private _resolveAccessToken(
    serverToken?: string, 
    sessionConfig?: SessionConfig
  ): string | undefined {
    return sessionConfig?.FMP_ACCESS_TOKEN || serverToken;
  }

  /**
   * Determines the server mode based on session configuration
   * @param sessionConfig - Configuration from session
   * @returns Determined server mode
   */
  private _resolveSessionMode(sessionConfig?: SessionConfig): ServerMode {
    // Check for dynamic tool discovery in session config
    const isDynamic = validateDynamicToolDiscoveryConfig(sessionConfig?.DYNAMIC_TOOL_DISCOVERY);
    
    if (isDynamic === true) {
      return 'DYNAMIC_TOOL_DISCOVERY';
    }
    
    // Check if specific toolsets are provided in session config
    if (sessionConfig?.FMP_TOOL_SETS && typeof sessionConfig.FMP_TOOL_SETS === 'string') {
      return 'STATIC_TOOL_SETS';
    }
    
    // Default to legacy mode (all tools)
    return 'ALL_TOOLS';
  }

  /**
   * Registers tools based on the determined server mode
   * @param mcpServer - The MCP server instance
   * @param mode - The determined server mode  
   * @param sessionConfig - Configuration from session
   * @param accessToken - Resolved access token
   * @returns Tool manager instance (if applicable) 
   */
  private _registerToolsForMode(
    mcpServer: McpServer,
    mode: ServerMode,
    sessionConfig?: SessionConfig,
    accessToken?: string
  ): DynamicToolsetManager | undefined {
    let toolManager: DynamicToolsetManager | undefined = undefined;

    switch (mode) {
      case 'DYNAMIC_TOOL_DISCOVERY':
        // For dynamic mode, create a new manager instance and register meta-tools
        // Each session gets its own isolated DynamicToolsetManager instance
        toolManager = new DynamicToolsetManager(mcpServer, accessToken);
        registerMetaTools(mcpServer, toolManager);
        console.log(`[McpServerFactory] Created isolated toolset manager and registered meta-tools for dynamic mode`);
        break;
      
      case 'STATIC_TOOL_SETS':
        // For static mode, parse the list and register only those toolsets
        const toolSetsString = (sessionConfig?.FMP_TOOL_SETS as string) || '';
        const toolSets = parseCommaSeparatedToolSets(toolSetsString);
        console.log(`[McpServerFactory] Loading static toolsets: ${toolSets.join(', ')}`);
        registerToolsBySet(mcpServer, toolSets, accessToken);
        // toolManager remains undefined for static mode
        break;

      case 'ALL_TOOLS':
      default:
        // For legacy mode, register all available tools
        console.log(`[McpServerFactory] Loading all tools (Legacy Mode)`);
        registerAllTools(mcpServer, accessToken);
        // toolManager remains undefined for legacy mode
        break;
    }

    return toolManager;
  }
}