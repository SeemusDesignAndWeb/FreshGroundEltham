

export const load = async ({ fetch }) => {
	try {
		const [eventsResponse, backgroundResponse] = await Promise.all([
			fetch('/api/events'),
			fetch('/api/page-backgrounds?path=/events')
		]);
		
		let events = [];
		if (eventsResponse.ok) {
			const eventsData = await eventsResponse.json();
			events = eventsData.events || [];
		}
		
		let backgroundImage = null;
		if (backgroundResponse.ok) {
			const backgroundData = await backgroundResponse.json();
			backgroundImage = backgroundData.background || null;
		}
		
		return {
			events,
			backgroundImage
		};
	} catch (error) {
		console.error('Error loading events data:', error);
		return {
			events,
			backgroundImage: null
		};
	}
};

