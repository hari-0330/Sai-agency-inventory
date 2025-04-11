const express = require('express');
const Order = require("../models/orders");
const router = express.Router();

// Get all orders
router.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ deliveryDate: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create a new order
router.post('/api/orders', async (req, res) => {
  try {
    const { deliveryPlace, cans25L, cans10L, cans1L, deliveryDate } = req.body;
    
    if (!deliveryPlace) {
      return res.status(400).json({ error: 'Delivery place is required' });
    }
    
    const newOrder = new Order({
      deliveryPlace,
      cans25L: cans25L || 0,
      cans10L: cans10L || 0,
      cans1L: cans1L || 0,
      deliveryDate: deliveryDate || new Date()
    });
    
    const savedOrder = await newOrder.save();
    res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update an existing order
router.put('/api/orders/:id', async (req, res) => {
  try {
    const { deliveryPlace, cans25L, cans10L, cans1L, deliveryDate } = req.body;
    
    if (!deliveryPlace) {
      return res.status(400).json({ error: 'Delivery place is required' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        deliveryPlace,
        cans25L: cans25L || 0,
        cans10L: cans10L || 0,
        cans1L: cans1L || 0,
        deliveryDate: deliveryDate || new Date()
      },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete an order
router.delete('/api/orders/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    
    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router; 