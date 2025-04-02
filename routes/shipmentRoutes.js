import express from 'express';
import {
    defineShipment,
    listShipments,
    getShipmentDetails,
    updateShipment,
    deleteShipment,
    checkShipmentAvailability
} from '../controllers/shipmentController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Shipment Management
router.post('/', protect, isAdmin, defineShipment); // Define Shipment (Admin Only)
router.get('/', protect, listShipments); // List Shipments
router.get('/:id', protect, getShipmentDetails); // Get Shipment Details
router.put('/:id', protect, isAdmin, updateShipment); // Update Shipment (Admin Only)
router.delete('/:id', protect, isAdmin, deleteShipment); // Delete Shipment (Admin Only)

// Shipment Availability Check (Buyer)
router.post('/check', protect, checkShipmentAvailability);

export default router;
