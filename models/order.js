const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  });

const orderSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    items: [orderItemSchema], 
    totalPrice: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
      },
    deliveryAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'PayPal', 'Stripe', 'UPI', 'Cash On Delivery'],
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      deliveredAt: {
        type: Date
      }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
