#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/scenario_common.sh"

cat <<'EOT'
Scenario 4: No CLI Arguments (Legacy mode by default, mimic Smithery)
Start server manually in another terminal:
  npm run dev -- --fmp-token=YOUR_TOKEN

EOT

if ! check_health; then
  warn "Server not healthy. Ensure it is running without CLI mode enforcement."
fi

info "Request A: No session config (expect ALL_TOOLS)"
post_initialize ""
post_tools_list ""

info "Request B: Valid dynamic session config (expect dynamic mode for this session)"
DYN_CFG=$(encode_config '{"DYNAMIC_TOOL_DISCOVERY":"true"}')
post_initialize "?config=${DYN_CFG}"
post_tools_list "?config=${DYN_CFG}"

info "Request C: Invalid static session config (expect fallback to ALL_TOOLS)"
BAD_STATIC=$(encode_config '{"FMP_TOOL_SETS":"invalid,unknown"}')
post_initialize "?config=${BAD_STATIC}"
post_tools_list "?config=${BAD_STATIC}"

cat <<'EON'
Verification tips:
- A: listChanged=false; tools/list should be large
- B: listChanged=true; tools/list should show only meta-tools initially
- C: listChanged=false; tools/list should be large
EON


