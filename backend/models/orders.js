const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    deliveryDate: Date,
    deliveryPlace: String,
    cans25L: Number,
    cans10L: Number,
    cans1L: Number,
  });

  
  const Order = mongoose.model('Order', orderSchema);
  module.exports = Order; 