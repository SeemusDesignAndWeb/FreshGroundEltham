import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/api/admin/activities');
		if (response.ok) {
			const data = await response.json();
			return {
				activities: data.activities || [],
				settings: data.settings || { hidden: false, message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!' }
			};
		}
	} catch (error) {
		console.error('Error loading activities:', error);
	}

	return {
		activities: [],
		settings: { hidden: false, message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!' }
	};
};

