import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getSettings,
  updateSettings,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

// Auth
router.post('/login', authUser);
router.post('/register', registerUser); // Use this once to create your admin

// Products
router.route('/products').post(protect, createProduct);
router
  .route('/products/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

// Orders
router.route('/orders').get(protect, getOrders);
router.route('/orders/:id').put(protect, updateOrderStatus);

// Settings
// Note: GET is public so the cart can fetch the shipping fee
router.route('/settings').get(getSettings).put(protect, updateSettings);

export default router;