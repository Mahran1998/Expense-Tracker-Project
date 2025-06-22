// src/server.js
require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { connectRabbit } = require('./config/rabbit');
const expenseRoutes = require('./routes/expenseRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { log } = require('./utils/logger');

const app = express();
app.use(express.json());

// connect to services
connectDB();
connectRedis();
connectRabbit();

// routes
app.use('/api/expenses', expenseRoutes);

// health-check
app.get('/health', (req, res) => res.send('OK'));

// error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => log(`Backend listening on port ${PORT}`));

