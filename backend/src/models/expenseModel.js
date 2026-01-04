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

    // Audit fields (Phase 4.1)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    approvedAt: { type: Date, default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

// helpful indexes
ExpenseSchema.index({ date: 1 });
ExpenseSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
