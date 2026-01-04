const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { requireAuth, requireRole } = require("../middleware/auth");

// ✅ protect everything under /api/expenses
router.use(requireAuth);

// MVP contract
router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);

// Employees can edit ONLY their submitted + own expenses (enforced in controller)
router.patch('/:id', expenseController.updateExpense);

// ✅ only manager can approve/reject
router.patch('/:id/status', requireRole("manager"), expenseController.updateExpenseStatus);

module.exports = router;
