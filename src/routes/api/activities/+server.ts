import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getActivities, getActivitiesSettings } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const activities = getActivities();
	const settings = getActivitiesSettings();
	return json({ activities, settings });
};

