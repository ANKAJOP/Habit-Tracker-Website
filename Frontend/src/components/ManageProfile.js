import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ManageProfile = () => {
  const [user, setUser] = useState({ name: "", email: "", points: 0, streak: 0 });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const config = storedUser
    ? { headers: { Authorization: `Bearer ${storedUser.token}` } }
    : null;

  // Scroll to top when opened
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch user data including points and streak
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileRes = await axios.get(`${API_URL}/api/auth/profile`, config);
        const pointsRes = await axios.get(`${API_URL}/api/rewards/update-points`, config);

        setUser({
          ...profileRes.data,
          points: pointsRes.data.points,
          streak: pointsRes.data.streak,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      }
    };
    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        config
      );
      setMessage(res.data.message || "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
            Your Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your account settings and track your progress</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Profile Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl mb-4">
                  {user.name ? getInitials(user.name) : "?"}
                </div>
                <div className="absolute bottom-4 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center">{user.name || "User"}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            {/* Stats Grid */}
            <div className="space-y-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Total Points</p>
                    <p className="text-4xl font-bold">{user.points}</p>
                  </div>
                  <div className="text-5xl">🏆</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-orange-400 to-pink-500 text-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium mb-1">Current Streak</p>
                    <p className="text-4xl font-bold">{user.streak} days</p>
                  </div>
                  <div className="text-5xl">🔥</div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Member Since</p>
                    <p className="text-xl font-bold">2024</p>
                  </div>
                  <div className="text-5xl">⭐</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Forms */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 space-y-6"
        >
          
          {/* Alert Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md flex items-start"
            >
              <span className="text-2xl mr-3">❌</span>
              <div>
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </motion.div>
          )}
          
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md flex items-start"
            >
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-semibold">Success</p>
                <p className="text-sm">{message}</p>
              </div>
            </motion.div>
          )}

          {/* Profile Information Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <p className="text-gray-500 text-sm">Your account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-medium cursor-not-allowed"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 font-medium cursor-not-allowed"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mt-4">
                <p className="text-blue-800 text-sm">
                  <strong>ℹ️ Note:</strong> Name and email cannot be changed. Contact support if you need to update these details.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Change Password Card */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                🔒
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                <p className="text-gray-500 text-sm">Update your password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full p-4 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔑</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.current ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password (min 6 characters)"
                    className="w-full p-4 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔐</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full p-4 pl-12 pr-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">✅</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 flex-1 rounded-full ${newPassword.length < 6 ? 'bg-red-300' : newPassword.length < 8 ? 'bg-yellow-300' : 'bg-green-400'}`}></div>
                    <span className={`text-xs font-semibold ${newPassword.length < 6 ? 'text-red-600' : newPassword.length < 8 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {newPassword.length < 6 ? 'Weak' : newPassword.length < 8 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>🔒</span>
                <span>Update Password</span>
              </motion.button>
            </form>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default ManageProfile;
