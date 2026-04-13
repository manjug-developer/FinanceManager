function saveNewTransaction(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Transactions');
    
    // Generate a unique ID (Timestamp + Random string)
    const txId = 'TX' + new Date().getTime() + Math.random().toString(36).substr(2, 4);
    
    // Prepare the row data
    // Format: [Date, Description, Type, Amount, AccountID, CategoryID, ID]
    const newRow = [
      formData.date,
      formData.notes || "",
      formData.type,
      parseFloat(formData.amount),
      formData.accountId,
      formData.categoryId,
      txId
    ];
    
    sheet.appendRow(newRow);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

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