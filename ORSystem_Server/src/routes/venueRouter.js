const express = require("express");
const { createVenue, getVenues, updateVenue, deleteVenue, getSingleVenue, getVenuesByOrganization } = require("../controllers/venueController");
const adminOnly = require("../middlewere/adminOnly");
const adminOrAdminCreatedUser = require("../middlewere/adminOrAdminCreatedUser");

const router = express.Router();

router.post("/add", adminOrAdminCreatedUser, createVenue);
router.get("/all", adminOnly, getVenues);
router.get("/single-venue/:id", getSingleVenue);
router.get("/venue-by-org/:organizationId", adminOrAdminCreatedUser, getVenuesByOrganization);
router.put("/update/:id", adminOrAdminCreatedUser, updateVenue);
router.delete("/delete/:id", adminOrAdminCreatedUser, deleteVenue);

module.exports = router;