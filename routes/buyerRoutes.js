import express from 'express';
import {
    registerBuyer,
    loginBuyer,
    uploadKYC,
    listBuyers,
    updateKYCStatus,
    toggleBuyerBlock,
    getBuyerById,
    deleteBuyer
} from '../controllers/buyerController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/kyc/' });
const router = express.Router();

// Buyer Authentication
router.post('/signup', registerBuyer);
router.post('/login', loginBuyer);

// KYC Upload
router.post('/kyc/upload', protect, upload.single('kycDocument'), uploadKYC);

// Admin Buyer Management
router.get('/', protect, isAdmin, listBuyers);
router.get('/:id', protect, isAdmin, getBuyerById);
router.put('/kyc/:id', protect, isAdmin, updateKYCStatus);
router.put('/block/:id', protect, isAdmin, toggleBuyerBlock);
router.delete('/:id', protect, isAdmin, deleteBuyer);

export default router;
