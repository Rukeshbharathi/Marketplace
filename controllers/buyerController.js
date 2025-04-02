import bcrypt from 'bcryptjs';
import Buyer from '../models/Buyer.js';
import { generateToken } from '../config/auth.js';

// 🔹 Buyer Signup
export const registerBuyer = async (req, res) => {
    const { name, email, password, phone, country } = req.body;

    try {
        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) {
            return res.status(400).json({ message: 'Buyer already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newBuyer = new Buyer({ name, email, password: hashedPassword, phone, country });
        await newBuyer.save();

        res.status(201).json({ message: 'Buyer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Buyer Login
export const loginBuyer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const buyer = await Buyer.findOne({ email });
        if (!buyer || !(await bcrypt.compare(password, buyer.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (buyer.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked' });
        }

        res.json({
            _id: buyer._id,
            name: buyer.name,
            email: buyer.email,
            phone: buyer.phone,
            country: buyer.country,
            kycStatus: buyer.kycStatus,
            token: generateToken(buyer),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Upload KYC Document
export const uploadKYC = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.user.id);
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        buyer.kycDocument = req.file.path;
        buyer.kycStatus = 'pending';
        await buyer.save();

        res.json({ message: 'KYC document uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 List All Buyers (Admin Only)
export const listBuyers = async (req, res) => {
    try {
        const buyers = await Buyer.find().select('-password');
        res.json(buyers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Approve/Reject Buyer KYC
export const updateKYCStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const buyer = await Buyer.findById(req.params.id);
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        buyer.kycStatus = status;
        await buyer.save();

        res.json({ message: `KYC ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Block/Unblock Buyer
export const toggleBuyerBlock = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.params.id);
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        buyer.isBlocked = !buyer.isBlocked;
        await buyer.save();

        res.json({ message: `Buyer ${buyer.isBlocked ? 'blocked' : 'unblocked'}` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get Buyer By ID
export const getBuyerById = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.params.id).select('-password');
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        res.json(buyer);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Delete Buyer (Admin Only)
export const deleteBuyer = async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.params.id);
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        await buyer.deleteOne();
        res.json({ message: 'Buyer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
