import FarmerProduct from '../models/FarmerProduct.js';
import Product from '../models/Product.js';

// 🔹 Create a Farmer Product (Farmer Only)
export const createFarmerProduct = async (req, res) => {
    const { product, quantity, price } = req.body;

    try {
        const productExists = await Product.findById(product);
        if (!productExists) return res.status(404).json({ message: 'Product not found' });

        const newFarmerProduct = new FarmerProduct({
            farmer: req.user.id,
            product,
            quantity,
            price,
            status: 'pending'
        });

        await newFarmerProduct.save();
        res.status(201).json({ message: 'Farmer product created successfully', farmerProduct: newFarmerProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 List Farmer Products (Farmers & Buyers)
export const listFarmerProducts = async (req, res) => {
    try {
        const { product, minPrice, maxPrice } = req.query;
        const query = {};

        if (product) query.product = product;
        if (minPrice) query.price = { $gte: minPrice };
        if (maxPrice) query.price = { $lte: maxPrice };

        const farmerProducts = await FarmerProduct.find(query).populate('product farmer');
        res.json(farmerProducts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get Farmer Product Details
export const getFarmerProductDetails = async (req, res) => {
    try {
        const farmerProduct = await FarmerProduct.findById(req.params.id).populate('product farmer');
        if (!farmerProduct) return res.status(404).json({ message: 'Farmer product not found' });

        res.json(farmerProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Update Farmer Product (Farmer Only)
export const updateFarmerProduct = async (req, res) => {
    try {
        const { quantity, price } = req.body;
        const farmerProduct = await FarmerProduct.findById(req.params.id);

        if (!farmerProduct) return res.status(404).json({ message: 'Farmer product not found' });

        if (farmerProduct.farmer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        farmerProduct.quantity = quantity || farmerProduct.quantity;
        farmerProduct.price = price || farmerProduct.price;

        await farmerProduct.save();
        res.json({ message: 'Farmer product updated successfully', farmerProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Delete Farmer Product (Farmer Only)
export const deleteFarmerProduct = async (req, res) => {
    try {
        const farmerProduct = await FarmerProduct.findById(req.params.id);
        if (!farmerProduct) return res.status(404).json({ message: 'Farmer product not found' });

        if (farmerProduct.farmer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await farmerProduct.deleteOne();
        res.json({ message: 'Farmer product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Approve or Reject a Farmer Product (Admin Only)
export const approveRejectFarmerProduct = async (req, res) => {
    try {
        const { status } = req.body;
        const farmerProduct = await FarmerProduct.findById(req.params.id);

        if (!farmerProduct) return res.status(404).json({ message: 'Farmer product not found' });
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        farmerProduct.status = status;
        await farmerProduct.save();

        res.json({ message: `Farmer product ${status} successfully`, farmerProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
