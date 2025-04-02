import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import SubAdmin from '../models/SubAdmin.js';
import Farmer from '../models/Farmer.js';
import Buyer from '../models/Buyer.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { generateToken } from '../config/auth.js';

// 🔹 Admin Login
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Create Subadmin
export const createSubAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const subAdminExists = await SubAdmin.findOne({ email });
        if (subAdminExists) {
            return res.status(400).json({ message: 'Subadmin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newSubAdmin = new SubAdmin({ name, email, password: hashedPassword });
        await newSubAdmin.save();

        res.status(201).json({ message: 'Subadmin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get All Farmers (with Search by Name, Email, Phone, Country)
export const getFarmers = async (req, res) => {
    const { search } = req.query;
    let query = {};

    if (search) {
        query = {
            $or: [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
                { country: new RegExp(search, 'i') }
            ]
        };
    }

    try {
        const farmers = await Farmer.find(query);
        res.json(farmers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Approve/Reject Buyer KYC
export const approveRejectBuyerKYC = async (req, res) => {
    const { buyerId, status } = req.body;

    try {
        const buyer = await Buyer.findById(buyerId);
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        buyer.kycStatus = status;
        await buyer.save();

        res.json({ message: `KYC ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Block/Unblock Buyer
export const blockUnblockBuyer = async (req, res) => {
    const { buyerId, status } = req.body;

    try {
        const buyer = await Buyer.findById(buyerId);
        if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

        buyer.isBlocked = status;
        await buyer.save();

        res.json({ message: `Buyer ${status ? 'Blocked' : 'Unblocked'} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Create Category
export const createCategory = async (req, res) => {
    const { name } = req.body;

    try {
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) return res.status(400).json({ message: 'Category already exists' });

        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Approve/Reject Farmer Product
export const approveRejectProduct = async (req, res) => {
    const { productId, status } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.approvalStatus = status;
        await product.save();

        res.json({ message: `Product ${status} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
