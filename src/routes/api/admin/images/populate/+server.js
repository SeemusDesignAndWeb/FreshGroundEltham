import { json } from '@sveltejs/kit';

import { populateImagesFromActivities, populateImagesFromOpeningTimes } from '$lib/server/database';

export const POST= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const activitiesResult = populateImagesFromActivities();
		const openingTimesResult = populateImagesFromOpeningTimes();
		
		const totalAdded = activitiesResult.added + openingTimesResult.added;
		const totalSkipped = activitiesResult.skipped + openingTimesResult.skipped;
		
		return json({ 
			success, 
			added,
			skipped,
			message: `Added ${totalAdded} image(s) to the library. ${totalSkipped} image(s) already existed.`
		});
	} catch (error) {
		console.error('Error populating images:', error);
		return json({ error: 'Failed to populate images' }, { status: 500 });
	}
};

