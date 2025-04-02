import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Farmer from '../models/Farmer.js';
import Buyer from '../models/Buyer.js';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await (Admin.findById(decoded.id) || Farmer.findById(decoded.id) || Buyer.findById(decoded.id));

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Role-based authorization
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

export const isFarmer = (req, res, next) => {
    if (req.user && req.user.role === 'farmer') {
        next();
    } else {
        res.status(403).json({ message: 'Farmer access required' });
    }
};

export const isBuyer = (req, res, next) => {
    if (req.user && req.user.role === 'buyer') {
        next();
    } else {
        res.status(403).json({ message: 'Buyer access required' });
    }

    
};
