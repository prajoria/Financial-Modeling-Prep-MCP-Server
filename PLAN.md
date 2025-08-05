# Plan: Migrate to Stateful Server with SessionCache and Class-Based Design

This plan outlines the steps to migrate to stateful server using Smithery SDK's `stateful.js`, maintaining SessionCache for multiple client support, and implementing proper class-based design with pure functions.

## Current Issues to Address
- Import path issues (missing `.js` extensions)
- Wrong import from `@smithery/sdk/server/mcp.js` instead of `@modelcontextprotocol/sdk/server/mcp.js`
- Using `StatefulServerParams` which doesn't exist, should be `CreateServerArg` from stateful.js
- Function signature mismatch for server creation
- Missing `FMP_TOOL_SETS` in config schema (needed for STATIC_TOOL_SETS mode)
- Missing helper functions for server modes: `resolveSessionMode`, `parseCommaSeparatedToolSets`, `registerToolsBySet`, `registerAllTools`
- **CRITICAL: DynamicToolsetManager singleton pattern breaks session isolation**
  - Current singleton shares state (`activeToolsets`, `registeredModules`) across all sessions
  - In stateful server architecture, each session needs its own isolated manager instance
  - Meta-tools currently call `getDynamicToolsetManager()` which gets global singleton
  - Would cause toolset state to leak between different client sessions

## To-Do List

### Phase 1: Fix Import and Type Issues ✅ COMPLETED
- [x] Fix import paths in `server.service.ts` to use correct modules and add `.js` extensions
- [x] Update imports to use `@modelcontextprotocol/sdk` instead of `@smithery/sdk` for McpServer
- [x] Replace `StatefulServerParams` with `CreateServerArg` from stateful server
- [x] Fix SessionCache imports to use correct relative paths
- [x] Update all relative imports to include proper file extensions

### Phase 2: Create MCP Server Factory Class & Complete Server Modes ✅ COMPLETED
- [x] Create `McpServerFactory.ts` class to handle MCP server creation logic
- [x] Move `createMcpServer` function logic into the factory class
- [x] **Add `FMP_TOOL_SETS` to config schema** (currently missing, needed for STATIC_TOOL_SETS mode)
- [x] **Implement missing helper functions**:
  - `resolveSessionMode(sessionConfig)` - determines server mode from config
  - `parseCommaSeparatedToolSets(toolSetsString)` - parses FMP_TOOL_SETS
- [x] **Import missing functions**: `registerToolsBySet`, `registerAllTools` from tools module
- [x] Make factory methods pure and testable
- [x] Add proper TypeScript interfaces for server creation options

### Phase 3: Fix Stateful Server Implementation ✅ COMPLETED
- [x] Keep using `createStatefulServer` from `@smithery/sdk/server/stateful.js` (already correct)
- [x] Fix `StatefulMcpServer` class to work properly with stateful paradigm (rename to `McpServerService`)
- [x] **Preserve existing server modes support** (DYNAMIC_TOOL_DISCOVERY, STATIC_TOOL_SETS, ALL_TOOLS)
- [x] Implement proper session management using SessionCache with stateful server
- [x] Update `_getSessionResources` to work with correct `CreateServerArg` interface
- [x] Add proper error handling for session creation and management

### Phase 4: Refactor Dynamic Toolset Manager Integration (CRITICAL) ✅ COMPLETED
- [x] **Remove singleton pattern** from `DynamicToolsetManager` class:
  - Remove `static instance`, `getInstance()`, and `resetInstance()` methods
  - Make constructor `public` instead of `private`
  - Remove `getDynamicToolsetManager` export that wraps `getInstance`
- [x] **Update meta-tools to use instance-based pattern**:
  - Change `registerMetaTools(server, accessToken)` to `registerMetaTools(server, toolManager)`
  - Remove `getDynamicToolsetManager()` call from meta-tools
  - Pass manager instance directly to meta-tools registration
- [x] **Update SessionCache integration**:
  - Create new `DynamicToolsetManager` instance per session in `_getSessionResources`
  - Store manager instance in cache entry alongside mcpServer
  - Ensure each session has isolated toolset state
