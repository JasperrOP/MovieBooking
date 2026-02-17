const Razorpay = require('razorpay');

// Initialize Razorpay with credentials from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res) => {
  const { amount } = req.body; // Amount in Rupees

  const options = {
    amount: amount * 100, // Razorpay takes amount in paise (1 INR = 100 paise)
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).send(error);
  }
};

module.exports = { createOrder };