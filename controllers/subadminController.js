import bcrypt from 'bcryptjs';
import SubAdmin from '../models/SubAdmin.js';
import { generateToken } from '../config/auth.js';

// 🔹 SubAdmin Login
export const loginSubAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const subAdmin = await SubAdmin.findOne({ email });
        if (!subAdmin || !(await bcrypt.compare(password, subAdmin.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: subAdmin._id,
            name: subAdmin.name,
            email: subAdmin.email,
            role: subAdmin.role,
            token: generateToken(subAdmin),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Create SubAdmin
export const createSubAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const subAdminExists = await SubAdmin.findOne({ email });
        if (subAdminExists) {
            return res.status(400).json({ message: 'SubAdmin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newSubAdmin = new SubAdmin({ name, email, password: hashedPassword });
        await newSubAdmin.save();

        res.status(201).json({ message: 'SubAdmin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get All SubAdmins
export const getSubAdmins = async (req, res) => {
    try {
        const subAdmins = await SubAdmin.find().select('-password');
        res.json(subAdmins);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get SubAdmin By ID
export const getSubAdminById = async (req, res) => {
    try {
        const subAdmin = await SubAdmin.findById(req.params.id).select('-password');
        if (!subAdmin) return res.status(404).json({ message: 'SubAdmin not found' });

        res.json(subAdmin);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Update SubAdmin
export const updateSubAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const subAdmin = await SubAdmin.findById(req.params.id);
        if (!subAdmin) return res.status(404).json({ message: 'SubAdmin not found' });

        subAdmin.name = name || subAdmin.name;
        subAdmin.email = email || subAdmin.email;

        if (password) {
            subAdmin.password = await bcrypt.hash(password, 10);
        }

        await subAdmin.save();
        res.json({ message: 'SubAdmin updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Delete SubAdmin
export const deleteSubAdmin = async (req, res) => {
    try {
        const subAdmin = await SubAdmin.findById(req.params.id);
        if (!subAdmin) return res.status(404).json({ message: 'SubAdmin not found' });

        await subAdmin.deleteOne();
        res.json({ message: 'SubAdmin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
