import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
 connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// // Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import subadminRoutes from './routes/subadminRoutes.js';
import farmerRoutes from './routes/farmerRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
 import productRoutes from './routes/productRoutes.js';
 import shipmentRoutes from './routes/shipmentRoutes.js';
 import orderRoutes from './routes/orderRoutes.js';
// import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
 import notificationRoutes from './routes/notificationRoutes.js';

// // Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subadmin', subadminRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/buyer', buyerRoutes);
 app.use('/api/category', categoryRoutes);
 app.use('/api/product', productRoutes);
 app.use('/api/shipment', shipmentRoutes);
 app.use('/api/order', orderRoutes);
// app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handling Middleware
 app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
