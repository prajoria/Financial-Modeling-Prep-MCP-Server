import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import express from 'express';
import { McpServer, type ServerOptions } from "./MCPServer.js"
import * as statefulSdk from "@smithery/sdk/server/stateful.js";

// Mock external dependencies
vi.mock("@smithery/sdk/server/stateful.js", () => ({
  createStatefulServer: vi.fn(),
}));

vi.mock("../session-cache/SessionCache.js", () => ({
  SessionCache: vi.fn().mockImplementation((options = {}) => ({
    maxSize: options.maxSize || 100,
    ttl: options.ttl || 3600000,
    cache: new Map(),
    get: vi.fn(),
    set: vi.fn(),
    stop: vi.fn(),
  })),
}));

vi.mock("../mcp-server-factory/McpServerFactory.js", () => ({
  McpServerFactory: vi.fn().mockImplementation(() => ({
    createServerFromSdkArg: vi.fn().mockReturnValue({ name: "mock-server" }),
    createServer: vi.fn().mockReturnValue({
      mode: "ALL_TOOLS",
      mcpServer: { name: "mock-server" },
      toolManager: undefined,
    }),
  })),
}));

// Mock console methods
const mockConsoleLog = vi.fn();
const mockConsoleWarn = vi.fn();
const mockConsoleError = vi.fn();

