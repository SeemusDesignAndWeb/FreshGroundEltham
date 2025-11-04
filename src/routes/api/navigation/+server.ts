import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNavigationSettings } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const settings = getNavigationSettings();
	return json(settings);
};

