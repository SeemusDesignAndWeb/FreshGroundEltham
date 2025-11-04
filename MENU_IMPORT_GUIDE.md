# Menu Import Guide

This guide explains how to import menu items from an Excel file.

## Excel File Structure

Your Excel file should have the following structure:

### Column Headers (Row 1)
- **Column A**: Category
- **Column B**: Name
- **Column C**: Description
- **Column D**: Price

### Data Format

| Category | Name | Description | Price |
|----------|------|-------------|-------|
| Hot Drinks | Cappuccino | Rich espresso with steamed milk | 3.50 |
| Hot Drinks | Latte | Smooth espresso with frothy milk | 3.75 |
| Cold Drinks | Iced Coffee | Chilled coffee with ice | 4.00 |
| Food | Sandwich | Fresh sandwich with your choice of filling | 5.50 |
| Cakes | Chocolate Cake | Decadent chocolate cake slice | 4.50 |

## Field Requirements

### Category (Required)
- Must be provided
- Common categories: "Hot Drinks", "Cold Drinks", "Food", "Cakes", "Snacks"
- Can be any text value

### Name (Required)
- Must be provided
- The name of the menu item
- Used together with category to identify unique items

### Description (Optional)
- Can be left empty
- Additional details about the menu item

### Price (Required)
- Must be a valid number
- Can include currency symbols (£, $) or commas - they will be removed
- Decimal values are supported (e.g., 3.50, 4.99)
- Examples:
  - `3.50`
  - `£3.50`
  - `$3.50`
  - `3,50` (European format)

## Import Behavior

### Matching Existing Items
Items are matched by **Category + Name** (case-insensitive). If a matching item exists:
- The existing item will be **updated** with the new data from the Excel file
- The ID of the existing item is preserved

### New Items
If no matching item is found:
- A new menu item will be **created** with a new ID
- All fields from the Excel row will be used

### Validation
- Rows missing required fields (Category or Name) will be skipped
- Rows with invalid prices will be skipped
- Errors will be reported in the import results

## Supported File Formats
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)
- `.csv` (Comma-separated values)

## Example Excel File

```
Category      | Name          | Description                    | Price
--------------|---------------|--------------------------------|-------
Hot Drinks    | Cappuccino    | Rich espresso with steamed milk| 3.50
Hot Drinks    | Latte         | Smooth espresso with frothy milk| 3.75
Cold Drinks   | Iced Coffee   | Chilled coffee with ice        | 4.00
Food          | Sandwich      | Fresh sandwich                 | 5.50
Cakes         | Chocolate Cake| Decadent chocolate cake slice  | 4.50
```

## Import Steps

1. Prepare your Excel file with the structure above
2. Go to Admin > Menu
3. Click "Import from Excel"
4. Select your Excel file
5. Review the import results
6. Check the menu items to verify the import

## Notes

- The first row should contain headers, but the system will work with or without headers
- Empty rows will be skipped
- Duplicate items in the same Excel file will be handled (first occurrence wins)
- The import process is additive - existing items not in the Excel file will remain unchanged

