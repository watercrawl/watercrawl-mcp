# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-05-03

### Fixed
- Improved async streaming implementation for more reliable event handling
- Fixed search event monitoring to correctly process event status
- Refactored stream processing for better error handling and resource management
- Removed debug console.log statements from tests

## [1.1.0] - 2025-04-30

### Added
- Sitemap API support with download functionality
- Sitemap visualization endpoints (graph and markdown formats)
- Search functionality with query, monitoring, and result handling
- Tests for new sitemap and search API features

### Changed
- Simplified documentation with clearer examples
- Updated LICENSE copyright to WaterCrawl-NodeJS

## [1.0.0] - 2025-01-19

### Added
- Initial release of the WaterCrawl Node.js client
- Full API coverage for WaterCrawl endpoints
- TypeScript support with complete type definitions
- Synchronous and asynchronous crawling capabilities
- Real-time crawl monitoring with event streaming
- Automatic result downloading and processing
- Promise-based API with async/await support
- Comprehensive error handling
- ESLint and Prettier configuration
- Continuous Integration with GitHub Actions
- Automated npm publishing with version tags
- Examples for basic usage
- Complete documentation in README.md
- MIT License file

### Dependencies
- axios ^1.6.5
- eventsource-parser ^1.1.1
- url-join ^5.0.0
