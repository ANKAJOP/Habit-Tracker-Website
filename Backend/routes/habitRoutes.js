import express from "express";
import {
  addHabit,
  getHabits,
  markHabitDone,
  deleteHabit,
  resetHabit,
  getMissedDays,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addHabit);             // Create habit
router.get("/", protect, getHabits);               // Get all habits
router.put("/:id/complete", protect, markHabitDone); // Mark done today
router.delete("/:id", protect, deleteHabit);       // Delete habit
router.put("/:id/reset", protect, resetHabit);
router.get("/:id/missed", protect, getMissedDays);
export default router;
