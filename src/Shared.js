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

/**
 * Generic function to add a row with an auto-incrementing alphanumeric primary key.
 */
function addGenericRow(sheetName, rowDataWithoutId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  
  // Determine prefix based on sheet name
  let prefix = "";
  if (sheetName === 'Transactions') prefix = "TXN";
  else if (sheetName === 'Accounts') prefix = "ACC";
  else if (sheetName === 'Categories') prefix = "CAT";

  // Calculate next ID
  let maxIdNum = 0;
  for (let i = 1; i < data.length; i++) {
    const currentId = data[i][0].toString();
    const idNum = parseInt(currentId.replace(prefix, ''));
    if (!isNaN(idNum) && idNum > maxIdNum) maxIdNum = idNum;
  }
  
  const newId = prefix + (maxIdNum + 1).toString().padStart(3, '0');
  const finalRow = [newId, ...rowDataWithoutId];
  
  sheet.appendRow(finalRow);
  return { success: true, newId: newId };
}

/**
 * Generic function to update a row based on the primary key in the first column.
 */
function updateGenericRow(sheetName, id, updatedDataArray) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      // update starting from column 2 (index 1) to preserve the ID in column 1
      sheet.getRange(i + 1, 2, 1, updatedDataArray.length).setValues([updatedDataArray]);
      return { success: true };
    }
  }
  return { success: false, message: "ID not found" };
}

/**
 * Generic function to delete a row based on the primary key in the first column.
 */
function deleteGenericRow(sheetName, id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: "ID not found" };
}

function testCRUD() {
  // console.log(deleteGenericRow('Accounts', 'ACC005'));
  // console.log(addGenericRow('Accounts', ['Loans','directions_car']));
  // console.log(updateGenericRow('Accounts','ACC005', ['Loanssssss','directions_carrrrrrr']));
}
















