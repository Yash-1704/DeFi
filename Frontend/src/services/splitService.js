const EPSILON = 0.000001;

/**
 * Calculate net balance for each member across all expenses.
 * Positive  = member should RECEIVE ETH
 * Negative  = member OWES ETH
 *
 * @param {Array}  expenses  - expense documents from backend
 * @param {Array}  members   - wallet address strings
 * @returns {Object} { address: netBalance }
 */
export function calculateBalances(expenses, members) {
  const balances = {};
  members.forEach(addr => { balances[addr.toLowerCase()] = 0; });

  expenses.forEach(exp => {
    const splitCount = exp.splitAmong?.length || 1;
    const share      = exp.amount / splitCount;
    const payer      = exp.paidBy.toLowerCase();

    // Payer gets credited the full amount they fronted
    if (balances[payer] === undefined) balances[payer] = 0;
    balances[payer] += exp.amount;

    // Each participant in splitAmong is debited their share
    (exp.splitAmong || []).forEach(addr => {
      const a = addr.toLowerCase();
      if (balances[a] === undefined) balances[a] = 0;
      balances[a] -= share;
    });
  });

  // Round to avoid floating-point noise
  Object.keys(balances).forEach(k => {
    balances[k] = parseFloat(balances[k].toFixed(6));
  });

  return balances;
}

/**
 * Simplify debts to the minimum number of peer-to-peer transactions.
 * Uses a greedy two-pointer approach.
 *
 * @param {Object} balances  - { address: netBalance }
 * @returns {Array}  [{ from, to, amount }]  — who pays whom how much
 */
export function simplifyDebts(balances) {
  const transactions = [];

  // Build sorted creditor / debtor lists
  let creditors = Object.entries(balances)
    .filter(([, v]) => v > EPSILON)
    .map(([addr, amount]) => ({ addr, amount }))
    .sort((a, b) => b.amount - a.amount);

  let debtors = Object.entries(balances)
    .filter(([, v]) => v < -EPSILON)
    .map(([addr, amount]) => ({ addr, amount: -amount })) // make positive
    .sort((a, b) => b.amount - a.amount);

  let ci = 0, di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const cred = creditors[ci];
    const debt = debtors[di];
    const transfer = Math.min(cred.amount, debt.amount);

    transactions.push({
      from:   debt.addr,
      to:     cred.addr,
      amount: parseFloat(transfer.toFixed(6)),
    });

    cred.amount -= transfer;
    debt.amount -= transfer;

    if (cred.amount < EPSILON) ci++;
    if (debt.amount < EPSILON) di++;
  }

  return transactions;
}

/** Truncate an address for display: 0x1234...abcd */
export const truncAddr = (addr) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—';

/** Format a timestamp to a readable string */
export const fmtDate = (ts) =>
  ts ? new Date(ts).toLocaleString() : '—';
