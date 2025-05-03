import { WaterCrawlAPIClient } from "./index.js";

export const getClient = (apiKey = "") => {
  const BASE_URL = process.env.WATERCRAWL_BASE_URL || "https://app.watercrawl.dev";
  const API_KEY: string = apiKey || process.env.WATERCRAWL_API_KEY || "";
  return new WaterCrawlAPIClient(API_KEY, BASE_URL);
}
