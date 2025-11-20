import { json } from '@sveltejs/kit';
import { getActiveAnnouncements } from '$lib/server/database';

export const GET = async () => {
	try {
		const announcements = getActiveAnnouncements();
		// Return only the first active announcement (highest priority)
		// If multiple are active, return the most recently created one
		const activeAnnouncement = announcements.length > 0 ? announcements[announcements.length - 1] : null;
		return json({ announcement: activeAnnouncement });
	} catch (error) {
		console.error('Error fetching announcements:', error);
		return json({ error: 'Failed to fetch announcements' }, { status: 500 });
	}
};

