import { json } from '@sveltejs/kit';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '$env/dynamic/private';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export const POST = async ({ request, cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Get and validate Cloudinary credentials
	const CLOUDINARY_CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME?.trim();
	const CLOUDINARY_API_KEY = env.CLOUDINARY_API_KEY?.trim();
	const CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET?.trim();

	if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
		const missing = [
			!CLOUDINARY_CLOUD_NAME && 'CLOUDINARY_CLOUD_NAME',
			!CLOUDINARY_API_KEY && 'CLOUDINARY_API_KEY',
			!CLOUDINARY_API_SECRET && 'CLOUDINARY_API_SECRET'
		].filter(Boolean);
		console.error('Cloudinary configuration missing:', missing);
		return json({
			error: 'Cloudinary not configured',
			details: `Set these environment variables in production: ${missing.join(', ')}. See CLOUDINARY_SETUP.md`
		}, { status: 500 });
	}

	// Configure Cloudinary for this request
	cloudinary.config({
		cloud_name: CLOUDINARY_CLOUD_NAME,
		api_key: CLOUDINARY_API_KEY,
		api_secret: CLOUDINARY_API_SECRET
	});

	try {
		const formData = await request.formData();
		const file = formData.get('file');

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
			const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
			const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
			return json({
				error: 'File too large',
				details: `File size is ${fileSizeMB}MB. Maximum allowed size is ${maxSizeMB}MB. Please compress or resize the image before uploading.`
			}, { status: 400 });
		}

		// Generate a sanitized public_id for Cloudinary
		const originalName = file.name;
		const sanitizedName = originalName
			.replace(/\.[^/.]+$/, '')
			.replace(/[^a-zA-Z0-9-]/g, '_')
			.toLowerCase();

		const timestamp = Date.now();
		const publicId = `freshground/${sanitizedName}_${timestamp}`;

		// Convert file to base64 data URI for Cloudinary upload
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		const base64 = buffer.toString('base64');
		const dataURI = `data:${file.type};base64,${base64}`;

		console.log('Uploading to Cloudinary:', {
			publicId,
			originalName,
			size: file.size,
			type: file.type
		});

		try {
			const result = await cloudinary.uploader.upload(dataURI, {
				public_id: publicId,
				folder: 'freshground',
				resource_type: 'auto',
				overwrite: false
			});

			console.log('Cloudinary upload successful:', {
				public_id: result.public_id,
				secure_url: result.secure_url,
				format: result.format
			});

			return json({
				success: true,
				path: result.secure_url,
				filename: result.public_id,
				originalName,
				size: file.size,
				type: file.type,
				cloudinary_id: result.public_id,
				width: result.width,
				height: result.height
			});
		} catch (uploadError) {
			const errMsg = uploadError instanceof Error ? uploadError.message : String(uploadError);
			console.error('Cloudinary upload error:', errMsg, uploadError);
			const details = process.env.NODE_ENV === 'development' ? errMsg : (errMsg.includes('Invalid') || errMsg.includes('Unauthorized') ? 'Check Cloudinary API key and secret in environment variables' : 'Verify Cloudinary credentials in your hosting dashboard');
			return json({
				error: 'Failed to upload image to Cloudinary',
				details
			}, { status: 500 });
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
		console.error('Error uploading image:', errorMessage, error);
		return json({
			error: 'Failed to upload image',
			details: process.env.NODE_ENV === 'development' ? errorMessage : 'Check server logs for details'
		}, { status: 500 });
	}
};
