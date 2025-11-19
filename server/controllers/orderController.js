import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Settings from '../models/settingsModel.js';
import sendOrderEmail from '../utils/sendOrderEmail.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, customer } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // 1. Fetch Shipping Fee from DB
  const siteSettings = await Settings.findOne();
  if (!siteSettings) {
    res.status(500);
    throw new Error('Site settings not found');
  }
  const shippingFee = siteSettings.shippingFee;

  // 2. Recalculate Item Prices securely from the DB
  let itemsPrice = 0;
  const secureOrderItems = [];

  for (const item of orderItems) {
    const productFromDb = await Product.findById(item._id);
    if (!productFromDb) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }

    // Use price from DB, not from request
    itemsPrice += productFromDb.price * item.qty;

    secureOrderItems.push({
      name: productFromDb.name,
      qty: item.qty,
      image: productFromDb.image,
      price: productFromDb.price,
      product: productFromDb._id,
    });
  }

  const totalPrice = itemsPrice + shippingFee;

  // 3. Create Order
  const order = new Order({
    orderItems: secureOrderItems,
    customer,
    itemsPrice,
    shippingPrice: shippingFee,
    totalPrice,
  });

  const createdOrder = await order.save();

  // 4. Send Email (catch error so it doesn't crash the response)
  try {
    await sendOrderEmail(createdOrder, siteSettings);
  } catch (error) {
    console.error('Email failed to send', error);
  }

  res.status(201).json(createdOrder);
});

export { addOrderItems };