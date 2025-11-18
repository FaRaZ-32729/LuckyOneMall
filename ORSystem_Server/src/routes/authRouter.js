const express = require("express");
const { registerUser, loginUser, registerAdmin,  setPassword, verifyOTP, forgotPassword, logoutUser, resetPassword, verifyMe, createUser } = require("../controllers/authController");
const authenticate = require("../middlewere/authMiddleware");
const adminOnly = require("../middlewere/adminOnly");

const router = express.Router()

router.post("/register-admin", registerAdmin);
router.post("/login", loginUser);
router.post("/register", authenticate, createUser);
router.post("/set-password/:token", setPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/verify-otp/:token", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/logout", authenticate, logoutUser);   
router.get('/verify/me', authenticate, verifyMe);


module.exports = router;
