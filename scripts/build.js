#!/usr/bin/env node

const esbuild = require('esbuild');
const path = require('path');

// Get project root directory
const projectRoot = path.resolve(__dirname, '..');

async function build() {
  try {
    // Build the CLI
    await esbuild.build({
      entryPoints: ['src/cli.ts'],
      bundle: true,
      platform: 'node',
      target: 'node16',
      outfile: 'dist/cli.js',
      external: ['fastmcp', '@watercrawl/nodejs'],
      format: 'cjs',
    });

    console.log('CLI build completed successfully');

    // Build the library
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node16',
      outfile: 'dist/index.js',
      external: ['fastmcp', '@watercrawl/nodejs'],
      format: 'cjs',
    });

    console.log('Library build completed successfully');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
