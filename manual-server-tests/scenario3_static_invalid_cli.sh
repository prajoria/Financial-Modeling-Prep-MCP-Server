#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/scenario_common.sh"

cat <<'EOT'
Scenario 3: Server-level Static Mode (invalid toolsets) CLI enforcement
Start server manually in another terminal (expected to exit early):
  npm run dev -- --fmp-token=YOUR_TOKEN --fmp-tool-sets=invalid,unknown

Expected console errors:
  Invalid tool sets: ...
  Available tool sets: ...

This script verifies that the server is not responding by probing healthcheck.
EOT

if check_health; then
  err "Server appears healthy but should have failed to start due to invalid toolsets."
  exit 1
else
  info "As expected: server is not responding."
fi


