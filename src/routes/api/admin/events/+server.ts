import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { 
	getEvents, 
	addEvent, 
	updateEvent, 
	removeEvent
} from '$lib/server/database';
import type { Event } from '$lib/server/database';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const events = getEvents();
	return json({ events });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const event: Event = await request.json();
		addEvent(event);
		return json({ success: true, event });
	} catch (error) {
		return json({ error: 'Failed to add event' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
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

export const DELETE: RequestHandler = async ({ request, cookies }) => {
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

