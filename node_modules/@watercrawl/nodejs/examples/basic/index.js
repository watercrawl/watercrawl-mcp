import { config } from 'dotenv';
import { WaterCrawlAPIClient } from '../../dist/index.js';

// Load environment variables
config();

const api = new WaterCrawlAPIClient(process.env.WATERCRAWL_API_KEY);

// Example 1: Simple synchronous crawl
async function simpleCrawl() {
    console.log('\nExample 1: Simple synchronous crawl');
    try {
        const pageOptions = {
            wait_time: 1000,
            only_main_content: true,
            include_html: true,
            include_links: true,
            actions: [
                { type: 'screenshot' },
                { type: 'pdf' }
            ]
        };

        const result = await api.scrapeUrl('https://watercrawl.dev', pageOptions);
        if ('result' in result) {
            console.log('Crawl result:', {
                title: result.title,
                url: result.url,
                attachments: result.attachments.map(a => a.filename)
            });
        } else {
            console.log('Crawl request created:', result.uuid);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example 2: Asynchronous crawl with monitoring
async function monitoredCrawl() {
    console.log('\nExample 2: Asynchronous crawl with monitoring');
    try {
        const options = {
            spider_options: {
                max_depth: 1,
                page_limit: 5,
                allowed_domains: ['watercrawl.dev'],
                include_paths: ['/docs/*']
            },
            page_options: {
                wait_time: 1000,
                include_html: true,
                include_links: true,
                locale: 'en-US',
                actions: [{ type: 'screenshot' }]
            }
        };

        const request = await api.createCrawlRequest('https://watercrawl.dev', options);
        console.log('Started crawl:', request.uuid);

        for await (const event of api.monitorCrawlRequest(request.uuid)) {
            if (event.type === 'state') {
                const { status, number_of_documents: docs, duration } = event.data;
                console.log(`Status: ${status.toUpperCase()}, Documents: ${docs}${duration ? `, Duration: ${duration}` : ''}`);
            } else if (event.type === 'result') {
                console.log('New result:', {
                    url: event.data.url,
                    attachments: event.data.attachments.map(a => a.filename)
                });
                // Download and display the result data
                try {
                    const resultData = await api.downloadResult(event.data);
                    console.log('Result data:', resultData);
                } catch (error) {
                    console.error('Error downloading result:', error.message);
                }
            } else if (event.type === 'error') {
                console.error('Error event:', event.data);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example 3: List and manage crawls
async function manageCrawls() {
    console.log('\nExample 3: List and manage crawls');
    try {
        // List crawls
        const { results } = await api.getCrawlRequestsList();
        console.log('Recent crawls:', results.map(r => ({
            uuid: r.uuid,
            status: r.status,
            url: r.url,
            docs: r.number_of_documents,
            duration: r.duration
        })));

        // Create a new crawl with advanced options
        const request = await api.createCrawlRequest('https://watercrawl.dev', {
            spider_options: {
                max_depth: 2,
                allowed_domains: ['watercrawl.dev'],
                exclude_paths: ['/login/*']
            },
            page_options: {
                wait_time: 1000,
                only_main_content: true,
                include_html: true,
                actions: [{ type: 'screenshot' }]
            }
        });
        console.log('Created crawl:', {
            uuid: request.uuid,
            status: request.status,
            url: request.url
        });

        // Stop the crawl
        await api.stopCrawlRequest(request.uuid);
        console.log('Stopped crawl:', request.uuid);

        // Get results if any
        const { results: crawlResults } = await api.getCrawlRequestResults(request.uuid);
        if (crawlResults.length > 0) {
            console.log('Results:', crawlResults.map(r => ({
                title: r.title,
                url: r.url,
                attachments: r.attachments.map(a => a.filename)
            })));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Example 4: Search functionality
async function searchExample() {
    console.log('\nExample 4: Search functionality');
    try {
        // List search requests
        const searchRequests = await api.getSearchRequestsList();
        console.log('Recent search requests:', searchRequests.results.map(r => ({
            uuid: r.uuid,
            status: r.status,
            query: r.query
        })));

        // Create an asynchronous search request and then monitor it
        console.log('\nCreating asynchronous search request...');
        const asyncSearch = await api.createSearchRequest(
            'javascript frameworks',
            {
                language: 'en',
                country: 'us',
                time_range: 'any',
                search_type: 'web',
                depth: 'basic'
            },
            3, // limit results
            false, // don't wait for results
            false // don't download results
        );
        console.log('Search request created:', asyncSearch.uuid);

        // Monitor search progress
        console.log('\nMonitoring search progress...');
        let count = 0;
        for await (const event of api.monitorSearchRequest(asyncSearch.uuid)) {
            console.log('Search event:', {
                type: event.type,
                status: event.data.status
            });
            count++;
            if (count >= 3 || event.data.status === 'finished') break;
        }

        // Get search request details
        const searchDetails = await api.getSearchRequest(asyncSearch.uuid);
        console.log('Search request details:', {
            uuid: searchDetails.uuid,
            query: searchDetails.query,
            status: searchDetails.status
        });

        // Try to stop the search request if it's still running
        try {
            if (searchDetails.status === 'running') {
                await api.stopSearchRequest(asyncSearch.uuid);
                console.log('Stopped search request:', asyncSearch.uuid);
            }
        } catch (error) {
            console.log('Note: Could not stop search - it might have already finished');
        }
    } catch (error) {
        console.error('Error in search example:', error.message);
    }
}

// Example 5: Sitemap functionality
async function sitemapExample() {
    console.log('\nExample 5: Sitemap functionality');
    try {
        // Find a crawl request with a sitemap
        const { results } = await api.getCrawlRequestsList();
        let crawlWithSitemap = null;

        for (const item of results) {
            try {
                const crawl = await api.getCrawlRequest(item.uuid);
                if (crawl.sitemap) {
                    crawlWithSitemap = crawl;
                    console.log('Found crawl with sitemap:', {
                        uuid: crawl.uuid,
                        url: crawl.url
                    });
                    break;
                }
            } catch (error) {
                console.log(`Error checking crawl request ${item.uuid}:`, error.message);
            }
        }

        if (crawlWithSitemap) {
            // Download sitemap
            console.log('\nDownloading sitemap...');
            const sitemap = await api.downloadSitemap(crawlWithSitemap.uuid);
            console.log('Sitemap structure (first 3 nodes):', sitemap.slice(0, 3).map(node => ({
                url: node.url,
                title: node.title
            })));

            // Download sitemap as graph
            try {
                console.log('\nDownloading sitemap graph...');
                const graph = await api.downloadSitemapGraph(crawlWithSitemap.uuid);
                console.log('Graph structure:', {
                    nodes: graph.nodes?.length || 0,
                    edges: graph.edges?.length || 0
                });
            } catch (error) {
                console.log('Sitemap graph endpoint might not be supported yet:', error.message);
            }

            // Download sitemap as markdown
            try {
                console.log('\nDownloading sitemap markdown...');
                const markdown = await api.downloadSitemapMarkdown(crawlWithSitemap.uuid);
                console.log('Markdown preview:', markdown.substring(0, 200) + '...');
            } catch (error) {
                console.log('Sitemap markdown endpoint might not be supported yet:', error.message);
            }
        } else {
            console.log('No crawl with sitemap found. Creating a new crawl request...');
            const request = await api.createCrawlRequest('https://watercrawl.dev', {
                spider_options: {
                    max_depth: 2,
                    page_limit: 10
                }
            });
            console.log('Created new crawl request. You can check for sitemap after it completes:', request.uuid);
        }
    } catch (error) {
        console.error('Error in sitemap example:', error.message);
    }
}

// Run all examples
async function main() {
    console.log('Running WaterCrawl examples...');
    
    // Uncomment the examples you want to run
    // await simpleCrawl();
    // await monitoredCrawl();
    // await manageCrawls();
    // await searchExample();
    await sitemapExample();
    
    console.log('\nAll examples completed!');
}

main().catch(console.error);
