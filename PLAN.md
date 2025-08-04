# Plan: Migrate to Stateless Server with SessionCache and Class-Based Design

This plan outlines the steps to migrate from stateful to stateless server using Smithery SDK, maintaining SessionCache for multiple client support, and implementing proper class-based design with pure functions.

## Current Issues to Address
- Import path issues (missing `.js` extensions)
- Wrong import from `@smithery/sdk/server/mcp.js` instead of `@modelcontextprotocol/sdk/server/mcp.js`
- Using `StatefulServerParams` which doesn't exist, should be `CreateServerArg`
- Function signature mismatch for server creation
- Missing toolsets in config schema
- **CRITICAL: DynamicToolsetManager singleton pattern breaks session isolation**
  - Current singleton shares state (`activeToolsets`, `registeredModules`) across all sessions
  - In stateless architecture, each session needs its own isolated manager instance
  - Meta-tools currently call `getDynamicToolsetManager()` which gets global singleton
  - Would cause toolset state to leak between different client sessions

## To-Do List

### Phase 1: Fix Import and Type Issues
- [ ] Fix import paths in `server.service.ts` to use correct modules and add `.js` extensions
- [ ] Update imports to use `@modelcontextprotocol/sdk` instead of `@smithery/sdk` for McpServer
- [ ] Replace `StatefulServerParams` with `CreateServerArg` from stateless server
- [ ] Fix SessionCache imports to use correct relative paths
- [ ] Update all relative imports to include proper file extensions

### Phase 2: Create MCP Server Factory Class
- [ ] Create `McpServerFactory.ts` class to handle MCP server creation logic
- [ ] Move `createMcpServer` function logic into the factory class
- [ ] Add proper config schema with FMP_ACCESS_TOKEN, FMP_TOOL_SETS, and DYNAMIC_TOOL_DISCOVERY
- [ ] Make factory methods pure and testable
- [ ] Add proper TypeScript interfaces for server creation options

### Phase 3: Migrate to Stateless Server Architecture  
- [ ] Update `server.service.ts` to use `createStatelessServer` instead of `createStatefulServer`
- [ ] Modify `StatefulMcpServer` class to work with stateless paradigm (rename to `McpServerService`)
- [ ] Implement proper session management using SessionCache with stateless server
- [ ] Update `_getSessionResources` to work with stateless server request pattern
- [ ] Add proper error handling for session creation and management

### Phase 4: Refactor Dynamic Toolset Manager Integration (CRITICAL)
- [ ] **Remove singleton pattern** from `DynamicToolsetManager` class:
  - Remove `static instance`, `getInstance()`, and `resetInstance()` methods
  - Make constructor `public` instead of `private`
  - Remove `getDynamicToolsetManager` export that wraps `getInstance`
- [ ] **Update meta-tools to use instance-based pattern**:
  - Change `registerMetaTools(server, accessToken)` to `registerMetaTools(server, toolManager)`
  - Remove `getDynamicToolsetManager()` call from meta-tools
  - Pass manager instance directly to meta-tools registration
- [ ] **Update SessionCache integration**:
  - Create new `DynamicToolsetManager` instance per session in `_getSessionResources`
  - Store manager instance in cache entry alongside mcpServer
  - Ensure each session has isolated toolset state
- [ ] **Fix imports and exports**:
  - Update `src/dynamic-toolset-manager/index.ts` to export class directly
  - Remove singleton export patterns
  - Update all imports throughout codebase

### Phase 5: Update Server Configuration and Schema
- [ ] Add `FMP_TOOL_SETS` to the config schema in server creation
- [ ] Update config schema descriptions to match current functionality
- [ ] Add proper validation for toolset names in config
- [ ] Ensure backward compatibility with existing configuration patterns

### Phase 6: Refactor Index.ts with Main Function Pattern
- [ ] Create `main()` function in `index.ts` that handles server startup
- [ ] Update argument parsing to work with new server class
- [ ] Maintain environment variable support (PORT, FMP_ACCESS_TOKEN, FMP_TOOL_SETS, DYNAMIC_TOOL_DISCOVERY)
- [ ] Preserve command line argument handling for all existing options
- [ ] Add proper error handling and graceful shutdown in main function
- [ ] Update startup logging to reflect new architecture

### Phase 7: Update Session Cache Integration
- [ ] Ensure SessionCache works properly with stateless server architecture
- [ ] Update cache entry structure if needed for stateless paradigm
- [ ] Add proper session cleanup and memory management
- [ ] Test session isolation and proper resource cleanup

### Phase 8: Testing and Validation
- [ ] Update existing tests to work with new stateless architecture
- [ ] Add tests for McpServerFactory class
- [ ] Test session management and isolation
- [ ] Validate environment variable and CLI argument handling
- [ ] Test dynamic toolset management per session

### Phase 9: Code Cleanup and Documentation
- [ ] Remove any unused imports or code from migration
- [ ] Add proper JSDoc comments to new classes and methods
- [ ] Update inline comments to reflect new architecture
- [ ] Ensure consistent error handling patterns throughout

## Migration Notes

**Key Architectural Changes:**
- **Stateful → Stateless**: Each request creates new server instance, but we cache them per session
- **Singleton → Instance**: DynamicToolsetManager becomes per-session instance
- **Pure Functions**: Server creation logic extracted to factory class
- **Session Management**: SessionCache handles multi-client support in stateless environment

**Environment Variable Support:**
- Maintain existing CLI args: `--fmp-token`, `--fmp-tool-sets`, `--dynamic-tool-discovery`, `--port`
- Preserve env vars: `FMP_ACCESS_TOKEN`, `FMP_TOOL_SETS`, `DYNAMIC_TOOL_DISCOVERY`, `PORT`
- Keep backward compatibility with existing configuration methods

**Class Structure:**
```
McpServerService (main server class)
├── McpServerFactory (server creation logic)  
├── SessionCache (session management)
└── DynamicToolsetManager (per-session instances, NO singleton)
```

**DynamicToolsetManager Refactoring:**
```typescript
// BEFORE (Singleton - BAD for session isolation):
const manager = getDynamicToolsetManager(server, token); // Global shared state

// AFTER (Instance per session - GOOD):
const manager = new DynamicToolsetManager(server, token); // Isolated per session
registerMetaTools(server, manager); // Pass instance directly
```

**File Changes:**
- `server.service.ts` → main server service class
- `McpServerFactory.ts` → new factory class for server creation
- `index.ts` → updated with main() function pattern  
- `SessionCache.ts` → minor updates for stateless integration
- Keep `server.ts` as reference during development