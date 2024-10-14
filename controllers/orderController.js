const Order = require('../models/order');

// Create a new order
exports.createOrder = async (req, res) => {
    const { products, totalAmount, deliveryAddress } = req.body;

    try {
        const order = new Order({ user: req.user.id, products, totalAmount, deliveryAddress });
        await order.save();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (err) {
        res.status(400).json({ message: 'Error creating order', error: err.message });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate('products.product');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
