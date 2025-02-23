const mongoose = require('mongoose');

const deliveryReportSchema = new mongoose.Schema({
    cans25L: { type: Number, default: 0, min: 0 },
    cans10L: { type: Number, default: 0, min: 0 },
    cans1L: { type: Number, default: 0, min: 0 },
    deliveryPlace: { type: String, required: true },
    userPhone: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  });
const DeliveryReport = mongoose.model('DeliveryReport', deliveryReportSchema);

module.exports = DeliveryReport; 