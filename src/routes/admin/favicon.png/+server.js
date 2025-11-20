import { readFileSync } from 'fs';
import { join } from 'path';

// Handle favicon requests in admin routes
// Browsers automatically request favicon.png relative to the current path
export const GET = async () => {
  try {
		const faviconPath = join(process.cwd(), 'static', 'favicon.png');
		const file = readFileSync(faviconPath);
		return new Response(file, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 'public, max-age = 31536000, immutable'
			}
		});
	} catch (error) {
		// If favicon.png doesn't exist, return 404
		return new Response(null, { status: 404 });
	}
};

