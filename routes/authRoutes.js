import express from 'express';
import {
    registerAdmin,
    loginAdmin,
    registerFarmer,
    loginFarmer,
    registerBuyer,
    loginBuyer,
} from '../controllers/authController.js';

import { protect, isAdmin, isFarmer, isBuyer } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

// Farmer Routes
router.post('/farmer/register', registerFarmer);
router.post('/farmer/login', loginFarmer);

// Buyer Routes
router.post('/buyer/register', registerBuyer);
router.post('/buyer/login', loginBuyer);

export default router;
