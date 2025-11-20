import { json } from '@sveltejs/kit';

import { 
	getMenuCategorySettings,
	updateMenuCategorySettings,
	renameMenuCategory
} from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const settings = getMenuCategorySettings();
	return json({ settings });
};

export const PUT= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const data = await request.json();
		
		if (data.rename) {
			// Rename category
			const { oldName, newName } = data.rename;
			if (!oldName || !newName) {
				return json({ error: 'Old name and new name are required' }, { status: 400 });
			}
			renameMenuCategory(oldName, newName);
			return json({ success: true });
		} else if (data.settings) {
			// Update category settings (order)
			const settings= data.settings;
			updateMenuCategorySettings(settings);
			return json({ success: true });
		} else {
			return json({ error: 'Invalid request' }, { status: 400 });
		}
	} catch (error) {
		return json({ error: 'Failed to update categories' }, { status: 500 });
	}
};

