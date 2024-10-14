const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/sendOtp',userController.sendOtp);
router.post('/', userController.registerUser);
router.post('/verify', userController.verifyUser);
router.post('/login', userController.loginUser);

module.exports = router;
