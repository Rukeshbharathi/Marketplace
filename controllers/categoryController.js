import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Create Category
export const createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category' });
    }
};

// Get All Categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category' });
    }
};

// Delete Category (Also Deletes Related Products)
export const deleteCategory = async (req, res) => {
    try {
        await Product.deleteMany({ category: req.params.id });
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category and related products deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};
