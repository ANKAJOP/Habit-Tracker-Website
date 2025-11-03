import User from "../models/User.js";
import Habit from "../models/Habit.js";
import ClaimedReward from "../models/ClaimedReward.js";

// 🎯 HARDCODED REWARDS - Same as frontend
const HARDCODED_REWARDS = [
  {
    _id: "reward1",
    title: "Premium Coffee",
    pointsRequired: 5,
  },
  {
    _id: "reward2",
    title: "Movie Ticket",
    pointsRequired: 10,
  },
  {
    _id: "reward3",
    title: "Gym Day Pass",
    pointsRequired: 8,
  },
  {
    _id: "reward4",
    title: "Book Voucher",
    pointsRequired: 15,
  },
  {
    _id: "reward5",
    title: "Spotify Premium",
    pointsRequired: 20,
  },
  {
    _id: "reward6",
    title: "Pizza Meal",
    pointsRequired: 12,
  },
  {
    _id: "reward7",
    title: "Yoga Class",
    pointsRequired: 7,
  },
  {
    _id: "reward8",
    title: "Amazon Gift Card",
    pointsRequired: 25,
  }
];

// 1️⃣ Update daily points


export const updateDailyPoints = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toDateString();

    // ⚡ OPTIMIZED: Get all active habits for today with minimal fields
    const habits = await Habit.find({ 
      user: userId,
      startDate: { $lte: today },
      endDate: { $gte: today }
    }).select('completedDates').lean(); // Only fetch completedDates, use lean for speed

    if (!habits.length) {
      return res.json({ 
        points: req.user.points, 
        streak: req.user.streak, 
        claimedRewards: req.user.claimedRewards,
        message: "No active habits for today",
        allCompleted: false,
        completedCount: 0,
        totalHabits: 0
      });
    }

    // Check if ALL habits are completed today
    let completedCount = 0;
    const allHabitsCompleted = habits.every(habit => {
      const isCompleted = habit.completedDates.some(date => 
        new Date(date).toDateString() === todayStr
      );
      if (isCompleted) completedCount++;
      return isCompleted;
    });

    const user = await User.findById(userId);
    const lastPointDate = user.lastPointDate ? new Date(user.lastPointDate) : null;
    const pointsAlreadyAddedToday = lastPointDate && lastPointDate.toDateString() === todayStr;

    // ⚡ OPTIMIZED: Calculate streak more efficiently
    // Instead of querying DB for each day, use a smarter approach
    let streak = 0;
    
    if (allHabitsCompleted) {
      // Today is complete, check consecutive days backwards
      let dayPointer = new Date(today);
      let maxDaysToCheck = 365; // Limit to prevent infinite loops
      
      for (let i = 0; i < maxDaysToCheck; i++) {
        const dayStr = dayPointer.toDateString();
        
        // Check if ALL current habits were completed on this specific day
        const allCompletedOnDay = habits.every(h =>
          h.completedDates.some(d => new Date(d).toDateString() === dayStr)
        );

        if (!allCompletedOnDay) break;

        streak += 1;
        dayPointer.setDate(dayPointer.getDate() - 1);
      }
    } else {
      // If today not complete, use yesterday's streak from user record
      // This prevents recalculating the entire streak every time
      streak = user.streak;
    }

    // Award points ONLY if all habits completed today and points not already added
    if (allHabitsCompleted && !pointsAlreadyAddedToday) {
      user.points += 1; // Award 1 point for completing all habits
      user.streak = streak;
      user.lastPointDate = today;
      await user.save();

      return res.json({ 
        points: user.points, 
        streak: user.streak, 
        claimedRewards: user.claimedRewards,
        message: `🎉 Great job! All habits completed! +1 point awarded.`,
        allCompleted: true,
        completedCount,
        totalHabits: habits.length
      });
    } 
    
    // Update streak but don't add points if not all completed
    user.streak = streak;
    await user.save();

    res.json({ 
      points: user.points, 
      streak: user.streak, 
      claimedRewards: user.claimedRewards,
      message: pointsAlreadyAddedToday 
        ? "Points already awarded for today" 
        : `Complete all habits to earn points! (${completedCount}/${habits.length} completed)`,
      allCompleted: false,
      completedCount,
      totalHabits: habits.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update points/streak" });
  }
};


// 2️⃣ Get all available rewards (REMOVED - Now using hardcoded data in frontend)
// This endpoint is no longer needed

// 3️⃣ Claim reward
export const claimReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    const userId = req.user._id;

    // Find the reward from hardcoded data
    const reward = HARDCODED_REWARDS.find(r => r._id === rewardId);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has enough points
    if (user.points < reward.pointsRequired) {
      return res.status(400).json({ 
        message: `Not enough points! You need ${reward.pointsRequired} points but have ${user.points}.` 
      });
    }

    // Check if reward already claimed by this user
    const alreadyClaimed = await ClaimedReward.findOne({ userId, rewardId });
    if (alreadyClaimed) {
      return res.status(400).json({ 
        message: "You have already claimed this reward!" 
      });
    }

    // Generate unique reward code
    const rewardCode = `${reward.title.replace(/\s+/g, '').substring(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    // Deduct points from user
    user.points -= reward.pointsRequired;
    await user.save();

    // Create claimed reward record in separate table
    const claimedReward = await ClaimedReward.create({
      userId: userId,
      rewardId: reward._id,
      rewardTitle: reward.title,
      pointsSpent: reward.pointsRequired,
      redemptionCode: rewardCode,
      status: "pending"
    });

    res.json({
      message: `Successfully claimed ${reward.title}!`,
      newPoints: user.points,
      link: rewardCode,
      claimedReward: {
        id: claimedReward._id,
        rewardTitle: claimedReward.rewardTitle,
        redemptionCode: claimedReward.redemptionCode,
        claimedAt: claimedReward.claimedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to claim reward", error: error.message });
  }
};

// 4️⃣ Get user's claimed rewards from separate table
export const getClaimedRewards = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const claimedRewards = await ClaimedReward.find({ userId })
      .sort({ claimedAt: -1 })
      .lean();

    res.json(claimedRewards);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch claimed rewards", error: error.message });
  }
};
