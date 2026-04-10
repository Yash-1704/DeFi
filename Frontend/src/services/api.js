
const BASE_URL = "http://localhost:5000";

// Create group
export const createGroup = async (data) => {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
};

// Add expense
export const addExpense = async (data) => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
};

// Get balances
export const getBalances = async (groupId) => {
  const res = await fetch(`${BASE_URL}/expenses/${groupId}/balances`);
  return res.json();
};

// Get settlement
export const getSettlement = async (groupId) => {
  const res = await fetch(`${BASE_URL}/expenses/${groupId}/settle`);
  return res.json();
};