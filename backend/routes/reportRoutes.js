const express = require('express');
const DeliveryReport = require('../models/deliveryReport');
const router = express.Router();
const Stock = require('../models/stock');

// Get all delivery reports
// Get reports by user phone
router.get('/reports/:phone', async (req, res) => {
    try {
      const { phone } = req.params;
      const reports = await DeliveryReport.find({ userPhone: phone })
        .sort({ timestamp: -1 });
      res.json({ success: true, reports });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  });

// Submit new delivery report
router.post('/report-delivery', async (req, res) => {
    try {
      const { cans25L, cans10L, cans1L, deliveryPlace, userPhone } = req.body;
      
      // Get current stock
      const currentStock = await Stock.findOne();
      if (!currentStock) {
        return res.status(404).json({ error: 'Stock not found' });
      }
  
      // Check if enough stock is available
      if (currentStock.cans25L < cans25L || 
          currentStock.cans10L < cans10L || 
          currentStock.cans1L < cans1L) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
  
      // Update stock
      currentStock.cans25L -= parseInt(cans25L) || 0;
      currentStock.cans10L -= parseInt(cans10L) || 0;
      currentStock.cans1L -= parseInt(cans1L) || 0;
      await currentStock.save();
  
      // Create delivery report
      const newReport = new DeliveryReport({
        cans25L: parseInt(cans25L) || 0,
        cans10L: parseInt(cans10L) || 0,
        cans1L: parseInt(cans1L) || 0,
        deliveryPlace,
        userPhone,
        timestamp: new Date()
      });
  
      await newReport.save();
      res.json({ 
        success: true, 
        message: 'Delivery report submitted and stock updated successfully',
        updatedStock: currentStock
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      res.status(500).json({ error: 'Failed to submit report' });
    }
  });

// Get reports by date range
router.get('/reports/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reports = await DeliveryReport.find({
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ timestamp: -1 });
    
    res.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching reports by range:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});
// Get all reports with optional date filtering
router.get('/reports', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let query = {};
  
      // Add date range filter if provided
      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
  
      // Fetch reports with optional date filter
      const reports = await DeliveryReport.find(query)
        .sort({ timestamp: -1 });
  
      // Calculate totals
      const totals = reports.reduce((acc, report) => {
        acc.totalCans25L += report.cans25L || 0;
        acc.totalCans10L += report.cans10L || 0;
        acc.totalCans1L += report.cans1L || 0;
        return acc;
      }, {
        totalCans25L: 0,
        totalCans10L: 0,
        totalCans1L: 0
      });
  
      // Group reports by delivery place
      const reportsByPlace = reports.reduce((acc, report) => {
        if (!acc[report.deliveryPlace]) {
          acc[report.deliveryPlace] = {
            cans25L: 0,
            cans10L: 0,
            cans1L: 0,
            count: 0
          };
        }
        acc[report.deliveryPlace].cans25L += report.cans25L || 0;
        acc[report.deliveryPlace].cans10L += report.cans10L || 0;
        acc[report.deliveryPlace].cans1L += report.cans1L || 0;
        acc[report.deliveryPlace].count += 1;
        return acc;
      }, {});
  
      res.json({ 
        success: true, 
        reports,
        totals,
        reportsByPlace,
        count: reports.length
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  });

module.exports = router; 