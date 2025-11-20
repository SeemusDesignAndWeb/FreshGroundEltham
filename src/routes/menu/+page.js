

export const load = async ({ fetch }) => {
	try {
		const [menuResponse, backgroundResponse] = await Promise.all([
			fetch('/api/menu'),
			fetch('/api/page-backgrounds?path=/menu')
		]);
		
		let menuItems = [];
		if (menuResponse.ok) {
			const menuData = await menuResponse.json();
			menuItems = menuData.menuItems || [];
		}
		
		let backgroundImage = null;
		if (backgroundResponse.ok) {
			const backgroundData = await backgroundResponse.json();
			backgroundImage = backgroundData.background || null;
		}
		
		return {
			menuItems,
			backgroundImage
		};
	} catch (error) {
		console.error('Error loading menu data:', error);
		return {
			menuItems,
			backgroundImage: null
		};
	}
};

