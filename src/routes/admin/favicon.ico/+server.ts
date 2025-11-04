import { readFileSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

// Handle favicon.ico requests in admin routes
// Browsers automatically request favicon.ico relative to the current path
export const GET: RequestHandler = async () => {
	try {
		// Try to serve favicon.svg as favicon.ico
		const faviconPath = join(process.cwd(), 'static', 'favicon.svg');
		const file = readFileSync(faviconPath);
		return new Response(file, {
			headers: {
				'Content-Type': 'image/svg+xml',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	} catch (error) {
		// If favicon doesn't exist, return 404
		return new Response(null, { status: 404 });
	}
};

