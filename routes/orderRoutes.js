const express = require('express');
const orderController = require('../controllers/orderController');
const  authenticate  = require('../middleware/auth').authenticate;

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/allOrder/:id',orderController.getUserOrders);
router.put('/updateOrder/:id',orderController.updateOrder);

module.exports = router;
