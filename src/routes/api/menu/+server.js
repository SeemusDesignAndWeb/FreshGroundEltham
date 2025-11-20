import { json } from '@sveltejs/kit';

import { getMenuItems } from '$lib/server/database';

export const GET= async () => {
	const menuItems = getMenuItems();
	return json({ menuItems });
};

