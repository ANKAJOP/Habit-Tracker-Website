import React from "react";
import { motion } from "framer-motion";

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: "🎯",
      title: "Goal-Oriented",
      description: "Set clear goals and track your progress with precision and ease."
    },
    {
      icon: "📊",
      title: "Data-Driven Insights",
      description: "Visualize your habit patterns with beautiful charts and analytics."
    },
    {
      icon: "🔔",
      title: "Smart Reminders",
      description: "Never miss a habit with intelligent email notifications."
    },
    {
      icon: "🏆",
      title: "Gamified Rewards",
      description: "Earn points and unlock rewards as you build consistent habits."
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Get personalized advice and motivation from our AI chatbot."
    },
    {
      icon: "📱",
      title: "Mobile-Friendly",
      description: "Track your habits anywhere, anytime on any device."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "1M+", label: "Habits Completed" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9★", label: "User Rating" }
  ];

  const timeline = [
    { 
      year: "2023", 
      title: "The Vision", 
      desc: "Founded with a mission to make personal growth accessible to everyone through technology.",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      year: "2024", 
      title: "Product Launch", 
      desc: "Released our flagship habit tracker with AI integration and gamification features.",
      color: "from-purple-500 to-pink-500"
    },
    { 
      year: "2025", 
      title: "Community Growth", 
      desc: "Reached 10,000+ users worldwide, helping transform lives one habit at a time.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const team = [
    { 
      name: "Yogesh Maurya", 
      role: "Founder & CEO", 
      bio: "Passionate about behavioral psychology and habit formation"
    },
    { 
      name: "Manish Pal", 
      role: "CTO & Lead Developer", 
      bio: "Full-stack engineer specializing in AI and data science"
    },
    { 
      name: "Neeraj Vishwakarma", 
      role: "Head of Design", 
      bio: "Award-winning UX/UI designer focused on user experience"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-32 pb-40">
        {/* Animated Background Elements */}
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
            Building Better Lives<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
              One Habit at a Time
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            HabitTracker empowers individuals to transform their daily routines with 
            intelligent tracking, AI-powered insights, and a supportive community.
          </motion.p>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Why Choose HabitTracker?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the features that make habit building effortless and enjoyable
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            {...fadeInUp}
            className="text-center"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <div className="bg-white rounded-3xl p-12 shadow-xl">
              <p className="text-2xl text-gray-700 leading-relaxed mb-6">
                We believe that <span className="font-bold text-indigo-600">small, consistent actions</span> lead 
                to extraordinary transformations. Our mission is to democratize personal growth by providing 
                powerful, intuitive tools that make habit formation accessible to everyone.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                Through cutting-edge technology, behavioral science, and a supportive community, 
                we're helping people worldwide unlock their full potential and live their best lives.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            {...fadeInUp}
            className="text-5xl font-bold text-center text-gray-900 mb-20"
          >
            Our Journey
          </motion.h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-500 to-pink-500 hidden md:block" />

            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className={`relative flex items-center mb-16 ${
                  idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <div className={`bg-gradient-to-br ${item.color} p-8 rounded-2xl text-white shadow-xl`}>
                    <div className="text-6xl font-bold mb-2">{item.year}</div>
                    <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/90 leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-indigo-500 rounded-full shadow-lg z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Passionate individuals dedicated to your personal growth
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -15, scale: 1.05 }}
                className="text-center group bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-5xl shadow-lg">
                    👤
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-indigo-400 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-400 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-2xl mb-10 text-white/90">
              Join thousands of users building better habits every day
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all"
              onClick={() => window.location.href = '/habits'}
            >
              Get Started Free →
            </motion.button>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;
