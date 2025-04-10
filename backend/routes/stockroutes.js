const express = require("express");
const Stock = require("../models/stock");
const router = express.Router();

router.get("/stock", async (req, res) => {
  try {
    let stock = await Stock.findOne().sort({ lastUpdated: -1 }).limit(1);
    if (!stock) {
      stock = new Stock();
      await stock.save();
    }
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/stock/update", async (req, res) => {
  try {
    const { cans25L, cans10L, cans1L } = req.body;
    let stock = await Stock.findOne().sort({ lastUpdated: -1 }).limit(1);
    let newstock = new Stock();
    newstock.cans25L = stock.cans25L+cans25L;
    newstock.cans10L = stock.cans10L+cans10L;
    newstock.cans1L = stock.cans1L+cans1L;
    newstock.lastUpdated = Date.now();
    await newstock.save();
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; 