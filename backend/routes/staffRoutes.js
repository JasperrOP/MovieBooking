const express = require('express');
const router = express.Router();
const { getFoodOrders, updateFoodStatus, verifyTicket } = require('../controllers/staffController');
const { protect } = require('../middleware/authMiddleware'); 
// Note: You can add an 'admin' or 'staff' middleware here if you have specific roles

router.get('/food-orders', protect, getFoodOrders);
router.put('/food-orders/:id', protect, updateFoodStatus);
router.post('/verify-ticket', protect, verifyTicket);

module.exports = router;