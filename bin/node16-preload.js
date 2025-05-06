// Node.js 16 polyfills for modern web APIs
// This file is loaded before anything else to ensure compatibility with Node.js 16

// Make the file work with ESM
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Polyfill for DOMException
if (typeof globalThis.DOMException === 'undefined') {
  globalThis.DOMException = class DOMException extends Error {
    constructor(message, name) {
      super(message);
      this.name = name || 'Error';
      this.code = 0;
      
      // Common DOMException codes
      if (name === 'AbortError') this.code = 20;
      if (name === 'InvalidStateError') this.code = 11;
      if (name === 'NetworkError') this.code = 19;
      if (name === 'NotFoundError') this.code = 8;
      if (name === 'NotSupportedError') this.code = 9;
      if (name === 'SecurityError') this.code = 18;
      if (name === 'SyntaxError') this.code = 12;
      if (name === 'TypeMismatchError') this.code = 17;
    }
  };
}

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

// Polyfill for Blob
if (typeof globalThis.Blob === 'undefined') {
  const { Buffer } = require('buffer');
  
  globalThis.Blob = class Blob {
    constructor(array, options = {}) {
      this.parts = array;
      this.type = options.type || '';
      
      // Calculate size
      this.size = array.reduce((acc, part) => {
        const buf = part instanceof Buffer ? part : Buffer.from(String(part));
        return acc + buf.length;
      }, 0);
    }
    
    // Basic implementation of slice
    slice(start, end, contentType) {
      // For simplicity, we're not implementing the full logic
      return new Blob([], { type: contentType || this.type });
    }
    
    // Add other methods as needed
    async text() {
      const buffers = [];
      for (const part of this.parts) {
        const buf = part instanceof Buffer ? part : Buffer.from(String(part));
        buffers.push(buf);
      }
      return Buffer.concat(buffers).toString('utf-8');
    }
    
    async arrayBuffer() {
      const buffers = [];
      for (const part of this.parts) {
        const buf = part instanceof Buffer ? part : Buffer.from(String(part));
        buffers.push(buf);
      }
      return Buffer.concat(buffers).buffer;
    }
  };
}

// Add additional web API polyfills that undici might need
if (typeof globalThis.WritableStream === 'undefined') {
  const { Writable } = require('stream');
  
  globalThis.WritableStream = class WritableStream {
    constructor(underlyingSink = {}) {
      this._writable = new Writable({
        write: (chunk, encoding, callback) => {
          if (underlyingSink.write) {
            Promise.resolve(underlyingSink.write(chunk))
              .then(() => callback(), callback);
          } else {
            callback();
          }
        }
      });
      
      if (underlyingSink.start) {
        underlyingSink.start(this);
      }
    }
    
    getWriter() {
      return {
        write: async (chunk) => {
          return new Promise((resolve, reject) => {
            this._writable.write(chunk, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        },
        close: async () => {
          return new Promise((resolve) => {
            this._writable.end(() => resolve());
          });
        },
        releaseLock: () => {}
      };
    }
  };
}

// More web polyfills
if (typeof globalThis.FormData === 'undefined') {
  globalThis.FormData = class FormData {
    constructor() {
      this._data = new Map();
    }
    
    append(name, value, filename) {
      this._data.set(name, { value, filename });
    }
    
    delete(name) {
      this._data.delete(name);
    }
    
    get(name) {
      return this._data.get(name)?.value;
    }
    
    has(name) {
      return this._data.has(name);
    }
    
    set(name, value, filename) {
      this.append(name, value, filename);
    }
  };
}

// Export to ensure this file is properly loaded as a module
export default {};
