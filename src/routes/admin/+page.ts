import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Dashboard doesn't need to load data - it fetches in the component
	return {};
};
