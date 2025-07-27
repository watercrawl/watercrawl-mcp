import { ScrapeTool } from './scrape';
import { Tool, ToolParameters } from 'fastmcp';
import { SearchTool } from './search';
import { SitemapTool } from './sitemap';
import { CrawlManagerTool } from './crawl-manager';
import { CrawlTool } from './crawl';

export const tools: Tool<any, ToolParameters>[] = [
  ScrapeTool,
  SearchTool,
  SitemapTool,
  CrawlTool,
  CrawlManagerTool,
];
