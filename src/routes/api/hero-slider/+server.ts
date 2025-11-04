import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getHeroSliderSettings } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const settings = getHeroSliderSettings();
	return json(settings);
};

