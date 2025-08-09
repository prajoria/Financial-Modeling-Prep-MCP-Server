# Release workflow

## Objectives
- Add GitHub Actions workflow to create releases on tag push (`v*`).
- Document tagging and release steps in `README.md`.
- No build on release since main already builds.

## Plan
- Create `.github/workflows/release.yml` using `softprops/action-gh-release@v2` with `generate_release_notes: true` and `permissions.contents: write`.
- Update `README.md` with commands:
  - `npm version [patch|minor|major] -m "release: v%s"`
  - `git push && git push --tags`
  - Note to tag from commits on `main` only.
- Optional `package.json` scripts for release convenience (add later if desired).

## Verification checklist
- ✅ Workflow file exists under `.github/workflows/release.yml`.
- ✅ Workflow triggers on `v*` tags.
- ✅ No build step executed in workflow.
- ✅ Admin-only release docs at `.github/RELEASE.md` (README has no release instructions).

## Status
- ✅ Completed


