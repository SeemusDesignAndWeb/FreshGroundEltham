import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTvScreenSettings } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const settings = getTvScreenSettings();
	return json(settings);
};

