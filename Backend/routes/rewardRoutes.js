import express from "express";
import { 
  claimReward, 
  updateDailyPoints,
  getClaimedRewards
} from "../controllers/rewardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/update-points", protect, updateDailyPoints);
router.get("/claimed", protect, getClaimedRewards);
router.post("/claim", protect, claimReward);

export default router;
