import express from 'express';
import {
    loginSubAdmin,
    createSubAdmin,
    getSubAdmins,
    getSubAdminById,
    updateSubAdmin,
    deleteSubAdmin
} from '../controllers/subadminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// SubAdmin Authentication
router.post('/login', loginSubAdmin);

// SubAdmin Management
router.post('/', protect, isAdmin, createSubAdmin);
router.get('/', protect, isAdmin, getSubAdmins);
router.get('/:id', protect, isAdmin, getSubAdminById);
router.put('/:id', protect, isAdmin, updateSubAdmin);
router.delete('/:id', protect, isAdmin, deleteSubAdmin);

export default router;
