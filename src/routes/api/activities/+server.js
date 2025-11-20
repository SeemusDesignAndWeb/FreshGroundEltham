import { json } from '@sveltejs/kit';

import { getActivities, getActivitiesSettings } from '$lib/server/database';

export const GET= async () => {
	const activities = getActivities();
	const settings = getActivitiesSettings();
	return json({ activities, settings });
};

