const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth, requireRole } = require("../middleware/auth");

// ✅ all report endpoints require authentication
router.use(requireAuth);

// ✅ only manager/accountant can view reports
router.get('/summary', requireRole("manager", "accountant"), reportController.getSummary);

module.exports = router;
