import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/opening-times');
		if (response.ok) {
			const data = await response.json();
			return {
				openingTimes: data.openingTimes || null
			};
		}
	} catch (error) {
		console.error('Error loading opening times:', error);
	}
	return {
		openingTimes: null
	};
};
