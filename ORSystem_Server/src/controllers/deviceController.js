const deviceModel = require("../models/deviceModel");
const venueModel = require("../models/venueModal");

// Helper function to generate Base64 API key
const generateApiKey = (deviceId, conditions) => {
    const data = JSON.stringify({ deviceId, conditions });
    return Buffer.from(data).toString("base64");
};


const createDevice = async (req, res) => {
    try {
        const { deviceId, venueId, conditions } = req.body;

        // 1️⃣ Basic field validation
        if (!deviceId || !venueId) {
            return res.status(400).json({ message: "deviceId and venueId are required" });
        }

        // 2️⃣ Check venue existence
        const venue = await venueModel.findById(venueId);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        // 3️⃣ Prevent duplicate device
        const existing = await deviceModel.findOne({ deviceId });
        if (existing) {
            return res.status(400).json({ message: "Device ID already exists" });
        }

        // 4️⃣ Validate conditions array
        if (conditions) {
            if (!Array.isArray(conditions)) {
                return res.status(400).json({ message: "Conditions must be an array" });
            }

            for (const cond of conditions) {
                // Required keys
                if (!cond.type || !cond.operator || cond.value === undefined) {
                    return res.status(400).json({
                        message: "Each condition must include type, operator, and value",
                    });
                }

                // Allowed type values
                const validTypes = ["temperature", "humidity", "odour"];
                if (!validTypes.includes(cond.type)) {
                    return res.status(400).json({
                        message: `Invalid type "${cond.type}". Allowed types: ${validTypes.join(", ")}`,
                    });
                }

                // Allowed operators
                const validOps = [">", "<", "="];
                if (!validOps.includes(cond.operator)) {
                    return res.status(400).json({
                        message: `Invalid operator "${cond.operator}". Allowed operators: >, <, =`,
                    });
                }

                // Type-based validation
                if (cond.type === "odour") {
                    if (typeof cond.value !== "boolean") {
                        return res.status(400).json({
                            message: `Value for odour must be boolean (true/false)`,
                        });
                    }
                } else {
                    if (typeof cond.value !== "number" || !Number.isFinite(cond.value)) {
                        return res.status(400).json({
                            message: `Value for ${cond.type} must be a valid number`,
                        });
                    }
                }
            }
        }

        // 5️⃣ Generate API Key
        const apiKey = generateApiKey(deviceId, conditions || []);

        // 6️⃣ Save device
        const newDevice = await deviceModel.create({
            deviceId,
            venue: venueId,
            conditions: conditions || [],
            apiKey,
        });

        return res.status(201).json({
            message: "Device created successfully",
            device: newDevice,
        });
    } catch (error) {
        console.error("Error creating device:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const getAllDevices = async (req, res) => {
    try {
        const devices = await deviceModel.find()
            .populate("venue", "name")
        res.status(200).json(devices);
    } catch (err) {
        console.error("Error fetching devices:", err);
        res.status(500).json({ message: "Failed to fetch devices" });
    }
};

const getSingleDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const device = await deviceModel.findById(id).populate("venue", "name");
        res.status(200).json({ device });
    } catch (error) {
        console.log("error while fetching device", error.message);
        res.status(500).json({ message: "Failed to fetch device" });
    }
}

const getDevicesByVenue = async (req, res) => {
    try {
        const { venueId } = req.params;

        if (!venueId) {
            return res.status(400).json({ message: "Venue ID is required" });
        }

        const devices = await deviceModel.find({ venue: venueId }).populate("venue", "name");

        if (!devices.length) {
            return res.status(404).json({ message: "No devices found for this venue" });
        }

        res.status(200).json({ devices });
    } catch (error) {
        console.error("Error fetching devices by venue:", error.message);
        res.status(500).json({ message: "Failed to fetch devices" });
    }
};


const updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const { deviceId, venueId, conditions } = req.body;

        const device = await deviceModel.findById(id);
        if (!device) return res.status(404).json({ message: "Device not found" });

        if (venueId) {
            const venue = await venueModel.findById(venueId);
            if (!venue) return res.status(404).json({ message: "Venue not found" });
        }

        if (conditions && !Array.isArray(conditions)) {
            return res.status(400).json({ message: "Conditions must be an array" });
        }

        if (conditions && conditions.length > 0) {
            for (const cond of conditions) {
                if (!cond.type || !cond.operator || cond.value === undefined) {
                    return res.status(400).json({
                        message: "Each condition must include type, operator, and value",
                    });
                }
            }
        }

        if (deviceId) device.deviceId = deviceId;
        if (venueId) device.venue = venueId;
        if (conditions) device.conditions = conditions;

        const newApiKey = generateApiKey(device.deviceId, device.conditions);
        device.apiKey = newApiKey;

        await device.save();

        res.status(200).json({
            message: "Device updated successfully",
            device,
        });

    } catch (error) {
        console.error("Error updating device:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deviceModel.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: "Device not found" });
        res.status(200).json({ message: "Device deleted successfully" });
    } catch (err) {
        console.error("Error deleting device:", err);
        res.status(500).json({ message: "Failed to delete device" });
    }
};



module.exports = { createDevice, getDevicesByVenue, getAllDevices, deleteDevice, updateDevice, getSingleDevice };
