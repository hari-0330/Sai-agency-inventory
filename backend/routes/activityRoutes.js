const express = require('express');
const router = express.Router();
const DeliveryReport = require('../models/deliveryReport');
const Stock = require('../models/stock');

router.get('/activities', async (req, res) => {
  try {
    // Fetch delivery reports
    const deliveryReports = await DeliveryReport.find()
      .select('cans25L cans10L cans1L deliveryPlace userPhone timestamp');

    // Fetch stock updates
    const stockUpdates = await Stock.find()
      .select('cans25L cans10L cans1L lastUpdated');

    // Format the activities
    const activities = [
      ...deliveryReports.map(report => ({
        ...report.toObject(),
        type: 'delivery',
        timestamp: report.timestamp
      })),
      ...stockUpdates.map(update => ({
        ...update.toObject(),
        type: 'stock',
        timestamp: update.lastUpdated
      }))
    ];

    // Sort by timestamp, most recent first
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, activities });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

module.exports = router; 