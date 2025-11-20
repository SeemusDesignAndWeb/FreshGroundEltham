import { json } from '@sveltejs/kit';

import { 
	getMenuItems, 
	addMenuItem, 
	updateMenuItem, 
	removeMenuItem 
} from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const menuItems = getMenuItems();
	return json({ menuItems });
};

export const POST= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const menuItem= await request.json();
		addMenuItem(menuItem);
		return json({ success: true, menuItem });
	} catch (error) {
		return json({ error: 'Failed to add menu item' }, { status: 500 });
	}
};

export const PUT= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id, ...updatedMenuItem } = await request.json();
		if (!id) {
			return json({ error: 'Menu item ID is required' }, { status: 400 });
		}
		updateMenuItem(id, updatedMenuItem);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to update menu item' }, { status: 500 });
	}
};

export const DELETE= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await request.json();
		if (!id) {
			return json({ error: 'Menu item ID is required' }, { status: 400 });
		}
		removeMenuItem(id);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to delete menu item' }, { status: 500 });
	}
};

