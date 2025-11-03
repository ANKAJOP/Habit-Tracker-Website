import express from "express";
import { sendMessage } from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", sendMessage); // Anyone can send a message, logged-in or anonymous

export default router;
