import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ServerModeEnforcer } from "./ServerModeEnforcer.js";

// Mock the validation utilities
vi.mock("../utils/validation.js", () => ({
  validateDynamicToolDiscoveryConfig: vi.fn(),
}));

// Mock the constants
vi.mock("../constants/index.js", () => ({
  getAvailableToolSets: vi.fn(),
}));

// Import mocked functions
import { validateDynamicToolDiscoveryConfig } from "../utils/validation.js";
import { getAvailableToolSets } from "../constants/index.js";

describe("ServerModeEnforcer", () => {
  let mockValidateDynamicToolDiscoveryConfig: ReturnType<typeof vi.mocked<typeof validateDynamicToolDiscoveryConfig>>;
  let mockGetAvailableToolSets: ReturnType<typeof vi.mocked<typeof getAvailableToolSets>>;
  let mockProcessExit: any;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockValidateDynamicToolDiscoveryConfig = vi.mocked(validateDynamicToolDiscoveryConfig);
    mockGetAvailableToolSets = vi.mocked(getAvailableToolSets);
    mockProcessExit = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // Setup default mock implementations
    mockValidateDynamicToolDiscoveryConfig.mockImplementation((value: unknown) => value === "true");
    mockGetAvailableToolSets.mockReturnValue([
      { key: "search", definition: {} as any },
      { key: "company", definition: {} as any },
      { key: "quotes", definition: {} as any },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Constructor and getter", () => {
    it("should return null when no overrides are configured", () => {
      const enforcer = new ServerModeEnforcer({}, {});
      expect(enforcer.serverModeOverride).toBe(null);
    });

    it("should return DYNAMIC_TOOL_DISCOVERY for CLI dynamic-tool-discovery flag", () => {
      const enforcer = new ServerModeEnforcer({}, { "dynamic-tool-discovery": true });
      expect(enforcer.serverModeOverride).toBe("DYNAMIC_TOOL_DISCOVERY");
    });

    it("should return DYNAMIC_TOOL_DISCOVERY for CLI dynamicToolDiscovery flag", () => {
      const enforcer = new ServerModeEnforcer({}, { "dynamicToolDiscovery": true });
      expect(enforcer.serverModeOverride).toBe("DYNAMIC_TOOL_DISCOVERY");
    });

    it("should return STATIC_TOOL_SETS for CLI tool-sets", () => {
      const enforcer = new ServerModeEnforcer({}, { "tool-sets": "search,company" });
      expect(enforcer.serverModeOverride).toBe("STATIC_TOOL_SETS");
    });

    it("should return DYNAMIC_TOOL_DISCOVERY for env var", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);
      
      const enforcer = new ServerModeEnforcer({ DYNAMIC_TOOL_DISCOVERY: "true" }, {});
      expect(enforcer.serverModeOverride).toBe("DYNAMIC_TOOL_DISCOVERY");
    });

    it("should return STATIC_TOOL_SETS for env var", () => {
      const enforcer = new ServerModeEnforcer({ FMP_TOOL_SETS: "quotes" }, {});
      expect(enforcer.serverModeOverride).toBe("STATIC_TOOL_SETS");
    });
  });

  describe("Precedence rules", () => {
    it("should prioritize CLI args over env vars", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(true);

      const enforcer = new ServerModeEnforcer(
        { DYNAMIC_TOOL_DISCOVERY: "true" },
        { "tool-sets": "search" }
      );

      expect(enforcer.serverModeOverride).toBe("STATIC_TOOL_SETS");
    });

    it("should prioritize CLI dynamic flag over other CLI tool sets", () => {
      const enforcer = new ServerModeEnforcer(
        {},
        { 
          "dynamic-tool-discovery": true,
          "tool-sets": "company"
        }
      );

      expect(enforcer.serverModeOverride).toBe("DYNAMIC_TOOL_DISCOVERY");
    });
  });

  describe("Edge cases", () => {
    it("should return null for empty tool sets", () => {
      const enforcer = new ServerModeEnforcer({ FMP_TOOL_SETS: "" }, {});
      expect(enforcer.serverModeOverride).toBe(null);
    });

    it("should return null for invalid dynamic tool discovery", () => {
      mockValidateDynamicToolDiscoveryConfig.mockReturnValue(false);
      
      const enforcer = new ServerModeEnforcer({ DYNAMIC_TOOL_DISCOVERY: "invalid" }, {});
      expect(enforcer.serverModeOverride).toBe(null);
    });

    it("should return null for non-boolean CLI dynamic flag", () => {
      const enforcer = new ServerModeEnforcer({}, { "dynamic-tool-discovery": "not-boolean" });
      expect(enforcer.serverModeOverride).toBe(null);
    });
  });

  describe("Tool Set Validation", () => {
    it("should exit process when invalid tool sets are provided via CLI", () => {
      mockGetAvailableToolSets.mockReturnValue([
        { key: "search", definition: {} as any },
        { key: "company", definition: {} as any },
      ]);

      expect(() => {
        new ServerModeEnforcer({}, { "tool-sets": "search,invalid,company" });
      }).toThrow("process.exit called");

      expect(mockConsoleError).toHaveBeenCalledWith("Invalid tool sets: invalid");
      expect(mockConsoleError).toHaveBeenCalledWith("Available tool sets: search, company");
      expect(mockProcessExit).toHaveBeenCalledWith(1);
    });

    it("should handle valid tool sets without error", () => {
      mockGetAvailableToolSets.mockReturnValue([
        { key: "search", definition: {} as any },
        { key: "company", definition: {} as any },
        { key: "quotes", definition: {} as any },
      ]);

      expect(() => {
        const enforcer = new ServerModeEnforcer({}, { "tool-sets": "search,company" });
        expect(enforcer.serverModeOverride).toBe("STATIC_TOOL_SETS");
      }).not.toThrow();

      expect(mockProcessExit).not.toHaveBeenCalled();
      expect(mockConsoleError).not.toHaveBeenCalled();
    });
  });
});