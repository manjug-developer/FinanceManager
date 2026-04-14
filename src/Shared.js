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
      obj[header] = row[index];
    });
    return obj;
  });
}



function loadMasterData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const transactions = ss.getSheetByName('Transactions').getDataRange().getValues();
  const categories = ss.getSheetByName('Categories').getDataRange().getValues();
  const accounts = ss.getSheetByName('Accounts').getDataRange().getValues();
  const userSettings = ss.getSheetByName('UserSettings').getDataRange().getValues();
  return {transactions,categories,accounts,userSettings};
}

















