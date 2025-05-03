# Publishing Guide for WaterCrawl MCP

This document explains how to set up automated publishing for the WaterCrawl MCP package.

## GitHub Secrets Configuration

The CI/CD pipeline requires the following GitHub secrets:

### 1. `NPM_TOKEN`

This token is used to publish the package to the npm registry.

To create an npm token:

1. Log in to your npm account at [npmjs.com](https://www.npmjs.com/)
2. Go to your account settings
3. Select "Access Tokens"
4. Click "Generate New Token"
5. Select "Automation" token type
6. Set permissions to "Read and write"
7. Copy the generated token

To add this token to GitHub:

1. Go to your GitHub repository
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click "Add secret"

### 2. `GITHUB_TOKEN`

This is automatically provided by GitHub Actions, so you don't need to configure it manually.

## Docker Hub Configuration (Optional)

If you want to publish to Docker Hub instead of or in addition to GitHub Container Registry:

1. Create a Docker Hub access token
2. Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets to GitHub
3. Modify the docker.yml workflow to use Docker Hub

## Configuring npm for Scoped Package

Since this package uses the `@watercrawl` scope, ensure your npm organization is set up correctly:

1. Create an npm organization named "watercrawl" if it doesn't exist
2. Add team members with appropriate permissions
3. Ensure your npm user has publish rights to the organization

## Testing the CI/CD Pipeline

The CI/CD pipeline will automatically run when you push to the main branch. To test it:

1. Make a change to the codebase
2. Commit with a semantic commit message (e.g., `feat: add new functionality`)
3. Push to the main branch
4. Check the Actions tab on GitHub to monitor progress

## Semantic Release

This project uses semantic-release to automate versioning and releases. It follows the commit message convention:

- `feat: ...` - Minor version bump (new features)
- `fix: ...` - Patch version bump (bug fixes)
- `perf: ...` - Patch version bump (performance improvements)
- `BREAKING CHANGE: ...` - Major version bump

Include `BREAKING CHANGE:` in the commit body or footer to trigger a major version bump.

## Docker Usage

The Docker image is built automatically and published to GitHub Container Registry.

To use the Docker image:

```bash
# Pull the image
docker pull ghcr.io/watercrawl/watercrawl-mcp:latest

# Run the container
docker run -p 3000:3000 -e WATERCRAWL_API_KEY=your-api-key ghcr.io/watercrawl/watercrawl-mcp:latest

# Or use docker-compose
docker-compose up
```
