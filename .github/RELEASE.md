# Admin: Release Process

This document is intended for repo admins and maintainers.

## GitHub Release

We create GitHub Releases automatically when pushing a tag that starts with `v`.

- No build or publish is performed in this workflow.
- CI builds already run on `main` for pushes and PRs.
- The job only creates a GitHub Release.

### Release notes generation

Our workflow uses `softprops/action-gh-release` with `generate_release_notes: true`.

This means:

- GitHub auto-generates release notes from commits/PRs since the last tag.
- Quality of notes depends on commit messages and PR titles. Prefer Conventional Commits (e.g., `feat: ...`, `fix: ...`).
- You can edit the generated release notes in the GitHub UI after the release is created.

Optional ways to influence notes:

- Create an annotated tag with a meaningful message, e.g.:
  ```bash
  git tag -a v1.2.0 -m "feat: dynamic toolsets\nfix: retry token resolution\nchore: docs updates"
  git push origin v1.2.0
  ```
  The generated notes will still be created by GitHub, but the tag message is shown in the release and can provide extra context.

### Recommended flow

```bash
# 1) Ensure you are on an up-to-date main
git checkout main && git pull

# 2) Bump version and create a tag (choose one)
npm version patch -m "release: v%s"
# or
npm version minor -m "release: v%s"
# or
npm version major -m "release: v%s"

# 3) Push commit and tags to trigger the Release workflow
git push && git push --tags

# Alternative (manual tag with a custom message):
# git tag -a v1.1.0 -m "feat: X\nfix: Y\nchore: Z"
# git push origin v1.1.0
```

Notes:

- Create tags from commits on `main` only.
- Release notes are auto-generated from commits/PRs since the last tag.
- After the release is created, you may edit the notes in the GitHub UI if needed.

## NPM Publish

We do not publish this package to NPM in this project lifecycle. There is no publish workflow.
