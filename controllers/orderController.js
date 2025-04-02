import Order from '../models/Order.js';
import FarmerProduct from '../models/FarmerProduct.js';
import { sendEmail } from '../utils/emailService.js';

// 🔹 Create an Order (Buyer Only)
export const createOrder = async (req, res) => {
    const { farmerProduct, quantity } = req.body;

    try {
        const product = await FarmerProduct.findById(farmerProduct).populate('farmer product');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (quantity > product.quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const totalPrice = product.price * quantity;

        const newOrder = new Order({
            buyer: req.user.id,
            farmerProduct,
            quantity,
            totalPrice,
            status: 'pending'
        });

        await newOrder.save();

        // Deduct ordered quantity from Farmer Product stock
        product.quantity -= quantity;
        await product.save();

        // Send email notification
        await sendEmail(req.user.email, 'Order Confirmation', `Your order for ${product.product.name} has been placed.`);

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 List Orders (Buyer & Farmer)
export const listOrders = async (req, res) => {
    try {
        const query = {};

        if (req.user.role === 'buyer') {
            query.buyer = req.user.id;
        } else if (req.user.role === 'farmer') {
            const farmerProducts = await FarmerProduct.find({ farmer: req.user.id }).select('_id');
            query.farmerProduct = { $in: farmerProducts };
        }

        const orders = await Order.find(query).populate('buyer farmerProduct');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get Order Details
export const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('buyer farmerProduct');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Update Order Status (Admin Only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (!['confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        order.status = status;
        await order.save();

        // Send email notification
        await sendEmail(order.buyer.email, 'Order Status Update', `Your order is now ${status}.`);

        res.json({ message: `Order status updated to ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Cancel Order (Buyer Only)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.buyer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot cancel order after confirmation' });
        }

        order.status = 'cancelled';
        await order.save();

        // Refund stock to Farmer Product
        const product = await FarmerProduct.findById(order.farmerProduct);
        product.quantity += order.quantity;
        await product.save();

        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
