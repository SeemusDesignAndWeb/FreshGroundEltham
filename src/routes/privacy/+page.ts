import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/page-backgrounds?path=/privacy');
		if (response.ok) {
			const data = await response.json();
			return {
				backgroundImage: data.background || null
			};
		}
	} catch (error) {
		console.error('Error loading background:', error);
	}
	return {
		backgroundImage: null
	};
};

