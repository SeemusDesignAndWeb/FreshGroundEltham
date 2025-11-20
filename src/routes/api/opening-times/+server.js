import { json } from '@sveltejs/kit';

import { getOpeningTimes } from '$lib/server/database';

export const GET= async () => {
	const openingTimes = getOpeningTimes();
	return json({ openingTimes });
};

