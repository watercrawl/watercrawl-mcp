// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import { setupServer } from '@server/index';

if (!process.env.WATERCRAWL_BASE_URL) {
  // show an error and exit
  console.error('WATERCRAWL_BASE_URL is not configured in the MCP');
  process.exit(1);
}

if (process.env.WATERCRAWL_API_KEY) {
  console.warn('For SSE version, WATERCRAWL_API_KEY will be ignored.');
}

const server = setupServer();

server.start({
  transportType: 'sse',
  sse: {
    endpoint: (process.env.SSE_ENDPOINT as `/${string}`) || '/sse',
    port: Number(process.env.SSE_PORT) || 3000,
  },
});
