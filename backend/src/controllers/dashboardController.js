const dashboardService = require('../services/dashboardService');

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getStats(req.user);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
