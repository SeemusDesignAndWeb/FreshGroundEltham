import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Simple health check - no database calls, no dependencies
export const GET: RequestHandler = async () => {
	console.log('[HEALTH] Health check endpoint called at', new Date().toISOString());
	// Return immediately without any processing
	return new Response(JSON.stringify({ 
		status: 'ok',
		timestamp: new Date().toISOString()
	}), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};

