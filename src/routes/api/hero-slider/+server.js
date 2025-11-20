import { json } from '@sveltejs/kit';

import { getHeroSliderSettings } from '$lib/server/database';

export const GET= async () => {
	const settings = getHeroSliderSettings();
	return json(settings);
};

