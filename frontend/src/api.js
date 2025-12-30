const API_BASE = process.env.REACT_APP_API_BASE || "";

async function request(path, { method = "GET", body, params } = {}) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
  const url = `${API_BASE}${path}${qs}`;

  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `${res.status} ${res.statusText}`);
  }

  // all our business endpoints return JSON
  return res.json();
}

export function listExpenses(filters) {
  const params = {};
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.category) params.category = filters.category;
  if (filters.status) params.status = filters.status;
  return request("/api/expenses", { params });
}

export function createExpense(payload) {
  return request("/api/expenses", { method: "POST", body: payload });
}

export function updateExpense(id, patch) {
  return request(`/api/expenses/${id}`, { method: "PATCH", body: patch });
}

export function updateExpenseStatus(id, status) {
  return request(`/api/expenses/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function getSummary(from, to) {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  return request("/api/reports/summary", { params });
}
