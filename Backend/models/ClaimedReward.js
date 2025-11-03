import mongoose from "mongoose";

const claimedRewardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  rewardId: {
    type: String,
    required: true
  },
  rewardTitle: {
    type: String,
    required: true
  },
  pointsSpent: {
    type: Number,
    required: true
  },
  redemptionCode: {
    type: String,
    required: true,
    unique: true // This creates the index automatically
  },
  claimedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "redeemed", "expired"],
    default: "pending"
  }
}, {
  timestamps: true
});

// Create compound index for faster queries
claimedRewardSchema.index({ userId: 1, rewardId: 1 });
// redemptionCode index is created automatically by unique: true

export default mongoose.model("ClaimedReward", claimedRewardSchema);
