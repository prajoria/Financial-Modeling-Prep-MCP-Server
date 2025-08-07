# Plan: ClientStorage with clientId derived from access token

This plan replaces sessionId-based caching with clientId-based caching and renames the cache component from SessionCache to ClientStorage. We will not manage or depend on SDK sessionId; createStatefulServer() remains the sole session manager.

## Key Objectives

- Compute a clientId from the resolved access token and use it for caching.
- If no access token is provided, generate a unique id (per-request) instead.
- Rename SessionCache → ClientStorage (class, files, directories, tests).
- Ensure FmpMcpServer uses clientId (not sessionId) as the cache key.
- Keep McpServerFactory stateless regarding caching, and ensure access token precedence is correct.
 - Maintain exactly one DynamicToolsetManager (and server instance) per clientId; sessions are not used for caching.

## Clarifications (please confirm)

- Tokenless behavior: Default is per-request unique id (no reuse without a token). If you prefer reuse within a single SDK session or a process-lifetime id, specify before implementation.

## To-Do List

- [ ] Introduce computeClientId
  - Add `src/utils/computeClientId.ts`.
  - Implement `computeClientId(accessToken?: string): string`:
    - If token: `client:<sha256(token)>`
    - If no token: `anon:<crypto.randomUUID()>` (per-request unique id)
  - Unit tests for deterministic hashing and anon format.

- [ ] Centralize access token resolution
  - Add `src/utils/resolveAccessToken.ts` exporting `resolveAccessToken(serverToken?: string, sessionConfig?: SessionConfig): string | undefined`.
  - Precedence: server-level token overrides session config (server > session).
  - Update usages and add tests.

- [ ] Rename SessionCache → ClientStorage
  - Move `src/session-cache/SessionCache.ts` → `src/client-storage/ClientStorage.ts`.
  - Update class name, exported types, and log messages to refer to clientId.
  - Replace `src/session-cache/index.ts` with `src/client-storage/index.ts`.
  - Update/rename `src/session-cache/SessionCache.test.ts` accordingly.

- [ ] Update FmpMcpServer
  - Replace imports to use ClientStorage from `src/client-storage`.
  - In `_getSessionResources(params)`, do NOT use `params.sessionId` for caching.
  - Resolve access token via `resolveAccessToken(this.serverOptions.accessToken, params.config)`.
  - Compute `clientId = computeClientId(resolvedAccessToken)`.
  - Use `this.clientStorage.get(clientId)` / `set(clientId, { mcpServer, toolManager })`.
  - Update logs to reference clientId.
  - Update tests (`src/server/FmpMcpServer.test.ts`) to assert clientId usage.
  - Ensure exactly one DynamicToolsetManager instance is stored per clientId (reuse across requests with the same clientId).

- [ ] Ensure McpServerFactory remains stateless for caching and confirm precedence
  - Keep creation and tool registration logic unchanged.
  - Ensure access token precedence follows server > session.
  - Optionally reuse `resolveAccessToken` util for consistency.
  - Update tests for precedence expectations.

- [ ] Documentation updates
  - Update `.github/copilot-instructions.md` to describe clientId-based caching and tokenless behavior.
  - Note: exactly one DynamicToolsetManager/server is maintained per clientId; sessions are not used.

- [ ] QA: tests and lint
  - Update/extend unit tests for ClientStorage, FmpMcpServer, and token precedence.
  - Run full test suite and linter.
  - Validate dynamic/static/legacy modes still work under clientId-based caching.

## Risks & Mitigations

- Shared state across requests sharing the same clientId reduces isolation: intentional tradeoff; documented clearly.
- Tokenless per-request IDs reduce cache hits: intentional to avoid accidental cross-request sharing.
- Access token precedence confirmation may alter behavior: add targeted tests and call out in docs.
