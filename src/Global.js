const SPREADSHEET_ID = '17zgFTafrG5Ql_1jZdLEadztqsre44jvYmUkROBVnLv4';

/**
 * Transforms a date string or object into yyyy-mm-dd format.
 * @param {string|Date} dateInput - The date to transform.
 * @returns {string} - The formatted date or an error message.
 */
function formatDate(dateInput) {
  const d = new Date(dateInput);

  // Check if the input is a valid date
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  const year = d.getFullYear();
  
  // getMonth() is 0-indexed (Jan is 0), so we add 1
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Reads a sheet and returns a mapped object keyed by a specific column.
 * @param {string} sheetName - Name of the sheet.
 * @param {string} keyHeader - The header to use as the Primary Key (e.g., 'CategoryID').
 * @param {Object} schema - Map of {SheetHeader: ObjectKey} (e.g., {'CategoryName': 'name'}).
 * @returns {Object} Mapped data object.
 */
function getMappedSheetData(sheetName, keyHeader, schema) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found.`);

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return {}; // Return empty if only headers or empty

  const headers = data.shift();
  const keyIndex = headers.indexOf(keyHeader);
  
  if (keyIndex === -1) throw new Error(`Key column "${keyHeader}" not found.`);

  return data.reduce((acc, row) => {
    const primaryKey = row[keyIndex];
    if (!primaryKey) return acc; // Skip empty rows

    const rowData = {};
    // Loop through the schema to map sheet headers to your desired keys
    for (const [sheetCol, targetKey] of Object.entries(schema)) {
      const colIndex = headers.indexOf(sheetCol);
      if (colIndex !== -1) {
        rowData[targetKey] = row[colIndex];
      }
    }

    acc[primaryKey] = rowData;
    return acc;
  }, {});
}

function doGet() {
  return HtmlService.createTemplateFromFile('GlobalView')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
    .setTitle('My Finance App');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Fetches all settings from the UserSettings sheet.
 */
function getUserSettings() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('UserSettings');
    const values = sheet.getDataRange().getValues();
    const settings = {};
    
    // Map Column A to Column B
    values.forEach(row => {
      if (row[0]) {
        settings[row[0].toString().trim()] = row[1].toString().trim();
      }
    });
    
    return settings;
  } catch (e) {
    console.log("Error loading settings: " + e);
    return {}; 
  }
}

/**
 * Saves or updates a setting in the UserSettings sheet.
 */
function saveUserSetting(key, value) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('UserSettings');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] == key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]);
}