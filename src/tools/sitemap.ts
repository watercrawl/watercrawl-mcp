import { z } from 'zod';
import { Tool } from 'fastmcp/src/FastMCP';
import { Context, ToolParameters, UserError } from 'fastmcp';
import { getClient } from '@utils/client';

interface SitemapArgs {
  crawlRequestId: string;
  format?: 'json' | 'graph' | 'markdown';
}

const downloadSitemap = async (args: SitemapArgs | any, { session }: Context<any>) => {
  const client = getClient(session?.apiKey);
  try {
    switch (args.format) {
      case 'graph':
        const graphData = await client.downloadSitemapGraph(args.crawlRequestId);
        return JSON.stringify(graphData);
      case 'markdown':
        const markdownData = await client.downloadSitemapMarkdown(args.crawlRequestId);
        return markdownData;
      case 'json':
      default:
        const jsonData = await client.downloadSitemap(args.crawlRequestId);
        return JSON.stringify(jsonData);
    }
  } catch (e) {
    throw new UserError(String(e));
  }
};

const parameters = z.object({
  crawlRequestId: z.string().describe('UUID of the crawl request'),
  format: z
    .enum(['json', 'graph', 'markdown'])
    .optional()
    .default('json')
    .describe('Format to return the sitemap in'),
});

export const SitemapTool: Tool<any, ToolParameters> = {
  name: 'download-sitemap',
  description:
    'Download the sitemap from a crawl request in different formats (JSON, graph, or markdown)',
  parameters: parameters,
  execute: downloadSitemap,
};
