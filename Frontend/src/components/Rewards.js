import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// 🎯 HARDCODED REWARDS DATA - No DB fetch needed!
const HARDCODED_REWARDS = [
  {
    _id: "reward1",
    title: "Premium Coffee",
    description: "Enjoy a delicious premium coffee at your favorite café",
    pointsRequired: 5,
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    category: "Food & Drink",
    stock: 100
  },
  {
    _id: "reward2",
    title: "Movie Ticket",
    description: "Watch the latest blockbuster at any theater near you",
    pointsRequired: 10,
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400",
    category: "Entertainment",
    stock: 50
  },
  {
    _id: "reward3",
    title: "Gym Day Pass",
    description: "Get a free day pass to a premium fitness center",
    pointsRequired: 8,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    category: "Health & Fitness",
    stock: 30
  },
  {
    _id: "reward4",
    title: "Book Voucher",
    description: "$20 voucher for your favorite online bookstore",
    pointsRequired: 15,
    imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
    category: "Education",
    stock: 25
  },
  {
    _id: "reward5",
    title: "Spotify Premium",
    description: "1 month of Spotify Premium subscription",
    pointsRequired: 20,
    imageUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400",
    category: "Entertainment",
    stock: 20
  },
  {
    _id: "reward6",
    title: "Pizza Meal",
    description: "Large pizza with 2 toppings from popular chains",
    pointsRequired: 12,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    category: "Food & Drink",
    stock: 40
  },
  {
    _id: "reward7",
    title: "Yoga Class",
    description: "Single session at a premium yoga studio",
    pointsRequired: 7,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    category: "Health & Fitness",
    stock: 15
  },
  {
    _id: "reward8",
    title: "Amazon Gift Card",
    description: "$25 Amazon gift card for any purchase",
    pointsRequired: 25,
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400",
    category: "Shopping",
    stock: 35
  }
];

