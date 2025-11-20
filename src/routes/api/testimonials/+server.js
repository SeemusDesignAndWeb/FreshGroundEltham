import { json } from '@sveltejs/kit';

import { getTestimonials } from '$lib/server/database';

export const GET= async () => {
	const testimonials = getTestimonials();
	return json({ testimonials });
};

