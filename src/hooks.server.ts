import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { error } from '@sveltejs/kit';

function createImagePathHandle(): Handle {
	return async ({ event, resolve }) => {
		// Handle invalid image paths that look like routes but aren't
		// These are often old Cloudinary paths or malformed image URLs
		const pathname = event.url.pathname;
		
		// Return 404 immediately for paths that start with /company/ (old Cloudinary paths)
		if (pathname.startsWith('/company/')) {
			return error(404, 'Not found');
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

export const handle: Handle = sequence(createImagePathHandle(), createAuthHandle());

