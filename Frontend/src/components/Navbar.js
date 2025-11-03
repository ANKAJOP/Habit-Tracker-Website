import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({ points: 0, streak: 0 });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const closeTimer = useRef(null);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load user from sessionStorage
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser);

    // Fetch user stats (points and streak) from API
    if (storedUser) {
      const fetchUserStats = async () => {
        try {
          const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
          console.log("📊 Fetching user stats from Navbar...");
          const config = { headers: { Authorization: `Bearer ${storedUser.token}` } };
          const res = await axios.get(`${API_URL}/api/rewards/update-points`, config);
          console.log("✅ User stats received:", res.data);
          setUserStats({
            points: res.data.points || 0,
            streak: res.data.streak || 0,
          });
        } catch (err) {
          console.error("❌ Failed to fetch user stats:", err.response?.data || err.message);
          // Set to 0 on error
          setUserStats({ points: 0, streak: 0 });
        }
      };
      fetchUserStats();
    }

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user"));
      setUser(updatedUser);
      
      // Re-fetch stats when user changes
      if (updatedUser) {
        const fetchUserStats = async () => {
          try {
            const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
            console.log("🔄 Re-fetching user stats after storage change...");
            const config = { headers: { Authorization: `Bearer ${updatedUser.token}` } };
            const res = await axios.get(`${API_URL}/api/rewards/update-points`, config);
            console.log("✅ User stats updated:", res.data);
            setUserStats({
              points: res.data.points || 0,
              streak: res.data.streak || 0,
            });
          } catch (err) {
            console.error("❌ Failed to re-fetch user stats:", err.response?.data || err.message);
            setUserStats({ points: 0, streak: 0 });
          }
        };
        fetchUserStats();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-change", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-change", handleStorageChange);
    };
  }, []);

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEsc = (e) => e.key === "Escape" && setDropdownOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("user-change"));
    navigate("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Habits", path: "/habits" },
    { name: "Habit Log", path: "/logs" },
    { name: "Progress", path: "/progress" },
    { name: "Rewards", path: "/rewards" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-xl"
          : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center group"
          >
            <div className="flex flex-col">
              <span className={`text-3xl font-extrabold tracking-tight ${
                scrolled ? "text-gray-900" : "text-white"
              }`}>
                Habit<span className={scrolled ? "text-indigo-600" : "text-yellow-300"}>Tracker</span>
              </span>
              <span className={`text-xs font-medium ${
                scrolled ? "text-gray-500" : "text-white/70"
              }`}>
                Build Better Habits
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                      isActive
                        ? scrolled
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "bg-white/20 text-white backdrop-blur-sm"
                        : scrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(() => setDropdownOpen(false), 300);
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-3 px-5 py-2.5 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${
                    scrolled
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-300"
                      : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
                  }`}
                >
                  {/* Profile Circle with Gradient Border */}
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 blur-sm ${
                      scrolled ? "opacity-50" : "opacity-70"
                    }`}></div>
                    <div className={`relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden ${
                      scrolled ? "bg-white/20" : "bg-white/30"
                    } backdrop-blur-sm border-2 ${
                      scrolled ? "border-white/50" : "border-white/30"
                    }`}>
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold tracking-wide">{user.name}</span>
                    <span className={`text-xs ${scrolled ? "text-white/80" : "text-white/70"}`}>
                      {userStats.points} pts • {userStats.streak} day streak
                    </span>
                  </div>

                  {/* Dropdown Arrow */}
                  <motion.svg
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>

                {/* Enhanced Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{user.name}</p>
                            <p className="text-sm text-white/80">{user.email}</p>
                          </div>
                        </div>
                        
                        {/* Stats Row */}
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                            <div className="text-lg font-bold">{userStats.points}</div>
                            <div className="text-xs text-white/70">Points</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                            <div className="text-lg font-bold">{userStats.streak}</div>
                            <div className="text-xs text-white/70">Day Streak</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/manage"
                          className="block px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <div className="font-semibold">Manage Profile</div>
                          <div className="text-xs text-gray-500">Settings & preferences</div>
                        </Link>

                        <Link
                          to="/progress"
                          className="block px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <div className="font-semibold">View Progress</div>
                          <div className="text-xs text-gray-500">Track your journey</div>
                        </Link>

                        <Link
                          to="/rewards"
                          className="block px-6 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 transition-all"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <div className="font-semibold">My Rewards</div>
                          <div className="text-xs text-gray-500">{userStats.points} points available</div>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <div className="font-semibold">Logout</div>
                          <div className="text-xs text-red-500/70">See you soon!</div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={`px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                    scrolled
                      ? "bg-white text-indigo-600 hover:bg-gray-50 border-2 border-gray-200"
                      : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border-2 border-white/30"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                    scrolled
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-300"
                      : "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:shadow-yellow-300"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              scrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
            }`}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden overflow-hidden ${
              scrolled ? "bg-white border-t border-gray-200" : "bg-indigo-700/95 backdrop-blur-md"
            }`}
          >
            <div className="px-4 py-6 space-y-2">
              {/* User Info Mobile */}
              {user && (
                <div className={`mb-4 p-4 rounded-2xl ${
                  scrolled ? "bg-gradient-to-r from-indigo-600 to-purple-600" : "bg-white/10 backdrop-blur-md"
                } text-white`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-sm text-white/80">{userStats.points} pts • {userStats.streak} day streak</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl font-semibold transition-all ${
                      isActive
                        ? scrolled
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "bg-white/20 text-white"
                        : scrolled
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Auth Buttons Mobile */}
              <div className="pt-4 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/manage"
                      className={`block text-center px-4 py-3 rounded-xl font-semibold shadow-md transition-all ${
                        scrolled
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-white text-indigo-600 hover:bg-white/90"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Manage Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full bg-red-500 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:bg-red-600 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`block text-center px-4 py-3 rounded-xl font-semibold shadow-md transition-all ${
                        scrolled
                          ? "bg-white text-indigo-600 border-2 border-gray-200 hover:bg-gray-50"
                          : "bg-white text-indigo-600 hover:bg-white/90"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-yellow-300 transition-all"
                      onClick={() => setMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
