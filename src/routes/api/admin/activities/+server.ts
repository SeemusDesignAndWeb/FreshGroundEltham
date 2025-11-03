import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { 
	getActivities, 
	addActivity, 
	updateActivity, 
	removeActivity 
} from '$lib/server/database';
import type { Activity } from '$lib/stores/cart';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const activities = getActivities();
	return json({ activities });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const activity: Activity = await request.json();
		addActivity(activity);
		return json({ success: true, activity });
	} catch (error) {
		return json({ error: 'Failed to add activity' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id, ...updatedActivity } = await request.json();
		if (!id) {
			return json({ error: 'Activity ID is required' }, { status: 400 });
		}
		updateActivity(id, updatedActivity);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to update activity' }, { status: 500 });
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
			return json({ error: 'Activity ID is required' }, { status: 400 });
		}
		removeActivity(id);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to delete activity' }, { status: 500 });
	}
};

