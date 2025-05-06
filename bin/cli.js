#!/usr/bin/env node

// Load Node.js 16 polyfills before anything else
import './node16-preload.js';

// Then import the main application
import('../dist/cli.js');
