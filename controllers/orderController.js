const Order = require('../models/order');
const Cart = require('../models/cart');
const User = require('../models/User');
const Address = require('../models/address')

// Create a new order
exports.createOrder = async (req, res) => {

    try {
        const { user, paymentMethod, addressId } = req.body;
        const address = await Address.findById(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        const cart = await Cart.findOne({ user: user });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const order = new Order({
            user: user,
            items: cart.items,
            totalPrice: cart.totalPrice,
            deliveryAddress: `${address.addressLine1}, ${address.addressLine2}, ${address.city}, ${address.state}, ${address.postalCode},${address.phoneNumber}`,
            paymentMethod: paymentMethod,
            paymentStatus: 'Pending',
            orderStatus: 'Pending'
        });
        const savedOrder = await order.save();
        cart.items = [];
        await cart.save();
        res.status(201).json({ message: 'Order Placed successfully', savedOrder });
    } catch (err) {
        res.status(400).json({ message: 'Error creating order', error: err.message });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.id });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

//update Order status
exports.updateOrder = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (orderStatus === 'Delivered') {
            order.deliveredAt = new Date(); // Update the delivery time when marked as delivered
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
}
