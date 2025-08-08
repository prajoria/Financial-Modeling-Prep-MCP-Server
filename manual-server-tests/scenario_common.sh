#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
BASE_URL="http://localhost:${PORT}"
COOKIE_DIR="/tmp/fmp_mcp_cookies"
mkdir -p "${COOKIE_DIR}"

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

cookie_jar_for() {
  # derive a stable filename per config suffix
  local key="$1"
  if command -v shasum >/dev/null 2>&1; then
    printf "%s" "$key" | shasum | awk '{print $1}'
  else
    printf "%s" "$key" | md5
  fi
}

sid_file_for() {
  local config_suffix="$1"
  echo "${COOKIE_DIR}/sid_$(cookie_jar_for "$config_suffix")"
}

bootstrap_session() {
  local config_suffix="$1" # empty or "?config=..."
  local jar="${COOKIE_DIR}/cookies_$(cookie_jar_for "$config_suffix")"
  info "Bootstrapping session via GET ${BASE_URL}/mcp${config_suffix} to obtain cookie"
  # Some stateful servers set the session cookie on first contact (GET). Ignore body.
  curl -sS -H "Accept: application/json, text/event-stream" -c "$jar" -b "$jar" \
    -X GET "${BASE_URL}/mcp${config_suffix}" >/dev/null || true
}

post_initialize() {
  local config_suffix="$1" # empty or "?config=..."
  local jar="${COOKIE_DIR}/cookies_$(cookie_jar_for "$config_suffix")"
  local sid_file="$(sid_file_for "$config_suffix")"
  bootstrap_session "$config_suffix"
  info "POST initialize ${BASE_URL}/mcp${config_suffix}"
  local hdr_file="${COOKIE_DIR}/hdr_$(cookie_jar_for "$config_suffix")"
  curl -sS -D "$hdr_file" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
    -c "$jar" -b "$jar" \
    -X POST "${BASE_URL}/mcp${config_suffix}" \
    -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","clientInfo":{"name":"curl-client","version":"0.0.1"},"capabilities":{}}}' \
    | tee /tmp/mcp_init_response.raw >/dev/null || true

  # capture session id header if present
  local sid
  sid=$(grep -i "^mcp-session-id:" "$hdr_file" | awk '{print $2}' | tr -d '\r\n' || true)
  if [ -n "$sid" ]; then
    echo "$sid" > "$sid_file"
    info "Captured mcp-session-id: $sid"
  fi

  # normalize SSE vs JSON into a JSON file
  if grep -q '^data:' /tmp/mcp_init_response.raw; then
    awk '/^data:/{sub(/^data: /,""); print}' /tmp/mcp_init_response.raw | tail -n 1 > /tmp/mcp_init_response.json || true
  else
    cp /tmp/mcp_init_response.raw /tmp/mcp_init_response.json || true
  fi
  cat /tmp/mcp_init_response.json | jq . || true

  info "Extracting listChanged capability (fallback path aware)"
  jq -r '(
    .result.serverInfo.capabilities.tools.listChanged //
    .result.capabilities.tools.listChanged //
    .serverInfo.capabilities.tools.listChanged //
    .capabilities.tools.listChanged //
    "unknown"
  )' /tmp/mcp_init_response.json || true
}

post_tools_list() {
  local config_suffix="$1"
  local jar="${COOKIE_DIR}/cookies_$(cookie_jar_for "$config_suffix")"
  local sid_file="$(sid_file_for "$config_suffix")"
  local sid=""
  if [ -f "$sid_file" ]; then sid=$(cat "$sid_file"); fi
  bootstrap_session "$config_suffix"
  info "POST tools/list ${BASE_URL}/mcp${config_suffix}"
  if [ -n "$sid" ]; then
    curl -sS -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" -H "mcp-session-id: $sid" \
      -c "$jar" -b "$jar" \
      -X POST "${BASE_URL}/mcp${config_suffix}" \
      -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | tee /tmp/mcp_tools_list.raw >/dev/null || true
  else
    curl -sS -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
      -c "$jar" -b "$jar" \
      -X POST "${BASE_URL}/mcp${config_suffix}" \
      -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | tee /tmp/mcp_tools_list.raw >/dev/null || true
  fi

  if grep -q '^data:' /tmp/mcp_tools_list.raw; then
    awk '/^data:/{sub(/^data: /,""); print}' /tmp/mcp_tools_list.raw | tail -n 1 > /tmp/mcp_tools_list.json || true
  else
    cp /tmp/mcp_tools_list.raw /tmp/mcp_tools_list.json || true
  fi
  cat /tmp/mcp_tools_list.json | jq . || true

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


