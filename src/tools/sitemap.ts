import { z } from 'zod';
import { Context, ToolParameters, UserError, Tool } from 'fastmcp';
import { getClient } from '@utils/client';

interface SitemapArgs {
  url: string;
  ignoreSitemapXml?: boolean;
  includeSubdomains?: boolean;
  searchTerm?: string;
  download?: boolean;
}

const Sitemap = async (args: SitemapArgs | any, { session }: Context<any>) => {
  const client = getClient(session?.apiKey);
  try {
    const req = await client.createSitemapRequest(
      args.url,
      {
        ignore_sitemap_xml: args.ignoreSitemapXml === undefined ? false : args.ignoreSitemapXml,
        include_subdomains: args.includeSubdomains === undefined ? true : args.includeSubdomains,
        search: args.searchTerm || null,
        include_paths: [],
        exclude_paths: [],
      },
      true,
      args.download === undefined ? false : args.download,
    );

    return JSON.stringify(req);
  } catch (e) {
    throw new UserError(String(e));
  }
};

const parameters = z.object({
  url: z.string().describe('URL to get sitemap for'),
  ignoreSitemapXml: z.boolean().optional().default(false),
  includeSubdomains: z.boolean().optional().default(true),
  searchTerm: z.string().optional(),
  download: z
    .boolean()
    .describe(
      'If set to true, returns all sitemap links. If false, returns a direct link to download the full sitemap.json file.',
    )
    .optional()
    .default(false),
});

export const SitemapTool: Tool<any, ToolParameters> = {
  name: 'sitemap',
  description:
    'Create a sitemap for a given URL, optionally ignoring sitemap.xml and including subdomains',
  parameters: parameters,
  execute: Sitemap,
};
