/**
 * Reads a sheet and returns data as an array of objects.
 * @param {string} sheetName - The name of the sheet to read.
 * @returns {Object[]} Array of objects where keys are header names.
 */
function getSheetDataAsObjects(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  
  // Safety check to ensure the sheet exists
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found.`);
  }

  const data = sheet.getDataRange().getValues();
  
  // Return empty array if sheet is empty
  if (data.length < 1) return [];

  const headers = data.shift(); // Remove and store the first row (headers)
  
  return data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Map each header to the corresponding column value
      // check for the Date value if yes convert it to date string
      if(header == 'Date') {
        obj[header] = row[index].toISOString();
      } else {
        obj[header] = row[index];
      }
    });
    return obj;
  });
}

function loadSharedData() {
  const transactions = getSheetDataAsObjects('Transactions');
  const categories = getSheetDataAsObjects('Categories');
  const accounts = getSheetDataAsObjects('Accounts');
  const userSettings = getSheetDataAsObjects('UserSettings');
  return {transactions,categories,accounts,userSettings};
}

















