/**
 * CATEGORY BACKEND - V1.4
 */
function getCategoryData() {
  const SPREADSHEET_ID = '17zgFTafrG5Ql_1jZdLEadztqsre44jvYmUkROBVnLv4';
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Categories');
  const data = sheet.getDataRange().getValues().slice(1);
  
  return data.map(row => ({
    id: row[0],
    name: row[1],
    type: row[2],
    icon: row[3] || 'category'
  }));
}

function saveCategory(category) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Categories');
  const data = sheet.getDataRange().getValues();
  
  if (category.id) {
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === category.id) {
        sheet.getRange(i + 1, 2, 1, 3).setValues([[category.name, category.type, category.icon]]);
        return { success: true };
      }
    }
  } else {
    const lastId = data.length > 1 ? data[data.length - 1][0] : 'CAT00';
    const newIdNum = parseInt(lastId.replace('CAT', '')) + 1;
    const newId = 'CAT' + newIdNum.toString().padStart(2, '0');
    sheet.appendRow([newId, category.name, category.type, category.icon]);
    return { success: true };
  }
}

function deleteCategory(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Categories');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
}