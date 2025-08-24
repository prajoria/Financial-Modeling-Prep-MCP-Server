## Plan: Make cache reuse aware of session config (mode/tool sets)

This plan ensures a new `McpServer` instance is created when a request's session config implies a different mode or static tool sets than the cached instance for the same token, while respecting server-level enforcement.

### To-Do List

- [x] Add public `determineMode(sessionConfig)` to `McpServerFactory` (wrap existing private logic)
    - Implemented `determineMode()` delegating to existing private resolver.
- [x] Add public `determineStaticToolSets(sessionConfig)` to `McpServerFactory` (enforcer-aware)
    - Implemented `determineStaticToolSets()` honoring enforcer precedence and parsing `FMP_TOOL_SETS`.
- [x] Update `FmpMcpServer._getSessionResources` to:
  - [ ] Compute desired mode/tool sets before cache reuse
  - [ ] If enforcer overrides mode, always reuse cached instance (ignore session changes)
  - [ ] If no override, compare cached vs desired:
    - [ ] If mode differs → create new instance and replace cache
    - [ ] If mode is `STATIC_TOOL_SETS` and tool sets differ (order-insensitive) → create new instance and replace cache
    - [ ] Else → reuse cached instance
  - [x] Store `mode` and (if static) `toolSets` alongside the cached server
    - Implemented: now computes desired mode/sets, compares with cached, recreates when mismatched, and persists `mode`/`staticToolSets` in cache entries.
  - [x] Refactor: extract set equality into private util and reuse condition into const
    - Implemented `_areStringSetsEqual()` and `shouldReuse` const for clarity/testability.
- [ ] Add unit tests in `src/server/FmpMcpServer.test.ts`:
  - [ ] Reuses instance when same mode and same static sets
  - [ ] Recreates instance when cached legacy but requested dynamic
  - [ ] Recreates instance when static sets changed
  - [ ] With enforcer override, ignores session changes and reuses
- [ ] Update README to document cache behavior and precedence for session-config changes

### Notes

- Comparison of tool sets should be order-insensitive (set equality).
- Do not alter how `listChanged` is reported; factory already sets it correctly per mode.
- Keep `clientId` derivation unchanged (still keyed by token), but cache value must include `mode` and `toolSets` for comparison.