const RewardPage = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  const [rewards] = useState(HARDCODED_REWARDS); // Use hardcoded data
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [progressMessage, setProgressMessage] = useState("");
  const [allCompleted, setAllCompleted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalHabits, setTotalHabits] = useState(0);
  const [loading, setLoading] = useState(false); // Set to false for instant display
  const [message, setMessage] = useState("");

  const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : null;

  // Fetch only user points and claimed rewards from DB
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        return;
      }

      try {
        // Fetch in background, UI already visible
        const [pointsRes, claimedRes] = await Promise.all([
          axios.get(`${API_URL}/api/rewards/update-points`, config),
          axios.get(`${API_URL}/api/rewards/claimed`, config)
        ]);

        setPoints(pointsRes.data.points);
        setStreak(pointsRes.data.streak);
        setProgressMessage(pointsRes.data.message || "");
        setAllCompleted(pointsRes.data.allCompleted || false);
        setCompletedCount(pointsRes.data.completedCount || 0);
        setTotalHabits(pointsRes.data.totalHabits || 0);
        
        // Map claimed rewards from separate table
        const claimed = claimedRes.data.map(cr => ({ rewardId: cr.rewardId }));
        setClaimedRewards(claimed);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData(); // Fetch in background
  }, [user, config]);

  const handleClaim = async (rewardId, pointsRequired) => {
    if (!user) {
      alert("❌ Please log in to claim rewards!");
      return;
    }

    // Check if user has enough points
    if (points < pointsRequired) {
      alert(`❌ Insufficient Points!\n\nYou need ${pointsRequired} points to claim this reward.\nYou currently have ${points} points.\n\nNeed ${pointsRequired - points} more points!`);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/rewards/claim`, { rewardId }, config);
      
      alert(`✅ ${res.data.message}\n\n🎟️ Your code: ${res.data.link}\n\nSave this code to redeem your reward!`);
      
      // Update local state
      setPoints(res.data.newPoints);
      
      // Refresh claimed rewards list
      const claimedRes = await axios.get(`${API_URL}/api/rewards/claimed`, config);
      const claimed = claimedRes.data.map(cr => ({ rewardId: cr.rewardId }));
      setClaimedRewards(claimed);
      
      setMessage(res.data.message);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error claiming reward";
      alert(`❌ ${errorMsg}`);
      setMessage(errorMsg);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02 // Reduced from 0.05 to 0.02 for much faster appearance
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2 // Reduced from 0.4 to 0.2 for faster animation
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-32 pb-24">
        {/* Simplified Background Elements - Static for better performance */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
            Rewards Center
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Complete your daily habits to earn points and unlock amazing rewards!
          </motion.p>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 text-center"
            >
              <div className="text-6xl font-extrabold text-white mb-2">{points}</div>
              <div className="text-white/90 font-semibold text-lg">Available Points</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 text-center"
            >
              <div className="text-6xl font-extrabold text-white mb-2">{streak}</div>
              <div className="text-white/90 font-semibold text-lg">Day Streak</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Progress Card */}
          {progressMessage && totalHabits > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <div className={`rounded-3xl p-8 shadow-2xl ${
                allCompleted 
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                  : 'bg-gradient-to-br from-blue-400 to-indigo-500'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                      {allCompleted ? '✓' : `${completedCount}/${totalHabits}`}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Today's Progress</h3>
                      <p className="text-white/90">{progressMessage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-extrabold text-white">{completedCount}/{totalHabits}</div>
                    <div className="text-white/90 font-medium">Habits Done</div>
                  </div>
                </div>

                {!allCompleted && (
                  <div>
                    <div className="w-full bg-white/30 rounded-full h-4 overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedCount / totalHabits) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-white h-full rounded-full shadow-lg"
                      />
                    </div>
                    <p className="text-white/90 text-center font-medium">
                      Complete all habits to earn 1 point today!
                    </p>
                  </div>
                )}

                {allCompleted && (
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
                    <p className="text-white text-xl font-bold">
                      Congratulations! You earned 1 point today! Keep up the great work!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-12 border border-indigo-100"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                  💡
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">How to Earn Points</h3>
                  <p className="text-gray-600">Complete ALL your daily habits to earn 1 point per day. Build streaks for consistency!</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Current Balance:</span>
                <span className="text-3xl font-extrabold text-indigo-600">{points} pts</span>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-8 flex items-start"
            >
              <span className="text-2xl mr-3">❌</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{message}</p>
              </div>
            </motion.div>
          )}

          {/* Rewards Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Rewards</h2>
            <p className="text-gray-600 text-lg">Redeem your hard-earned points for exciting perks</p>
          </motion.div>

          {/* Rewards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {rewards.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Rewards Available</h3>
                <p className="text-gray-600">Check back soon for new rewards!</p>
              </div>
            ) : rewards.map((r, index) => {
              const claimed = claimedRewards.some((cr) => cr.rewardId === r._id);
              const progress = Math.min((points / r.pointsRequired) * 100, 100);
              const canClaim = points >= r.pointsRequired && !claimed;

              return (
                <motion.div
                  key={r._id}
                  variants={itemVariants}
                  whileHover={{ y: canClaim ? -10 : -5, scale: canClaim ? 1.03 : 1.01 }}
                  transition={{ duration: 0.2 }}
                  className={`relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ${
                    claimed ? "opacity-75" : ""
                  }`}
                >
                  {/* Claimed Badge */}
                  {claimed && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center space-x-1">
                        <span>✓</span>
                        <span>CLAIMED</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Image - Load all immediately for instant display */}
                    <div className="w-full h-48 mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                      <img 
                        src={r.imageUrl} 
                        alt={r.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.title)}&size=400&background=6366f1&color=fff&bold=true`;
                        }}
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {r.category}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{r.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{r.description}</p>

                    {/* Points Required */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl font-extrabold text-indigo-600">{r.pointsRequired}</span>
                        <span className="text-gray-600 font-medium">points</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {!claimed && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                          <span>Your Progress</span>
                          <span className="font-bold">{Math.min(points, r.pointsRequired)}/{r.pointsRequired}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Claim Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClaim(r._id, r.pointsRequired)}
                      disabled={claimed}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                        claimed
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : canClaim
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl cursor-pointer"
                          : "bg-gray-200 text-gray-400 cursor-pointer hover:bg-gray-300"
                      }`}
                    >
                      {claimed ? (
                        <span className="flex items-center justify-center gap-2">
                          <span>✓</span>
                          <span>CLAIMED</span>
                        </span>
                      ) : canClaim ? (
                        "Claim Reward"
                      ) : (
                        `Need ${r.pointsRequired - points} more points`
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Motivational Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white shadow-2xl"
          >
            <h3 className="text-3xl font-bold mb-4">Keep Building Your Streak! 🔥</h3>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              The more consistent you are with your habits, the more rewards you'll unlock. 
              Start today and transform your life one habit at a time!
            </p>
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-4xl font-extrabold mb-2">{claimedRewards.length}</div>
                <div className="text-white/80">Rewards Claimed</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold mb-2">{streak}</div>
                <div className="text-white/80">Day Streak</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold mb-2">{rewards.length - claimedRewards.length}</div>
                <div className="text-white/80">Rewards Left</div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default RewardPage;
