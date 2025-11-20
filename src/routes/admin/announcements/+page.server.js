import { getAnnouncements } from '$lib/server/database';

export const load = async ({ cookies }) => {
	// Check authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		return {
			announcements: []
		};
	}

	try {
		const announcements = getAnnouncements();
		return {
			announcements
		};
	} catch (error) {
		console.error('Error loading announcements:', error);
		return {
			announcements: []
		};
	}
};

