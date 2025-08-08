import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ClientStorage, type StorageOptions } from "./ClientStorage.js";

vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  McpServer: vi.fn(),
}));

vi.mock("../dynamic-toolset-manager/DynamicToolsetManager.js", () => ({
  DynamicToolsetManager: vi.fn(),
}));

const mockConsoleLog = vi.fn();
const mockConsoleError = vi.fn();

describe("ClientStorage", () => {
  let storage: ClientStorage;
  let mockMcpServer: any;
  let mockToolManager: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(mockConsoleLog);
    vi.spyOn(console, "error").mockImplementation(mockConsoleError);

    mockMcpServer = { close: vi.fn() };
    mockToolManager = { cleanup: vi.fn() };
  });

  afterEach(() => {
    if (storage) storage.stop();
    vi.restoreAllMocks();
  });

  describe("Constructor and Configuration", () => {
    it("should create storage with default options", () => {
      storage = new ClientStorage();
      expect(storage).toBeInstanceOf(ClientStorage);
      expect(typeof storage.getEntryCount()).toBe("number");
    });

    it("should create storage with custom options", () => {
      const options: StorageOptions = { maxSize: 50, ttl: 60000 };
      storage = new ClientStorage(options);
      expect(storage.getMaxSize()).toBe(50);
      expect(storage.getTtl()).toBe(60000);
    });

    it("should start pruning interval on construction", () => {
      const setIntervalSpy = vi.spyOn(global, "setInterval");
      storage = new ClientStorage();
      expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000 * 60 * 10);
    });
  });

  describe("Basic Operations", () => {
    beforeEach(() => {
      storage = new ClientStorage();
    });

    it("should set and get a client entry", () => {
      const clientId = "client-1";
      const data = { mcpServer: mockMcpServer, toolManager: mockToolManager };
      storage.set(clientId, data);
      const result = storage.get(clientId);
      expect(result).toEqual(data);
    });

    it("should return null for non-existent client", () => {
      expect(storage.get("missing")).toBeNull();
    });

    it("should delete a client entry", () => {
      const clientId = "client-1";
      const data = { mcpServer: mockMcpServer };
      storage.set(clientId, data);
      storage.delete(clientId);
      expect(storage.get(clientId)).toBeNull();
    });
  });

  describe("LRU and TTL", () => {
    it("should evict least recently used when max size reached", () => {
      const options: StorageOptions = { maxSize: 2 };
      storage = new ClientStorage(options);

      storage.set("c1", { mcpServer: mockMcpServer });
      storage.set("c2", { mcpServer: mockMcpServer });
      storage.set("c3", { mcpServer: mockMcpServer });

      expect(storage.get("c1")).toBeNull();
      expect(storage.get("c2")).toBeDefined();
      expect(storage.get("c3")).toBeDefined();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[ClientStorage] Max size reached. Evicting least recently used client: c1"
      );
    });

    it("should expire entries based on TTL", () => {
      vi.useFakeTimers();
      const options: StorageOptions = { ttl: 1000 * 60 * 5 };
      storage = new ClientStorage(options);

      storage.set("c1", { mcpServer: mockMcpServer });
      vi.advanceTimersByTime(1000 * 60 * 6);
      expect(storage.get("c1")).toBeNull();
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "[ClientStorage] Client c1 expired. Deleting."
      );
      vi.useRealTimers();
    });

    it("should prune expired entries", () => {
      vi.useFakeTimers();
      const options: StorageOptions = { ttl: 1000 * 60 * 5 };
      storage = new ClientStorage(options);

      storage.set("c1", { mcpServer: mockMcpServer });
      vi.advanceTimersByTime(1000 * 60 * 6);

      // @ts-ignore access private for test via as any
      (storage as any).pruneExpired();

      expect(storage.get("c1")).toBeNull();
      expect(mockConsoleLog).toHaveBeenCalledWith("[ClientStorage] Pruning expired clients...");
      expect(mockConsoleLog).toHaveBeenCalledWith("[ClientStorage] Pruning expired client: c1");
      vi.useRealTimers();
    });
  });

  describe("Resource Management", () => {
    it("should stop the prune interval on stop()", () => {
      const clearIntervalSpy = vi.spyOn(global, "clearInterval");
      storage = new ClientStorage();
      storage.stop();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});


