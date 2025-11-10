import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/admin/special-offers');
		if (response.ok) {
			const data = await response.json();
			return {
				offers: data.offers || []
			};
		}
	} catch (error) {
		console.error('Error loading special offers:', error);
	}

	return {
		offers: []
	};
};

