import { json } from '@sveltejs/kit';

import { 
	getImages, 
	addImage, 
	updateImage, 
	removeImage
} from '$lib/server/database';

export const GET= async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const images = getImages();
	return json({ images });
};

export const POST= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const image= await request.json();
		addImage(image);
		return json({ success: true, image });
	} catch (error) {
		return json({ error: 'Failed to add image' }, { status: 500 });
	}
};

export const PUT= async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id, ...updatedImage } = await request.json();
		if (!id) {
			return json({ error: 'Image ID is required' }, { status: 400 });
		}
		updateImage(id, updatedImage);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to update image' }, { status: 500 });
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
			return json({ error: 'Image ID is required' }, { status: 400 });
		}
		removeImage(id);
		return json({ success: true });
	} catch (error) {
		return json({ error: 'Failed to delete image' }, { status: 500 });
	}
};

