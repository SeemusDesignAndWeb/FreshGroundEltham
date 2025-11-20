import { json } from '@sveltejs/kit';

import { getTvScreenSettings } from '$lib/server/database';

export const GET= async () => {
	const settings = getTvScreenSettings();
	return json(settings);
};

