// Utility function to get page background image
export async function getPageBackground(path, defaultImage) {
	try {
		const response = await fetch(`/api/page-backgrounds?path=${encodeURIComponent(path)}`);
		if (response.ok) {
			const data = await response.json();
			return data.background || defaultImage;
		}
	} catch (error) {
		console.error('Error loading page background:', error);
	}
	return defaultImage;
}

