import { z } from 'zod';
import { Tool } from 'fastmcp/src/FastMCP';
import { Context, ToolParameters, UserError } from 'fastmcp';
import { getClient } from '@utils/client';

interface CrawlManagerArgs {
  action: 'list' | 'get' | 'stop' | 'download';
  crawlRequestId?: string;
  page?: number;
  pageSize?: number;
}

const manageCrawl = async (args: CrawlManagerArgs | any, { session }: Context<any>) => {
  const client = getClient(session?.apiKey);
  try {
    switch (args.action) {
      case 'list':
        const listResult = await client.getCrawlRequestsList(args.page || 1, args.pageSize || 10);
        return JSON.stringify(listResult);
      case 'get':
        if (!args.crawlRequestId) {
          throw new UserError("crawlRequestId is required for 'get' action");
        }
        const getResult = await client.getCrawlRequest(args.crawlRequestId);
        return JSON.stringify(getResult);
      case 'stop':
        if (!args.crawlRequestId) {
          throw new UserError("crawlRequestId is required for 'stop' action");
        }
        await client.stopCrawlRequest(args.crawlRequestId);
        return JSON.stringify({ success: true, message: 'Crawl request stopped successfully' });
      case 'download':
        if (!args.crawlRequestId) {
          throw new UserError("crawlRequestId is required for 'download' action");
        }
        const downloadResult = await client.downloadCrawlRequest(args.crawlRequestId);
        return JSON.stringify(downloadResult);
      default:
        throw new UserError(`Unknown action: ${args.action}`);
    }
  } catch (e) {
    throw new UserError(String(e));
  }
};

const parameters = z.object({
  action: z
    .enum(['list', 'get', 'stop', 'download'])
    .describe('Action to perform on crawl requests'),
  crawlRequestId: z
    .string()
    .optional()
    .describe('UUID of the crawl request (required for get, stop, and download actions)'),
  page: z.number().optional().default(1).describe('Page number for listing (1-indexed)'),
  pageSize: z.number().optional().default(10).describe('Number of items per page for listing'),
});

export const CrawlManagerTool: Tool<any, ToolParameters> = {
  name: 'manage-crawl',
  description: 'Manage crawl requests: list, get details, stop, or download results',
  parameters: parameters,
  execute: manageCrawl,
};
