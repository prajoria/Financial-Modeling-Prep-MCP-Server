# Package.json metadata update

## Objectives
- Improve `description` and `keywords` for discoverability.
- Confirm/add `repository`, `homepage`, `bugs`, `author` fields.
- Add optional release scripts.

## Plan
- Update `package.json` fields:
  - description: concise explanation of the MCP server for Financial Modeling Prep (FMP) API.
  - keywords: ["model context protocol", "mcp", "financial modeling prep", "fmp", "fmp api", "typescript", "node", "server", "ai tools", "tooling"].
  - repository/homepage/bugs/author: populate if missing.
  - scripts: `release:patch`, `release:minor`, `release:major`.

## Verification checklist
- Keywords upserted without removing existing relevant terms.
- Description added.

## Status
- ✅ Completed
