import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTestimonials } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const testimonials = getTestimonials();
	return json({ testimonials });
};

