import { z } from "zod";
import { Tool } from "fastmcp/src/FastMCP";
import { Context, ToolParameters, UserError } from "fastmcp";
import { getClient } from "@utils/client";
import type { SearchOptions } from "@watercrawl/nodejs/dist/types";

interface SearchArgs {
  query: string;
  searchOptions?: SearchOptions;
  resultLimit?: number;
  sync?: boolean;
  download?: boolean;
}

const search = async (args: SearchArgs | any, {session}: Context<any>) => {
  const client = getClient(session?.apiKey);
  try {
    const results = await client.createSearchRequest(
      args.query,
      args.searchOptions || {},
      args.resultLimit || 5,
      args.sync === false ? false : true,
      args.download === false ? false : true
    );
    return JSON.stringify(results);
  } catch (e) {
    throw new UserError(String(e));
  }
}

const parameters = z.object({
  query: z.string().describe("Search query"),
  searchOptions: z.object({
    language: z.string().nullable().optional().describe("Language code (e.g., 'en', 'fr')"),
    country: z.string().nullable().optional().describe("Country code (e.g., 'us', 'fr')"),
    time_range: z.enum(['any', 'hour', 'day', 'week', 'month', 'year']).optional().describe("Time range for search results"),
    search_type: z.enum(['web']).optional().default('web').describe("Type of search"),
    depth: z.enum(['basic', 'advanced', 'ultimate']).optional().describe("Search depth level"),
  }).optional().describe("Search configuration options"),
  resultLimit: z.number().optional().default(5).describe("Maximum number of results to return"),
  sync: z.boolean().optional().default(true).describe("Wait for search to complete"),
  download: z.boolean().optional().default(true).describe("Download content immediately"),
});

export const SearchTool: Tool<any, ToolParameters> = {
  name: "search",
  description: "Search for information using configurable options for language, country, time range, and depth",
  parameters: parameters,
  execute: search,
};
