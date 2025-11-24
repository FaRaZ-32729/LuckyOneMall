const express = require("express");
const { getAllUsers, updateUserStatus, updateUserProfile, deleteUser, getUsersByOrganizationId, addVenueToUser, removeVenueFromUser, getUserStatus } = require("../controllers/userController");
const adminOnly = require("../middlewere/adminOnly");
const authenticate = require("../middlewere/authMiddleware");

const router = express.Router();

router.post("/:userId/add-venue", addVenueToUser);
router.put("/update-status/:id", authenticate, adminOnly, updateUserStatus);
router.get("/all", getAllUsers);
router.get("/status/:userId", getUserStatus);
router.get("/:orgId", getUsersByOrganizationId)
router.put("/update/:id", authenticate, adminOnly, updateUserProfile);
router.delete("/delete/:id", authenticate, adminOnly, deleteUser);
router.delete("/:userId/delete/:venueId", removeVenueFromUser);


module.exports = router;