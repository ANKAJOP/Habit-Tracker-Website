import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = JSON.parse(sessionStorage.getItem("user"));
      setIsLoggedIn(!!user);
    };

    checkLoginStatus();
    window.addEventListener("user-change", checkLoginStatus);

    return () => window.removeEventListener("user-change", checkLoginStatus);
  }, []);

  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroButtonClick = () => {
    // Always scroll to features section
    scrollToFeatures();
  };

  const stats = [
    { number: "10K+", label: "Active Users", color: "from-blue-400 to-indigo-500" },
    { number: "1M+", label: "Habits Tracked", color: "from-purple-400 to-pink-500" },
    { number: "95%", label: "Success Rate", color: "from-green-400 to-emerald-500" },
    { number: "4.9★", label: "User Rating", color: "from-yellow-400 to-amber-500" },
  ];

  const features = [
    { 
      title: "Track Your Habits", 
      text: "Build powerful routines by tracking daily habits with our intuitive interface. Never miss a day and watch your consistency grow.",
      gradient: "from-blue-400 to-indigo-500"
    },
    { 
      title: "Set Clear Goals", 
      text: "Define specific, measurable goals with custom timelines. Our smart goal-setting system helps you stay focused and motivated.",
      gradient: "from-purple-400 to-pink-500"
    },
    { 
      title: "Monitor Your Progress", 
      text: "Visualize your journey with beautiful charts and analytics. See your improvement trends and celebrate your milestones.",
      gradient: "from-green-400 to-emerald-500"
    },
    { 
      title: "Smart Reminders", 
      text: "Never forget your habits with personalized email reminders. Set custom times and get gentle nudges to stay on track.",
      gradient: "from-orange-400 to-red-500"
    },
    {
      title: "Earn Rewards",
      text: "Unlock exciting rewards as you build streaks and complete habits. Gamification makes the journey more fun and engaging.",
      gradient: "from-cyan-400 to-teal-500"
    },
    {
      icon: "�",
      title: "Calendar View",
      text: "Visualize your entire habit journey with our interactive calendar. See patterns, track streaks, and identify areas for improvement.",
      gradient: "from-yellow-400 to-amber-500"
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      image: "👩‍💼",
      text: "HabitTracker transformed my life! I've maintained a 90-day streak on my morning workout routine.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Student",
      image: "👨‍🎓",
      text: "The reminders and progress tracking keep me accountable. My study habits have never been better!",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Entrepreneur",
      image: "👩‍💻",
      text: "Simple, effective, and beautifully designed. This app helped me build habits that grew my business.",
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-32 pb-24">
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
            className="absolute top-40 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
              y: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-20 left-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight">
              Build Better <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Habits Today
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Transform your life one habit at a time. Track progress, stay motivated, and achieve your goals with our intuitive habit tracker.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHeroButtonClick}
              className="px-10 py-5 bg-white text-indigo-600 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-white/25 transition-all"
            >
              {isLoggedIn ? "See More" : "Start Your Journey"}
            </motion.button>
            {!isLoggedIn && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-2xl text-lg font-bold hover:bg-white/20 transition-all"
              >
                Sign In
              </motion.button>
            )}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-col items-center cursor-pointer"
            onClick={scrollToFeatures}
          >
            <p className="text-white/80 text-sm mb-2 font-medium">Scroll to explore</p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-white text-3xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-6xl mx-auto px-6 mt-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to build and maintain life-changing habits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${feature.gradient}`}></div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                step: "1", 
                title: "Create Your Habit", 
                desc: "Choose from categories or create custom habits that align with your goals.",
                color: "from-blue-400 to-indigo-500"
              },
              { 
                step: "2", 
                title: "Track Daily Progress", 
                desc: "Mark habits as complete each day and watch your streaks grow longer.",
                color: "from-purple-400 to-pink-500"
              },
              { 
                step: "3", 
                title: "Achieve Your Goals", 
                desc: "Celebrate milestones, earn rewards, and transform your life one habit at a time.",
                color: "from-green-400 to-emerald-500"
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${item.color} text-white font-bold text-lg mb-4`}>
                  Step {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our community of successful habit builders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-24 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 0]
            }}
            transition={{ duration: 30, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -180, 0]
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of users who have built life-changing habits with HabitTracker. Start your journey today!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isLoggedIn ? "/habits" : "/register")}
              className="px-12 py-6 bg-white text-indigo-600 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all inline-flex items-center gap-3"
            >
              {isLoggedIn ? "Create Your First Habit" : "Get Started Free"}
            </motion.button>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8"
          >
            <blockquote className="text-2xl md:text-3xl font-semibold italic text-white mb-4">
              "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
            </blockquote>
            <p className="text-lg text-white/80">— Aristotle</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
