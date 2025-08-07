import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DynamicToolsetManager } from "../dynamic-toolset-manager/DynamicToolsetManager.js";

// Define the structure of what we're caching for each session
interface CacheEntry {
  mcpServer: McpServer;
  toolManager?: DynamicToolsetManager; // Optional - only used in DYNAMIC_TOOL_DISCOVERY mode
  lastAccessed: number;
}

// Define the options for configuring the cache
export interface CacheOptions {
  maxSize?: number; // Maximum number of sessions to keep in memory
  ttl?: number;     // Time-to-live for a session in milliseconds (decay)
}

export class SessionCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private ttl: number; // Time-to-live in ms
  private pruneInterval: NodeJS.Timeout;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 1000;
    this.ttl = options.ttl ?? 1000 * 60 * 60; // Default to 1 hour
    
    // Periodically prune expired sessions every 10 minutes
    this.pruneInterval = setInterval(() => this._prune(), 1000 * 60 * 10);
  }

  /**
   * Retrieves an entry from the cache. Returns null if not found or expired.
   */
  get(sessionId: string): Omit<CacheEntry, 'lastAccessed'> | null {
    const entry = this.cache.get(sessionId);

    if (!entry) {
      return null; // Not in cache
    }

    // Check for expiration (decay)
    if (Date.now() - entry.lastAccessed > this.ttl) {
      console.log(`[Cache] Session ${sessionId} expired. Deleting.`);
      this.delete(sessionId);
      return null;
    }

    // Update last accessed time and move to end of map to mark as most recently used
    entry.lastAccessed = Date.now();
    this.cache.delete(sessionId);
    this.cache.set(sessionId, entry);

    return { mcpServer: entry.mcpServer, toolManager: entry.toolManager };
  }

  /**
   * Adds a new entry to the cache, evicting the oldest if max size is reached.
   */
  set(sessionId: string, data: Omit<CacheEntry, 'lastAccessed'>): void {
    if (this.cache.size >= this.maxSize) {
      this._evict();
    }
    const newEntry: CacheEntry = {
      ...data,
      lastAccessed: Date.now(),
    };
    this.cache.set(sessionId, newEntry);
  }

  /**
   * Deletes an entry from the cache.
   */
  delete(sessionId: string): void {
    this.cache.delete(sessionId);
  }

  /**
   * Stops the periodic pruning of the cache.
   */
  stop(): void {
    if (this.pruneInterval) {
      clearInterval(this.pruneInterval);
      this.pruneInterval = null as any;
    }
  }

  /**
   * Evicts the least recently used (LRU) item from the cache.
   * The LRU item is the first one in the Map's insertion order.
   */
  private _evict(): void {
    const lruSessionId = this.cache.keys().next().value;
    if (lruSessionId) {
      console.log(`[Cache] Max size reached. Evicting least recently used session: ${lruSessionId}`);
      this.delete(lruSessionId);
    }
  }

  /**
   * Periodically iterates through the cache and removes expired items.
   */
  private _prune(): void {
    const now = Date.now();
    console.log(`[Cache] Pruning expired sessions...`);
    for (const [sessionId, entry] of this.cache.entries()) {
      if (now - entry.lastAccessed > this.ttl) {
        console.log(`[Cache] Pruning expired session: ${sessionId}`);
        this.delete(sessionId);
      }
    }
  }
}
