import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

function createInvalidPathHandle(): Handle {
	return async ({ event, resolve }) => {
		// Handle invalid paths that look like routes but aren't
		// These are often from security scanners, old Cloudinary paths, or misconfigured clients
		let pathname = event.url.pathname;
		
		// Decode URL-encoded paths (security scanners often use URL encoding)
		try {
			pathname = decodeURIComponent(pathname);
		} catch {
			// If decoding fails, use original pathname
		}
		
		// Check for pipe-separated paths (common security scanner pattern)
		// e.g., /config.php|/.env|settings.py or /.git|/.svn
		if (pathname.includes('|')) {
			return new Response('Not found', { status: 404 });
		}
		
		// Common invalid paths to block immediately
		// Note: .well-known paths are allowed for SSL certificate validation
		const invalidPaths = [
			'/company/',           // Old Cloudinary paths
			'/.aws/',              // AWS credentials (security)
			'/s3cmd.ini',          // S3 configuration files
			'/.env',               // Environment files (security)
			'/wp-admin',           // WordPress paths (common scan target)
			'/wp-content',         // WordPress paths
			'/.git',               // Git directories (security) - removed trailing slash to catch /.git|/.svn
			'/.svn',               // SVN directories (security)
			'/phpmyadmin',         // Common scan target
			'/adminer',            // Common scan target
			'/config.php',         // PHP config files
			'/settings.py',         // Python config files
			'/.htaccess',          // Apache config
			'/web.config'          // IIS config
		];
		
		// Check if path matches any invalid pattern
		for (const invalidPath of invalidPaths) {
			if (pathname.startsWith(invalidPath)) {
				return new Response('Not found', { status: 404 });
			}
		}
		
		// Also check for exact matches
		if (
			pathname === '/s3cmd.ini' || 
			pathname === '/.env' || 
			pathname === '/.aws/credentials' ||
			pathname === '/config.php' ||
			pathname === '/settings.py'
		) {
			return new Response('Not found', { status: 404 });
		}
		
		// Check for URL-encoded versions of common paths
		const encodedPathname = event.url.pathname;
		if (
			encodedPathname.includes('%2Eenv') ||      // .env
			encodedPathname.includes('%2F.git') ||      // /.git
			encodedPathname.includes('%2F.svn') ||      // /.svn
			encodedPathname.includes('%2F.aws') ||      // /.aws
			encodedPathname.includes('config%2Ephp') ||  // config.php
			encodedPathname.includes('settings%2Epy')    // settings.py
		) {
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

