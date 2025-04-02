import { sendEmail } from "../utils/emailService.js";
import Buyer from "../models/Buyer.js";
import Order from "../models/Order.js";
import Farmer from "../models/Farmer.js";

// KYC Approval/Rejection Notification
export const notifyKYCStatus = async (req, res) => {
    const { buyerId, status } = req.body;

    const buyer = await Buyer.findById(buyerId);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    const message = status === "approved"
        ? `Your KYC has been approved. You can now place orders.`
        : `Your KYC has been rejected. Please submit correct documents.`;

    await sendEmail(buyer.email, "KYC Status Update", message);
    res.status(200).json({ message: "Notification sent" });
};

// Order Confirmation Notification
export const notifyOrderConfirmation = async (orderId) => {
    const order = await Order.findById(orderId).populate("buyer").populate("farmer");

    if (!order) return console.error("Order not found");

    const buyerEmail = order.buyer.email;
    const farmerEmail = order.farmer.email;

    await sendEmail(buyerEmail, "Order Confirmation", `Your order for ${order.quantity} units has been placed.`);
    await sendEmail(farmerEmail, "New Order Received", `You have received an order for ${order.quantity} units.`);

    console.log("Order confirmation emails sent.");
};
