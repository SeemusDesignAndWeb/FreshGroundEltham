import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNavigationSettings, updateNavigationSettings } from '$lib/server/database';
import { checkAdminAuth } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	if (!checkAdminAuth(cookies)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	const settings = getNavigationSettings();
	return json(settings);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!checkAdminAuth(cookies)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	
	try {
		const settings = await request.json();
		updateNavigationSettings(settings);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};

