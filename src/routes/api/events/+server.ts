import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvents } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const events = getEvents();
	return json({ events });
};

