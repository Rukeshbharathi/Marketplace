import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
    farmerProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'FarmerProduct', required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
