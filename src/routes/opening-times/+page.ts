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
		
		// Only use page backgrounds, no fallback to openingTimes.backgroundImage
		let backgroundImage = null;
		if (backgroundResponse.ok) {
			const backgroundData = await backgroundResponse.json();
			backgroundImage = backgroundData.background || null;
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
