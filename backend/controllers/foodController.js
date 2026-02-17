const Food = require('../models/Food');

// @desc    Add a new food item
// @route   POST /api/food
// @access  Private/Admin
const addFoodItem = async (req, res) => {
  const { name, price, category, image } = req.body;

  try {
    const food = new Food({
      name,
      price,
      category,
      image
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add food item' });
  }
};

// @desc    Get all food items
// @route   GET /api/food
// @access  Public
const getFoodMenu = async (req, res) => {
  try {
    const menu = await Food.find({});
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu' });
  }
};

module.exports = { addFoodItem, getFoodMenu };