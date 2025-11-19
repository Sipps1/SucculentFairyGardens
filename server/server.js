import express from 'express';
importRP from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

// You can keep this here to start the connection process early, 
// but the middleware below is what actually ensures it's ready.
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ADD THIS MIDDLEWARE ---
// This ensures every request waits for the DB connection to be ready
app.use(async (req, res, next) => {
  await connectDB();
  next();
});
// ---------------------------

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Export app for Vercel (Serverless)
export default app;

// Start server ONLY if not in production (Vercel handles this automatically in prod)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}