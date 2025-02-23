const express = require("express");
const Stock = require("../models/stock");
const router = express.Router();

router.get("/stock", async (req, res) => {
  try {
    let stock = await Stock.findOne();
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
    let stock = await Stock.findOne();
    if (!stock) {
      stock = new Stock();
    }
    stock.cans25L = cans25L;
    stock.cans10L = cans10L;
    stock.cans1L = cans1L;
    stock.lastUpdated = Date.now();
    await stock.save();
    res.json({ success: true, stock });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router; 