import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

function createInvalidPathHandle(): Handle {
	return async ({ event, resolve }) => {
		// Handle invalid paths that look like routes but aren't
		// These are often from security scanners, old Cloudinary paths, or misconfigured clients
		const pathname = event.url.pathname;
		
		// Common invalid paths to block immediately
		// Note: .well-known paths are allowed for SSL certificate validation
		const invalidPaths = [
			'/company/',           // Old Cloudinary paths
			'/.aws/',              // AWS credentials (security)
			'/s3cmd.ini',          // S3 configuration files
			'/.env',               // Environment files (security)
			'/wp-admin',           // WordPress paths (common scan target)
			'/wp-content',         // WordPress paths
			'/.git/',              // Git directories (security)
			'/phpmyadmin',         // Common scan target
			'/adminer'             // Common scan target
		];
		
		// Check if path matches any invalid pattern
		for (const invalidPath of invalidPaths) {
			if (pathname.startsWith(invalidPath)) {
				return new Response('Not found', { status: 404 });
			}
		}
		
		// Also check for exact matches
		if (pathname === '/s3cmd.ini' || pathname === '/.env' || pathname === '/.aws/credentials') {
			return new Response('Not found', { status: 404 });
		}

		return resolve(event);
	};
}

function createAuthHandle(): Handle {
	return async ({ event, resolve }) => {
		// Check if route is protected
		if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login') {
			const isAuthenticated = event.cookies.get('admin_session');
			if (!isAuthenticated) {
				return Response.redirect(`${event.url.origin}/admin/login`, 302);
			}
		}

		return resolve(event);
	};
}

export const handle: Handle = sequence(createInvalidPathHandle(), createAuthHandle());

