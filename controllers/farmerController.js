import bcrypt from 'bcryptjs';
import Farmer from '../models/Farmer.js';
import { generateToken } from '../config/auth.js';
import FarmerProduct from '../models/FarmerProduct.js';

// 🔹 Farmer Registration
export const registerFarmer = async (req, res) => {
    const { name, email, password, phone, country } = req.body;

    try {
        const existingFarmer = await Farmer.findOne({ email });
        if (existingFarmer) {
            return res.status(400).json({ message: 'Farmer already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newFarmer = new Farmer({ name, email, password: hashedPassword, phone, country });
        await newFarmer.save();

        res.status(201).json({ message: 'Farmer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Farmer Login
export const loginFarmer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const farmer = await Farmer.findOne({ email });
        if (!farmer || !(await bcrypt.compare(password, farmer.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: farmer._id,
            name: farmer.name,
            email: farmer.email,
            phone: farmer.phone,
            country: farmer.country,
            token: generateToken(farmer),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 List Farmer's Products (With Filters)
export const listFarmerProducts = async (req, res) => {
    try {
        const { category, name } = req.query;
        const query = { farmer: req.user.id };

        if (category) query.category = category;
        if (name) query.name = new RegExp(name, 'i');

        const products = await FarmerProduct.find(query).populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get Product Details
export const getProductDetails = async (req, res) => {
    try {
        const product = await FarmerProduct.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Add New Product (Farmer)
export const createFarmerProduct = async (req, res) => {
    const { name, category, price, quantity } = req.body;

    try {
        const newProduct = new FarmerProduct({
            farmer: req.user.id,
            name,
            category,
            price,
            quantity
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 List Orders for Farmer's Products
export const listFarmerOrders = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const orders = await Order.find({ 'items.farmer': farmerId }).populate('buyer');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
