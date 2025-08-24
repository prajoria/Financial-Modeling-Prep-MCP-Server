# Plan: Add `list_mcp_assets` MCP prompt

This plan adds a human-friendly prompt that summarizes server capabilities with mode-aware behavior and a health snapshot. It must work whether mode is enforced at the server level or provided via session configuration (dynamic, static, legacy).

## To-Do List

- [x] Declare prompts capability in `McpServerFactory`
  - Implemented `capabilities.prompts.listChanged = false` alongside existing tools capability.
- [x] Create prompt registration module and `list_mcp_assets` prompt
- [x] Wire prompt registration in server factory with mode-aware context (session/server)
- [x] Add optional tool alias `list_mcp_assets_tool` for compatibility
- [ ] Add tests for prompt presence and mode-aware content
- [ ] Update README to document the new prompt

## Implementation Notes

- The prompt response must follow this structure:
  - `# Server Capabilities`
  - `## Prompts`
  - `## Tools` (mode-aware; avoid listing all tools in legacy mode)
  - `## Resources` (health status snapshot)
  - `## Quick Start`
- Cover all mode sources: server-level enforcement (CLI/env) and session-level config.
- In static mode configured via session, include the session-provided toolsets in the output.
- In dynamic mode, emphasize meta-tools and enabling toolsets on demand.
- In legacy mode, summarize categories and counts; do not enumerate 250+ tools.


