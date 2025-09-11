# Changelog

All notable changes to the Financial Modeling Prep MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- MCP Registry publishing support with comprehensive metadata
- Registry badge and installation instructions in README
- Version synchronization utilities for consistent releases
- Automated publishing workflows for registry updates

## [2.4.0] - 2024-12-09

### Added
- MCP Registry metadata configuration (server.json)
- NPM package validation field (mcpName) for registry compliance
- Version synchronization scripts for package.json, server.json consistency
- Comprehensive registry documentation and installation methods

### Changed
- Enhanced README with MCP Registry section and installation options
- Updated package.json with registry-compliant mcpName field
- Improved documentation structure for better discoverability

### Fixed
- Version consistency across package.json and registry metadata files

## [2.3.0] - 2024-11-15

### Added
- Dynamic toolset management (BETA) with runtime tool loading/unloading
- Meta-tools for toolset control: enable_toolset, disable_toolset, get_toolset_status
- Server-level mode enforcement with configuration precedence hierarchy
- Session-level configuration via Base64-encoded query parameters

### Changed
- Refactored server architecture to support multiple operational modes
- Enhanced client storage with LRU cache and TTL for session management
- Improved tool registration system with dynamic loading capabilities

### Fixed
- Memory optimization through selective tool loading
- Session isolation and proper cache management

## [2.2.0] - 2024-10-20

### Added
- Comprehensive tool categorization across 24 financial domains
- Static toolset configuration for predictable performance
- Enhanced error handling and graceful degradation
- Docker support with environment variable configuration

### Changed
- Reorganized tool structure for better maintainability
- Improved API client architecture with base class inheritance
- Enhanced documentation with usage examples and system prompts

### Fixed
- Tool loading performance optimizations
- Consistent error responses across all tools

## [2.1.0] - 2024-09-25

### Added
- 253+ financial tools across comprehensive categories
- Real-time market data integration
- Financial statements and ratio analysis tools
- Technical indicators and market performance metrics

### Changed
- Migrated to TypeScript for better type safety
- Enhanced API client with context-aware authentication
- Improved tool registration patterns

### Fixed
- API rate limiting and timeout handling
- Data validation and error reporting

## [2.0.0] - 2024-08-15

### Added
- Model Context Protocol (MCP) server implementation
- Smithery SDK integration for stateful session management
- HTTP server with JSON-RPC endpoint
- Comprehensive financial data access via FMP API

### Changed
- Complete rewrite from previous versions
- New architecture with session-based tool management
- Enhanced security with token-based authentication

### Removed
- Legacy API interfaces (breaking change)
- Deprecated configuration methods

## [1.x.x] - Legacy Versions

Previous versions were experimental implementations. See git history for detailed changes.

---

## Release Process

### Version Numbering

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions  
- **PATCH** version for backwards-compatible bug fixes

### Release Checklist

1. Update version in package.json
2. Run version synchronization: `npm run version:sync`
3. Update CHANGELOG.md with new version section
4. Create git tag: `git tag v{version}`
5. Push changes and tag: `git push origin main --tags`
6. Automated publishing workflow handles NPM and registry updates

### Registry Publishing

Registry updates are automatically synchronized with NPM releases through GitHub Actions. Manual publishing can be performed using:

```bash
# Validate metadata
npm run version:validate

# Publish to NPM (required for registry validation)
npm publish

# Submit to MCP Registry (requires authentication)
mcp-publisher publish
```

For detailed publishing instructions, see the [MCP Registry Publishing Guide](https://docs.modelcontextprotocol.io/registry/publishing).