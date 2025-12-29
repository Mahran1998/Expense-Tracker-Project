const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, uppercase: true, default: 'HUF' },

    // Business fields
    date: { type: Date, required: true },
    vendor: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    costCenter: { type: String, required: true, trim: true },

    notes: { type: String, default: '', trim: true },

    status: {
      type: String,
      enum: ['submitted', 'approved', 'rejected'],
      default: 'submitted',
      index: true,
    },
  },
  { timestamps: true }
);

// Helpful indexes for filters/reports
ExpenseSchema.index({ date: 1 });
ExpenseSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
