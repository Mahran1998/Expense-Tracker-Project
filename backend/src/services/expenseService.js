const Expense = require('../models/expenseModel');

function buildListQuery({ from, to, category, status, createdBy }) {
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

  // ✅ ownership filter for employees
  if (createdBy) query.createdBy = createdBy;

  return query;
}

async function createExpense(payload) {
  if (!payload.createdBy) throw new Error("createdBy is required");
  const doc = {
    amount: payload.amount,
    currency: payload.currency,
    date: payload.date,
    vendor: payload.vendor,
    category: payload.category,
    costCenter: payload.costCenter,
    notes: payload.notes ?? "",

    // enforced server-side
    status: "submitted",

    // ✅ audit
    createdBy: payload.createdBy,
    updatedBy: payload.updatedBy || payload.createdBy,

    approvedBy: null,
    approvedAt: null,
  };

  return Expense.create(doc);
}

async function listExpenses(filters) {
  const query = buildListQuery(filters);
  return Expense.find(query).sort({ date: -1, createdAt: -1 });
}

async function updateExpenseWithRules(id, patch, user) {
  if (user.role === "accountant") {
    throw new Error("Forbidden: accountant cannot edit expenses");
  }

  // Only allow editing business fields (NOT status here)
  const allowed = ['amount', 'currency', 'date', 'vendor', 'category', 'costCenter', 'notes'];
  const updates = {};
  for (const key of allowed) {
    if (patch[key] !== undefined) updates[key] = patch[key];
  }
  updates.updatedBy = user.id;

  // ✅ enforce rules by role
  let filter = { _id: id, status: "submitted" };

  if (user.role === "employee") {
    filter.createdBy = user.id; // own only
  }
  // manager: submitted only (no createdBy restriction)

  return Expense.findOneAndUpdate(filter, updates, { new: true, runValidators: true });
}

async function updateExpenseStatusWithAudit(id, status, user) {
  // This endpoint is manager-only at the route level.
  if (status !== "approved" && status !== "rejected") {
    throw new Error("Only approved/rejected allowed here");
  }

  const expense = await Expense.findById(id);
  if (!expense) return null;

  if (expense.status !== "submitted") {
    throw new Error("Only submitted expenses can be approved/rejected");
  }

  expense.status = status;
  expense.approvedBy = user.id;
  expense.approvedAt = new Date();
  expense.updatedBy = user.id;

  await expense.save();
  return expense;
}

module.exports = {
  createExpense,
  listExpenses,
  updateExpenseWithRules,
  updateExpenseStatusWithAudit,
};