- [x] **Fix imports and exports**:
  - Update `src/dynamic-toolset-manager/index.ts` to export class directly
  - Remove singleton export patterns
  - Update all imports throughout codebase

### Phase 5: Complete Server Configuration and Schema
- [ ] Add `FMP_TOOL_SETS` to the config schema in server creation (required for STATIC_TOOL_SETS mode)
- [ ] Update config schema descriptions to match current server modes functionality
- [ ] Add proper validation for toolset names in config
- [ ] Ensure all three server modes (DYNAMIC/STATIC/ALL_TOOLS) are properly documented in schema
- [ ] Ensure backward compatibility with existing configuration patterns

### Phase 6: Refactor Index.ts with Main Function Pattern
- [ ] Create `main()` function in `index.ts` that handles server startup
- [ ] Update argument parsing to work with new server class
- [ ] Maintain environment variable support (PORT, FMP_ACCESS_TOKEN, FMP_TOOL_SETS, DYNAMIC_TOOL_DISCOVERY)
- [ ] Preserve command line argument handling for all existing options
- [ ] Add proper error handling and graceful shutdown in main function
- [ ] Update startup logging to reflect new architecture

### Phase 7: Update Session Cache Integration
- [ ] Ensure SessionCache works properly with stateful server architecture
- [ ] Update cache entry structure if needed for stateful paradigm
- [ ] Add proper session cleanup and memory management
- [ ] Test session isolation and proper resource cleanup

### Phase 8: Testing and Validation
- [ ] Update existing tests to work with stateful server architecture
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
- **✅ Keep Stateful**: Using `createStatefulServer` from `@smithery/sdk/server/stateful.js`
- **✅ Multi-Mode Support**: Three server modes now supported per session
- **✅ Singleton → Instance**: DynamicToolsetManager becomes per-session instance (FIXED!)
- **✅ Pure Functions**: Server creation logic extracted to factory class
- **✅ Session Management**: SessionCache handles multi-client support in stateful environment

**Server Modes (PRESERVE & COMPLETE):**
- **✅ DYNAMIC_TOOL_DISCOVERY**: Creates DynamicToolsetManager + meta-tools for runtime toolset control
- **✅ STATIC_TOOL_SETS**: Registers only specified toolsets from `FMP_TOOL_SETS` config
- **✅ ALL_TOOLS**: Registers all available tools (legacy compatibility mode)

**Environment Variable Support:**
- **✅ Maintain existing CLI args**: `--fmp-token`, `--fmp-tool-sets`, `--dynamic-tool-discovery`, `--port`
- **✅ Preserve env vars**: `FMP_ACCESS_TOKEN`, `FMP_TOOL_SETS`, `DYNAMIC_TOOL_DISCOVERY`, `PORT`
- **✅ Keep backward compatibility** with existing configuration methods

**Class Structure:**
```
✅ McpServerService (main server class)
├── ✅ McpServerFactory (server creation logic)  
├── ✅ SessionCache (session management)
└── ✅ DynamicToolsetManager (per-session instances, NO singleton)
```

**DynamicToolsetManager Refactoring:**
```typescript
// ✅ BEFORE (Singleton - BAD for session isolation):
const manager = getDynamicToolsetManager(server, token); // Global shared state

// ✅ AFTER (Instance per session - GOOD):
const manager = new DynamicToolsetManager(server, token); // Isolated per session
registerMetaTools(server, manager); // Pass instance directly
```

**File Changes:**
- **✅ `server.service.ts`** → main server service class (renamed to `McpServerService`)
- **✅ `McpServerFactory.ts`** → new factory class for server creation
- **⏳ `index.ts`** → updated with main() function pattern (Phase 6)
- **✅ `SessionCache.ts`** → minor updates for stateful integration
- **✅ `DynamicToolsetManager.ts`** → removed singleton pattern (Phase 4)
- **✅ `meta-tools.ts`** → updated to use instance-based pattern (Phase 4)
- Keep `server.ts` as reference during development