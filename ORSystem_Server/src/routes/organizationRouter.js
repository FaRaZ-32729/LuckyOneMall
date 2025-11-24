const express = require("express");
const { createOrganization, getOrganizations, updateOrganization, deleteOrganization, getOrganizationByUserId } = require("../controllers/organizationController");
const adminOnly = require("../middlewere/adminOnly");

const router = express.Router();

router.post("/new-org", createOrganization);
router.get("/all-org", getOrganizations);
router.get("/:userId", getOrganizationByUserId);
router.put("/update/:id", updateOrganization);
router.delete("/delete/:id", deleteOrganization);

module.exports = router