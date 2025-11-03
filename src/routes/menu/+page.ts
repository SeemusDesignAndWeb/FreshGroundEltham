import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/menu');
	const { menuItems } = await response.json();
	return { menuItems };
};

