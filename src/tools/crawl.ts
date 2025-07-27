import { z } from 'zod';
import { Context, ToolParameters, UserError, Tool } from 'fastmcp';
import { getClient } from '@utils/client';
import type { PageOptions, SpiderOptions } from '@watercrawl/nodejs/dist/types';

interface CrawlArgs {
  url: string;
  spiderOptions?: SpiderOptions;
  pageOptions?: PageOptions;
}

const crawlUrl = async (args: CrawlArgs | any, { session }: Context<any>) => {
  const client = getClient(session?.apiKey);
  try {
    const req = await client.createCrawlRequest(
      args.url,
      args.spiderOptions || {},
      args.pageOptions || {},
    );
    return JSON.stringify(req);
  } catch (e) {
    throw new UserError(String(e));
  }
};

const parameters = z.object({
  url: z.string().describe('URL to scrape'),
  spiderOptions: z
    .object({
      max_depth: z.number().optional().describe('Maximum depth to crawl'),
      page_limit: z.number().optional().describe('Maximum number of pages to crawl'),
      allowed_domains: z
        .string()
        .array()
        .optional()
        .describe('Allowed domains to crawl example: ["*.example.com"]'),
      exclude_paths: z
        .string()
        .array()
        .optional()
        .describe('Paths to exclude from crawling example: ["/path/*"]'),
      include_paths: z
        .string()
        .array()
        .optional()
        .describe('Paths to include in crawling example: ["/path/*"]'),
    })
    .optional()
    .describe('Spider options'),
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
});

export const CrawlTool: Tool<any, ToolParameters> = {
  name: 'crawl',
  description:
    'Crawl a URL and its subpages with customizable depth and spider limitations. This is an async operation, with crawl manager you can get status and results.',
  parameters: parameters,
  execute: crawlUrl,
};
