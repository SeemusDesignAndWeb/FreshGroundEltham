

export const load = async ({ fetch }) => {
	try {
		const [activitiesResponse, backgroundResponse] = await Promise.all([
			fetch('/api/activities'),
			fetch('/api/page-backgrounds?path=/activities')
		]);
		
		let activities = [];
		let settings = { hidden: false, message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!' };
		if (activitiesResponse.ok) {
			const activitiesData = await activitiesResponse.json();
			activities = activitiesData.activities || [];
			settings = activitiesData.settings || settings;
		}
		
		let backgroundImage = null;
		if (backgroundResponse.ok) {
			const backgroundData = await backgroundResponse.json();
			backgroundImage = backgroundData.background || null;
		}
		
		return {
			activities,
			settings,
			backgroundImage
		};
	} catch (error) {
		console.error('Error loading activities data:', error);
		return {
			activities: [],
			settings: { hidden: false, message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!' },
			backgroundImage: null
		};
	}
};
