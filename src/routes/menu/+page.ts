import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/menu');
		if (response.ok) {
			const { menuItems } = await response.json();
			return { menuItems: menuItems || [] };
		}
	} catch (error) {
		console.error('Error loading menu in page load:', error);
	}
	return { menuItems: [] };
};

