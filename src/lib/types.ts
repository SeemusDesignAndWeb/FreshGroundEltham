// Shared types that can be used in both client and server code

export interface SiteImage {
	id: string;
	name: string; // Display name for the image
	path: string; // Path to the image (e.g., '/images/pastries.jpg')
	alt?: string; // Alt text for accessibility
	category?: string; // Optional category (e.g., 'coffee', 'food', 'activities')
}

