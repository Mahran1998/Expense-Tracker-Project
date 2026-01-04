const mongoose = require('mongoose');
const expenseService = require('../services/expenseService');

const VALID_STATUS = new Set(['submitted', 'approved', 'rejected']);

exports.createExpense = async (req, res) => {
  try {
    // ✅ add audit fields
    const payload = {
      ...req.body,
      status: 'submitted',
      createdBy: req.user.id,
      updatedBy: req.user.id,
    };

    const expense = await expenseService.createExpense(payload);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { from, to, category, status } = req.query;

    // ✅ employees only see their own expenses
    const filters = { from, to, category, status };
    if (req.user.role === "employee") {
      filters.createdBy = req.user.id;
    }

    const expenses = await expenseService.listExpenses(filters);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid expense id' });
    }

    // ✅ employees can only edit their own submitted expenses
    const patch = {
      ...req.body,
      updatedBy: req.user.id,
    };

    const updated = await expenseService.updateExpenseWithRules(id, patch, req.user);
    if (!updated) return res.status(404).json({ error: 'Expense not found' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid expense id' });
    }
    if (!status || !VALID_STATUS.has(status)) {
      return res.status(400).json({ error: "status must be one of: submitted|approved|rejected" });
    }

    // ✅ manager only (route enforces), set audit fields
    const updated = await expenseService.updateExpenseStatusWithAudit(id, status, req.user);
    if (!updated) return res.status(404).json({ error: 'Expense not found' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
