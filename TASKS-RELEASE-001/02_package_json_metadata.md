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
- `npm pack --dry-run` shows updated metadata.
- `npm run release:patch` updates version and pushes tags (if added).

## Status
- Pending
