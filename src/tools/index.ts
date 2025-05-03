import { Tool } from 'fastmcp/src/FastMCP';
import { ScrapeTool } from './scrape';
import { ToolParameters } from 'fastmcp';
import { SearchTool } from './search';
import { SitemapTool } from './sitemap';
import { CrawlManagerTool } from './crawl-manager';
import { SearchManagerTool } from './search-manager';
import { MonitorTool } from './monitor';

export const tools: Tool<any, ToolParameters>[] = [
  ScrapeTool,
  SearchTool,
  SitemapTool,
  CrawlManagerTool,
  SearchManagerTool,
  MonitorTool,
];
