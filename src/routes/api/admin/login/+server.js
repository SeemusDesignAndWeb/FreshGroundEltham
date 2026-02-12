import { json } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

export const POST = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const { password } = body;
		
		if (!password) {
			return json({ 
				success: false, 
				message: 'Password is required' 
			}, { status: 400 });
		}
		
		// Try to get the admin password from environment
		const adminPassword = env.ADMIN_PASSWORD;
		
		if (!adminPassword) {
			console.error('ADMIN_PASSWORD environment variable is not set');
			return json({ 
				success: false, 
				message: 'Admin password not configured. Please set ADMIN_PASSWORD in your .env file.' 
			}, { status: 500 });
		}

		if (password === adminPassword) {
			// Set a session cookie (expires in 24 hours)
			// Use sameSite: 'lax' for better compatibility with redirects after login
			cookies.set('admin_session', 'authenticated', {
				path: '/',
				maxAge: 60 * 60 * 24, // 24 hours
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production'
			});

			return json({ 
				success: true, 
				message: 'Login successful' 
			});
		} else {
			return json({ 
				success: false, 
				message: 'Invalid password' 
			}, { status: 401 });
		}
	} catch (error) {
		console.error('Login error:', error);
		const errorMessage = error instanceof Error ? error.message : 'An error occurred';
		return json({ 
			success: false, 
			message: `Error: ${errorMessage}` 
		}, { status: 500 });
	}
};

