import mongoose from 'mongoose';

const subAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'subadmin' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SubAdmin', subAdminSchema);
