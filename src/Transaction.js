/**
 * Updates an existing transaction or deletes it
 */
function updateTransaction(id, updatedRow) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Transactions');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === id) { // Assuming Column G is a unique ID
      sheet.getRange(i + 1, 1, 1, 6).setValues([updatedRow]);
      return { success: true };
    }
  }
}

function deleteTransaction(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Transactions');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
}