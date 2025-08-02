# Plan: Implement Dynamic Toolset Pattern for FMP MCP Server

This plan outlines the steps to implement Dynamic Toolset Pattern as an option in our Financial Modeling Prep MCP server, allowing tools to be enabled/disabled on-demand during runtime.

## Task Overview
- **Goal**: Add Dynamic Toolset Pattern alongside existing Static Toolset Pattern
- **Current State**: Server has 250+ tools with static toolset configuration at startup
- **Target**: Enable runtime toolset management with `enable_toolset` and `disable_toolset` meta-tools

## Backward Compatibility Requirements
The implementation must support three distinct modes:

1. **Legacy Mode** (Default): No toolset configuration → All 250+ tools registered at startup
   - `FMP_TOOL_SETS` not provided OR empty
   - `DYNAMIC_TOOL_DISCOVERY` not set
   - Behavior: `registerAllTools()` called (current default)

2. **Static Mode**: Toolset configuration provided → Specific toolsets registered at startup  
   - `FMP_TOOL_SETS="search,company,quotes"` provided
   - `DYNAMIC_TOOL_DISCOVERY` not set OR `false`
   - Behavior: `registerToolsBySet()` called (current behavior)

3. **Dynamic Mode**: Dynamic toolsets enabled → Meta-tools for runtime management
   - `DYNAMIC_TOOL_DISCOVERY=true` 
   - `FMP_TOOL_SETS` ignored (or used as initial state)
   - Behavior: Only meta-tools registered initially, toolsets enabled on-demand
   - **Note**: All registration functions must receive `accessToken` parameter for consistency

## Dynamic Toolset Workflow Example

**User Request**: "Can you get the latest stock quote for AAPL?"

**Step 1**: Server starts with `listChanged: true` and only meta-tools (`enable_toolset`, `disable_toolset`)
**Step 2**: AI sees it doesn't have quote tools, but recognizes `enable_toolset` meta-tool  
**Step 3**: AI calls `enable_toolset(toolsetName: "quotes")`
**Step 4**: Server dynamically registers all quote-related tools using existing `registerQuotesTools()`
**Step 5**: Server sends `notifications/tools/list_changed` to client
**Step 6**: Client refreshes tool list, AI now sees `getRealTimeQuote`, `getHistoricalQuotes`, etc.
**Step 7**: AI calls `getRealTimeQuote(symbol: "AAPL")` to fulfill original request

## To-Do List

- [x] Add `dynamicToolDiscovery: boolean` option to `ServerConfig` interface with three-mode logic
    - *Added `DYNAMIC_TOOL_DISCOVERY?: string` to config object following established pattern*
    - *Added `DYNAMIC_TOOL_DISCOVERY` to configSchema for Smithery/environment variable support*
    - *Added CLI support: `--dynamic-tool-discovery` and env var `DYNAMIC_TOOL_DISCOVERY="true"`*
    - *Parse with priority: CLI/env overrides Smithery config, similar to `FMP_TOOL_SETS` pattern*
    - *Implemented three-mode logic: Dynamic (meta-tools only), Static (specific toolsets), Legacy (all tools)*
    - *Added `listChanged: true` capability when dynamicToolDiscovery === true*
- [x] Extend MCP server capabilities to support `listChanged: true` for dynamic tool updates
    - *Verified `listChanged: true` capability is properly declared when `dynamicToolDiscovery === true`*
    - *Confirmed server returns underlying server instance with notification capabilities*  
    - *Added documentation for `notifications/tools/list_changed` notification method*
    - *Infrastructure ready for meta-tools to send tool list change notifications*  
- [x] Create `DynamicToolsetManager` class following GitHub's pattern to wrap existing toolset system
    - *Created `src/server/DynamicToolsetManager.ts` with state management for active toolsets*
    - *Wraps existing `MODULE_REGISTRATIONS` and `TOOL_SETS` systems*
    - *Provides `enableToolset()` and `disableToolset()` methods with notification support*
    - *Integrates dynamic lazy-loading of toolset modules*
    - *Tracks registered modules to avoid duplicate registrations*
    - *Sends `notifications/tools/list_changed` when toolsets are enabled/disabled*
    - *Integrated with server.ts and stored as `_dynamicManager` for meta-tools access*
- [ ] Implement `enable_toolset` meta-tool for dynamically loading toolset modules with operation-based routing
- [ ] Implement `disable_toolset` meta-tool for dynamically unloading toolset modules with state tracking
- [ ] Ensure meta-tools send `notifications/tools/list_changed` after registration/unregistration
- [ ] Update server creation logic with three-mode compatibility (Legacy/Static/Dynamic)
- [ ] Add `DYNAMIC_TOOL_DISCOVERY` environment variable and CLI `--dynamic-tool-discovery` support
- [ ] Update server startup logging to clearly indicate which of the three modes is active
- [ ] Create comprehensive tests for dynamic toolset functionality with multi-environment support
- [ ] Add specific backward compatibility tests for all three modes (Legacy/Static/Dynamic)  
- [ ] Add configuration source testing for all three environments: Command Line, Smithery, and Docker ENV
- [ ] Update smithery.yaml configSchema to include DYNAMIC_TOOL_DISCOVERY option
- [ ] Update documentation and help text to describe dynamic toolset feature and three-mode operation
- [ ] Add validation and error handling for dynamic toolset operations
- [ ] Final verification: ensure no breaking changes to existing Legacy and Static modes

## Testing Strategy

Based on existing test patterns in `src/server/server.test.ts`, we need comprehensive testing for:

### Configuration Source Testing (All 3 Modes × 3 Sources = 9 Test Scenarios)

**Command Line Arguments:**
- `node . --dynamic-tool-discovery` (Dynamic Mode)
- `node . --tool-sets="search,company"` (Static Mode)  
- `node .` (Legacy Mode - no args)

**Smithery Configuration (smithery.yaml):**
- `DYNAMIC_TOOL_DISCOVERY: "true"` in configSchema (Dynamic Mode)
- `FMP_TOOL_SETS: "search,company"` in configSchema (Static Mode)
- Neither specified (Legacy Mode)

**Docker Environment Variables:**
- `DYNAMIC_TOOL_DISCOVERY="true"` in docker-compose.yml (Dynamic Mode)
- `FMP_TOOL_SETS="search,company"` in docker-compose.yml (Static Mode)
- Neither specified (Legacy Mode)

### Dynamic Toolset Specific Tests

**Meta-tool functionality:**
- `enable_toolset` with valid toolset names
- `enable_toolset` with invalid toolset names  
- `disable_toolset` for active toolsets
- `disable_toolset` for inactive toolsets
- Multiple toolsets enabled/disabled in sequence
- Tool list change notifications (`listChanged: true`) sent correctly

**State management:**
- Active toolsets tracked correctly
- Tool registration/unregistration functions called with proper accessToken
- No conflicts between static and dynamic registration

**Error handling:**
- Invalid toolset names rejected gracefully
- Proper error messages for malformed requests
- Server remains stable after errors
