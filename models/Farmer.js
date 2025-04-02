import mongoose from 'mongoose';

const farmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    country: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProduct' }], // Products added by farmer
    role: { type: String, default: 'farmer' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Farmer', farmerSchema);
