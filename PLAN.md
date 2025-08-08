# Plan: Manual Local Server Scenario Tests

This plan adds a root-level directory containing shell scripts to validate server behavior across explicit scenarios. You will start the server manually for each scenario and the scripts will send curl requests and print guidance on logs to verify.

## To-Do List

- [x] Create a `manual-server-tests/` directory in the repo root.
- [x] Add `manual-server-tests/README.md` describing:
  - Scenarios and their server start commands
  - Script filenames and how to run them
  - Expected server logs to verify
  - How URL base64 session config works
  - Requirements: `curl`, `jq` (optional but recommended)
  - How to override port with `PORT` env var
- [x] Add `manual-server-tests/scenario1_dynamic_cli.sh`
  - Server must be started with CLI enforcement: `--dynamic-tool-discovery`
  - Script sends:
    - POST `/mcp` without `config`
    - POST `/mcp` with valid dynamic session config
    - POST `/mcp` with invalid session config
  - After initialize, also call `tools/list` and print:
    - Total tools count
    - First 10 tool names
  - Expectations:
    - `listChanged=true` for all requests; only meta-tools initially
  - Logs to look for:
    - `[McpServerFactory] Server-level mode enforced: DYNAMIC_TOOL_DISCOVERY`
    - `[McpServerFactory] Created isolated toolset manager and registered meta-tools for dynamic mode`
- [x] Add `manual-server-tests/scenario2_static_valid_cli.sh`
  - Server must be started with CLI enforcement: `--fmp-tool-sets=search,company,quotes`
  - Script sends same 3 requests as above
  - After initialize, call `tools/list` and print count + names
  - Expectations:
    - `listChanged=false` for all requests; tools reflect `search,company,quotes`
  - Logs to look for:
    - `[McpServerFactory] Server-level mode enforced: STATIC_TOOL_SETS`
    - `[McpServerFactory] Loading static toolsets from server-level: search, company, quotes`
- [x] Add `manual-server-tests/scenario3_static_invalid_cli.sh`
  - Attempt to start server with invalid CLI toolsets: `--fmp-tool-sets=invalid,unknown`
  - Expected: server exits with error before running
  - Script checks `/healthcheck`; expects connection failure
  - Expected console errors:
    - `Invalid tool sets: ...`
    - `Available tool sets: ...`
- [x] Add `manual-server-tests/scenario4_no_cli_args_legacy.sh`
  - Start server with no CLI args (mimic Smithery deployment)
  - Script sends 3 requests:
    - No `config` (expect `listChanged=false` → ALL_TOOLS legacy; `tools/list` shows many tools)
    - Valid dynamic session config (expect `listChanged=true` → dynamic mode honored; `tools/list` shows only meta-tools initially)
    - Invalid static session config (`FMP_TOOL_SETS` invalid; expect fallback to ALL_TOOLS → `listChanged=false`; `tools/list` shows many tools)
  - Logs to look for:
    - Absence of server-level enforcement message, and mode resolution messages such as `Creating server in ... mode` and warnings for invalid toolsets
- [x] Ensure scripts print clear instructions, expected outcomes, and tips for verifying logs. Include `tools/list` verification in each scenario.
- [x] Add a note in README to run `chmod +x manual-server-tests/*.sh` (or set executable bit in repo).

## Shared Details for Scripts

- Endpoint: `POST http://localhost:${PORT:-3000}/mcp[?config=BASE64_ENCODED_CONFIG]`
- Healthcheck: `GET http://localhost:${PORT:-3000}/healthcheck`
- Required headers:
  - `Content-Type: application/json`
  - `Accept: application/json, text/event-stream`
- Initialize payload:
  - `{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"clientInfo":{"name":"curl-client","version":"0.0.1"},"capabilities":{}}}`
- `tools/list` payload:
  - `{"jsonrpc":"2.0","id":2,"method":"tools/list"}`
- Base64 examples (macOS/Linux):
  - Dynamic: `echo -n '{"DYNAMIC_TOOL_DISCOVERY":"true"}' | base64 | tr -d '\n'`
  - Static: `echo -n '{"FMP_TOOL_SETS":"search,company,quotes"}' | base64 | tr -d '\n'`


