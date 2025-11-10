import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const [openingTimesResponse, backgroundResponse] = await Promise.all([
			fetch('/api/opening-times'),
			fetch('/api/page-backgrounds?path=/opening-times')
		]);
		
		let openingTimes = null;
		if (openingTimesResponse.ok) {
			const data = await openingTimesResponse.json();
			openingTimes = data.openingTimes || null;
		}
		
		// Check page backgrounds first, fall back to openingTimes.backgroundImage
		let backgroundImage = null;
		if (backgroundResponse.ok) {
			const backgroundData = await backgroundResponse.json();
			backgroundImage = backgroundData.background || null;
		}
		
		// If no page background is set, use openingTimes.backgroundImage as fallback
		if (!backgroundImage && openingTimes?.backgroundImage) {
			backgroundImage = openingTimes.backgroundImage;
		}
		
		return {
			openingTimes,
			backgroundImage
		};
	} catch (error) {
		console.error('Error loading opening times:', error);
	}
	return {
		openingTimes: null,
		backgroundImage: null
	};
};
