const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/summary', reportController.getSummary);

module.exports = router;
