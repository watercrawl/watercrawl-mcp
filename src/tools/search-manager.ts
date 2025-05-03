import { z } from "zod";
import { Tool } from "fastmcp/src/FastMCP";
import { Context, ToolParameters, UserError } from "fastmcp";
import { getClient } from "@utils/client";

interface SearchManagerArgs {
  action: 'list' | 'get' | 'stop';
  searchRequestId?: string;
  page?: number;
  pageSize?: number;
  download?: boolean;
}

const manageSearch = async (args: SearchManagerArgs | any, { session }: Context<any>) => {
  const client = getClient(session?.apiKey);
  try {
    switch (args.action) {
      case 'list':
        const listResult = await client.getSearchRequestsList(args.page || 1, args.pageSize || 10);
        return JSON.stringify(listResult);
      case 'get':
        if (!args.searchRequestId) {
          throw new UserError("searchRequestId is required for 'get' action");
        }
        const getResult = await client.getSearchRequest(args.searchRequestId, args.download !== false);
        return JSON.stringify(getResult);
      case 'stop':
        if (!args.searchRequestId) {
          throw new UserError("searchRequestId is required for 'stop' action");
        }
        await client.stopSearchRequest(args.searchRequestId);
        return JSON.stringify({ success: true, message: "Search request stopped successfully" });
      default:
        throw new UserError(`Unknown action: ${args.action}`);
    }
  } catch (e) {
    throw new UserError(String(e));
  }
};

const parameters = z.object({
  action: z.enum(['list', 'get', 'stop']).describe("Action to perform on search requests"),
  searchRequestId: z.string().optional().describe("UUID of the search request (required for get and stop actions)"),
  page: z.number().optional().default(1).describe("Page number for listing (1-indexed)"),
  pageSize: z.number().optional().default(10).describe("Number of items per page for listing"),
  download: z.boolean().optional().default(true).describe("Download content when getting a search request"),
});

export const SearchManagerTool: Tool<any, ToolParameters> = {
  name: "manage-search",
  description: "Manage search requests: list, get details, or stop running searches",
  parameters: parameters,
  execute: manageSearch,
};
