#!/usr/bin/env node
// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import { Command } from 'commander';
import { setupServer } from "@server/index";

const program = new Command();

// Setup version and description
program
  .name('watercrawl-mcp')
  .description('WaterCrawl MCP (Model Context Protocol) Server')
  .version('1.0.0');

// Common options
program
  .option('-b, --base-url <url>', 'WaterCrawl API base URL', 'https://app.watercrawl.dev')
  .option('-k, --api-key <key>', 'WaterCrawl API key');

// SSE command
program
  .command('sse')
  .description('Start the server with SSE transport')
  .option('-p, --port <number>', 'Port to run the SSE server on', '3000')
  .option('-e, --endpoint <path>', 'SSE endpoint path', '/sse')
  .action((options) => {
    // Set environment variables from options if provided
    if (program.opts().baseUrl) {
      process.env.WATERCRAWL_BASE_URL = program.opts().baseUrl;
    }
    
    // Base URL is required for all modes
    if (!process.env.WATERCRAWL_BASE_URL) {
      console.error("WATERCRAWL_BASE_URL is not configured. Use --base-url or set WATERCRAWL_BASE_URL in .env");
      process.exit(1);
    }
    
    // API key is optional for SSE mode
    if (program.opts().apiKey) {
      process.env.WATERCRAWL_API_KEY = program.opts().apiKey;
      console.warn("For SSE version, WATERCRAWL_API_KEY will be ignored.");
    }

    const server = setupServer();
    
    server.start({
      transportType: "sse",
      sse: {
        endpoint: options.endpoint as `/${string}`,
        port: Number(options.port),
      }
    });
    
    console.log(`SSE server running on port ${options.port} with endpoint ${options.endpoint}`);
  });

// STDIO command (default)
program
  .command('stdio', { isDefault: true })
  .description('Start the server with STDIO transport (default)')
  .action(() => {
    // Set environment variables from options if provided
    if (program.opts().baseUrl) {
      process.env.WATERCRAWL_BASE_URL = program.opts().baseUrl;
    }
    
    if (program.opts().apiKey) {
      process.env.WATERCRAWL_API_KEY = program.opts().apiKey;
    }
    
    // Base URL is required for all modes
    if (!process.env.WATERCRAWL_BASE_URL) {
      console.error("WATERCRAWL_BASE_URL is not configured. Use --base-url or set WATERCRAWL_BASE_URL in .env");
      process.exit(1);
    }
    
    // API key is required for STDIO mode
    if (!process.env.WATERCRAWL_API_KEY) {
      console.error("WATERCRAWL_API_KEY is not configured. Use --api-key or set WATERCRAWL_API_KEY in .env");
      process.exit(1);
    }

    const server = setupServer();
    
    server.start({
      transportType: "stdio"
    });
  });

program.parse();
