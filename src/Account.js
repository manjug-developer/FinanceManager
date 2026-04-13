function saveAccount(accountData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Accounts');
  const data = sheet.getDataRange().getValues();
  
  let maxId = 0;
  for (let i = 1; i < data.length; i++) {
    const idNum = parseInt(data[i][0].toString().replace('ACC', ''));
    if (!isNaN(idNum) && idNum > maxId) maxId = idNum;
  }
  const newId = 'ACC' + (maxId + 1);

  sheet.appendRow([newId, accountData.name, accountData.balance, accountData.icon]);
  return { success: true };
}

function updateAccount(id, accountData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Accounts');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 2, 1, 3).setValues([[accountData.name, accountData.balance, accountData.icon]]);
      return { success: true };
    }
  }
}

function deleteAccount(id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Accounts');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
}