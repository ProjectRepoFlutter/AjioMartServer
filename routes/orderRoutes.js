const express = require('express');
const orderController = require('../controllers/orderController');
const  authenticate  = require('../middleware/auth').authenticate;

const router = express.Router();

router.post('/', authenticate, orderController.createOrder);
router.get('/:id', authenticate, orderController.getOrderById);
router.get('/', authenticate, orderController.getUserOrders);

module.exports = router;
