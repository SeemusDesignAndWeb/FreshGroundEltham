import { json } from '@sveltejs/kit';

import { getActivities, getActivitiesSettings } from '$lib/server/database';

export const GET= async () => {
	const activities = getActivities();
	const settings = getActivitiesSettings();
	// Sort by date then time (chronological order)
	const sorted = [...activities].sort((a, b) => {
		const dateCompare = (a.date || '').localeCompare(b.date || '');
		if (dateCompare !== 0) return dateCompare;
		return (a.time || '').localeCompare(b.time || '');
	});
	return json({ activities: sorted, settings });
};

