const mongoose = require('mongoose');
const { log } = require('../utils/logger');

function connectDB() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => log('MongoDB connected'))
    .catch(err => {
      log('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = { connectDB };

