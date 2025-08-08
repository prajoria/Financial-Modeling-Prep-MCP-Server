#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/scenario_common.sh"

cat <<'EOT'
Scenario 1: Server-level Dynamic Mode (CLI enforcement)
Start server manually in another terminal:
  npm run dev -- --fmp-token=YOUR_TOKEN --dynamic-tool-discovery

Expect logs:
  [McpServerFactory] Server-level mode enforced: DYNAMIC_TOOL_DISCOVERY
  [McpServerFactory] Created isolated toolset manager and registered meta-tools for dynamic mode
EOT

if ! check_health; then
  warn "Server not healthy. Ensure it is running with dynamic mode enforced."
fi

info "Request A: No session config"
post_initialize ""
post_tools_list ""

info "Request B: Valid dynamic session config (should be enforced anyway)"
DYN_CFG=$(encode_config '{"DYNAMIC_TOOL_DISCOVERY":"true"}')
post_initialize "?config=${DYN_CFG}"
post_tools_list "?config=${DYN_CFG}"

info "Request C: Invalid session config (should be ignored by server-level enforcement)"
BAD_CFG=$(encode_config '{"FMP_TOOL_SETS":"invalid,unknown"}')
post_initialize "?config=${BAD_CFG}"
post_tools_list "?config=${BAD_CFG}"

cat <<'EON'
Verification tips:
- listChanged should be true for all three requests
- tools/list should show only meta-tools initially
EON


