
import { getMenuItems } from '$lib/server/database';
import XLSX from 'xlsx';

export const GET = async ({ cookies }) => {
	// Check authentication
	if (!cookies.get('admin_session')) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		const menuItems = getMenuItems();

		// Create worksheet data
		const worksheetData = [
			// Header row
			['Category', 'Name', 'Description', 'Price'],
			// Data rows
			...menuItems.map(item => [
				item.category,
				item.name,
				item.description || '',
				item.price
			])
		];

		// Create workbook and worksheet
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

		// Set column widths for better readability
		worksheet['!cols'] = [
			{ wch: 15 }, // Category
			{ wch: 25 }, // Name
			{ wch: 40 }, // Description
			{ wch: 10 }  // Price
		];

		// Add worksheet to workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Menu Items');

		// Generate Excel file buffer
		const excelBuffer = XLSX.write(workbook, { 
			type: 'buffer', 
			bookType: 'xlsx' 
		});

		// Generate filename with current date
		const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
		const filename = `menu-export-${date}.xlsx`;

		return new Response(excelBuffer, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename="${filename}"`,
				'Content-Length': excelBuffer.length.toString()
			}
		});
	} catch (error) {
		console.error('Error exporting menu:', error);
		return new Response('Failed to export menu', { status: 500 });
	}
};

