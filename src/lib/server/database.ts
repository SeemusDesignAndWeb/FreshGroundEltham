import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import type { Activity } from '../stores/cart';

const DB_PATH = process.env.DATABASE_PATH || './data/database.json';

export interface Testimonial {
	id: string;
	name: string;
	text: string;
	rating: number; // 1-5 stars
}

export interface MenuItem {
	id: string;
	category: string; // e.g., "Hot Drinks", "Cold Drinks", "Food", "Cakes"
	name: string;
	description: string;
	price: number;
}

export interface OpeningTimes {
	days: string; // e.g., "Wednesday to Saturday"
	hours: string; // e.g., "9:30 am to 2:00 pm"
	closedDays: string; // e.g., "Sunday, Monday, and Tuesday"
	backgroundImage: string; // URL for background image
	specialHours?: string; // Optional special opening hours message
}

export interface ActivitiesSettings {
	hidden: boolean;
	message: string; // Message to show when activities are hidden
}

export interface BannerSettings {
	message: string; // Banner message to display in top bar
	enabled: boolean; // Whether to show the banner
	icon?: string; // Icon to display before the message (e.g., 'star', 'explosion', 'sparkle')
	endIcon?: string; // Icon to display after the message (e.g., 'star', 'explosion', 'sparkle')
}

export interface SiteImage {
	id: string;
	name: string; // Display name for the image
	path: string; // Path to the image (e.g., '/images/pastries.jpg')
	alt?: string; // Alt text for accessibility
	category?: string; // Optional category (e.g., 'coffee', 'food', 'activities')
}

export interface Database {
	activities: Activity[];
	bookings: any[];
	testimonials: Testimonial[];
	menuItems: MenuItem[];
	openingTimes: OpeningTimes | null;
	activitiesSettings?: ActivitiesSettings;
	bannerSettings?: BannerSettings;
	images?: SiteImage[];
}

function getDbPath(): string {
	if (DB_PATH.startsWith('./') || DB_PATH.startsWith('../')) {
		// Relative path - resolve from project root
		const resolved = join(process.cwd(), DB_PATH);
		// Ensure the directory exists
		const dir = dirname(resolved);
		try {
			mkdirSync(dir, { recursive: true });
		} catch (error) {
			// Directory might already exist, ignore
		}
		return resolved;
	}
	return DB_PATH;
}

