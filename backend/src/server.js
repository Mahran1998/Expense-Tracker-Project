const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require("./routes/authRoutes");

require('dotenv').config();

// Import the new Business Logic
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // Logs requests to the console

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// --- ROUTES ---
app.use("/api/auth", authRoutes);
// Mount the Expense API at /api/expenses
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);

// --- HEALTH CHECKS ---
// 1. Internal Docker check (localhost:3000/health)
app.get('/health', (req, res) => res.status(200).send('OK'));

// 2. Nginx/Frontend check (localhost:8080/api/health)
app.get('/api/health', (req, res) => res.status(200).send('OK'));

// Start Server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  await connectDB();
  
  // Connect to RabbitMQ (Optional for MVP API, but good to init)
  // We skip strict Rabbit connection here to let the separate module handle it
  
  app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
  });
};

startServer();