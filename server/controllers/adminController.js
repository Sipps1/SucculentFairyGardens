import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Settings from '../models/settingsModel.js';
import generateToken from '../utils/generateToken.js'; // We need to create this

// --- Auth ---

// @desc    Auth user & get token
// @route   POST /api/admin/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user (admin)
// @route   POST /api/admin/register
// @access  Public (or change to private after first user)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password, // will be hashed by mongoose pre-save hook
    isAdmin: true,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// --- Products (CRUD) ---

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category } = req.body;

  const product = new Product({
    name,
    price,
    description,
    image,
    category,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne(); // Use deleteOne()
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// --- Orders ---

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const { orderStatus } = req.body; // e.g., "Payment Received" or "Shipped"

  if (order) {
    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// --- Settings ---

// @desc    Get site settings
// @route   GET /api/admin/settings
// @access  Public (for cart) & Private (for admin)
const getSettings = asyncHandler(async (req, res) => {
  // Find a single settings doc, or create it if it doesn't exist
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json(settings);
});

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  const {
    shippingFee,
    notificationEmail,
    bankName,
    accountHolder,
    accountNumber,
    branchCode,
  } = req.body;

  let settings = await Settings.findOne();

  if (settings) {
    settings.shippingFee = shippingFee || settings.shippingFee;
    settings.notificationEmail =
      notificationEmail || settings.notificationEmail;
    settings.bankName = bankName || settings.bankName;
    settings.accountHolder = accountHolder || settings.accountHolder;
    settings.accountNumber = accountNumber || settings.accountNumber;
    settings.branchCode = branchCode || settings.branchCode;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } else {
    // This should ideally not happen after the first getSettings call
    const newSettings = await Settings.create({
      shippingFee,
      notificationEmail,
      bankName,
      accountHolder,
      accountNumber,
      branchCode,
    });
    res.status(201).json(newSettings);
  }
});

export {
  authUser,
  registerUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getSettings,
  updateSettings,
};