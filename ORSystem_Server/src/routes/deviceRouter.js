const express = require("express");
const { createDevice, getAllDevices, deleteDevice, updateDevice, getSingleDevice, getDevicesByVenue } = require("../controllers/deviceController");
const adminOnly = require("../middlewere/adminOnly");
const router = express.Router();


router.post("/add",  createDevice);
router.put("/update/:id",  updateDevice)
router.get("/all-devices", getAllDevices);
router.get("/single-device/:id", getSingleDevice);
router.get("/device-by-venue/:venueId", getDevicesByVenue);
router.delete("/delete/:id",  deleteDevice);


module.exports = router;