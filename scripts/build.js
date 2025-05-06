#!/usr/bin/env node

import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

// Get project root directory using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
      format: 'esm',
      banner: {
        js: `
          // ESM shim for CommonJS modules with dynamic requires
          import { createRequire } from 'module';
          const require = createRequire(import.meta.url);
          
          // Polyfill for ReadableStream in Node.js 16
          if (typeof globalThis.ReadableStream === 'undefined') {
            const { Readable } = require('stream');
            
            // Simple polyfill for ReadableStream
            globalThis.ReadableStream = class ReadableStream {
              constructor(underlyingSource = {}) {
                this._readable = new Readable({ 
                  read: underlyingSource.pull, 
                  objectMode: true 
                });
                
                if (underlyingSource.start) {
                  underlyingSource.start(this);
                }
              }
              
              getReader() {
                return {
                  read: async () => {
                    return new Promise((resolve) => {
                      this._readable.once('data', (chunk) => {
                        resolve({ value: chunk, done: false });
                      });
                      this._readable.once('end', () => {
                        resolve({ value: undefined, done: true });
                      });
                    });
                  },
                  releaseLock: () => {}
                };
              }
            };
          }
        `,
      },
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
      format: 'esm',
      banner: {
        js: `
          // ESM shim for CommonJS modules with dynamic requires
          import { createRequire } from 'module';
          const require = createRequire(import.meta.url);
          
          // Polyfill for ReadableStream in Node.js 16
          if (typeof globalThis.ReadableStream === 'undefined') {
            const { Readable } = require('stream');
            
            // Simple polyfill for ReadableStream
            globalThis.ReadableStream = class ReadableStream {
              constructor(underlyingSource = {}) {
                this._readable = new Readable({ 
                  read: underlyingSource.pull, 
                  objectMode: true 
                });
                
                if (underlyingSource.start) {
                  underlyingSource.start(this);
                }
              }
              
              getReader() {
                return {
                  read: async () => {
                    return new Promise((resolve) => {
                      this._readable.once('data', (chunk) => {
                        resolve({ value: chunk, done: false });
                      });
                      this._readable.once('end', () => {
                        resolve({ value: undefined, done: true });
                      });
                    });
                  },
                  releaseLock: () => {}
                };
              }
            };
          }
        `,
      },
    });

    console.log('Library build completed successfully');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
