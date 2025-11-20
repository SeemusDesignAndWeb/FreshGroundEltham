import { json } from '@sveltejs/kit';

import { getEvents } from '$lib/server/database';

export const GET= async () => {
	const events = getEvents();
	return json({ events });
};

