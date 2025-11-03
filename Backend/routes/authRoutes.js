import express from "express";
import { registerUser, loginUser, getProfile, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", registerUser);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", loginUser);

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", protect, getProfile);

//change password
router.put("/change-password", protect, changePassword);


export default router;
