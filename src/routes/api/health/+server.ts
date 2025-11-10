import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json({ 
		status: 'ok', 
		timestamp: new Date().toISOString(),
		service: 'fresh-ground-eltham'
	}, { 
		status: 200 
	});
};

