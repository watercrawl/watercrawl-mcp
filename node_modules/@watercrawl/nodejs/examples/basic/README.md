# WaterCrawl Basic Example

This example demonstrates basic usage of the WaterCrawl Node.js client.

## Setup

1. Build the main package:
```bash
# From the root directory
npm install
npm run build
```

2. Install example dependencies:
```bash
# From this directory (examples/basic)
npm install
```

3. Create a `.env` file in this directory with your API key:
```bash
WATERCRAWL_API_KEY=your-api-key
```

## Running the Example

```bash
npm start
```

This will run several examples:
1. Simple synchronous crawl
2. Asynchronous crawl with monitoring
3. Managing multiple crawls

## Local Development

To test changes to the main package:

1. Link the package:
```bash
# From the root directory
npm link

# From this directory (examples/basic)
npm link watercrawl-nodejs
```

2. Run the build in watch mode:
```bash
# From the root directory
npm run build -- --watch
```

3. Run the example:
```bash
# From this directory (examples/basic)
npm start
```

Any changes you make to the main package will be automatically rebuilt and reflected in the example.
