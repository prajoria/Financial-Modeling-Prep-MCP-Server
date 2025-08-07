import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { SessionConfig } from '../mcp-server-factory/index.js';

/**
 * Middleware to handle legacy mode - requests without session configuration.
 * 
 * This middleware intercepts MCP requests that don't have a config parameter
 * and automatically generates a default session configuration to trigger
 * ALL_TOOLS mode (legacy behavior). This ensures backward compatibility
 * with clients that don't provide session configurations while maintaining
 * the Smithery SDK's requirement for configuration parameters.
 * 
 * @param req - Express request object
 * @param res - Express response object  
 * @param next - Express next function
 */
export function legacyConfigMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Check if this is an MCP request that's missing a config parameter
  if (req.method === 'POST' && (req.url === '/' || req.url === '/mcp' || req.url.startsWith('/mcp'))) {
    // If no config query parameter exists, generate a default session config for legacy mode
    if (!req.query.config && !req.url.includes('config=')) {
      const generatedSessionId = crypto.randomBytes(16).toString('hex');
      const legacyConfig: SessionConfig = {
        // Leave all config properties undefined to trigger ALL_TOOLS mode (legacy default)
        FMP_ACCESS_TOKEN: undefined,
        FMP_TOOL_SETS: undefined,
        DYNAMIC_TOOL_DISCOVERY: undefined
      };
      
      // Encode the config as base64 and add it as a query parameter
      const configBase64 = Buffer.from(JSON.stringify(legacyConfig)).toString('base64');
      
      // Add config parameter to the URL
      if (req.url.includes('?')) {
        req.url = `${req.url}&config=${encodeURIComponent(configBase64)}`;
      } else {
        req.url = `${req.url}?config=${encodeURIComponent(configBase64)}`;
      }

      // Add the sessionId to the header only if it doesn't already exist
      if (!req.headers['mcp-session-id']) {
        req.headers['mcp-session-id'] = generatedSessionId;
      }
      
      console.log(`[FmpMcpServer] 🔧 Generated legacy session config for ALL_TOOLS mode - session: ${generatedSessionId}`);
    }
  }
  next();
}
