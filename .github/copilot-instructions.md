# AI Coding Agent Instructions for Financial Modeling Prep MCP Server

## Architecture Overview

This is a **Model Context Protocol (MCP) server** that exposes 253+ financial tools across 24 categories using the Financial Modeling Prep API. The codebase uses a **stateful session-based architecture** with three operational modes:

- **Dynamic Mode**: Starts with 3 meta-tools, loads toolsets on-demand via `enable_toolset()` calls
- **Static Mode**: Pre-loads specific toolsets at startup via `FMP_TOOL_SETS` environment variable
- **Legacy Mode**: Loads all 253 tools at startup (default)

## Key Components & Data Flow

### Core Architecture Pattern
```
HTTP Request → McpServer → SessionCache → McpServerFactory → DynamicToolsetManager → Individual Tool Modules
```

1. **`McpServer`** (`src/server/MCPServer.ts`): HTTP server wrapping Express with session management
2. **`SessionCache`** (`src/session-cache/SessionCache.ts`): LRU cache with TTL for session isolation
3. **`McpServerFactory`** (`src/mcp-server-factory/McpServerFactory.ts`): Creates MCP server instances per session
4. **`DynamicToolsetManager`** (`src/dynamic-toolset-manager/DynamicToolsetManager.ts`): Runtime tool loading/unloading
5. **Tool modules** (`src/tools/*.ts`): Individual tool registration functions following consistent patterns

### Session Isolation Pattern
Each client session gets its own `McpServer` instance and `DynamicToolsetManager`, cached by `sessionId`. Sessions are managed by the Smithery SDK's stateful server wrapper.

## Development Workflows

### Testing Strategy
- **Framework**: Vitest with comprehensive mocking patterns
- **Key Pattern**: Mock external dependencies in test files using `vi.mock()` at module level
- **Run Tests**: `npm test` (watch mode) or `npm run test:run` (single run)
- **Coverage**: `npm run test:coverage`

### Mock Pattern Example (from `MCPServer.test.ts`):
```typescript
vi.mock("../session-cache/SessionCache.js", () => ({
  SessionCache: vi.fn().mockImplementation((options = {}) => ({
    get: vi.fn(),
    set: vi.fn(), 
    stop: vi.fn(), // Critical: mock ALL methods used in production
  })),
}));
```

### Build & Development
- **Build**: `npm run build` (TypeScript compilation to `dist/`)
- **Dev Mode**: `npm run dev` (uses `tsx watch`)
- **Entry Point**: `src/index.ts` → CLI interface with minimist argument parsing

## Project-Specific Conventions

### Tool Registration Pattern
All tools follow this exact pattern in `src/tools/*.ts`:
```typescript
export function registerXxxTools(server: McpServer, accessToken?: string): void {
  const client = new XxxClient(accessToken);
  
  server.tool("toolName", "description", {
    param: z.string().describe("param description"),
  }, async ({ param }) => {
    try {
      const results = await client.method(param);
      return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  });
}
```

### API Client Pattern  
All API clients in `src/api/*/` extend `FMPClient` base class:
- **Context-based API keys**: Clients accept `context` parameter with session-specific tokens
- **Error handling**: Consistent axios error wrapping with FMP-specific messages
- **Method naming**: Direct mapping to FMP API endpoints (e.g., `getProfile`, `getQuote`)

### Environment Configuration Precedence
1. Command line arguments (`--fmp-token`, `--dynamic-tool-discovery`)
2. Environment variables (`FMP_ACCESS_TOKEN`, `DYNAMIC_TOOL_DISCOVERY`)
3. Default values

## Critical Integration Points

### Smithery SDK Integration
- Uses `@smithery/sdk/server/stateful.js` for session management
- `createStatefulServer()` wraps the core session resource function
- Compatible with `CreateServerArg<SessionConfig>` interface

### Tool Set System
- **Tool sets defined in**: `src/constants/toolSets.ts` with structured metadata
- **Module mapping**: Both static (`src/tools/index.ts`) and dynamic (`DynamicToolsetManager.ts`) registrations
- **Validation**: `src/utils/validation.ts` handles tool set parsing and sanitization

### Error Handling Patterns
- **Session errors**: Logged but re-thrown to let Smithery SDK handle responses
- **Tool errors**: Caught and returned as `{ content: [...], isError: true }`
- **API errors**: Wrapped with context-specific error messages

## Testing Critical Areas

### Session Cache Testing
Mock `SessionCache` with proper `stop()` method to avoid "not a function" errors in lifecycle tests.

### Dynamic Tool Loading
Test the `DynamicToolsetManager` enable/disable flow, especially module loading timeouts and validation.

### API Client Context Handling  
Verify clients properly extract API keys from session context vs constructor parameters.

## Key Files to Understand

- `src/server/MCPServer.ts`: Main server lifecycle and session management
- `src/mcp-server-factory/McpServerFactory.ts`: Mode resolution and server creation logic
- `src/constants/toolSets.ts`: Complete tool organization structure
- `src/tools/index.ts`: Static tool registration patterns
- `src/dynamic-toolset-manager/DynamicToolsetManager.ts`: Runtime tool management

When adding new tools or modifying architecture, follow the established patterns for consistency and maintainability.
