# Remove `src/middleware/` directory if unused

## Objectives
- Determine whether `src/middleware/legacyConfigMiddleware.ts` is used.
- If unused, remove the directory.
- If used, refactor to remove dependency and update imports.

## Plan
- Search for imports/usages of `legacyConfigMiddleware` or `src/middleware`.
- If unused, delete directory.
- Run tests to confirm green.

## Verification checklist
- No compile errors or broken imports.
- Tests pass after removal.

## Status
- Pending
