import { json } from '@sveltejs/kit';

import { getGallerySettings } from '$lib/server/database';

export const GET= async () => {
	const settings = getGallerySettings();
	return json(settings);
};

