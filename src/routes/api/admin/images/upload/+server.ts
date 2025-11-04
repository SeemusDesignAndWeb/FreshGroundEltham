import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export const POST: RequestHandler = async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// Validate file type
		if (!ALLOWED_TYPES.includes(file.type)) {
			return json({ 
				error: 'Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, SVG' 
			}, { status: 400 });
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			return json({ 
				error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` 
			}, { status: 400 });
		}

		// Ensure images directory exists
		const imagesDir = join(process.cwd(), 'static', 'images');
		if (!existsSync(imagesDir)) {
			await mkdir(imagesDir, { recursive: true });
		}

		// Generate filename (sanitize original filename)
		const originalName = file.name;
		const sanitizedName = originalName
			.replace(/[^a-zA-Z0-9.-]/g, '_')
			.toLowerCase();
		
		// Add timestamp to avoid conflicts
		const timestamp = Date.now();
		const extension = sanitizedName.split('.').pop() || 'jpg';
		const baseName = sanitizedName.replace(/\.[^/.]+$/, '') || 'image';
		let filename = `${baseName}_${timestamp}.${extension}`;
		let filepath = join(imagesDir, filename);

		// Check if file already exists (very unlikely with timestamp, but just in case)
		if (existsSync(filepath)) {
			// Add random string if timestamp collision
			const random = Math.random().toString(36).substr(2, 5);
			filename = `${baseName}_${timestamp}_${random}.${extension}`;
			filepath = join(imagesDir, filename);
		}

		// Convert file to buffer and save
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		await writeFile(filepath, buffer);

		// Return the path that will be used in the app
		const imagePath = `/images/${filename}`;

		return json({ 
			success: true, 
			path: imagePath,
			filename: filename,
			originalName: originalName,
			size: file.size,
			type: file.type
		});
	} catch (error) {
		console.error('Error uploading image:', error);
		return json({ error: 'Failed to upload image' }, { status: 500 });
	}
};

