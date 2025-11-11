import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert hardcoded admin user
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Add adminUser as the 'user' for sample products (if your model needs it)
    // Our model doesn't, but this is where you'd link it.
    const sampleProducts = products.map((product) => {
      return { ...product };
    });

    // Insert sample products
    await Product.insertMany(sampleProducts);

    console.log('Data Imported! Admin user created.');
    console.log('Admin Email: admin@example.com');
    console.log('Admin Password: 123456');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check for command-line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}