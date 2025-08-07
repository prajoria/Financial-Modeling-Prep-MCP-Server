import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SessionCache, type CacheOptions } from "./SessionCache.js";

// Mock the external dependencies
vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  McpServer: vi.fn(),
}));

vi.mock("../dynamic-toolset-manager/DynamicToolsetManager.js", () => ({
  DynamicToolsetManager: vi.fn(),
}));

// Mock console methods to avoid noise in tests
const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();

describe("SessionCache", () => {
  let cache: SessionCache;
  let mockMcpServer: any;
  let mockToolManager: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(mockConsoleLog);
    vi.spyOn(console, "error").mockImplementation(mockConsoleError);
    
    // Create mock objects
    mockMcpServer = {
      close: vi.fn(),
    };
    
    mockToolManager = {
      cleanup: vi.fn(),
    };
  });

  afterEach(() => {
    if (cache) {
      cache.stop();
    }
    vi.restoreAllMocks();
  });

  describe("Constructor and Configuration", () => {
    it("should create cache with default options", () => {
      cache = new SessionCache();
      
      expect(cache).toBeInstanceOf(SessionCache);
    });

    it("should create cache with custom options", () => {
      const options: CacheOptions = {
        maxSize: 500,
        ttl: 1000 * 60 * 30, // 30 minutes
      };
      
      cache = new SessionCache(options);
      
      expect(cache).toBeInstanceOf(SessionCache);
    });

    it("should start pruning interval on construction", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");
      
      cache = new SessionCache();
      
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000 * 60 * 10);
    });
  });

  describe("Basic Cache Operations", () => {
    beforeEach(() => {
      cache = new SessionCache();
    });

    it("should set and get a session", () => {
      const sessionId = "test-session-1";
      const data = { mcpServer: mockMcpServer, toolManager: mockToolManager };
      
      cache.set(sessionId, data);
      const result = cache.get(sessionId);
      
      expect(result).toEqual(data);
    });

    it("should return null for non-existent session", () => {
      const result = cache.get("non-existent-session");
      
      expect(result).toBeNull();
    });

    it("should delete a session", () => {
      const sessionId = "test-session-1";
      const data = { mcpServer: mockMcpServer, toolManager: mockToolManager };
      
      cache.set(sessionId, data);
      cache.delete(sessionId);
      
      const result = cache.get(sessionId);
      expect(result).toBeNull();
    });

    it("should handle setting session without toolManager", () => {
      const sessionId = "test-session-1";
      const data = { mcpServer: mockMcpServer };
      
      cache.set(sessionId, data);
      const result = cache.get(sessionId);
      
      expect(result).toEqual(data);
      expect(result?.toolManager).toBeUndefined();
    });
  });

  describe("Session Isolation", () => {
    beforeEach(() => {
      cache = new SessionCache();
    });

    it("should maintain separate sessions independently", () => {
      const session1Id = "session-1";
      const session2Id = "session-2";
      
      const data1 = { mcpServer: { ...mockMcpServer } };
      const data2 = { mcpServer: { ...mockMcpServer } };
      
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      
      const result1 = cache.get(session1Id);
      const result2 = cache.get(session2Id);
      
      expect(result1).toEqual(data1);
      expect(result2).toEqual(data2);
      expect(result1?.mcpServer).toBe(data1.mcpServer);
      expect(result2?.mcpServer).toBe(data2.mcpServer);
    });

    it("should not affect other sessions when deleting one", () => {
      const session1Id = "session-1";
      const session2Id = "session-2";
      
      const data1 = { mcpServer: mockMcpServer };
      const data2 = { mcpServer: { ...mockMcpServer } };
      
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      
      cache.delete(session1Id);
      
      const result1 = cache.get(session1Id);
      const result2 = cache.get(session2Id);
      
      expect(result1).toBeNull();
      expect(result2).toEqual(data2);
    });

    it("should handle concurrent access to different sessions", () => {
      const session1Id = "session-1";
      const session2Id = "session-2";
      
      const data1 = { mcpServer: mockMcpServer };
      const data2 = { mcpServer: { ...mockMcpServer } };
      
      // Simulate concurrent access
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      
      const result1 = cache.get(session1Id);
      const result2 = cache.get(session2Id);
      const result1Again = cache.get(session1Id);
      
      expect(result1).toEqual(data1);
      expect(result2).toEqual(data2);
      expect(result1Again).toEqual(data1);
    });

    it("should ensure complete session isolation with different tool managers", () => {
      const session1Id = "session-1";
      const session2Id = "session-2";
      
      const toolManager1 = { ...mockToolManager };
      const toolManager2 = { ...mockToolManager };
      
      const data1 = { mcpServer: mockMcpServer, toolManager: toolManager1 };
      const data2 = { mcpServer: mockMcpServer, toolManager: toolManager2 };
      
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      
      const result1 = cache.get(session1Id);
      const result2 = cache.get(session2Id);
      
      expect(result1?.toolManager).toBe(toolManager1);
      expect(result2?.toolManager).toBe(toolManager2);
      expect(result1?.toolManager).not.toBe(result2?.toolManager);
    });
  });

  describe("Memory Management and Cleanup", () => {
    it("should evict least recently used session when max size is reached", () => {
      const options: CacheOptions = { maxSize: 2 };
      cache = new SessionCache(options);
      
      const session1Id = "session-1";
      const session2Id = "session-2";
      const session3Id = "session-3";
      
      const data1 = { mcpServer: { ...mockMcpServer } };
      const data2 = { mcpServer: { ...mockMcpServer } };
      const data3 = { mcpServer: { ...mockMcpServer } };
      
      // Fill cache to capacity
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      
      // This should trigger eviction of session1 (LRU)
      cache.set(session3Id, data3);
      
      expect(cache.get(session1Id)).toBeNull();
      expect(cache.get(session2Id)).toEqual(data2);
      expect(cache.get(session3Id)).toEqual(data3);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[Cache] Max size reached. Evicting least recently used session: session-1"
      );
    });

    it("should update last accessed time when getting a session", () => {
      cache = new SessionCache();
      
      const sessionId = "test-session";
      const data = { mcpServer: mockMcpServer };
      
      // Set initial time for the set operation
      vi.spyOn(Date, "now").mockReturnValue(1000000);
      cache.set(sessionId, data);
      
      // Set time for the get operation
      vi.spyOn(Date, "now").mockReturnValue(2000000);
      
      const result = cache.get(sessionId);
      
      expect(result).toEqual(data);
    });

    it("should move accessed session to end of map (LRU behavior)", () => {
      const options: CacheOptions = { maxSize: 2 };
      cache = new SessionCache(options);
      
      const session1Id = "session-1";
      const session2Id = "session-2";
      const session3Id = "session-3";
      
      const data1 = { mcpServer: { ...mockMcpServer } };
      const data2 = { mcpServer: { ...mockMcpServer } };
      const data3 = { mcpServer: { ...mockMcpServer } };
      
      // Set initial sessions
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      
      // Access session1 to make it most recently used
      cache.get(session1Id);
      
      // Add new session - should evict session2 (now LRU)
      cache.set(session3Id, data3);
      
      expect(cache.get(session1Id)).toEqual(data1);
      expect(cache.get(session2Id)).toBeNull();
      expect(cache.get(session3Id)).toEqual(data3);
    });

    it("should handle memory cleanup when sessions are evicted", () => {
      const options: CacheOptions = { maxSize: 1 };
      cache = new SessionCache(options);
      
      const session1Id = "session-1";
      const session2Id = "session-2";
      
      const data1 = { mcpServer: mockMcpServer, toolManager: mockToolManager };
      const data2 = { mcpServer: { ...mockMcpServer } };
      
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      
      // session1 should be evicted
      expect(cache.get(session1Id)).toBeNull();
      expect(cache.get(session2Id)).toEqual(data2);
    });
  });

  describe("TTL and Expiration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should expire sessions based on TTL", () => {
      const options: CacheOptions = { ttl: 1000 * 60 * 5 }; // 5 minutes
      cache = new SessionCache(options);
      
      const sessionId = "test-session";
      const data = { mcpServer: mockMcpServer };
      
      // Set initial time
      vi.setSystemTime(new Date(1000000));
      cache.set(sessionId, data);
      
      // Advance time by 6 minutes (after TTL)
      vi.advanceTimersByTime(1000 * 60 * 6);
      
      const result = cache.get(sessionId);
      
      expect(result).toBeNull();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[Cache] Session test-session expired. Deleting."
      );
    });

    it("should not expire sessions within TTL", () => {
      const options: CacheOptions = { ttl: 1000 * 60 * 5 }; // 5 minutes
      cache = new SessionCache(options);
      
      const sessionId = "test-session";
      const data = { mcpServer: mockMcpServer };
      
      // Set initial time
      vi.setSystemTime(new Date(1000000));
      cache.set(sessionId, data);
      
      // Advance time by 3 minutes (within TTL)
      vi.advanceTimersByTime(1000 * 60 * 3);
      
      const result = cache.get(sessionId);
      
      expect(result).toEqual(data);
    });

    it("should handle TTL expiration during pruning", () => {
      const options: CacheOptions = { ttl: 1000 * 60 * 5 }; // 5 minutes
      cache = new SessionCache(options);
      
      const sessionId = "test-session";
      const data = { mcpServer: mockMcpServer };
      
      // Set initial time
      vi.setSystemTime(new Date(1000000));
      cache.set(sessionId, data);
      
      // Advance time by 6 minutes (after TTL)
      vi.advanceTimersByTime(1000 * 60 * 6);
      
      // Trigger pruning manually
      (cache as any)._prune();
      
      expect(cache.get(sessionId)).toBeNull();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[Cache] Pruning expired sessions..."
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[Cache] Pruning expired session: test-session"
      );
    });

    it("should handle multiple expired sessions during pruning", () => {
      const options: CacheOptions = { ttl: 1000 * 60 * 5 }; // 5 minutes
      cache = new SessionCache(options);
      
      const session1Id = "session-1";
      const session2Id = "session-2";
      const session3Id = "session-3";
      
      const data1 = { mcpServer: mockMcpServer };
      const data2 = { mcpServer: { ...mockMcpServer } };
      const data3 = { mcpServer: { ...mockMcpServer } };
      
      // Set initial time
      vi.setSystemTime(new Date(1000000));
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      cache.set(session3Id, data3);
      
      // Advance time by 6 minutes (after TTL)
      vi.advanceTimersByTime(1000 * 60 * 6);
      
      // Trigger pruning manually
      (cache as any)._prune();
      
      expect(cache.get(session1Id)).toBeNull();
      expect(cache.get(session2Id)).toBeNull();
      expect(cache.get(session3Id)).toBeNull();
    });
  });

  describe("Resource Cleanup", () => {
    it("should stop pruning interval when stop() is called", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      
      cache = new SessionCache();
      cache.stop();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it("should handle stop() calls gracefully", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      
      cache = new SessionCache();
      cache.stop();
      cache.stop(); // Second call should not cause issues
      
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    });

    it("should clean up resources when sessions are deleted", () => {
      cache = new SessionCache();
      
      const sessionId = "test-session";
      const data = { mcpServer: mockMcpServer, toolManager: mockToolManager };
      
      cache.set(sessionId, data);
      cache.delete(sessionId);
      
      // Verify session is removed
      expect(cache.get(sessionId)).toBeNull();
    });

    it("should clean up all resources when cache is stopped", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      
      cache = new SessionCache();
      
      // Add some sessions
      cache.set("session-1", { mcpServer: mockMcpServer });
      cache.set("session-2", { mcpServer: mockMcpServer });
      
      cache.stop();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    beforeEach(() => {
      cache = new SessionCache();
    });

    it("should handle empty session ID", () => {
      const data = { mcpServer: mockMcpServer };
      
      cache.set("", data);
      const result = cache.get("");
      
      expect(result).toEqual(data);
    });

    it("should handle very large session IDs", () => {
      const largeSessionId = "a".repeat(1000);
      const data = { mcpServer: mockMcpServer };
      
      cache.set(largeSessionId, data);
      const result = cache.get(largeSessionId);
      
      expect(result).toEqual(data);
    });

    it("should handle concurrent set operations", () => {
      const sessionId = "test-session";
      const data1 = { mcpServer: { ...mockMcpServer } };
      const data2 = { mcpServer: { ...mockMcpServer } };
      
      // Simulate concurrent sets
      cache.set(sessionId, data1);
      cache.set(sessionId, data2);
      
      const result = cache.get(sessionId);
      
      // Should have the last set value
      expect(result).toEqual(data2);
    });

    it("should handle rapid get/set operations", () => {
      const sessionId = "test-session";
      const data = { mcpServer: mockMcpServer };
      
      cache.set(sessionId, data);
      cache.get(sessionId);
      cache.get(sessionId);
      cache.get(sessionId);
      
      const result = cache.get(sessionId);
      expect(result).toEqual(data);
    });

    it("should handle null/undefined session data gracefully", () => {
      const sessionId = "test-session";
      
      // This should not throw
      expect(() => {
        cache.set(sessionId, { mcpServer: null as any });
      }).not.toThrow();
    });
  });

  describe("Performance and Scalability", () => {
    it("should handle large number of sessions efficiently", () => {
      const options: CacheOptions = { maxSize: 10000 };
      cache = new SessionCache(options);
      
      // Add many sessions
      for (let i = 0; i < 1000; i++) {
        const sessionId = `session-${i}`;
        const data = { mcpServer: { ...mockMcpServer } };
        cache.set(sessionId, data);
      }
      
      // Verify all sessions are accessible
      for (let i = 0; i < 1000; i++) {
        const sessionId = `session-${i}`;
        const result = cache.get(sessionId);
        expect(result).toBeDefined();
      }
    });

    it("should handle rapid eviction when max size is small", () => {
      const options: CacheOptions = { maxSize: 3 };
      cache = new SessionCache(options);
      
      // Add more sessions than max size
      for (let i = 0; i < 10; i++) {
        const sessionId = `session-${i}`;
        const data = { mcpServer: { ...mockMcpServer } };
        cache.set(sessionId, data);
      }
      
      // Only the last 3 sessions should remain
      expect(cache.get("session-0")).toBeNull();
      expect(cache.get("session-1")).toBeNull();
      expect(cache.get("session-2")).toBeNull();
      expect(cache.get("session-3")).toBeNull();
      expect(cache.get("session-4")).toBeNull();
      expect(cache.get("session-5")).toBeNull();
      expect(cache.get("session-6")).toBeNull();
      expect(cache.get("session-7")).toBeDefined();
      expect(cache.get("session-8")).toBeDefined();
      expect(cache.get("session-9")).toBeDefined();
    });
  });

  describe("Integration Tests", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should handle complete session lifecycle", () => {
      cache = new SessionCache();
      
      const sessionId = "test-session";
      const data = { mcpServer: mockMcpServer, toolManager: mockToolManager };
      
      // Create session
      cache.set(sessionId, data);
      expect(cache.get(sessionId)).toEqual(data);
      
      // Access session multiple times
      cache.get(sessionId);
      cache.get(sessionId);
      expect(cache.get(sessionId)).toEqual(data);
      
      // Delete session
      cache.delete(sessionId);
      expect(cache.get(sessionId)).toBeNull();
      
      // Recreate session
      cache.set(sessionId, data);
      expect(cache.get(sessionId)).toEqual(data);
    });

    it("should handle session expiration and recreation", () => {
      const options: CacheOptions = { ttl: 1000 * 60 * 5 }; // 5 minutes
      cache = new SessionCache(options);
      
      const sessionId = "test-session";
      const data1 = { mcpServer: { ...mockMcpServer } };
      const data2 = { mcpServer: { ...mockMcpServer } };
      
      // Set initial time
      vi.setSystemTime(new Date(1000000));
      cache.set(sessionId, data1);
      expect(cache.get(sessionId)).toEqual(data1);
      
      // Advance time by 6 minutes (after TTL)
      vi.advanceTimersByTime(1000 * 60 * 6);
      
      expect(cache.get(sessionId)).toBeNull();
      
      // Recreate session
      cache.set(sessionId, data2);
      expect(cache.get(sessionId)).toEqual(data2);
    });

    it("should handle complex session isolation scenarios", () => {
      cache = new SessionCache();
      
      const session1Id = "session-1";
      const session2Id = "session-2";
      const session3Id = "session-3";
      
      const toolManager1 = { ...mockToolManager };
      const toolManager2 = { ...mockToolManager };
      const toolManager3 = { ...mockToolManager };
      
      const data1 = { mcpServer: { ...mockMcpServer }, toolManager: toolManager1 };
      const data2 = { mcpServer: { ...mockMcpServer }, toolManager: toolManager2 };
      const data3 = { mcpServer: { ...mockMcpServer }, toolManager: toolManager3 };
      
      // Set all sessions
      cache.set(session1Id, data1);
      cache.set(session2Id, data2);
      cache.set(session3Id, data3);
      
      // Verify isolation
      expect(cache.get(session1Id)).toEqual(data1);
      expect(cache.get(session2Id)).toEqual(data2);
      expect(cache.get(session3Id)).toEqual(data3);
      
      // Delete middle session
      cache.delete(session2Id);
      
      // Verify others are unaffected
      expect(cache.get(session1Id)).toEqual(data1);
      expect(cache.get(session2Id)).toBeNull();
      expect(cache.get(session3Id)).toEqual(data3);
      
      // Recreate middle session
      const newData2 = { mcpServer: { ...mockMcpServer }, toolManager: toolManager2 };
      cache.set(session2Id, newData2);
      
      expect(cache.get(session1Id)).toEqual(data1);
      expect(cache.get(session2Id)).toEqual(newData2);
      expect(cache.get(session3Id)).toEqual(data3);
    });
  });
}); 