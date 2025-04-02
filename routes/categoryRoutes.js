import express from 'express';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, isAdmin } from '../config/auth.js';

const router = express.Router();

router.post('/', protect, isAdmin, createCategory);
router.get('/', protect, isAdmin, getAllCategories);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

export default router;
