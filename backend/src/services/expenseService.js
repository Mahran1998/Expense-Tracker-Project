const Expense = require('../models/expenseModel');

function buildListQuery({ from, to, category, status }) {
  const query = {};

  // Date range filter (inclusive)
  if (from || to) {
    query.date = {};
    if (from) {
      const d = new Date(from);
      d.setHours(0, 0, 0, 0);
      query.date.$gte = d;
    }
    if (to) {
      const d = new Date(to);
      d.setHours(23, 59, 59, 999);
      query.date.$lte = d;
    }
  }

  if (category) query.category = category;
  if (status) query.status = status;

  return query;
}

async function createExpense(payload) {
  // Whitelist fields to avoid junk input
  const doc = {
    amount: payload.amount,
    currency: payload.currency,
    date: payload.date,
    vendor: payload.vendor,
    category: payload.category,
    costCenter: payload.costCenter,
    notes: payload.notes ?? '',
    // status is default "submitted"
  };

  return Expense.create(doc);
}

async function listExpenses(filters) {
  const query = buildListQuery(filters);
  return Expense.find(query).sort({ date: -1, createdAt: -1 });
}

async function updateExpense(id, patch) {
  // Only allow editing business fields (NOT status here)
  const allowed = ['amount', 'currency', 'date', 'vendor', 'category', 'costCenter', 'notes'];
  const updates = {};

  for (const key of allowed) {
    if (patch[key] !== undefined) updates[key] = patch[key];
  }

  return Expense.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

async function updateExpenseStatus(id, status) {
  return Expense.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
}

module.exports = {
  createExpense,
  listExpenses,
  updateExpense,
  updateExpenseStatus,
};
