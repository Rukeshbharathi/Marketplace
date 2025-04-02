import Shipment from '../models/Shipment.js';

// 🔹 Define a Shipment (Admin Only)
export const defineShipment = async (req, res) => {
    const { fromCountry, toCountry, shippingCost, estimatedDelivery } = req.body;

    try {
        const existingShipment = await Shipment.findOne({ fromCountry, toCountry });
        if (existingShipment) {
            return res.status(400).json({ message: 'Shipment route already exists' });
        }

        const shipment = new Shipment({ fromCountry, toCountry, shippingCost, estimatedDelivery });
        await shipment.save();

        res.status(201).json({ message: 'Shipment route added successfully', shipment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 List Shipments
export const listShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find();
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Get Shipment Details
export const getShipmentDetails = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Update Shipment (Admin Only)
export const updateShipment = async (req, res) => {
    try {
        const { fromCountry, toCountry, shippingCost, estimatedDelivery } = req.body;
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        shipment.fromCountry = fromCountry || shipment.fromCountry;
        shipment.toCountry = toCountry || shipment.toCountry;
        shipment.shippingCost = shippingCost || shipment.shippingCost;
        shipment.estimatedDelivery = estimatedDelivery || shipment.estimatedDelivery;

        await shipment.save();
        res.json({ message: 'Shipment updated successfully', shipment });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Delete Shipment (Admin Only)
export const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        await shipment.deleteOne();
        res.json({ message: 'Shipment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// 🔹 Check Shipment Availability
export const checkShipmentAvailability = async (req, res) => {
    const { fromCountry, toCountry } = req.body;

    try {
        const shipment = await Shipment.findOne({ fromCountry, toCountry });
        if (!shipment) return res.status(404).json({ message: 'No shipment available between these countries' });

        res.json({ available: true, shippingCost: shipment.shippingCost, estimatedDelivery: shipment.estimatedDelivery });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
