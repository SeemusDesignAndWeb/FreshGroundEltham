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

export interface Database {
	activities: Activity[];
	bookings: any[];
	testimonials: Testimonial[];
	menuItems: MenuItem[];
	openingTimes: OpeningTimes | null;
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

