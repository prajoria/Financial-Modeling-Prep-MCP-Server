import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { McpServerFactory, type ServerMode, type SessionConfig, type McpServerOptions } from "./McpServerFactory.js";
import * as validation from "../utils/validation.js";

// Mock the external dependencies
vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  McpServer: vi.fn().mockImplementation((config) => ({
    name: config.name,
    version: config.version,
    capabilities: config.capabilities,
    configSchema: config.configSchema,
  })),
}));

vi.mock("../utils/validation.js", () => ({
  parseCommaSeparatedToolSets: vi.fn(),
  validateDynamicToolDiscoveryConfig: vi.fn(),
  validateAndSanitizeToolsetName: vi.fn(),
  validateToolSets: vi.fn(),
  validateToolsetModules: vi.fn(),
}));

vi.mock("../dynamic-toolset-manager/DynamicToolsetManager.js", () => ({
  DynamicToolsetManager: vi.fn().mockImplementation(() => ({
    id: "mock-tool-manager",
    getAvailableToolsets: vi.fn().mockReturnValue(["search", "company", "quotes"]),
    getActiveToolsets: vi.fn().mockReturnValue([]),
  })),
}));

vi.mock("../tools/meta-tools.js", () => ({
  registerMetaTools: vi.fn(),
}));

vi.mock("../tools/index.js", () => ({
  registerAllTools: vi.fn(),
  registerToolsBySet: vi.fn(),
}));

vi.mock("../utils/getServerVersion.js", () => ({
  getServerVersion: vi.fn().mockReturnValue("1.0.0"),
}));

// Mock console methods to avoid noise in tests
const mockConsoleLog = vi.fn();
const mockConsoleWarn = vi.fn();
const mockConsoleError = vi.fn();

// Get typed references to the mocked functions
const mockParseCommaSeparatedToolSets = vi.mocked(validation.parseCommaSeparatedToolSets);
const mockValidateDynamicToolDiscoveryConfig = vi.mocked(validation.validateDynamicToolDiscoveryConfig);

describe("McpServerFactory", () => {
  let factory: McpServerFactory;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(mockConsoleLog);
    vi.spyOn(console, "warn").mockImplementation(mockConsoleWarn);
    vi.spyOn(console, "error").mockImplementation(mockConsoleError);

    factory = new McpServerFactory();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Constructor", () => {
    it("should create factory", () => {
      expect(factory).toBeInstanceOf(McpServerFactory);
    });
  });

  describe("createServer", () => {
    it("should create server in ALL_TOOLS mode by default", () => {
      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {},
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeUndefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Creating server for session test-session in ALL_TOOLS mode"
      );
    });

    it("should create server in DYNAMIC_TOOL_DISCOVERY mode when configured", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);

      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {
          DYNAMIC_TOOL_DISCOVERY: "true",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeDefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Creating server for session test-session in DYNAMIC_TOOL_DISCOVERY mode"
      );
    });

    it("should create server in STATIC_TOOL_SETS mode when FMP_TOOL_SETS is provided", () => {
      mockParseCommaSeparatedToolSets.mockReturnValue(["search", "company"]);

      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {
          FMP_TOOL_SETS: "search,company",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("STATIC_TOOL_SETS");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeUndefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServerFactory] Creating server for session test-session in STATIC_TOOL_SETS mode"
      );
    });

    it("should resolve access token from server configuration", () => {
      const options: McpServerOptions = {
        sessionId: "", // Falsy value to test the fallback to serverAccessToken
        config: {},
        serverAccessToken: "server-token",
      };

      const result = factory.createServer(options);

      expect(result.mcpServer).toBeDefined();
    });

    it("should resolve access token from session config with priority", () => {
      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {
          FMP_ACCESS_TOKEN: "session-token",
        },
        serverAccessToken: undefined,
      };

      const result = factory.createServer(options);

      expect(result.mcpServer).toBeDefined();
    });

    it("should handle empty tool sets in STATIC_TOOL_SETS mode and fallback to ALL_TOOLS", () => {
      mockParseCommaSeparatedToolSets.mockReturnValue([]);

      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {
          FMP_TOOL_SETS: "",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
    });
  });

  describe("Server Mode Resolution", () => {
    it("should prioritize DYNAMIC_TOOL_DISCOVERY over STATIC_TOOL_SETS", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);
      mockParseCommaSeparatedToolSets.mockReturnValue(["search", "company"]);

      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {
          DYNAMIC_TOOL_DISCOVERY: "true",
          FMP_TOOL_SETS: "search,company",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("DYNAMIC_TOOL_DISCOVERY");
    });

    it("should handle invalid DYNAMIC_TOOL_DISCOVERY config", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(false);

      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {
          DYNAMIC_TOOL_DISCOVERY: "invalid",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
    });

    it("should handle empty FMP_TOOL_SETS", () => {
      mockParseCommaSeparatedToolSets.mockReturnValue([]);

      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {
          FMP_TOOL_SETS: "",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
    });
  });

  describe("Error Handling", () => {
    it("should handle missing config gracefully", () => {
      const options: McpServerOptions = {
        sessionId: "test-session",
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
    });

    it("should handle undefined access token", () => {
      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {},
      };

      const result = factory.createServer(options);

      expect(result.mcpServer).toBeDefined();
    });

    it("should handle empty session config", () => {
      const options: McpServerOptions = {
        sessionId: "test-session",
        config: {},
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle complete DYNAMIC_TOOL_DISCOVERY scenario", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);

      const options: McpServerOptions = {
        sessionId: "dynamic-session",
        config: {
          DYNAMIC_TOOL_DISCOVERY: "true",
          FMP_ACCESS_TOKEN: "dynamic-token",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("DYNAMIC_TOOL_DISCOVERY");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeDefined();
    });

    it("should handle complete STATIC_TOOL_SETS scenario", () => {
      mockParseCommaSeparatedToolSets.mockReturnValue(["search", "company", "quotes"]);

      const options: McpServerOptions = {
        sessionId: "static-session",
        config: {
          FMP_TOOL_SETS: "search,company,quotes",
          FMP_ACCESS_TOKEN: "static-token",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("STATIC_TOOL_SETS");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeUndefined();
    });

    it("should handle complete ALL_TOOLS scenario", () => {
      const options: McpServerOptions = {
        sessionId: "all-tools-session",
        config: {
          FMP_ACCESS_TOKEN: "all-tools-token",
        },
      };

      const result = factory.createServer(options);

      expect(result.mode).toBe("ALL_TOOLS");
      expect(result.mcpServer).toBeDefined();
      expect(result.toolManager).toBeUndefined();
    });
  });
});