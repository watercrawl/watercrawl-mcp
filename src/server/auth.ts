import http from 'http';
import { getClient } from '@utils/client';
import { WaterCrawlAPIClient } from '@watercrawl/nodejs';

export interface WaterCrawlSession {
  apiKey: string;

  [key: string]: any;
}

export const authenticate = async (request: http.IncomingMessage): Promise<WaterCrawlSession> => {
  let apiKey;

  if (request.headers.authorization) {
    const auth: string = request.headers.authorization as string;
    apiKey = auth.split('Bearer ')[1];
  } else {
    // read from query params apikey=<API_KEY>
    const parsed_query = new URLSearchParams(request.url?.split('?')[1]);

    apiKey = parsed_query.get('apikey');
  }

  if (!apiKey) {
    throw new Response(null, {
      status: 401,
      statusText:
        "Unauthorized, missing api key you have to send it in header with key 'authorization' or in query params with key 'apikey'",
    });
  }

  try {
    const client: WaterCrawlAPIClient = getClient(apiKey);

    await client.getCrawlRequestsList(1, 1);
  } catch (e) {
    console.error(e);
    throw new Response(null, {
      status: 401,
      statusText: 'Unauthorized, Invalid api key',
    });
  }

  return Promise.resolve({
    apiKey,
  } as WaterCrawlSession);
};
