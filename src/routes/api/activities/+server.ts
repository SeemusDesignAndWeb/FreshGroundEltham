import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getActivities } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const activities = getActivities();
	return json({ activities });
};

