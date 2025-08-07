import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { SessionConfig } from '../mcp-server-factory/index.js';

/**
 * Middleware to handle legacy mode and Smithery deployment scanning.
 * 
 * This middleware intercepts MCP requests that don't have a config parameter
 * and automatically generates a default session configuration to trigger
 * ALL_TOOLS mode (legacy behavior). It also handles Smithery deployment
 * scanning requests by generating temporary session IDs when needed.
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
      
      // Handle session ID for deployment scanning and legacy clients
      const isDeploymentScan = isSmitheryDeploymentScan(req);

      
      if (isDeploymentScan && !req.headers['mcp-session-id']) {
        const generatedSessionId = crypto.randomBytes(16).toString('hex');
        req.headers['mcp-session-id'] = generatedSessionId;
        
        if (isDeploymentScan) {
          console.log(`[FmpMcpServer] 🔍 Generated session ID for Smithery deployment scan: ${generatedSessionId}`);
        } else {
          console.log(`[FmpMcpServer] 🔧 Generated session ID for legacy client: ${generatedSessionId}`);
        }
      } else {
        console.log(`[FmpMcpServer] 🔧 Generated legacy session config for modern MCP client`);
      }
    }
  }
  
  next();
}

/**
 * Detects if the request is from Smithery's deployment scanning process
 */
function isSmitheryDeploymentScan(req: Request): boolean {
  const userAgent = req.headers['user-agent']?.toLowerCase() || '';
  const origin = req.headers['origin']?.toLowerCase() || '';
  const referer = req.headers['referer']?.toLowerCase() || '';
  
  // Check for Smithery-specific headers or user agents
  return (
    userAgent.includes('smithery') ||
    origin.includes('smithery.ai') ||
    referer.includes('smithery.ai') ||
    req.headers['x-smithery-scan'] === 'true' ||
    req.headers['x-deployment-scan'] === 'true'
  );
}