export function readDatabase(): Database {
	try {
		const dbPath = getDbPath();
		const data = readFileSync(dbPath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		// If file doesn't exist, return default structure
		return {
			activities: [],
			bookings: [],
			testimonials: [],
			menuItems: [],
			openingTimes: null
		};
	}
}

export function writeDatabase(data: Database): void {
	const dbPath = getDbPath();
	writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export function getActivities(): Activity[] {
	const db = readDatabase();
	return db.activities;
}

export function addActivity(activity: Activity): void {
	const db = readDatabase();
	db.activities.push(activity);
	writeDatabase(db);
}

export function updateActivity(activityId: string, updatedActivity: Partial<Activity>): void {
	const db = readDatabase();
	const index = db.activities.findIndex(a => a.id === activityId);
	if (index !== -1) {
		db.activities[index] = { ...db.activities[index], ...updatedActivity };
		writeDatabase(db);
	}
}

export function removeActivity(activityId: string): void {
	const db = readDatabase();
	db.activities = db.activities.filter(a => a.id !== activityId);
	writeDatabase(db);
}

export function addBooking(booking: any): void {
	const db = readDatabase();
	db.bookings.push(booking);
	writeDatabase(db);
}

export function getBookings(): any[] {
	const db = readDatabase();
	return db.bookings;
}

export function getTestimonials(): Testimonial[] {
	const db = readDatabase();
	return db.testimonials || [];
}

export function addTestimonial(testimonial: Testimonial): void {
	const db = readDatabase();
	if (!db.testimonials) {
		db.testimonials = [];
	}
	db.testimonials.push(testimonial);
	writeDatabase(db);
}

export function updateTestimonial(testimonialId: string, updatedTestimonial: Partial<Testimonial>): void {
	const db = readDatabase();
	if (!db.testimonials) {
		db.testimonials = [];
	}
	const index = db.testimonials.findIndex(t => t.id === testimonialId);
	if (index !== -1) {
		db.testimonials[index] = { ...db.testimonials[index], ...updatedTestimonial };
		writeDatabase(db);
	}
}

export function removeTestimonial(testimonialId: string): void {
	const db = readDatabase();
	if (!db.testimonials) {
		db.testimonials = [];
	}
	db.testimonials = db.testimonials.filter(t => t.id !== testimonialId);
	writeDatabase(db);
}

export function getMenuItems(): MenuItem[] {
	const db = readDatabase();
	return db.menuItems || [];
}

export function addMenuItem(menuItem: MenuItem): void {
	const db = readDatabase();
	if (!db.menuItems) {
		db.menuItems = [];
	}
	db.menuItems.push(menuItem);
	writeDatabase(db);
}

export function updateMenuItem(menuItemId: string, updatedMenuItem: Partial<MenuItem>): void {
	const db = readDatabase();
	if (!db.menuItems) {
		db.menuItems = [];
	}
	const index = db.menuItems.findIndex(m => m.id === menuItemId);
	if (index !== -1) {
		db.menuItems[index] = { ...db.menuItems[index], ...updatedMenuItem };
		writeDatabase(db);
	}
}

export function removeMenuItem(menuItemId: string): void {
	const db = readDatabase();
	if (!db.menuItems) {
		db.menuItems = [];
	}
	db.menuItems = db.menuItems.filter(m => m.id !== menuItemId);
	writeDatabase(db);
}

export function getOpeningTimes(): OpeningTimes | null {
	const db = readDatabase();
	return db.openingTimes || null;
}

export function updateOpeningTimes(openingTimes: OpeningTimes): void {
	const db = readDatabase();
	db.openingTimes = openingTimes;
	writeDatabase(db);
}

export function getActivitiesSettings(): ActivitiesSettings {
	const db = readDatabase();
	return db.activitiesSettings || {
		hidden: false,
		message: 'No activities scheduled at the moment. Check back soon for upcoming kids activities!'
	};
}

export function updateActivitiesSettings(settings: ActivitiesSettings): void {
	const db = readDatabase();
	db.activitiesSettings = settings;
	writeDatabase(db);
}

export function getBannerSettings(): BannerSettings {
	const db = readDatabase();
	return db.bannerSettings || {
		message: '',
		enabled: false,
		icon: 'none',
		endIcon: 'none'
	};
}

export function updateBannerSettings(settings: BannerSettings): void {
	const db = readDatabase();
	db.bannerSettings = settings;
	writeDatabase(db);
}

export function getImages(): SiteImage[] {
	const db = readDatabase();
	return db.images || [];
}

export function addImage(image: SiteImage): void {
	const db = readDatabase();
	if (!db.images) {
		db.images = [];
	}
	db.images.push(image);
	writeDatabase(db);
}

export function updateImage(imageId: string, updatedImage: Partial<SiteImage>): void {
	const db = readDatabase();
	if (!db.images) {
		db.images = [];
	}
	const index = db.images.findIndex(img => img.id === imageId);
	if (index !== -1) {
		db.images[index] = { ...db.images[index], ...updatedImage };
		writeDatabase(db);
	}
}

export function removeImage(imageId: string): void {
	const db = readDatabase();
	if (!db.images) {
		db.images = [];
	}
	db.images = db.images.filter(img => img.id !== imageId);
	writeDatabase(db);
}

/**
 * Populates the image library with images currently used by activities
 * Only adds images that don't already exist in the library
 */
export function populateImagesFromActivities(): { added: number; skipped: number } {
	const db = readDatabase();
	const activities = db.activities || [];
	
	// Initialize images array if it doesn't exist
	if (!db.images) {
		db.images = [];
	}
	
	// Get all unique image paths from activities
	const activityImagePaths = new Set<string>();
	activities.forEach(activity => {
		if (activity.image && activity.image.trim()) {
			activityImagePaths.add(activity.image.trim());
		}
	});
	
	// Get existing image paths to avoid duplicates
	const existingPaths = new Set(db.images.map(img => img.path));
	
	let added = 0;
	let skipped = 0;
	
	// Create image entries for each unique activity image
	activityImagePaths.forEach(path => {
		if (existingPaths.has(path)) {
			skipped++;
			return;
		}
		
		// Generate a friendly name from the path
		const filename = path.split('/').pop() || 'image';
		const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
		const name = nameWithoutExt
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
		
		// Determine category based on filename
		let category = 'activities';
		const lowerPath = path.toLowerCase();
		if (lowerPath.includes('coffee')) {
			category = 'coffee';
		} else if (lowerPath.includes('pastries') || lowerPath.includes('food')) {
			category = 'food';
		}
		
		// Generate alt text
		const alt = name || filename;
		
		const newImage: SiteImage = {
			id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
			name: name || filename,
			path: path,
			alt: alt,
			category: category
		};
		
		db.images.push(newImage);
		existingPaths.add(path); // Add to set to avoid duplicates in the same run
		added++;
	});
	
	if (added > 0) {
		writeDatabase(db);
	}
	
	return { added, skipped };
}

/**
 * Populates the image library with images currently used by opening times
 * Only adds images that don't already exist in the library
 */
export function populateImagesFromOpeningTimes(): { added: number; skipped: number } {
	const db = readDatabase();
	const openingTimes = db.openingTimes;
	
	// Initialize images array if it doesn't exist
	if (!db.images) {
		db.images = [];
	}
	
	// Get existing image paths to avoid duplicates
	const existingPaths = new Set(db.images.map(img => img.path));
	
	let added = 0;
	let skipped = 0;
	
	// Check if opening times has a background image
	if (openingTimes && openingTimes.backgroundImage && openingTimes.backgroundImage.trim()) {
		const path = openingTimes.backgroundImage.trim();
		
		// Only add if it's a local image (starts with /images/)
		if (path.startsWith('/images/')) {
			if (existingPaths.has(path)) {
				skipped++;
			} else {
				// Generate a friendly name from the path
				const filename = path.split('/').pop() || 'image';
				const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
				const name = nameWithoutExt
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(' ');
				
				// Determine category
				let category = 'opening-times';
				const lowerPath = path.toLowerCase();
				if (lowerPath.includes('coffee')) {
					category = 'coffee';
				} else if (lowerPath.includes('pastries') || lowerPath.includes('food')) {
					category = 'food';
				}
				
				// Generate alt text
				const alt = name || filename;
				
				const newImage: SiteImage = {
					id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
					name: name || filename,
					path: path,
					alt: alt,
					category: category
				};
				
				db.images.push(newImage);
				existingPaths.add(path);
				added++;
			}
		}
	}
	
	if (added > 0) {
		writeDatabase(db);
	}
	
	return { added, skipped };
}

