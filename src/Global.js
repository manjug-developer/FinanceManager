const SPREADSHEET_ID = '17zgFTafrG5Ql_1jZdLEadztqsre44jvYmUkROBVnLv4';

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