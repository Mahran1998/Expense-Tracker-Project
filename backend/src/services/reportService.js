const Expense = require('../models/expenseModel');

function buildDateMatch(from, to) {
  const match = {};
  if (from || to) {
    match.date = {};
    if (from) {
      const d = new Date(from);
      d.setHours(0, 0, 0, 0);
      match.date.$gte = d;
    }
    if (to) {
      const d = new Date(to);
      d.setHours(23, 59, 59, 999);
      match.date.$lte = d;
    }
  }
  return match;
}

async function getSummary({ from, to }) {
  const match = buildDateMatch(from, to);

  const totals = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$currency',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const byCategory = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: { currency: '$currency', category: '$category' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.currency': 1, '_id.category': 1 } },
  ]);

  const byStatus = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    from: from || null,
    to: to || null,
    totals,
    byCategory,
    byStatus,
  };
}

module.exports = { getSummary };
