import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMenuItems, addMenuItem, updateMenuItem } from '$lib/server/database';
import type { MenuItem } from '$lib/server/database';
import XLSX from 'xlsx';

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
		const allowedTypes = [
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
			'application/vnd.ms-excel', // .xls
			'text/csv' // .csv
		];
		
		const fileName = file.name.toLowerCase();
		const isValidType = allowedTypes.includes(file.type) || 
			fileName.endsWith('.xlsx') || 
			fileName.endsWith('.xls') || 
			fileName.endsWith('.csv');

		if (!isValidType) {
			return json({ 
				error: 'Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV file.' 
			}, { status: 400 });
		}

		// Read file as buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Parse Excel file
		const workbook = XLSX.read(buffer, { type: 'buffer' });
		const firstSheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[firstSheetName];

		// Convert to JSON (with header row)
		const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
			header: ['category', 'name', 'description', 'price'],
			defval: '' // Default value for empty cells
		}) as Array<{
			category?: string;
			name?: string;
			description?: string;
			price?: number | string;
		}>;

		if (jsonData.length === 0) {
			return json({ error: 'Excel file is empty or has no data rows' }, { status: 400 });
		}

		// Get existing menu items to check for duplicates
		const existingMenuItems = getMenuItems();
		const existingItemsMap = new Map<string, MenuItem>();
		existingMenuItems.forEach(item => {
			// Use category + name as unique key
			const key = `${item.category.toLowerCase().trim()}|${item.name.toLowerCase().trim()}`;
			existingItemsMap.set(key, item);
		});

		let imported = 0;
		let updated = 0;
		let skipped = 0;
		const errors: string[] = [];

		// Process each row
		for (let i = 0; i < jsonData.length; i++) {
			const row = jsonData[i];
			const rowNum = i + 2; // +2 because Excel is 1-indexed and we have a header row

			// Validate required fields
			if (!row.category || !row.name) {
				errors.push(`Row ${rowNum}: Missing required fields (Category and Name are required)`);
				skipped++;
				continue;
			}

			// Validate price
			let price = 0;
			if (row.price !== undefined && row.price !== null && row.price !== '') {
				const priceValue = typeof row.price === 'string' 
					? parseFloat(row.price.replace(/[£$,\s]/g, '')) 
					: Number(row.price);
				
				if (isNaN(priceValue) || priceValue < 0) {
					errors.push(`Row ${rowNum}: Invalid price value "${row.price}"`);
					skipped++;
					continue;
				}
				price = priceValue;
			}

			// Clean up data
			const category = String(row.category).trim();
			const name = String(row.name).trim();
			const description = row.description ? String(row.description).trim() : '';

			// Check if item already exists (by category + name)
			const key = `${category.toLowerCase()}|${name.toLowerCase()}`;
			const existingItem = existingItemsMap.get(key);

			const menuItem: MenuItem = {
				id: existingItem ? existingItem.id : Date.now().toString() + Math.random().toString(36).substr(2, 9),
				category,
				name,
				description,
				price
			};

			if (existingItem) {
				// Update existing item
				updateMenuItem(existingItem.id, menuItem);
				updated++;
			} else {
				// Add new item
				addMenuItem(menuItem);
				existingItemsMap.set(key, menuItem); // Add to map to avoid duplicates in same import
				imported++;
			}
		}

		return json({
			success: true,
			imported,
			updated,
			skipped,
			errors: errors.length > 0 ? errors : undefined,
			message: `Import completed: ${imported} new items, ${updated} updated, ${skipped} skipped.`
		});
	} catch (error) {
		console.error('Error importing menu:', error);
		return json({ 
			error: error instanceof Error ? error.message : 'Failed to import menu items' 
		}, { status: 500 });
	}
};

