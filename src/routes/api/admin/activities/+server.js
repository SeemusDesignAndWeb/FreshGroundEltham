import { json } from '@sveltejs/kit';

import { 
	getActivities, 
	addActivity, 
	updateActivity, 
	removeActivity,
	getActivitiesSettings,
	updateActivitiesSettings
} from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const activities = getActivities();
	const settings = getActivitiesSettings();
	return json({ activities, settings });
};

export const POST= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const activity= await request.json();
		addActivity(activity);
		return json({ success: true, activity });
	} catch (error) {
		return json({ error: 'Failed to add activity' }, { status: 500 });
	}
};

export const PUT= async ({ request, cookies }) => {
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

export const DELETE= async ({ request, cookies }) => {
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

export const PATCH= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const settings = await request.json();
		updateActivitiesSettings(settings);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to update settings' }, { status: 500 });
	}
};

