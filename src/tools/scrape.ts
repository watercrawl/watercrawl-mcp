import { z } from 'zod';
import { Context, ToolParameters, UserError, Tool } from 'fastmcp';
import { getClient } from '@utils/client';
import type { CrawlRequest, PageOptions } from '@watercrawl/nodejs/dist/types';

interface ScrapeArgs {
  urls: string[];
  pageOptions?: PageOptions;
}

const scrapeUrl = async (args: ScrapeArgs | any, { session }: Context<any>) => {
  const client = getClient(session?.apiKey);
  try {
    const req = await client.createBatchCrawlRequest(args.urls, {}, args.pageOptions || {});
    const results = [];
    for await (const data of client.monitorCrawlRequest(req.uuid, true)) {
      if (data.type === 'result') {
        results.push(data.data);
      }
      if (data.type === 'state' && (data.data as CrawlRequest).status === 'finished') {
        break;
      }
    }

    return JSON.stringify({
      ...req,
      results,
    });
  } catch (e) {
    throw new UserError(String(e));
  }
};

const parameters = z.object({
  urls: z.string().array().describe('List of URLs to scrape'),
  pageOptions: z
    .object({
      exclude_tags: z.string().array().optional().describe('HTML tags to exclude'),
      include_tags: z.string().array().optional().describe('HTML tags to include'),
      wait_time: z.number().optional().describe('Time to wait for page loading in ms'),
      only_main_content: z.boolean().optional().describe('Extract only main content'),
      include_html: z.boolean().optional().describe('Include HTML in response'),
      include_links: z.boolean().optional().describe('Include links in response'),
      timeout: z.number().optional().describe('Page load timeout in ms'),
      accept_cookies_selector: z
        .string()
        .optional()
        .describe('CSS selector for accept cookies button'),
      locale: z.string().optional().describe('Locale for the page'),
      extra_headers: z.record(z.string()).optional().describe('Additional HTTP headers'),
      actions: z
        .array(
          z.object({
            type: z.enum(['pdf', 'screenshot']).describe('Action type'),
          }),
        )
        .optional()
        .describe('Actions to perform on the page'),
    })
    .optional()
    .describe('Page scraping options'),
  sync: z.boolean().optional().default(true).describe('Wait for scraping to complete'),
  download: z.boolean().optional().default(true).describe('Download content immediately'),
});

export const ScrapeTool: Tool<any, ToolParameters> = {
  name: 'scrape-urls',
  description:
    'Scrape multiple(or single) URL(s) with optional configuration for page options, and more',
  parameters: parameters,
  execute: scrapeUrl,
};