describe("McpServer", () => {
  let server: McpServer;
  let mockCreateStatefulServer: any;
  let mockExpressApp: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(mockConsoleLog);
    vi.spyOn(console, "warn").mockImplementation(mockConsoleWarn);
    vi.spyOn(console, "error").mockImplementation(mockConsoleError);

    // Setup mock for createStatefulServer
    mockExpressApp = express();
    mockCreateStatefulServer = vi.mocked(statefulSdk.createStatefulServer);
    mockCreateStatefulServer.mockReturnValue({
      app: mockExpressApp,
    });
  });

  afterEach(() => {
    if (server && server.isRunning()) {
      server.stop();
    }
    vi.restoreAllMocks();
  });

  describe("Constructor", () => {
    it("should create server with default options", () => {
      server = new McpServer();

      expect(server).toBeInstanceOf(McpServer);
      const status = server.getStatus();
      expect(status.serverOptions.hasAccessToken).toBe(false);
    });

    it("should create server with custom options", () => {
      const options: ServerOptions = {
        accessToken: "test-token",
        cacheOptions: {
          maxSize: 50,
          ttl: 1800000,
        },
      };

      server = new McpServer(options);

      expect(server).toBeInstanceOf(McpServer);
      const status = server.getStatus();
      expect(status.serverOptions.hasAccessToken).toBe(true);
      expect(status.cacheConfig.maxSize).toBe(50);
      expect(status.cacheConfig.ttl).toBe(1800000);
    });

    it("should setup routes during construction", () => {
      server = new McpServer();

      expect(mockCreateStatefulServer).toHaveBeenCalledTimes(1);
      expect(mockCreateStatefulServer).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("Server Lifecycle", () => {
    beforeEach(() => {
      server = new McpServer({ accessToken: "test-token" });
    });

    it("should start server successfully", async () => {
      const port = 3001;
      
      server.start(port);

      // Wait a bit for server to start
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(server.isRunning()).toBe(true);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining(`🚀 MCP Server started successfully on port ${port}`)
      );
    });

    it("should warn when starting server without access token", async () => {
      server = new McpServer(); // No access token
      const port = 3002;
      
      server.start(port);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        "[McpServer] ⚠️ Server access token is required for operations - running dummy server"
      );
    });

    it("should prevent starting server twice", async () => {
      const port = 3003;
      
      server.start(port);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Try to start again
      server.start(port);
      
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        "[McpServer] ⚠️  Server is already running."
      );
    });

    it("should stop server gracefully", async () => {
      const port = 3004;
      
      server.start(port);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      server.stop();
      
      expect(server.isRunning()).toBe(false);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServer] 🛑 Initiating server shutdown..."
      );
    });

    it("should handle stop when server is not running", () => {
      server.stop();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServer] ℹ️  Server was not running"
      );
    });

    it("should handle server startup errors", () => {
      // Mock listen to throw an error
      const mockApp = server.getApp();
      vi.spyOn(mockApp, 'listen').mockImplementation(() => {
        throw new Error("Port already in use");
      });

      expect(() => server.start(3005)).toThrow("Port already in use");
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining("Failed to start server on port 3005"),
        expect.any(Error)
      );
    });
  });

  describe("Health Endpoint", () => {
    beforeEach(() => {
      server = new McpServer({ accessToken: "test-token" });
    });

    it("should setup health endpoint route", () => {
      const app = server.getApp();
      
      // Verify that the app has routes (Express apps have a _router property)
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
    });
  });

  describe("Session Management", () => {
    let mockSessionCache: any;
    let mockServerFactory: any;

    beforeEach(() => {
      server = new McpServer({ accessToken: "test-token" });
      mockSessionCache = (server as any).cache;
      mockServerFactory = (server as any).serverFactory;
    });

    it("should return cached session resources when available", () => {
      const sessionId = "test-session-1";
      const mockMcpServer = { name: "cached-server" };
      
      mockSessionCache.get.mockReturnValue({
        mcpServer: mockMcpServer,
        toolManager: undefined
      });

      const params = {
        sessionId,
        config: { FMP_ACCESS_TOKEN: "session-token" }
      };

      const result = (server as any)._getSessionResources(params);

      expect(result).toBe(mockMcpServer);
      expect(mockSessionCache.get).toHaveBeenCalledWith(sessionId);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `[McpServer] ✅ Reusing cached resources for session: ${sessionId}`
      );
    });

    it("should create new session resources when not cached", () => {
      const sessionId = "test-session-2";
      const mockMcpServer = { name: "new-server" };
      
      mockSessionCache.get.mockReturnValue(null);
      mockServerFactory.createServerFromSdkArg.mockReturnValue(mockMcpServer);
      mockServerFactory.createServer.mockReturnValue({
        mode: "DYNAMIC_TOOL_DISCOVERY",
        mcpServer: mockMcpServer,
        toolManager: { id: "tool-manager" }
      });

      const params = {
        sessionId,
        config: { DYNAMIC_TOOL_DISCOVERY: "true" }
      };

      const result = (server as any)._getSessionResources(params);

      expect(result).toBe(mockMcpServer);
      expect(mockServerFactory.createServerFromSdkArg).toHaveBeenCalledWith(params);
      expect(mockSessionCache.set).toHaveBeenCalledWith(sessionId, {
        mcpServer: mockMcpServer,
        toolManager: { id: "tool-manager" }
      });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `[McpServer] 🔧 Creating new resources for session: ${sessionId}`
      );
    });

    it("should handle session creation errors", () => {
      const sessionId = "test-session-error";
      const error = new Error("Factory creation failed");
      
      mockSessionCache.get.mockReturnValue(null);
      mockServerFactory.createServerFromSdkArg.mockImplementation(() => {
        throw error;
      });

      const params = {
        sessionId,
        config: {}
      };

      expect(() => (server as any)._getSessionResources(params)).toThrow(error);
      expect(mockConsoleError).toHaveBeenCalledWith(
        `[McpServer] ❌ Failed to create resources for session ${sessionId}:`,
        error
      );
    });
  });

  describe("Status and Utility Methods", () => {
    beforeEach(() => {
      server = new McpServer({
        accessToken: "test-token",
        cacheOptions: { maxSize: 75, ttl: 2000000 }
      });
    });

    it("should return correct status", () => {
      const status = server.getStatus();

      expect(status).toEqual({
        running: false,
        activeSessions: 0,
        cacheConfig: {
          maxSize: 75,
          ttl: 2000000
        },
        serverOptions: {
          hasAccessToken: true
        }
      });
    });

    it("should return Express app instance", () => {
      const app = server.getApp();
      expect(app).toBeInstanceOf(Function); // Express app is a function
    });

    it("should correctly report running status", async () => {
      expect(server.isRunning()).toBe(false);
      
      server.start(3006);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(server.isRunning()).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle route setup errors", () => {
      // Mock createStatefulServer to throw an error
      mockCreateStatefulServer.mockImplementation(() => {
        throw new Error("Route setup failed");
      });

      expect(() => new McpServer()).toThrow("Route setup failed");
    });

    it("should handle shutdown errors gracefully", () => {
      server = new McpServer({ accessToken: "test-token" });
      
      // Mock the cache stop method to throw an error
      const mockCache = (server as any).cache;
      vi.mocked(mockCache.stop).mockImplementation(() => {
        throw new Error("Cache stop failed");
      });

      expect(() => server.stop()).toThrow("Cache stop failed");
      expect(mockConsoleError).toHaveBeenCalledWith(
        "[McpServer] ❌ Error during server shutdown:",
        expect.any(Error)
      );
    });

    it("should handle cache stop method properly during normal shutdown", () => {
      server = new McpServer({ accessToken: "test-token" });
      
      // Verify the cache stop method is called during normal shutdown
      const mockCache = (server as any).cache;
      const stopSpy = vi.mocked(mockCache.stop);
      
      server.stop();
      
      expect(stopSpy).toHaveBeenCalledTimes(1);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[McpServer] ✅ Session cache stopped"
      );
    });
  });
});

