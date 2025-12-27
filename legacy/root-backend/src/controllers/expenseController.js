const { getAll, create } = require('../services/expenseService');

async function listExpenses(req, res, next) {
  try {
    const items = await getAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function addExpense(req, res, next) {
  try {
    const newExp = await create(req.body);
    res.status(201).json(newExp);
  } catch (err) {
    next(err);
  }
}

module.exports = { listExpenses, addExpense };

