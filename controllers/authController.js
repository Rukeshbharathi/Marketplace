import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Farmer from '../models/Farmer.js';
import Buyer from '../models/Buyer.js';
import { generateToken } from '../config/auth.js';  // Token generation utility

// Register Admin (Super Admin only)
export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if Admin exists
        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Admin Login
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

// Register Farmer
export const registerFarmer = async (req, res) => {
    const { name, email, password, country } = req.body;

    try {
        // Check if farmer exists
        const farmerExists = await Farmer.findOne({ email });
        if (farmerExists) {
            return res.status(400).json({ message: 'Farmer already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new farmer
        const newFarmer = new Farmer({ name, email, password: hashedPassword, country });
        await newFarmer.save();

        // Send success response
        res.status(201).json({ message: 'Farmer registered successfully' });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error during registration:", error);

        // Return error response with proper message
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// Farmer Login
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
            role: farmer.role,
            token: generateToken(farmer),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Register Buyer
export const registerBuyer = async (req, res) => {
    const { name, email, password, country } = req.body;

    try {
        const buyerExists = await Buyer.findOne({ email });
        if (buyerExists) {
            return res.status(400).json({ message: 'Buyer already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newBuyer = new Buyer({ name, email, password: hashedPassword, country });
        await newBuyer.save();

        res.status(201).json({ message: 'Buyer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Buyer Login
export const loginBuyer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const buyer = await Buyer.findOne({ email });
        if (!buyer || !(await bcrypt.compare(password, buyer.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: buyer._id,
            name: buyer.name,
            email: buyer.email,
            role: buyer.role,
            token: generateToken(buyer),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Middleware to Protect Routes (check if user is logged in)
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware to Check Admin Role
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an Admin' });
    }
};

// Middleware to Check Farmer Role
export const isFarmer = (req, res, next) => {
    if (req.user && req.user.role === 'farmer') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a Farmer' });
    }
};

// Middleware to Check Buyer Role
export const isBuyer = (req, res, next) => {
    if (req.user && req.user.role === 'buyer') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a Buyer' });
    }
};
