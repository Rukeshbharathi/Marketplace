import express from "express";
import { notifyKYCStatus } from "../controllers/notificationController.js";
import { protect, isAdmin as adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/kyc", protect, adminOnly, notifyKYCStatus); // Only admin can approve/reject KYC

export default router;
