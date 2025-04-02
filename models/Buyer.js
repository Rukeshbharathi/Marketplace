import mongoose from 'mongoose';

const buyerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, },
    country: { type: String, required: true },
    kycDocument: { type: String, default: null }, // Stores KYC document path
    kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isBlocked: { type: Boolean, default: false },
    role: { type: String, default: 'buyer' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Buyer', buyerSchema);
