import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/activities');
		if (response.ok) {
			const data = await response.json();
			return {
				activities: data.activities || []
			};
		}
	} catch (error) {
		console.error('Error loading activities:', error);
	}

	return {
		activities: []
	};
};
