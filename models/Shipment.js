import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
    fromCountry: { type: String, required: true },
    toCountry: { type: String, required: true },
    shippingCost: { type: Number, required: true },
    estimatedDelivery: { type: String, required: true }, // e.g., "5-7 days"
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Shipment', shipmentSchema);
