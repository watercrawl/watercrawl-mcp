// Node.js 16 polyfills for modern web APIs
// This file should be required before any other code runs

// Polyfill for ReadableStream
if (typeof globalThis.ReadableStream === 'undefined') {
  const { Readable } = require('stream');
  
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

// Other polyfills can be added as needed

// Export to ensure this file is properly loaded as a module
module.exports = {};
