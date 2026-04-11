const BASE_URL = "http://localhost:5000/api";

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
};

// ── Groups ──────────────────────────────────────────────────────
export const createGroup = async (data) => {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const getGroups = async () => {
  const res = await fetch(`${BASE_URL}/groups`);
  return handleResponse(res);
};

// ── Expenses ────────────────────────────────────────────────────
export const addExpense = async (data) => {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const getBalances = async (groupId) => {
  const res = await fetch(`${BASE_URL}/expenses/${groupId}/balances`);
  return handleResponse(res);
};

export const getSettlement = async (groupId) => {
  const res = await fetch(`${BASE_URL}/expenses/${groupId}/settle`);
  return handleResponse(res);
};

// ── Transactions ────────────────────────────────────────────────
export const getTransactions = async (address) => {
  if (!address) return [];
  const res = await fetch(`${BASE_URL}/transactions/${address}`);
  return handleResponse(res);
};

export const addTransaction = async (data) => {
  const res = await fetch(`${BASE_URL}/transactions/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ── SplitCoin: Groups ────────────────────────────────────────────
export const getGroupById = async (id) => {
  const res = await fetch(`${BASE_URL}/groups/${id}`);
  return handleResponse(res);
};

export const deleteGroup = async (id) => {
  const res = await fetch(`${BASE_URL}/groups/${id}`, { method: 'DELETE' });
  return handleResponse(res);
};

export const getGroupsByMember = async (address) => {
  if (!address) return [];
  const res = await fetch(`${BASE_URL}/groups?member=${address}`);
  return handleResponse(res);
};

export const getPendingGroupInvites = async (address) => {
  if (!address) return [];
  const res = await fetch(`${BASE_URL}/groups?pendingMember=${address}`);
  return handleResponse(res);
};

export const confirmGroupInvite = async (groupId, walletAddress) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return handleResponse(res);
};

export const declineGroupInvite = async (groupId, walletAddress) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members/decline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return handleResponse(res);
};

export const addGroupMember = async (groupId, walletAddress) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress }),
  });
  return handleResponse(res);
};

export const fundGroupPool = async (groupId, data) => {
  const res = await fetch(`${BASE_URL}/groups/${groupId}/fund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ── SplitCoin: Expenses ──────────────────────────────────────────
export const getGroupExpenses = async (groupId) => {
  if (!groupId) return [];
  const res = await fetch(`${BASE_URL}/expenses/${groupId}`);
  return handleResponse(res);
};

export const getGroupBalances = async (groupId) => {
  if (!groupId) return { balances: {} };
  const res = await fetch(`${BASE_URL}/expenses/${groupId}/balances`);
  return handleResponse(res);
};