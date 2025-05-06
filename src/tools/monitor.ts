import { z } from 'zod';
import { Context, ToolParameters, UserError, Tool } from 'fastmcp';
import { getClient } from '@utils/client';
import type { CrawlRequest } from '@watercrawl/nodejs/dist/types';

interface MonitorArgs {
  type: 'crawl' | 'search';
  requestId: string;
  download?: boolean;
  timeout?: number; // in seconds
}

const monitor = async (args: MonitorArgs | any, { session }: Context<any>) => {
  const client = getClient(session?.apiKey);
  const download = args.download !== false;
  const timeout = args.timeout || 30; // Default 30s timeout
  const startTime = Date.now();
  const timeoutMs = timeout * 1000;

  try {
    const events: Array<any> = [];

    if (args.type === 'crawl') {
      const generator = client.monitorCrawlRequest(args.requestId, download);

      while (true) {
        const { value, done } = await generator.next();

        if (done) break;

        events.push(value);

        // Check for timeout
        if (Date.now() - startTime > timeoutMs) {
          return JSON.stringify({
            status: 'timeout',
            message: `Monitoring timed out after ${timeout} seconds`,
            events,
          });
        }

        // If we received a result or a finished/failed state, we can stop monitoring
        if (value.type === 'result') {
          break;
        } else if (value.type === 'state') {
          // Cast to CrawlRequest to access status property
          const state = value.data as CrawlRequest;
          if (['finished', 'failed', 'cancelled'].includes(state.status)) {
            break;
          }
        }
      }
    } else if (args.type === 'search') {
      const generator = client.monitorSearchRequest(args.requestId, download);

      while (true) {
        const { value, done } = await generator.next();

        if (done) break;

        events.push(value);

        // Check for timeout
        if (Date.now() - startTime > timeoutMs) {
          return JSON.stringify({
            status: 'timeout',
            message: `Monitoring timed out after ${timeout} seconds`,
            events,
          });
        }

        // If we received a finished/failed state, we can stop monitoring
        if (
          value.type === 'state' &&
          ['finished', 'failed', 'cancelled'].includes(value.data.status)
        ) {
          break;
        }
      }
    } else {
      throw new UserError(`Unknown monitor type: ${args.type}`);
    }

    return JSON.stringify({
      status: 'completed',
      events,
    });
  } catch (e) {
    throw new UserError(String(e));
  }
};

const parameters = z.object({
  type: z.enum(['crawl', 'search']).describe('Type of request to monitor'),
  requestId: z.string().describe('UUID of the request to monitor'),
  download: z.boolean().optional().default(true).describe('Download content while monitoring'),
  timeout: z.number().optional().default(30).describe('Maximum time to monitor in seconds'),
});

export const MonitorTool: Tool<any, ToolParameters> = {
  name: 'monitor-request',
  description: 'Monitor a crawl or search request in real-time, with timeout control',
  parameters: parameters,
  execute: monitor,
};
