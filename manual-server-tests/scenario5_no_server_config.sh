#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/scenario_common.sh"

cat <<'EOT'
Scenario 5: Server started with NO configuration (no CLI args, no FMP_ACCESS_TOKEN)
This mimics Smithery deployment where the server has no server-level config; sessions provide config.

Start server manually in another terminal with ZERO config:
  # Ensure FMP_ACCESS_TOKEN is unset
  unset FMP_ACCESS_TOKEN
  npm run dev

Notes:
- Expect a startup warning about missing access token. This is OK for listing tools/meta-tools.
- Sessions can pass FMP_ACCESS_TOKEN via config.
EOT

if ! check_health; then
  warn "Server not healthy. Ensure it is running with NO env/CLI config."
fi

info "Request A: No session config (expect legacy ALL_TOOLS: listChanged=false, large tool list)"
post_initialize ""
post_tools_list ""

info "Request B: Session provides only FMP_ACCESS_TOKEN"
if [ -z "${FMP_TOKEN:-}" ]; then
  warn "FMP_TOKEN env var not set. Using placeholder value; API calls (beyond listing) would fail."
fi
TOKEN_JSON=$(printf '{"FMP_ACCESS_TOKEN":"%s"}' "${FMP_TOKEN:-PLACEHOLDER_TOKEN_FOR_TOOL_LISTING}")
TOKEN_CFG=$(encode_config "$TOKEN_JSON")
post_initialize "?config=${TOKEN_CFG}"
post_tools_list "?config=${TOKEN_CFG}"

info "Request C: Session provides FMP_ACCESS_TOKEN + DYNAMIC_TOOL_DISCOVERY=true (expect meta-tools only; listChanged=true)"
DYN_JSON=$(printf '{"FMP_ACCESS_TOKEN":"%s","DYNAMIC_TOOL_DISCOVERY":"true"}' "${FMP_TOKEN:-PLACEHOLDER_TOKEN_FOR_TOOL_LISTING}")
DYN_CFG=$(encode_config "$DYN_JSON")
post_initialize "?config=${DYN_CFG}"
post_tools_list "?config=${DYN_CFG}"

cat <<'EON'
Verification tips:
- A: listChanged=false; tools/list should be large (ALL_TOOLS legacy)
- B: listChanged=false; tools/list remains large; access token is session-provided
- C: listChanged=true; tools/list shows only 3 meta-tools
EON