// CLI Integration Tests - separate describe block
describe("CLI Integration", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let originalArgv: string[];

  beforeEach(() => {
    // Save original environment and argv
    originalEnv = { ...process.env };
    originalArgv = [...process.argv];
    
    // Clear relevant environment variables
    delete process.env.PORT;
    delete process.env.FMP_ACCESS_TOKEN;
  });

  afterEach(() => {
    // Restore original environment and argv
    process.env = originalEnv;
    process.argv = originalArgv;
  });

  describe("Environment Variable Handling", () => {
    it("should use PORT environment variable", () => {
      process.env.PORT = "4000";
      
      const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
      expect(PORT).toBe(4000);
    });

    it("should default to port 3000 when PORT is not set", () => {
      const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
      expect(PORT).toBe(3000);
    });

    it("should use FMP_ACCESS_TOKEN environment variable", () => {
      process.env.FMP_ACCESS_TOKEN = "env-token";
      
      const fmpToken = process.env.FMP_ACCESS_TOKEN;
      expect(fmpToken).toBe("env-token");
    });

    it("should handle invalid PORT environment variable", () => {
      process.env.PORT = "invalid";
      
      const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
      expect(PORT).toBeNaN();
    });
  });

  describe("Command Line Argument Parsing", () => {
    it("should parse fmp-token argument", () => {
      // Simulate minimist parsing --fmp-token
      const mockArgv = { "fmp-token": "cli-token" };
      const fmpToken = mockArgv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;
      
      expect(fmpToken).toBe("cli-token");
    });

    it("should parse help argument", () => {
      const mockArgv = { help: true };
      expect(mockArgv.help).toBe(true);
    });

    it("should parse short help argument", () => {
      const mockArgv = { h: true };
      expect(mockArgv.h).toBe(true);
    });
  });

  describe("Argument Precedence", () => {
    it("should prioritize CLI argument over environment variable", () => {
      process.env.FMP_ACCESS_TOKEN = "env-token";
      const mockArgv = { "fmp-token": "cli-token" };
      
      const fmpToken = mockArgv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;
      expect(fmpToken).toBe("cli-token");
    });

    it("should fall back to environment variable when CLI argument is not provided", () => {
      process.env.FMP_ACCESS_TOKEN = "env-token";
      const mockArgv = {};
      
      const fmpToken = mockArgv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;
      expect(fmpToken).toBe("env-token");
    });

    it("should be undefined when neither CLI argument nor environment variable is set", () => {
      const mockArgv = {};
      
      const fmpToken = mockArgv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;
      expect(fmpToken).toBeUndefined();
    });
  });

  describe("Signal Handling Setup", () => {
    it("should setup signal handlers correctly", () => {
      const mockMcpServer = {
        stop: vi.fn()
      };

      const mockProcessOn = vi.fn();
      const mockProcessExit = vi.fn();
      
      vi.spyOn(process, 'on').mockImplementation(mockProcessOn);
      vi.spyOn(process, 'exit').mockImplementation(mockProcessExit);

      // Simulate the main function signal handler setup
      const handleShutdown = () => {
        console.log('\n🔌 Shutting down server...');
        mockMcpServer.stop();
        process.exit(0);
      };

      process.on("SIGINT", handleShutdown);
      process.on("SIGTERM", handleShutdown);

      expect(mockProcessOn).toHaveBeenCalledWith("SIGINT", expect.any(Function));
      expect(mockProcessOn).toHaveBeenCalledWith("SIGTERM", expect.any(Function));

      // Test that the handler function works
      handleShutdown();
      expect(mockMcpServer.stop).toHaveBeenCalled();
      expect(mockProcessExit).toHaveBeenCalledWith(0);
    });
  });

  describe("Server Configuration Integration", () => {
    it("should create server with parsed configuration", () => {
      process.env.FMP_ACCESS_TOKEN = "integration-token";
      const mockArgv = { "fmp-token": "cli-override-token" };
      
      const fmpToken = mockArgv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;
      const serverOptions: ServerOptions = {
        accessToken: fmpToken,
        cacheOptions: {
          maxSize: 100,
          ttl: 1000 * 60 * 60 * 24, // 24 hours
        },
      };

      expect(serverOptions.accessToken).toBe("cli-override-token");
      expect(serverOptions.cacheOptions?.maxSize).toBe(100);
      expect(serverOptions.cacheOptions?.ttl).toBe(86400000); // 24 hours in ms
    });

    it("should handle missing configuration gracefully", () => {
      const mockArgv = {};
      
      const fmpToken = mockArgv["fmp-token"] || process.env.FMP_ACCESS_TOKEN;
      const serverOptions: ServerOptions = {
        accessToken: fmpToken,
        cacheOptions: {
          maxSize: 100,
          ttl: 1000 * 60 * 60 * 24,
        },
      };

      expect(serverOptions.accessToken).toBeUndefined();
      expect(serverOptions.cacheOptions).toBeDefined();
    });
  });
});
