import { z } from 'zod';
import { Context, ToolParameters, UserError, Tool } from 'fastmcp';
import { getClient } from '@utils/client';

interface CrawlManagerArgs {
  action: 'list' | 'get' | 'get_results' | 'stop';
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
      case 'get_results':
        if (!args.crawlRequestId) {
          throw new UserError("crawlRequestId is required for 'get_results' action");
        }

        const results = await client.getCrawlRequestResults(
          args.crawlRequestId,
          args.page || 1,
          args.pageSize || 10,
          args.download !== false,
        );
        return JSON.stringify(results);
      case 'stop':
        if (!args.crawlRequestId) {
          throw new UserError("crawlRequestId is required for 'stop' action");
        }
        await client.stopCrawlRequest(args.crawlRequestId);
        return JSON.stringify({ success: true, message: 'Crawl request stopped successfully' });
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
  page: z
    .number()
    .optional()
    .default(1)
    .describe('Page number for listing (1-indexed), can use for get_results and list actions'),
  pageSize: z
    .number()
    .optional()
    .default(10)
    .describe('Number of items per page for listing, can use for get_results and list actions'),
});

export const CrawlManagerTool: Tool<any, ToolParameters> = {
  name: 'manage-crawl',
  description: 'Manage crawl requests: list, get details, stop, or download results',
  parameters: parameters,
  execute: manageCrawl,
};
