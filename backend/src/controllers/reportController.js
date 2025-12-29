const reportService = require('../services/reportService');

exports.getSummary = async (req, res) => {
  try {
    const { from, to } = req.query;

    // MVP: require from/to so the report is meaningful
    if (!from || !to) {
      return res.status(400).json({ error: "Query params required: from=YYYY-MM-DD&to=YYYY-MM-DD" });
    }

    const summary = await reportService.getSummary({ from, to });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
