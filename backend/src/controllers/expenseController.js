const mongoose = require('mongoose');
const expenseService = require('../services/expenseService');

const VALID_STATUS = new Set(['submitted', 'approved', 'rejected']);

exports.createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { from, to, category, status } = req.query;
    const expenses = await expenseService.listExpenses({ from, to, category, status });
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

    const updated = await expenseService.updateExpense(id, req.body);
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

    const updated = await expenseService.updateExpenseStatus(id, status);
    if (!updated) return res.status(404).json({ error: 'Expense not found' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
