

export const load = async ({ fetch }) => {
	try {
		const response = await fetch('/api/page-backgrounds?path=/about');
		if (response.ok) {
			const data = await response.json();
			return {
				backgroundImage: data.background || null
			};
		}
	} catch (error) {
		console.error('Error loading background:', error);
	}
	return {
		backgroundImage: null
	};
};
