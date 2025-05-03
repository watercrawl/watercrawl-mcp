import { FastMCP } from 'fastmcp';
import { tools } from '@tools/index';
import { authenticate, WaterCrawlSession } from './auth';

export const setupServer = () => {
  const server: FastMCP<WaterCrawlSession> = new FastMCP({
    name: 'WaterCrawl MCP Server',
    version: '1.0.0',
    authenticate,
  });

  // Register tools
  for (const tool of tools) {
    server.addTool(tool);
  }

  return server;
};
