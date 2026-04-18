function updateTransaction(id, updatedRow) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Transactions');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === id) { // Matching unique ID in Column G
      // updatedRow doesn't include ID, so we append the original ID back
      const finalRow = [...updatedRow, id]; 
      sheet.getRange(i + 1, 1, 1, 7).setValues([finalRow]);
      return { success: true };
    }
  }
  return { success: false };
}