import express from 'express';
import {
    createOrder,
    listOrders,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder
} from '../controllers/orderController.js';
import { protect, isBuyer, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Order Management
router.post('/', protect, isBuyer, createOrder); // Create Order (Buyer Only)
router.get('/', protect, listOrders); // List Orders (Buyer & Farmer)
router.get('/:id', protect, getOrderDetails); // Get Order Details
router.put('/:id/status', protect, isAdmin, updateOrderStatus); // Update Order Status (Admin Only)
router.delete('/:id', protect, isBuyer, cancelOrder); // Cancel Order (Buyer Only)

export default router;
