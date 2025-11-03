import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import Calendar from "react-calendar";
import { motion } from "framer-motion";
import "react-calendar/dist/Calendar.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Progress = () => {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [missedDays, setMissedDays] = useState(0);
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const token = JSON.parse(sessionStorage.getItem("user"))?.token;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHabits();
    fetchQuote();
  }, []);

  useEffect(() => {
    if (selectedHabit) fetchMissedDays(selectedHabit._id);
  }, [selectedHabit]);

  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
      if (res.data.length > 0) setSelectedHabit(res.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuote = async () => {
    try {
      const res = await axios.get("https://api.quotable.io/random");
      setQuote(res.data.content);
    } catch (err) {
      setQuote("Consistency beats intensity!");
    }
  };

  const fetchMissedDays = async (habitId) => {
    try {
      const res = await axios.get(`${API_URL}/api/habits/${habitId}/missed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMissedDays(res.data.missedDays);
    } catch (err) {
      console.error(err);
    }
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.doneToday).length;
  const currentStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const highestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const categoryData = {};
  habits.forEach((h) => {
    const cat = h.category || "Other";
    if (!categoryData[cat]) categoryData[cat] = 0;
    if (h.streak > 0) categoryData[cat] += 1;
  });

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#6366F1",
          "#F59E0B",
          "#10B981",
          "#EF4444",
          "#8B5CF6",
          "#3B82F6",
          "#F472B6",
        ],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    }
  };

  const streakData = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Habits Completed",
        data: Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return habits.reduce((sum, h) => {
            const done = h.completedDates.some(
              (date) => new Date(date).toDateString() === d.toDateString()
            );
            return sum + (done ? 1 : 0);
          }, 0);
        }),
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "#6366F1",
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: "#6366F1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(99, 102, 241, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
            weight: '600'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 11,
            weight: '600'
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  const achievements = [
    { title: "First Habit", icon: "✅", condition: totalHabits >= 1, desc: "Created your first habit" },
    { title: "5-Day Streak", icon: "🔥", condition: currentStreak >= 5, desc: "Maintained a 5-day streak" },
    { title: "10 Habits", icon: "🎉", condition: habits.filter((h) => h.streak > 0).length >= 10, desc: "Completed 10 different habits" },
    { title: "Consistency Champ", icon: "🏆", condition: currentStreak >= 10, desc: "Achieved 10-day streak" },
    { title: "Perfect Day", icon: "💯", condition: completedToday === totalHabits && totalHabits > 0, desc: "Completed all habits today" },
  ];

  const tileContent = ({ date, view }) => {
    if (view !== "month" || !selectedHabit) return null;
    const done = selectedHabit.completedDates.some((d) => {
      const completed = new Date(d);
      completed.setHours(0, 0, 0, 0);
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      return completed.getTime() === targetDate.getTime();
    });

    const start = new Date(selectedHabit.startDate);
    start.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = targetDate < today;
    const inRange = targetDate >= start && isPast;
    const missed = inRange && !done;

    if (done) return <span className="text-green-500 font-bold text-lg">✅</span>;
    if (missed) return <span className="text-red-500 font-bold text-lg">❌</span>;
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
            Your Progress
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Track your journey, celebrate your wins, and stay motivated!
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your progress...</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">📝</div>
                    <div className="text-right">
                      <div className="text-5xl font-extrabold">{totalHabits}</div>
                    </div>
                  </div>
                  <div className="text-blue-100 font-semibold text-lg">Total Habits</div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-8 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">✅</div>
                    <div className="text-right">
                      <div className="text-5xl font-extrabold">{completedToday}</div>
                    </div>
                  </div>
                  <div className="text-green-100 font-semibold text-lg">Completed Today</div>
                  <div className="mt-2 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">🔥</div>
                    <div className="text-right">
                      <div className="text-5xl font-extrabold">{currentStreak}</div>
                    </div>
                  </div>
                  <div className="text-orange-100 font-semibold text-lg">Current Streak</div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl p-8 text-white shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">🏆</div>
                    <div className="text-right">
                      <div className="text-5xl font-extrabold">{highestStreak}</div>
                    </div>
                  </div>
                  <div className="text-purple-100 font-semibold text-lg">Highest Streak</div>
                </motion.div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Pie Chart */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-3xl shadow-xl p-8"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                      📊
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Category Distribution</h2>
                      <p className="text-gray-500 text-sm">Active habits by category</p>
                    </div>
                  </div>
                  {Object.keys(categoryData).length > 0 ? (
                    <div className="h-80">
                      <Pie data={pieData} options={pieOptions} />
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📈</div>
                        <p>No active habits yet</p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Line Chart */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-3xl shadow-xl p-8"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                      📈
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">7-Day Streak</h2>
                      <p className="text-gray-500 text-sm">Your consistency over time</p>
                    </div>
                  </div>
                  <div className="h-80">
                    <Line data={streakData} options={lineOptions} />
                  </div>
                </motion.div>
              </div>

              {/* Calendar Section */}
              {selectedHabit && (
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-3xl shadow-xl p-8"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                      📅
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">Habit Calendar</h2>
                      <p className="text-gray-500 text-sm">Track your daily progress</p>
                    </div>
                  </div>

                  {/* Habit Selector */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Select Habit to View
                    </label>
                    <select
                      className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition bg-white font-medium"
                      value={selectedHabit._id}
                      onChange={(e) =>
                        setSelectedHabit(habits.find((h) => h._id === e.target.value))
                      }
                    >
                      {habits.map((h) => (
                        <option key={h._id} value={h._id}>
                          {h.name} - {h.streak} day streak
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Calendar */}
                  <div className="flex justify-center mb-6">
                    <div className="habit-calendar">
                      <Calendar tileContent={tileContent} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">📅</span>
                        <div>
                          <div className="text-2xl font-bold text-blue-700">
                            {selectedHabit.endDate 
                              ? Math.floor((new Date(selectedHabit.endDate) - new Date(selectedHabit.startDate)) / (1000 * 60 * 60 * 24)) + 1
                              : Math.floor((new Date() - new Date(selectedHabit.startDate)) / (1000 * 60 * 60 * 24)) + 1}
                          </div>
                          <div className="text-blue-600 text-sm font-medium">Total Days</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">❌</span>
                        <div>
                          <div className="text-2xl font-bold text-red-700">{missedDays}</div>
                          <div className="text-red-600 text-sm font-medium">Missed Days</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">🔥</span>
                        <div>
                          <div className="text-2xl font-bold text-green-700">{selectedHabit.streak}</div>
                          <div className="text-green-600 text-sm font-medium">Current Streak</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Achievements */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-3xl shadow-xl p-8"
              >
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                    🏅
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                    <p className="text-gray-500 text-sm">Your milestones and badges</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((ach, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: ach.condition ? 1.05 : 1 }}
                      className={`rounded-2xl p-6 transition-all ${
                        ach.condition
                          ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <div className="text-5xl mb-3">{ach.icon}</div>
                      <h3 className={`text-xl font-bold mb-1 ${ach.condition ? 'text-white' : 'text-gray-600'}`}>
                        {ach.title}
                      </h3>
                      <p className={`text-sm ${ach.condition ? 'text-white/90' : 'text-gray-500'}`}>
                        {ach.desc}
                      </p>
                      {ach.condition && (
                        <div className="mt-3 bg-white/20 rounded-full px-3 py-1 text-xs font-bold inline-block">
                          UNLOCKED ✓
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Motivational Quote */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-center text-white shadow-2xl"
              >
                <div className="text-5xl mb-4">💭</div>
                <blockquote className="text-2xl md:text-3xl font-medium italic leading-relaxed">
                  "{quote}"
                </blockquote>
                <div className="mt-6 text-white/80 font-semibold">— Stay Motivated</div>
              </motion.div>

            </motion.div>
          )}
        </div>
      </section>

      {/* Custom Calendar Styles */}
      <style jsx global>{`
        .habit-calendar .react-calendar {
          border: none;
          border-radius: 1rem;
          padding: 1rem;
          background: white;
          font-family: inherit;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .habit-calendar .react-calendar__tile {
          padding: 1rem 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }
        
        .habit-calendar .react-calendar__tile:enabled:hover {
          background-color: #EEF2FF;
          transform: scale(1.05);
        }
        
        .habit-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          color: white;
        }
        
        .habit-calendar .react-calendar__navigation button {
          font-size: 1.1rem;
          font-weight: 600;
          color: #4F46E5;
        }
        
        .habit-calendar .react-calendar__navigation button:enabled:hover {
          background-color: #EEF2FF;
          border-radius: 0.5rem;
        }
        
        .habit-calendar .react-calendar__month-view__weekdays {
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default Progress;
