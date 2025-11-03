import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMenuItems } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const menuItems = getMenuItems();
	return json({ menuItems });
};

