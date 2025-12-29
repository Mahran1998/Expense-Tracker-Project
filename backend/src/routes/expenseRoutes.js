const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// MVP contract
router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.patch('/:id', expenseController.updateExpense);
router.patch('/:id/status', expenseController.updateExpenseStatus);

module.exports = router;

