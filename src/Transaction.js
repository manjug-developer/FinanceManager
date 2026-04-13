/**
 * Transaction Backend - Fetches and Joins real data from Spreadsheet
 */
function getTransactionData() {
  const DUMMY_TRANSACTIONS = [];
  getSheetDataAsObjects('Transactions').forEach(trans => {
    DUMMY_TRANSACTIONS.push(
      [formatDate(trans.Date),trans.Notes,trans.Type,trans.Amount,trans.Account,trans.Category]
    );
  })
  //console.log(DUMMY_TRANSACTIONS);

  const sheetName1 = "Categories"; // Change this to your actual sheet name
  const primaryKey1 = "CategoryID";
  
  // Define which column goes to which property name
  const mappingSchema1 = {
    'CategoryName': 'name',
    'Icon': 'icon'
  };

  const MOCK_CATS = getMappedSheetData(sheetName1, primaryKey1, mappingSchema1);
  //console.log(MOCK_CATS);

  const sheetName2 = "Accounts"; // Change this to your actual sheet name
  const primaryKey2 = "AccountID";
  
  // Define which column goes to which property name
  const mappingSchema2 = {
    'AccountName': 'name'
  };

  const MOCK_ACCS = getMappedSheetData(sheetName2, primaryKey2, mappingSchema2);
  //console.log(MOCK_ACCS);
  return{
    transactions : DUMMY_TRANSACTIONS,
    categories : MOCK_CATS,
    accounts : MOCK_ACCS
    };
}

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