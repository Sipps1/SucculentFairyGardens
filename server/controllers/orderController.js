import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import Settings from '../models/settingsModel.js';
import sendOrderEmail from '../utils/sendOrderEmail.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, customer, itemsPrice, shippingPrice, totalPrice } =
    req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // 1. Get the current settings (for notification email)
    // We use findOne() because there is only one settings doc
    const siteSettings = await Settings.findOne();
    if (!siteSettings) {
      // This is a failsafe in case settings aren't seeded
      throw new Error('Site settings not found. Cannot process order.');
    }

    // 2. Create the order
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id, // Map frontend _id to product field
        _id: undefined, // Remove _id to let MongoDB create a new one
      })),
      customer,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // 3. Send the notification email to the admin
    try {
      await sendOrderEmail(createdOrder, siteSettings);
    } catch (emailError) {
      console.error('Email failed to send, but order was saved:', emailError);
      // You might want to add logic here to retry or flag this order
    }

    // 4. Send the created order back to the frontend
    res.status(201).json(createdOrder);
  }
});

export { addOrderItems };