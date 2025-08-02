import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DynamicToolsetManager } from "./DynamicToolsetManager.js";
import type { ToolSet } from "../constants/index.js";

// Mock the MCP server with proper server interface
const mockMcpServer = {
  server: {
    notification: vi.fn().mockResolvedValue(undefined),
  },
} as any;

// Mock the constants and utils
vi.mock("../constants/toolSets.js", () => ({
  TOOL_SETS: {
    search: {
      name: "Search & Directory", 
      description: "Search for stocks, company information, and directory services",
      modules: ["search", "directory"],
    },
    quotes: {
      name: "Real-time Quotes",
      description: "Real-time stock quotes, price changes, and market data", 
      modules: ["quotes"],
    },
    company: {
      name: "Company Profile & Info",
      description: "Company profiles, executives, employees, and core business information",
      modules: ["company"],
    },
  },
}));

vi.mock("../constants/index.js", () => ({
  getModulesForToolSets: vi.fn((toolsets: ToolSet[]) => {
    const moduleMap: Record<ToolSet, string[]> = {
      search: ["search", "directory"],
      quotes: ["quotes"], 
      company: ["company"],
    } as any;
    
    return toolsets.flatMap(ts => moduleMap[ts] || []);
  }),
}));

describe("DynamicToolsetManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {}); // Suppress console logs during tests
    vi.spyOn(console, "warn").mockImplementation(() => {}); // Suppress warnings during tests
    vi.spyOn(console, "error").mockImplementation(() => {}); // Suppress errors during tests
    // Reset singleton instance before each test
    DynamicToolsetManager.resetInstance();
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore console methods after each test
    DynamicToolsetManager.resetInstance();
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance when called multiple times", () => {
      const instance1 = DynamicToolsetManager.getInstance(mockMcpServer, "test-token");
      const instance2 = DynamicToolsetManager.getInstance(mockMcpServer, "test-token");
      
      expect(instance1).toBe(instance2);
    });

    it("should update server and accessToken on subsequent calls", () => {
      const mockServer2 = { ...mockMcpServer } as any;
      
      const instance1 = DynamicToolsetManager.getInstance(mockMcpServer, "token1");
      const instance2 = DynamicToolsetManager.getInstance(mockServer2, "token2");
      
      expect(instance1).toBe(instance2);
      // The instance should be updated with new values
    });

    it("should reset instance correctly", () => {
      const instance1 = DynamicToolsetManager.getInstance(mockMcpServer, "test-token");
      DynamicToolsetManager.resetInstance();
      const instance2 = DynamicToolsetManager.getInstance(mockMcpServer, "test-token");
      
      expect(instance1).not.toBe(instance2);
    });
  });

  describe("Basic Functionality", () => {
    let manager: DynamicToolsetManager;

    beforeEach(() => {
      manager = DynamicToolsetManager.getInstance(mockMcpServer, "test-token");
    });

    it("should return available toolsets", () => {
      const toolsets = manager.getAvailableToolsets();
      expect(toolsets).toEqual(["search", "quotes", "company"]);
    });

    it("should return empty active toolsets initially", () => {
      const activeToolsets = manager.getActiveToolsets();
      expect(activeToolsets).toEqual([]);
    });

    it("should check if toolset is active", () => {
      expect(manager.isActive("search" as ToolSet)).toBe(false);
    });

    it("should get toolset definition", () => {
      const definition = manager.getToolsetDefinition("search" as ToolSet);
      expect(definition).toEqual({
        name: "Search & Directory",
        description: "Search for stocks, company information, and directory services",
        modules: ["search", "directory"],
      });
    });

    it("should return status information", () => {
      const status = manager.getStatus();
      expect(status).toEqual({
        availableToolsets: ["search", "quotes", "company"],
        activeToolsets: [],
        registeredModules: [],
        totalToolsets: 3,
        activeCount: 0,
      });
    });
  });

  describe("Toolset Validation", () => {
    let manager: DynamicToolsetManager;

    beforeEach(() => {
      manager = DynamicToolsetManager.getInstance(mockMcpServer, "test-token");
    });

    it("should reject invalid toolset names", async () => {
      const result = await manager.enableToolset("invalid" as ToolSet);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain("not found");
      expect(result.message).toContain("Available toolsets:");
    });

    it("should reject already enabled toolset", async () => {
      // Manually add to active set to simulate already enabled
      (manager as any).activeToolsets.add("search");
      
      const result = await manager.enableToolset("search" as ToolSet);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain("already enabled");
    });

    it("should reject disabling inactive toolset", async () => {
      const result = await manager.disableToolset("search" as ToolSet);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain("not currently active");
    });

    it("should validate toolset existence properly", async () => {
      const result = await manager.enableToolset("nonexistent-toolset" as ToolSet);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain("not found");
      expect(result.message).toContain("Available toolsets:");
    });
  });

  describe("State Management", () => {
    let manager: DynamicToolsetManager;

    beforeEach(() => {
      vi.clearAllMocks(); // Reset all mocks including the server notification mock
      manager = DynamicToolsetManager.getInstance(mockMcpServer, "test-token");
    });

    it("should maintain consistent internal state", () => {
      // Initial state
      expect(manager.getActiveToolsets()).toEqual([]);
      expect(manager.getStatus().registeredModules).toEqual([]);
      
      // Manually manipulate state to test getters (without real module loading)
      (manager as any).activeToolsets.add("search");
      (manager as any).registeredModules.add("search");
      (manager as any).registeredModules.add("directory");
      
      expect(manager.getActiveToolsets()).toEqual(["search"]);
      expect(manager.getStatus().registeredModules).toEqual(["search", "directory"]);
      expect(manager.isActive("search" as ToolSet)).toBe(true);
      expect(manager.isActive("quotes" as ToolSet)).toBe(false);
    });

    it("should return correct status information", () => {
      // Add some test state
      (manager as any).activeToolsets.add("search");
      (manager as any).activeToolsets.add("quotes");
      (manager as any).registeredModules.add("search");
      (manager as any).registeredModules.add("directory");
      (manager as any).registeredModules.add("quotes");
      
      const status = manager.getStatus();
      expect(status.availableToolsets).toEqual(["search", "quotes", "company"]);
      expect(status.activeToolsets).toEqual(["search", "quotes"]);
      expect(status.registeredModules).toEqual(["search", "directory", "quotes"]);
      expect(status.totalToolsets).toBe(3);
      expect(status.activeCount).toBe(2);
    });

    it("should handle disable operations on active toolsets", async () => {
      // Manually set up active state
      (manager as any).activeToolsets.add("search");
      (manager as any).registeredModules.add("search");
      (manager as any).registeredModules.add("directory");
      
      // Ensure notification doesn't fail for this test
      mockMcpServer.server.notification.mockResolvedValueOnce(undefined);
      
      const result = await manager.disableToolset("search" as ToolSet);
      
      expect(result.success).toBe(true);
      expect(result.message).toContain("disabled successfully");
      expect(result.message).toContain("MCP SDK limitations");
      expect(manager.isActive("search" as ToolSet)).toBe(false);
    });
  });

  describe("Error Handling", () => {
    let manager: DynamicToolsetManager;

    beforeEach(() => {
      manager = DynamicToolsetManager.getInstance(mockMcpServer, "test-token");
    });

    it("should handle malformed toolset names gracefully", async () => {
      const result = await manager.enableToolset("" as ToolSet);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain("Invalid toolset name provided");
    });

    it("should handle null/undefined toolset names", async () => {
      const result = await manager.enableToolset(null as any);
      
      expect(result.success).toBe(false);
    });

    it("should provide detailed error messages", async () => {
      const result = await manager.enableToolset("nonexistent" as ToolSet);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain("not found");
      expect(result.message).toContain("Available toolsets:");
      expect(result.message).toContain("search");
    });
  });

  describe("Access Token Handling", () => {
    it("should store access token correctly", () => {
      const manager = DynamicToolsetManager.getInstance(mockMcpServer, "custom-token");
      
      // Access token is stored internally, this test verifies the manager
      // can be instantiated with a token without errors
      expect(manager).toBeDefined();
      expect(manager.getAvailableToolsets()).toEqual(["search", "quotes", "company"]);
    });

    it("should handle undefined access token", () => {
      const manager = DynamicToolsetManager.getInstance(mockMcpServer);
      
      // Should work without access token
      expect(manager).toBeDefined();
      expect(manager.getAvailableToolsets()).toEqual(["search", "quotes", "company"]);
    });
  });
});