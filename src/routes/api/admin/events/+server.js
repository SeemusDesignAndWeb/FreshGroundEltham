import { json } from '@sveltejs/kit';

import { 
	getEvents, 
	addEvent, 
	updateEvent, 
	removeEvent
} from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const events = getEvents();
	return json({ events });
};

export const POST= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const event= await request.json();
		addEvent(event);
		return json({ success: true, event });
	} catch (error) {
		return json({ error: 'Failed to add event' }, { status: 500 });
	}
};

export const PUT= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id, ...updatedEvent } = await request.json();
		if (!id) {
			return json({ error: 'Event ID is required' }, { status: 400 });
		}
		updateEvent(id, updatedEvent);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to update event' }, { status: 500 });
	}
};

export const DELETE= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await request.json();
		if (!id) {
			return json({ error: 'Event ID is required' }, { status: 400 });
		}
		removeEvent(id);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to delete event' }, { status: 500 });
	}
};

