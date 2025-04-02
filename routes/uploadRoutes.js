import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

// 🔹 Route to upload an image
router.post('/image', upload.single('file'), uploadImage);

export default router;
