import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import SubAdmin from "../models/SubAdmin.js";
import Farmer from "../models/Farmer.js";
import Buyer from "../models/Buyer.js";

// ✅ Generic Authentication Middleware (Checks for Token & Finds User)
const authMiddleware = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user in different collections
        let user = await Admin.findById(decoded.id).select("-password") ||
            await SubAdmin.findById(decoded.id).select("-password") ||
            await Farmer.findById(decoded.id).select("-password") ||
            await Buyer.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // Attach user data to request object
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// ✅ Protect Routes (Require Authentication)
export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        req.user = await Admin.findById(decoded.id).select("-password") ||
            await SubAdmin.findById(decoded.id).select("-password") ||
            await Farmer.findById(decoded.id).select("-password") ||
            await Buyer.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// ✅ Specific Role-Based Middleware
export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only" });
    }
    next();
};

export const isFarmer = (req, res, next) => {
    if (req.user?.role !== "farmer") {
        return res.status(403).json({ message: "Access denied. Farmers only" });
    }
    next();
};

export const isBuyer = (req, res, next) => {
    if (req.user?.role !== "buyer") {
        return res.status(403).json({ message: "Access denied. Buyers only" });
    }
    next();
};

// ✅ Restrict Routes Based on Roles (Allow Multiple Roles)
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied" });
        }
        next();
    };
};

export default authMiddleware;
