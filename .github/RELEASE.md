# Admin: Release Process

This document is intended for repo admins and maintainers.

## GitHub Release

We create GitHub Releases automatically when pushing a tag that starts with `v`.

No build is performed in the release workflow because CI builds already run on `main` for pushes and PRs. The release job only creates the release notes and attaches artifacts if needed.

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

# Alternative (manual tag):
# git tag -a v1.1.0 -m "Your release notes here"
# git push origin v1.1.0
```

Notes:
- Create tags from commits on `main` only.
- Release notes are auto-generated from the tag message and commits since the last tag.

## NPM Publish

Publishing to NPM is handled by `.github/workflows/publish.yml`. It runs on `release` events and on version tags (`v*`). It installs dependencies, builds the project, and runs `npm publish` using `NPM_TOKEN`.


