import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Cookies } from '@sveltejs/kit';

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

export const handle: Handle = sequence(createAuthHandle());

