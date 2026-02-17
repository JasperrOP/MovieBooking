const express = require('express');
const router = express.Router();
const { addFoodItem, getFoodMenu } = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, addFoodItem); // Only Admin can add
router.get('/', getFoodMenu);                  // Everyone can see

module.exports = router;