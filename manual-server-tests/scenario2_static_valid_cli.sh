#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/scenario_common.sh"

cat <<'EOT'
Scenario 2: Server-level Static Mode (valid toolsets) CLI enforcement
Start server manually in another terminal:
  npm run dev -- --fmp-token=YOUR_TOKEN --fmp-tool-sets=search,company,quotes

Expect logs:
  [McpServerFactory] Server-level mode enforced: STATIC_TOOL_SETS
  [McpServerFactory] Loading static toolsets from server-level: search, company, quotes
EOT

if ! check_health; then
  warn "Server not healthy. Ensure it is running with static toolsets enforced."
fi

info "Request A: No session config"
post_initialize ""
post_tools_list ""

info "Request B: Valid dynamic session config (should be overridden to static)"
DYN_CFG=$(encode_config '{"DYNAMIC_TOOL_DISCOVERY":"true"}')
post_initialize "?config=${DYN_CFG}"
post_tools_list "?config=${DYN_CFG}"

info "Request C: Another static session config (server-level still enforced)"
STATIC_CFG=$(encode_config '{"FMP_TOOL_SETS":"search,company,quotes"}')
post_initialize "?config=${STATIC_CFG}"
post_tools_list "?config=${STATIC_CFG}"

cat <<'EON'
Verification tips:
- listChanged should be false for all three requests
- tools/list should contain tools from search, company, quotes
EON


