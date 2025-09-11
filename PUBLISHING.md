# NPM Publishing Guide

This document provides instructions for publishing the Financial Modeling Prep MCP Server to NPM.

## Automated Publishing (Recommended)

The package is automatically published to NPM via GitHub Actions when you create a release tag. See [.github/RELEASE.md](.github/RELEASE.md) for the automated release process.

**Quick automated release:**
```bash
npm version patch  # or minor/major
git push && git push --tags
```

## Manual Publishing (Fallback)

Use this process only if the automated workflow fails or for emergency hotfixes.

## Prerequisites

1. **NPM Account**: Ensure you have an NPM account with username `imbenrabi` and email `imbenrabi@gmail.com`
2. **NPM CLI**: Ensure npm CLI is installed and up to date
3. **Build Environment**: Node.js >=20.0.0 and TypeScript compiler

## Package Configuration

### Build Exclusions

The package is configured to exclude development files from the NPM package:

- **Test files**: `*.test.ts` files are excluded from TypeScript compilation via `tsconfig.json`
- **Scripts directory**: The `scripts/` directory is not included in the `files` array
- **Source files**: Only the compiled `dist/` directory is included

This results in a clean, production-ready package that's ~43% smaller than including test files.

### Package Contents

The published package includes only:
- `dist/` - Compiled TypeScript output (JS, d.ts, source maps)
- `LICENSE` - Apache 2.0 license file
- `README.md` - Documentation
- `package.json` - Package metadata with `mcpName` field

## Pre-Publishing Checklist

### 1. Verify Package Configuration

The package.json should include:
- ✅ `mcpName` field: `"io.github.imbenrabi/financial-modeling-prep-mcp-server"`
- ✅ Correct version number
- ✅ All required fields (name, description, main, bin, files, etc.)
- ✅ Proper file inclusion in `files` array (only `dist`, `LICENSE`, `README.md`)
- ✅ Test files and scripts directory are excluded from the package

### 2. Build and Test Package

```bash
# Quick verification of publishing readiness
npm run verify:npm-ready

# Or run individual checks:
# Clean build
rm -rf dist/
npm run build

# Run tests
npm run test:run

# Verify package contents
npm pack --dry-run

# Comprehensive publishing test
npm run test:npm-publish
```

### 3. Version Management

```bash
# Validate version consistency
npm run version:validate

# Sync versions if needed
npm run version:sync

# Check version info
npm run version:info
```

## Publishing Steps

### 1. Login to NPM

```bash
# Login with your NPM account
npm login --registry https://registry.npmjs.org/

# Verify login
npm whoami --registry https://registry.npmjs.org/
```

When prompted:
- Username: `imbenrabi`
- Password: [Your NPM password]
- Email: `imbenrabi@gmail.com`

### 2. Verify Package Name Availability

```bash
# Check if package name is available
npm view financial-modeling-prep-mcp-server --registry https://registry.npmjs.org/
```

Expected result: Package should not exist (404 error) for first publish, or show current version for updates.

### 3. Test Package Build

```bash
# Test the build process
npm run prePublishOnly

# Verify the built package
npm pack --dry-run
```

### 4. Publish to NPM

```bash
# Publish the package
npm publish --registry https://registry.npmjs.org/

# For first-time publish, you might need:
npm publish --access public --registry https://registry.npmjs.org/
```

### 5. Verify Publication

```bash
# Check the published package
npm view financial-modeling-prep-mcp-server --registry https://registry.npmjs.org/

# Test installation
npm install -g financial-modeling-prep-mcp-server --registry https://registry.npmjs.org/

# Test the CLI
fmp-mcp --help
```

## Post-Publishing Verification

### 1. Package Installation Test

Create a test directory and verify installation:

```bash
mkdir test-install
cd test-install
npm init -y
npm install financial-modeling-prep-mcp-server
```

### 2. MCP Name Verification

Verify the mcpName field is accessible:

```bash
node -e "console.log(require('financial-modeling-prep-mcp-server/package.json').mcpName)"
```

Expected output: `io.github.imbenrabi/financial-modeling-prep-mcp-server`

### 3. Binary Verification

Test the binary installation:

```bash
npx financial-modeling-prep-mcp-server --help
# or
fmp-mcp --help
```

## Troubleshooting

### Authentication Issues

If you encounter authentication errors:

```bash
# Clear npm cache
npm cache clean --force

# Re-login
npm logout
npm login --registry https://registry.npmjs.org/
```

### Registry Issues

If you're using a custom registry (like JFrog), temporarily override:

```bash
# Publish with explicit registry
npm publish --registry https://registry.npmjs.org/

# Or temporarily update .npmrc
echo "registry=https://registry.npmjs.org/" > .npmrc
npm publish
# Restore original .npmrc after publishing
```

### Version Conflicts

If version already exists:

```bash
# Update version
npm version patch  # or minor/major
npm run version:sync
npm publish --registry https://registry.npmjs.org/
```

## Automated Publishing (Future)

For CI/CD automation, consider:

1. **GitHub Actions**: Set up automated publishing on tag creation
2. **NPM Tokens**: Use `NPM_TOKEN` environment variable for authentication
3. **Semantic Versioning**: Implement automated version bumping

## Security Considerations

1. **Two-Factor Authentication**: Enable 2FA on your NPM account
2. **Access Tokens**: Use granular access tokens instead of password authentication
3. **Package Signing**: Consider signing packages for additional security

## Package Maintenance

### Regular Updates

1. Keep dependencies updated
2. Monitor security vulnerabilities
3. Update documentation
4. Maintain changelog

### Version Strategy

- **Patch** (x.x.X): Bug fixes, security updates
- **Minor** (x.X.x): New features, backward compatible
- **Major** (X.x.x): Breaking changes

## Support

For publishing issues:
- NPM Support: https://www.npmjs.com/support
- Package Issues: GitHub repository issues
- MCP Registry: Follow MCP community guidelines