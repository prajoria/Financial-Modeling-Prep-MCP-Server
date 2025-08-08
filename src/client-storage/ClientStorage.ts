import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { DynamicToolsetManager } from "../dynamic-toolset-manager/DynamicToolsetManager.js";

interface StorageEntry {
  mcpServer: McpServer;
  toolManager?: DynamicToolsetManager;
  lastAccessed: number;
}

export interface StorageOptions {
  maxSize?: number;
  ttl?: number; // ms
}

export class ClientStorage {
  private storage = new Map<string, StorageEntry>();
  private maxSize: number;
  private ttl: number;
  private pruneInterval: NodeJS.Timeout;

  constructor(options: StorageOptions = {}) {
    this.maxSize = options.maxSize ?? 1000;
    this.ttl = options.ttl ?? 1000 * 60 * 60;
    this.pruneInterval = setInterval(() => this.pruneExpired(), 1000 * 60 * 10);
  }

  public getEntryCount(): number {
    return this.storage.size;
  }

  public getMaxSize(): number {
    return this.maxSize;
  }

  public getTtl(): number {
    return this.ttl;
  }

  get(clientId: string): Omit<StorageEntry, "lastAccessed"> | null {
    const entry = this.storage.get(clientId);
    if (!entry) return null;

    if (Date.now() - entry.lastAccessed > this.ttl) {
      console.log(`[ClientStorage] Client ${clientId} expired. Deleting.`);
      this.delete(clientId);
      return null;
    }

    entry.lastAccessed = Date.now();
    this.storage.delete(clientId);
    this.storage.set(clientId, entry);
    return { mcpServer: entry.mcpServer, toolManager: entry.toolManager };
  }

  set(clientId: string, data: Omit<StorageEntry, "lastAccessed">): void {
    if (this.storage.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }
    const newEntry: StorageEntry = { ...data, lastAccessed: Date.now() };
    this.storage.set(clientId, newEntry);
  }

  delete(clientId: string): void {
    this.storage.delete(clientId);
  }

  stop(): void {
    if (this.pruneInterval) {
      clearInterval(this.pruneInterval);
      this.pruneInterval = null as any;
    }
  }

  private evictLeastRecentlyUsed(): void {
    const lruClientId = this.storage.keys().next().value;
    if (lruClientId) {
      console.log(`[ClientStorage] Max size reached. Evicting least recently used client: ${lruClientId}`);
      this.delete(lruClientId);
    }
  }

  private pruneExpired(): void {
    const now = Date.now();
    console.log(`[ClientStorage] Pruning expired clients...`);
    for (const [clientId, entry] of this.storage.entries()) {
      if (now - entry.lastAccessed > this.ttl) {
        console.log(`[ClientStorage] Pruning expired client: ${clientId}`);
        this.delete(clientId);
      }
    }
  }
}


