import { json } from '@sveltejs/kit';
import { getBookings } from '$lib/server/database';

// Get all bookings (admin only)
export const GET = async ({ cookies }) => {
	// Check authentication
	const adminSession = cookies.get('admin_session');
	if (!adminSession) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const bookings = getBookings();
		// Sort by most recent first
		const sortedBookings = [...bookings].sort((a, b) => {
			const dateA = new Date(a.paidAt || a.createdAt || 0);
			const dateB = new Date(b.paidAt || b.createdAt || 0);
			return dateB.getTime() - dateA.getTime();
		});
		return json({ bookings: sortedBookings });
	} catch (error) {
		console.error('Error fetching bookings:', error);
		return json({ error: 'Failed to fetch bookings' }, { status: 500 });
	}
};
