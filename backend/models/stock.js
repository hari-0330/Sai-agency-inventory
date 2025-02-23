const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  cans25L: { type: Number, default: 0 },
  cans10L: { type: Number, default: 0 },
  cans1L: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock; 