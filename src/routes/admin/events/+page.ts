import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/admin/events');
		if (response.ok) {
			const data = await response.json();
			return {
				events: data.events || []
			};
		}
	} catch (error) {
		console.error('Error loading events:', error);
	}

	return {
		events: []
	};
};

