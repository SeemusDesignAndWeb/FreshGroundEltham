import { json } from '@sveltejs/kit';
import { 
	getAnnouncements, 
	addAnnouncement, 
	updateAnnouncement, 
	removeAnnouncement 
} from '$lib/server/database';

// Get all announcements (admin - includes inactive ones)
export const GET = async ({ cookies }) => {
	// Check authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const announcements = getAnnouncements();
		return json({ announcements });
	} catch (error) {
		console.error('Error fetching announcements:', error);
		return json({ error: 'Failed to fetch announcements' }, { status: 500 });
	}
};

// Create or update announcements
export const POST = async ({ request, cookies }) => {
	// Check authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { action, announcement } = await request.json();

		if (action === 'create') {
			// Generate a unique ID for the new announcement
			const newAnnouncement = {
				...announcement,
				id: Date.now().toString()
			};
			addAnnouncement(newAnnouncement);
			return json({ success: true, announcement: newAnnouncement });
		} 
		
		if (action === 'update') {
			updateAnnouncement(announcement.id, announcement);
			return json({ success: true });
		}
		
		if (action === 'delete') {
			removeAnnouncement(announcement.id);
			return json({ success: true });
		}

		return json({ error: 'Invalid action' }, { status: 400 });
	} catch (error) {
		console.error('Error managing announcements:', error);
		return json({ error: 'Failed to process request' }, { status: 500 });
	}
};

