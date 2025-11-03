import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Habit = () => {
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "Health & Fitness",
    startDate: "",
    endDate: "",
    reminderTime: "07:00",
  });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = JSON.parse(sessionStorage.getItem("user"))?.token;

  const categoryOptions = [
    { value: "Health & Fitness", icon: "💪", color: "from-green-400 to-emerald-500" },
    { value: "Personal Growth", icon: "📚", color: "from-blue-400 to-indigo-500" },
    { value: "Lifestyle", icon: "🏠", color: "from-purple-400 to-pink-500" },
    { value: "Work/Study", icon: "💼", color: "from-orange-400 to-red-500" },
    { value: "Spiritual", icon: "🧘", color: "from-cyan-400 to-teal-500" },
    { value: "Hobbies", icon: "🎨", color: "from-yellow-400 to-amber-500" },
  ];

  const addHabit = async (e) => {
    e.preventDefault();

    if (!newHabit.name.trim()) return alert("Please enter a habit name!");
    if (newHabit.name.length > 50) return alert("Habit name cannot exceed 50 characters!");
    if (!newHabit.startDate) return alert("Please select a start date!");
    if (newHabit.startDate < today) return alert("Start date cannot be in the past!");
    if (!newHabit.endDate) return alert("Please select an end date!");
    if (newHabit.endDate < newHabit.startDate)
      return alert("End date cannot be before start date!");
    if (newHabit.description.length > 150)
      return alert("Description cannot exceed 150 characters!");

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/habits`, newHabit, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🎉 Habit added successfully!");
      setNewHabit({
        name: "",
        description: "",
        category: "Health & Fitness",
        startDate: "",
        endDate: "",
        reminderTime: "07:00",
      });
      navigate("/logs");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add habit");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categoryOptions.find(cat => cat.value === newHabit.category);
  const habitDuration = newHabit.startDate && newHabit.endDate 
    ? Math.floor((new Date(newHabit.endDate) - new Date(newHabit.startDate)) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
             Create New Habit
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Start building better habits today. Define your goal, set reminders, and track your progress!
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12"
          >
            
            <form onSubmit={addHabit} className="space-y-8">
              
              {/* Habit Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Habit Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., Morning Exercise, Read 30 Minutes, Meditate..."
                    value={newHabit.name}
                    maxLength={50}
                    required
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🎯</span>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">Give your habit a clear, specific name</p>
                  <p className="text-xs text-gray-500">{newHabit.name.length}/50</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Description / Goal
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Describe what you want to achieve with this habit..."
                    value={newHabit.description}
                    maxLength={150}
                    rows={4}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                  />
                  <span className="absolute left-4 top-4 text-gray-400 text-xl">📝</span>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-xs text-gray-500">Optional: Add motivation or specific goals</p>
                  <p className="text-xs text-gray-500">{newHabit.description.length}/150</p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categoryOptions.map((cat) => (
                    <motion.button
                      key={cat.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewHabit({ ...newHabit, category: cat.value })}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        newHabit.category === cat.value
                          ? `bg-gradient-to-br ${cat.color} text-white border-transparent shadow-lg`
                          : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <div className="text-sm font-semibold">{cat.value}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">📅</span>
                  Habit Duration
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newHabit.startDate}
                      min={today}
                      required
                      onChange={(e) => setNewHabit({ ...newHabit, startDate: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newHabit.endDate}
                      min={newHabit.startDate || today}
                      required
                      onChange={(e) => setNewHabit({ ...newHabit, endDate: e.target.value })}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white"
                    />
                  </div>
                </div>

                {habitDuration > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-white rounded-xl p-4 flex items-center justify-between"
                  >
                    <span className="text-gray-600 font-medium">Total Duration:</span>
                    <span className="text-2xl font-bold text-indigo-600">{habitDuration} days</span>
                  </motion.div>
                )}
              </div>

              {/* Reminder Time */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">⏰</span>
                  Daily Reminder
                </h3>
                
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Reminder Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={newHabit.reminderTime}
                    required
                    onChange={(e) => setNewHabit({ ...newHabit, reminderTime: e.target.value })}
                    className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white font-medium text-lg"
                  />
                  <div className="mt-3 bg-white rounded-xl p-3 flex items-start">
                    <span className="text-xl mr-2">📧</span>
                    <p className="text-sm text-gray-600">
                      You'll receive an email reminder at this time every day to help you stay on track!
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              {newHabit.name && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-2">�</span>
                    Preview
                  </h3>
                  
                  <div className={`bg-gradient-to-br ${selectedCategory.color} rounded-2xl p-6 text-white shadow-lg`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">{selectedCategory.icon}</div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold">
                        {newHabit.category}
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold mb-2">{newHabit.name}</h4>
                    {newHabit.description && (
                      <p className="text-white/90 text-sm mb-3">{newHabit.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center">
                        <span className="mr-1">⏰</span>
                        {newHabit.reminderTime}
                      </span>
                      {habitDuration > 0 && (
                        <span className="flex items-center">
                          <span className="mr-1">📅</span>
                          {habitDuration} days
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  type="submit"
                  disabled={loading}
                  className={`px-12 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center space-x-3 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Habit...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Create Habit</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Habit;
