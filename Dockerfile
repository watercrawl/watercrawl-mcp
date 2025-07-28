FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production \
    WATERCRAWL_BASE_URL=https://app.watercrawl.dev \
    SSE_PORT=3000 \
    SSE_ENDPOINT=/sse

# Accept version as build argument
ARG VERSION
ENV VERSION=${VERSION}

# Install the specific version of the published package globally
RUN npm install -g @watercrawl/mcp@${VERSION}

# Create a non-root user
RUN addgroup -g 1001 -S watercrawl && \
    adduser -S watercrawl -u 1001

USER watercrawl

# Expose port for SSE server
EXPOSE 3000

# Set entrypoint with default SSE mode
ENTRYPOINT ["watercrawl-mcp"]

# Default command line arguments
CMD ["sse", "--port", "3000", "--endpoint", "/sse"]
