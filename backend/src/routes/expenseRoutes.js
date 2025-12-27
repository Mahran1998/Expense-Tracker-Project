const express = require('express');
const { listExpenses, addExpense } = require('../controllers/expenseController');
const router = express.Router();

// GET /api/expenses
router.get('/', listExpenses);

// POST /api/expenses
router.post('/', addExpense);

module.exports = router;

