import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const HabitLog = () => {
  const [habits, setHabits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = JSON.parse(sessionStorage.getItem("user"))?.token;

  const categoryOptions = [
    { value: "All", color: "from-gray-400 to-gray-600" },
    { value: "Health & Fitness", color: "from-green-400 to-emerald-500" },
    { value: "Personal Growth", color: "from-blue-400 to-indigo-500" },
    { value: "Lifestyle", color: "from-purple-400 to-pink-500" },
    { value: "Work/Study", color: "from-orange-400 to-red-500" },
    { value: "Spiritual", color: "from-cyan-400 to-teal-500" },
    { value: "Hobbies", color: "from-yellow-400 to-amber-500" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsDone = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/api/habits/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setHabits((prev) =>
        prev.map((h) => (h._id === id ? { ...h, ...res.data.habit } : h))
      );

      if (res.data.allHabitsCompleted) {
        alert("Congratulations! All habits completed for today! Check your Rewards page to claim your point!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error marking habit done");
    }
  };

  const resetHabit = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/api/habits/${id}/reset`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits((prev) =>
        prev.map((h) => (h._id === id ? { ...h, ...res.data } : h))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset habit");
    }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    try {
      await axios.delete(`${API_URL}/api/habits/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHabits = habits.filter(
    (h) =>
      (selectedCategory === "All" || h.category === selectedCategory) &&
      h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    const cat = categoryOptions.find(c => c.value === category);
    return cat ? cat.color : "from-gray-400 to-gray-600";
  };

  const completedToday = filteredHabits.filter(h => h.doneToday).length;
  const totalHabits = filteredHabits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

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
            Habit Journal
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Track your daily habits and build consistency one day at a time
          </motion.p>

          {/* Progress Bar */}
          {totalHabits > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-semibold">Today's Progress</span>
                  <span className="text-white font-bold text-lg">{completedToday}/{totalHabits}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-white h-full rounded-full shadow-lg flex items-center justify-end pr-2"
                  >
                    {completionRate > 10 && (
                      <span className="text-xs font-bold text-indigo-600">{completionRate}%</span>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search your habits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                />
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition font-medium"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 bg-gray-100 p-2 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    viewMode === "grid" 
                      ? "bg-white shadow text-indigo-600" 
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    viewMode === "list" 
                      ? "bg-white shadow text-indigo-600" 
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Filter Summary */}
            {(searchTerm || selectedCategory !== "All") && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <span>Showing {filteredHabits.length} of {habits.length} habits</span>
                {(searchTerm || selectedCategory !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your habits...</p>
            </div>
          ) : filteredHabits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-16 text-center"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Habits Found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your filters or search term"
                  : "Start your journey by creating your first habit!"}
              </p>
              {!searchTerm && selectedCategory === "All" && (
                <button
                  onClick={() => window.location.href = "/habits"}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg"
                >
                  Create Your First Habit
                </button>
              )}
            </motion.div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"}>
              <AnimatePresence>
                {filteredHabits.map((habit) => {
                  const categoryColor = getCategoryColor(habit.category);
                  const habitDuration = habit.startDate && habit.endDate 
                    ? Math.floor((new Date(habit.endDate) - new Date(habit.startDate)) / (1000 * 60 * 60 * 24)) + 1
                    : 0;

                  return viewMode === "grid" ? (
                    // Grid View
                    <motion.div
                      key={habit._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden"
                    >
                      {/* Top Gradient Bar */}
                      <div className={`h-3 bg-gradient-to-r ${categoryColor}`}></div>

                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`px-4 py-2 rounded-xl bg-gradient-to-br ${categoryColor} text-white text-sm font-semibold shadow-lg`}>
                            {habit.category}
                          </div>
                          {habit.doneToday && (
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <span>✓</span>
                              <span>DONE</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{habit.name}</h3>
                        {habit.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{habit.description}</p>
                        )}

                        {/* Stats */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Category</span>
                            <span className="font-semibold text-gray-700">{habit.category}</span>
                          </div>
                          {habitDuration > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Duration</span>
                              <span className="font-semibold text-gray-700">{habitDuration} days</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-sm">Streak</span>
                            <span className="text-2xl font-bold text-orange-500">{habit.streak || 0} days</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markAsDone(habit._id)}
                            className={`w-full py-3 rounded-xl font-bold shadow transition ${
                              habit.doneToday
                                ? "bg-green-500 text-white cursor-default"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                            }`}
                          >
                            {habit.doneToday ? "Completed" : "Mark as Done"}
                          </motion.button>

                          <div className="flex gap-2">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => resetHabit(habit._id)}
                              className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 rounded-lg font-semibold transition text-sm"
                            >
                              Reset
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteHabit(habit._id)}
                              className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-semibold transition text-sm"
                            >
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    // List View
                    <motion.div
                      key={habit._id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden"
                    >
                      <div className="flex flex-col lg:flex-row">
                        {/* Left - Icon & Status */}
                        <div className={`lg:w-32 bg-gradient-to-br ${categoryColor} flex items-center justify-center p-6`}>
                          <div className="text-center">
                            {habit.doneToday && (
                              <div className="bg-white/30 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-bold">
                                ✓ DONE
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Middle - Content */}
                        <div className="flex-1 p-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{habit.name}</h3>
                          {habit.description && (
                            <p className="text-gray-600 mb-3">{habit.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span>{habit.category}</span>
                            {habitDuration > 0 && <span>{habitDuration} days</span>}
                            <span className="font-bold text-orange-500">{habit.streak || 0} day streak</span>
                          </div>
                        </div>

                        {/* Right - Actions */}
                        <div className="lg:w-64 p-6 flex lg:flex-col gap-2 border-t lg:border-t-0 lg:border-l border-gray-100">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => markAsDone(habit._id)}
                            className={`flex-1 py-3 rounded-xl font-bold shadow transition ${
                              habit.doneToday
                                ? "bg-green-500 text-white"
                                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                            }`}
                          >
                            {habit.doneToday ? "Done" : "Mark Done"}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => resetHabit(habit._id)}
                            className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-3 rounded-xl font-semibold transition"
                          >
                            Reset
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteHabit(habit._id)}
                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-xl font-semibold transition"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HabitLog;
