function getHomeData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const transData = ss.getSheetByName('Transactions').getDataRange().getValues();
  const catData = ss.getSheetByName('Categories').getDataRange().getValues();
  const accData = ss.getSheetByName('Accounts').getDataRange().getValues();

  const transactions = transData.slice(1);
  const categories = catData.slice(1);
  const accounts = accData.slice(1);

  let summary = { income: 0, expense: 0, total: 0 };
  let accountBalances = {};
  let catMap = {};

  categories.forEach(c => {
    catMap[c[0]] = { name: c[1], type: c[2], icon: c[3] || 'category', amount: 0 };
  });

  accounts.forEach(acc => {
    accountBalances[acc[0]] = { name: acc[1], icon: acc[2] || 'account_balance', balance: 0, totalIn: 0 };
  });

  transactions.forEach(row => {
    const amount = parseFloat(row[3]) || 0;
    const accID = row[4];
    const catID = row[5];
    const catInfo = catMap[catID];

    if (catInfo && accountBalances[accID]) {
      if (catInfo.type === 'Income') {
        summary.income += amount;
        accountBalances[accID].balance += amount;
        accountBalances[accID].totalIn += amount;
      } else {
        summary.expense += amount;
        accountBalances[accID].balance -= amount;
      }
      catMap[catID].amount += amount;
    }
  });

  summary.total = summary.income - summary.expense;

  return {
    summary: summary,
    accounts: Object.values(accountBalances),
    categories: Object.values(catMap).filter(c => c.amount > 0)
  };
}