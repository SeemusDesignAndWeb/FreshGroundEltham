import { json } from '@sveltejs/kit';

import { 
	getTestimonials, 
	addTestimonial, 
	updateTestimonial, 
	removeTestimonial 
} from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const testimonials = getTestimonials();
	return json({ testimonials });
};

export const POST= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const testimonial= await request.json();
		addTestimonial(testimonial);
		return json({ success: true, testimonial });
	} catch (error) {
		return json({ error: 'Failed to add testimonial' }, { status: 500 });
	}
};

export const PUT= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id, ...updatedTestimonial } = await request.json();
		if (!id) {
			return json({ error: 'Testimonial ID is required' }, { status: 400 });
		}
		updateTestimonial(id, updatedTestimonial);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to update testimonial' }, { status: 500 });
	}
};

export const DELETE= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await request.json();
		if (!id) {
			return json({ error: 'Testimonial ID is required' }, { status: 400 });
		}
		removeTestimonial(id);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to delete testimonial' }, { status: 500 });
	}
};

