import express from 'express';
import {
    createFarmerProduct,
    listFarmerProducts,
    getFarmerProductDetails,
    updateFarmerProduct,
    deleteFarmerProduct,
    approveRejectFarmerProduct
} from '../controllers/farmerProductController.js';
import { protect, isFarmer, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Farmer Product Management
router.post('/', protect, isFarmer, createFarmerProduct);  // Create Farmer Product
router.get('/', listFarmerProducts);                        // List Farmer Products
router.get('/:id', getFarmerProductDetails);               // Get Farmer Product Details
router.put('/:id', protect, isFarmer, updateFarmerProduct); // Update Farmer Product
router.delete('/:id', protect, isFarmer, deleteFarmerProduct); // Delete Farmer Product
router.put('/:id/status', protect, isAdmin, approveRejectFarmerProduct); // Approve/Reject Farmer Product

export default router;
