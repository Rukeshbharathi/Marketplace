import express from 'express';
import {
    loginAdmin,
    createSubAdmin,
    getFarmers,
    approveRejectBuyerKYC,
    blockUnblockBuyer,
    createCategory,
    approveRejectProduct
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Authentication
router.post('/login', loginAdmin);

// Subadmin Management
router.post('/subadmin', protect, isAdmin, createSubAdmin);

// Farmer Management
router.get('/farmers', protect, isAdmin, getFarmers);

// Buyer Management
router.post('/buyers/kyc', protect, isAdmin, approveRejectBuyerKYC);
router.post('/buyers/block', protect, isAdmin, blockUnblockBuyer);

// Category Management
router.post('/categories', protect, isAdmin, createCategory);

// Product Management
router.post('/products/approve', protect, isAdmin, approveRejectProduct);

export default router;
