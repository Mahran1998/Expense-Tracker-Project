const Expense = require('../models/expenseModel');

async function getAll() {
  return Expense.find().sort({ date: -1 });
}

async function create(data) {
  const exp = new Expense(data);
  return exp.save();
}

module.exports = { getAll, create };

