import express from 'express';
import {
    createProduct,
    listProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    approveRejectProduct
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Product Management
router.post('/', protect, isAdmin, createProduct);        // Create Product
router.get('/', listProducts);                            // List Products
router.get('/:id', getProductDetails);                   // Get Product Details
router.put('/:id', protect, isAdmin, updateProduct);     // Update Product
router.delete('/:id', protect, isAdmin, deleteProduct);  // Delete Product
router.put('/:id/status', protect, isAdmin, approveRejectProduct); // Approve/Reject Product

export default router;
