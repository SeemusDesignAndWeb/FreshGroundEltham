import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getOpeningTimes } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const openingTimes = getOpeningTimes();
	return json({ openingTimes });
};

