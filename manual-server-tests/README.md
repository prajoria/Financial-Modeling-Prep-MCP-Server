# Manual Server Tests

This folder contains shell scripts to manually validate server behavior across four scenarios. You start the server yourself per scenario, then run the corresponding script to send requests and verify outputs/logs.

## Prerequisites

- curl
- jq (recommended)
- Server running locally on `http://localhost:${PORT:-3000}`

## Endpoints and Requests

- MCP endpoint: `POST http://localhost:${PORT:-3000}/mcp[?config=BASE64_ENCODED_CONFIG]`
- Healthcheck: `GET http://localhost:${PORT:-3000}/healthcheck`
- Headers: `Content-Type: application/json`, `Accept: application/json, text/event-stream`
- Initialize payload:
  `{ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": { "clientInfo": { "name": "curl-client", "version": "0.0.1" }, "capabilities": {} } }`
- List tools payload:
  `{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }`

## Session Config in URL (Base64)

Encode JSON and pass via `?config=...` in the URL.

- Dynamic: `echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64 | tr -d '\n'`
- Static: `echo -n '{"FMP_TOOL_SETS":"search,company,quotes"}' | base64 | tr -d '\n'`
- Invalid: `echo -n '{"FMP_TOOL_SETS":"invalid,unknown"}' | base64 | tr -d '\n'`

Set a custom port via `PORT=4000` when running scripts.

## Scenarios and Scripts

1) Scenario 1: Server-level Dynamic Mode (CLI enforcement)
   - Start server manually with: `npm run dev -- --fmp-token=YOUR_TOKEN --dynamic-tool-discovery`
   - Run: `./scenario1_dynamic_cli.sh`
   - Expectations:
     - `listChanged=true` for all requests
     - `tools/list` returns only meta-tools initially
     - Logs show:
       - `[McpServerFactory] Server-level mode enforced: DYNAMIC_TOOL_DISCOVERY`
       - `[McpServerFactory] Created isolated toolset manager and registered meta-tools for dynamic mode`

2) Scenario 2: Server-level Static Mode with Valid Toolsets (CLI enforcement)
   - Start server manually with: `npm run dev -- --fmp-token=YOUR_TOKEN --fmp-tool-sets=search,company,quotes`
   - Run: `./scenario2_static_valid_cli.sh`
   - Expectations:
     - `listChanged=false` for all requests
     - `tools/list` contains tools from `search`, `company`, `quotes`
     - Logs show:
       - `[McpServerFactory] Server-level mode enforced: STATIC_TOOL_SETS`
       - `[McpServerFactory] Loading static toolsets from server-level: search, company, quotes`

3) Scenario 3: Server-level Static Mode with Invalid Toolsets (CLI enforcement)
   - Attempt to start server with invalid sets: `npm run dev -- --fmp-token=YOUR_TOKEN --fmp-tool-sets=invalid,unknown`
   - Expected: server exits with error before running
   - Run: `./scenario3_static_invalid_cli.sh` (verifies server is not responding)
   - Expected console errors:
     - `Invalid tool sets: ...`
     - `Available tool sets: ...`

4) Scenario 4: No CLI Args (Legacy by default; mimic Smithery)
   - Start server manually with: `npm run dev -- --fmp-token=YOUR_TOKEN`
   - Run: `./scenario4_no_cli_args_legacy.sh`
   - Expectations:
     - No config: `listChanged=false`; `tools/list` is large (ALL_TOOLS)
     - Valid dynamic config: `listChanged=true`; `tools/list` shows only meta-tools initially
     - Invalid static config: fallback to ALL_TOOLS; `listChanged=false`; `tools/list` large
   - Logs:
     - No server-level enforcement message
     - Mode resolution logs like `Creating server in ... mode` and warnings for invalid toolsets when applicable

5) Scenario 5: No Server Configuration (no CLI args, no env token)
   - Start with: `unset FMP_ACCESS_TOKEN && npm run dev`
   - Run: `./scenario5_no_server_config.sh`
   - Expectations:
     - A (no config): `listChanged=false`; `tools/list` is large (ALL_TOOLS legacy)
     - B (session FMP_ACCESS_TOKEN only): `listChanged=false`; `tools/list` remains large
     - C (session FMP_ACCESS_TOKEN + dynamic): `listChanged=true`; `tools/list` shows only meta-tools initially

## Workflow

1. Start the server for the scenario exactly as specified
2. Make scripts executable (once): `chmod +x manual-server-tests/*.sh`
3. Run the scenario script
4. Observe script outputs and verify server logs in your terminal

If the server was started without `FMP_ACCESS_TOKEN`, it will warn and run as a dummy server. Tool listing is still possible, but many tools require a token to function if invoked.
