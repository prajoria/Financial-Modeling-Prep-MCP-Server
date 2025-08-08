#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
BASE_URL="http://localhost:${PORT}"

info() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
err()  { echo "[ERROR] $*" >&2; }

check_health() {
  info "Checking health at ${BASE_URL}/healthcheck"
  if ! curl -sS "${BASE_URL}/healthcheck" | jq . >/dev/null 2>&1; then
    warn "Healthcheck failed or server not responding."
    return 1
  fi
  info "Healthcheck OK"
}

post_initialize() {
  local config_suffix="$1" # empty or "?config=..."
  info "POST initialize ${BASE_URL}/mcp${config_suffix}"
  curl -sS -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
    -X POST "${BASE_URL}/mcp${config_suffix}" \
    -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"clientInfo":{"name":"curl-client","version":"0.0.1"},"capabilities":{}}}}' | tee /tmp/mcp_init_response.json | jq . || true

  info "Extracting listChanged capability (fallback path aware)"
  jq -r '(.result.serverInfo.capabilities.tools.listChanged // .serverInfo.capabilities.tools.listChanged // "unknown")' /tmp/mcp_init_response.json || true
}

post_tools_list() {
  local config_suffix="$1"
  info "POST tools/list ${BASE_URL}/mcp${config_suffix}"
  curl -sS -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
    -X POST "${BASE_URL}/mcp${config_suffix}" \
    -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | tee /tmp/mcp_tools_list.json | jq . || true

  info "Total tools count:"
  jq -r '(.result.tools | length) // "unknown"' /tmp/mcp_tools_list.json || true

  info "First 10 tool names:"
  jq -r '(.result.tools[0:10][]?.name) // empty' /tmp/mcp_tools_list.json || true
}

encode_config() {
  # echoes base64-encoded config without newline
  local json="$1"
  printf "%s" "$json" | base64 | tr -d '\n'
}


