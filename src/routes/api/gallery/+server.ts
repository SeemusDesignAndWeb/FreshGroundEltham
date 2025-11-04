import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGallerySettings } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const settings = getGallerySettings();
	return json(settings);
};

