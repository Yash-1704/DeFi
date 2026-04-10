exports.calculateSettlement = (expenses, members) => {
  const balances = {};

  // initialize balances
  members.forEach(m => {
    balances[m] = 0;
  });

  // process each expense
  expenses.forEach(expense => {
    const splitCount = expense.splitAmong.length;
    const share = expense.amount / splitCount;

    // subtract share from each participant
    expense.splitAmong.forEach(user => {
      balances[user] -= share;
    });

    // add full amount to payer
    balances[expense.paidBy] += expense.amount;
  });

  // prepare settlement
  const users = [];
  const amounts = [];

  for (let user in balances) {
    if (balances[user] > 0) {
      users.push(user);
      amounts.push(balances[user]);
    }
  }

  return { users, amounts, balances };
};