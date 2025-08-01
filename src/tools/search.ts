import { z } from 'zod';
import { Context, ToolParameters, UserError, Tool } from 'fastmcp';
import { getClient } from '@utils/client';
import type { SearchOptions } from '@watercrawl/nodejs/dist/types';

interface SearchArgs {
  query: string;
  searchOptions?: SearchOptions;
  resultLimit?: number;
}

const search = async (args: SearchArgs | any, { session }: Context<any>) => {
  const client = getClient(session?.apiKey);
  try {
    const results = await client.createSearchRequest(
      args.query,
      args.searchOptions || {},
      args.resultLimit || 5,
      true,
      true,
    );
    return JSON.stringify(results);
  } catch (e) {
    throw new UserError(String(e));
  }
};

const parameters = z.object({
  query: z.string().describe('Search query'),
  searchOptions: z
    .object({
      language: z.string().nullable().optional().describe("Language code (e.g., 'en', 'fr')"),
      country: z.string().nullable().optional().describe("Country code (e.g., 'us', 'fr')"),
      time_range: z
        .enum(['any', 'hour', 'day', 'week', 'month', 'year'])
        .optional()
        .describe('Time range for search results'),
      search_type: z.enum(['web']).optional().default('web').describe('Type of search'),
      depth: z.enum(['basic', 'advanced', 'ultimate']).optional().describe('Search depth level'),
    })
    .optional()
    .describe('Search configuration options'),
  resultLimit: z.number().optional().default(5).describe('Maximum number of results to return'),
});

export const SearchTool: Tool<any, ToolParameters> = {
  name: 'search',
  description:
    'Search for information using configurable options for language, country, time range, and depth',
  parameters: parameters,
  execute: search,
};
