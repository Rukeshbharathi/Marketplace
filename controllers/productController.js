import Product from '../models/Product.js';
import FarmerProduct from '../models/FarmerProduct.js';
import Category from '../models/Category.js';

// 🔹 Create a Product (Admin Only)
export const createProduct = async (req, res) => {
    const { name, category, description, image } = req.body;

    try {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) return res.status(404).json({ message: 'Category not found' });

        const newProduct = new Product({
            name,
            category,
            description,
            image,
            createdBy: req.user.id,
            status: 'pending'
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 List All Products (Admin / Farmers / Buyers)
export const listProducts = async (req, res) => {
    try {
        const { category, name } = req.query;
        const query = {};

        if (category) query.category = category;
        if (name) query.name = new RegExp(name, 'i');

        const products = await Product.find(query).populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get Product Details
export const getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Update Product (Admin Only)
export const updateProduct = async (req, res) => {
    try {
        const { name, category, description, image } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = name || product.name;
        product.category = category || product.category;
        product.description = description || product.description;
        product.image = image || product.image;

        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Delete Product (Admin Only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete all related FarmerProducts
        await FarmerProduct.deleteMany({ product: product._id });

        await product.deleteOne();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Approve or Reject a Product (Admin Only)
export const approveRejectProduct = async (req, res) => {
    try {
        const { status } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        product.status = status;
        await product.save();

        res.json({ message: `Product ${status} successfully`, product });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
