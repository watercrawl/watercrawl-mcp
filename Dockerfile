FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production \
    WATERCRAWL_BASE_URL=https://app.watercrawl.dev \
    SSE_PORT=3000 \
    SSE_ENDPOINT=/sse

# Install the published package globally
RUN npm install -g @watercrawl/mcp

# Expose port for SSE server
EXPOSE 3000

# Set entrypoint with default SSE mode
ENTRYPOINT ["watercrawl-mcp"]

# Default command line arguments
CMD ["sse", "--port", "3000", "--endpoint", "/sse"]
