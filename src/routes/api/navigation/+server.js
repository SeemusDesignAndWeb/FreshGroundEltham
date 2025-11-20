import { json } from '@sveltejs/kit';

import { getNavigationSettings } from '$lib/server/database';

export const GET= async () => {
	const settings = getNavigationSettings();
	return json(settings);
};

