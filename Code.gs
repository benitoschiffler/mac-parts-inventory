/**
 * MAC PARTS INVENTORY - Google Apps Script Backend
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete any code in Code.gs and paste this entire file
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone" (or "Anyone with Google account" for more security)
 * 8. Click "Deploy" and authorize when prompted
 * 9. Copy the Web app URL and paste it in your React app's GOOGLE_SCRIPT_URL
 */

// Sheet configuration
const SHEET_NAME = 'Inventory';
const HEADERS = [
  'id',
  'category',
  'partName',
  'macModel',
  'screenSize',
  'year',
  'chip',
  'modelNumber',
  'condition',
  'quantity',
  'lowStockThreshold',
  'location',
  'cost',
  'supplier',
  'capacity',
  'notes',
  'status',
  'checkedOutTo',
  'checkedOutDate',
  'dateAdded',
  'lastModified'
];

/**
 * Initialize the sheet with headers if it doesn't exist
 */
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Set column widths for better visibility
    sheet.setColumnWidth(1, 180);  // id
    sheet.setColumnWidth(2, 120);  // category
    sheet.setColumnWidth(3, 200);  // partName
    sheet.setColumnWidth(4, 120);  // macModel
    sheet.setColumnWidth(5, 80);   // screenSize
    sheet.setColumnWidth(6, 80);   // year
    sheet.setColumnWidth(7, 150);  // chip
    sheet.setColumnWidth(8, 100);  // modelNumber
    sheet.setColumnWidth(9, 120);  // condition
    sheet.setColumnWidth(10, 60);  // quantity
  }
  
  return sheet;
}

/**
 * Handle GET requests - retrieve inventory
 */
function doGet(e) {
  const action = e.parameter.action || 'getAll';
  
  try {
    if (action === 'getAll') {
      const items = getAllItems();
      return createJsonResponse({ success: true, items: items });
    }
    
    return createJsonResponse({ success: false, error: 'Unknown action' });
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * Handle POST requests - add, update, delete items
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    switch (action) {
      case 'add':
        addItem(data.item);
        return createJsonResponse({ success: true, message: 'Item added' });
        
      case 'update':
        updateItem(data.item);
        return createJsonResponse({ success: true, message: 'Item updated' });
        
      case 'delete':
        deleteItem(data.id);
        return createJsonResponse({ success: true, message: 'Item deleted' });
        
      default:
        return createJsonResponse({ success: false, error: 'Unknown action' });
    }
  } catch (error) {
    return createJsonResponse({ success: false, error: error.toString() });
  }
}

/**
 * Get all items from the sheet
 */
function getAllItems() {
  const sheet = initializeSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return []; // Only headers, no data
  
  const headers = data[0];
  const items = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // Skip empty rows
    
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index] || '';
    });
    items.push(item);
  }
  
  return items;
}

/**
 * Add a new item to the sheet
 */
function addItem(item) {
  const sheet = initializeSheet();
  const row = HEADERS.map(header => item[header] || '');
  sheet.appendRow(row);
}

/**
 * Update an existing item
 */
function updateItem(item) {
  const sheet = initializeSheet();
  const data = sheet.getDataRange().getValues();
  const idColumn = HEADERS.indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColumn] === item.id) {
      const row = HEADERS.map(header => item[header] || '');
      sheet.getRange(i + 1, 1, 1, HEADERS.length).setValues([row]);
      return;
    }
  }
}

/**
 * Delete an item by ID
 */
function deleteItem(id) {
  const sheet = initializeSheet();
  const data = sheet.getDataRange().getValues();
  const idColumn = HEADERS.indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColumn] === id) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

/**
 * Create a JSON response with CORS headers
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to initialize the sheet
 */
function testSetup() {
  initializeSheet();
  Logger.log('Sheet initialized successfully!');
}
