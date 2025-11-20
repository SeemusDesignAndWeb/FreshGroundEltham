import { json } from '@sveltejs/kit';

import { getBannerSettings, updateBannerSettings } from '$lib/server/database';

export const GET= async () => {
	const settings = getBannerSettings();
	return json(settings);
};

export const PATCH= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const settings = await request.json();
		updateBannerSettings(settings);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to update banner settings' }, { status: 500 });
	}
};

