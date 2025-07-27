# WaterCrawl MCP

A Model Context Protocol (MCP) server for [WaterCrawl](https://watercrawl.dev), built with [FastMCP](https://github.com/punkpeye/fastmcp). This package provides AI systems with web crawling, scraping, and search capabilities through a standardized interface.

## Quick Start with npx (No Installation)

Use WaterCrawl MCP directly without installation using npx:

```bash
npx @watercrawl/mcp --api-key YOUR_API_KEY
```

### Using with AI Assistants

#### Codeium/Windsurf

Configure your Codeium or Windsurf with this package without installing it:

```json
{
  "mcpServers": {
    "watercrawl": {
      "command": "npx",
      "args": [
        "@watercrawl/mcp",
        "--api-key",
        "YOUR_API_KEY",
        "--base-url",
        "https://app.watercrawl.dev"
      ]
    }
  }
}
```

#### Claude Desktop

Run WaterCrawl MCP in SSE mode:

```bash
npx @watercrawl/mcp sse --port 3000 --endpoint /sse --api-key YOUR_API_KEY
```

Then configure Claude Desktop to connect to your SSE server.

### Command-line Options

- `-b, --base-url <url>`: WaterCrawl API base URL (default: https://app.watercrawl.dev)
- `-k, --api-key <key>`: Required, your WaterCrawl API key
- `-h, --help`: Display help information
- `-V, --version`: Display version information

SSE mode additional options:
- `-p, --port <number>`: Port for the SSE server (default: 3000)
- `-e, --endpoint <path>`: SSE endpoint path (default: /sse)

## Development and Contribution

### Project Structure

```
wc-mcp/
├── src/                   # Source code
│   ├── cli/               # Command-line interface
│   ├── config/            # Configuration management
│   ├── mcp/               # MCP implementation
│   ├── services/          # WaterCrawl API services
│   └── tools/             # MCP tools implementation
├── tests/                 # Test suite
├── dist/                  # Compiled JavaScript
├── tsconfig.json          # TypeScript configuration
├── package.json           # npm package configuration
└── README.md              # This file
```

### Setup for Development

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/watercrawl/watercrawl-mcp
cd watercrawl-mcp
npm install
```

2. Build the project:

```bash
npm run build
```

3. Link the package for local development:

```bash
npm link @watercrawl/mcp
```


### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Installation (Alternative to npx)

### Global Installation

```bash
npm install -g @watercrawl/mcp
```

### Local Installation

```bash
npm install @watercrawl/mcp
```

## Configuration

Configure WaterCrawl MCP using environment variables or command-line parameters.

### Environment Variables

Create a `.env` file or set environment variables:

```
WATERCRAWL_BASE_URL=https://app.watercrawl.dev
WATERCRAWL_API_KEY=YOUR_API_KEY
SSE_PORT=3000                  # Optional, for SSE mode
SSE_ENDPOINT=/sse              # Optional, for SSE mode
```

## Available Tools

The WaterCrawl MCP server provides the following tools:

### 1. scrape-url

Scrape content from a URL with customizable options.

```js
{
  "url": "https://example.com",
  "pageOptions": {
    "exclude_tags": ["script", "style"],
    "include_tags": ["p", "h1", "h2"],
    "wait_time": 1000,
    "only_main_content": true,
    "include_html": false,
    "include_links": true,
    "timeout": 15000,
    "accept_cookies_selector": ".cookies-accept-button",
    "locale": "en-US",
    "extra_headers": {
      "User-Agent": "Custom User Agent"
    },
    "actions": [
      {"type": "screenshot"},
      {"type": "pdf"}
    ]
  },
  "sync": true,
  "download": true
}
```

### 2. search

Search the web using WaterCrawl.

```js
{
  "query": "artificial intelligence latest developments",
  "searchOptions": {
    "language": "en",
    "country": "us",
    "time_range": "recent",
    "search_type": "web",
    "depth": "deep"
  },
  "resultLimit": 5,
  "sync": true,
  "download": true
}
```

### 3. download-sitemap

Download a sitemap from a crawl request in different formats.

```js
{
  "crawlRequestId": "uuid-of-crawl-request",
  "format": "json" // or "graph" or "markdown"
}
```

### 4. manage-crawl

Manage crawl requests: list, get details, stop, or download results.

```js
{
  "action": "list", // or "get", "stop", "download"
  "crawlRequestId": "uuid-of-crawl-request", // for get, stop, and download actions
  "page": 1,
  "pageSize": 10
}
```

### 5. manage-search

Manage search requests: list, get details, or stop running searches.

```js
{
  "action": "list", // or "get", "stop"
  "searchRequestId": "uuid-of-search-request", // for get and stop actions
  "page": 1,
  "pageSize": 10,
  "download": true
}
```

### 6. monitor-request

Monitor a crawl or search request in real-time, with timeout control.

```js
{
  "type": "crawl", // or "search"
  "requestId": "uuid-of-request",
  "timeout": 30, // in seconds
  "download": true
}
```

## License

ISC
