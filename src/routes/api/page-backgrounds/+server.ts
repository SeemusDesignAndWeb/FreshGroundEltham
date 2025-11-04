import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPageBackgroundImages, getPageBackgroundImage } from '$lib/server/database';

export const GET: RequestHandler = async ({ url }) => {
	const path = url.searchParams.get('path');
	
	if (path) {
		// Get background for specific page
		const background = getPageBackgroundImage(path);
		return json({ background });
	}
	
	// Get all backgrounds
	const backgrounds = getPageBackgroundImages();
	return json({ backgrounds });
};

