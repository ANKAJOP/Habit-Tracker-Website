import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          setUser(storedUser);
          setFormData({
            name: storedUser.name || "",
            email: storedUser.email || "",
            message: "",
          });
        }
      } catch {
        console.log("Invalid user data in localStorage");
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const payload = {
        ...formData,
        user: user?._id || null,
      };

      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await axios.post(`${API_URL}/api/contact`, payload, config);

      setSuccess(res.data.message || "Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
      });
      
      // Auto-dismiss success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      detail: "contact@habittracker.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📞",
      title: "Call Us",
      detail: "+91 9930584775",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "📍",
      title: "Visit Us",
      detail: "11 Bhandup Tulshet Pada, Mumbai, India",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const faqs = [
    {
      q: "How quickly will I receive a response?",
      a: "We typically respond within 24 hours during business days."
    },
    {
      q: "Can I schedule a demo?",
      a: "Absolutely! Mention 'demo request' in your message."
    },
    {
      q: "Do you offer enterprise plans?",
      a: "Yes! Contact us for custom pricing and features."
    }
  ];

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
            Let's Connect
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Contact Methods Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            {contactMethods.map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`bg-gradient-to-br ${method.color} p-8 rounded-2xl shadow-xl text-white`}
              >
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                <p className="text-white/90">{method.detail}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Form and Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-10"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl mr-4">
                  ✉️
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Send a Message</h2>
                  <p className="text-gray-500">We'll get back to you soon</p>
                </div>
              </div>

              {/* Alert Messages */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-start"
                >
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <p className="font-semibold">Success!</p>
                    <p className="text-sm">{success}</p>
                  </div>
                </motion.div>
              )}
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start"
                >
                  <span className="text-2xl mr-3">❌</span>
                  <div>
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      disabled={!!user}
                      className={`w-full p-4 pl-12 rounded-xl border-2 ${
                        user ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      } outline-none transition`}
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                  </div>
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">✓ Auto-filled from your profile</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      disabled={!!user}
                      className={`w-full p-4 pl-12 rounded-xl border-2 ${
                        user ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                      } outline-none transition`}
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
                  </div>
                  {user && (
                    <p className="text-xs text-gray-500 mt-1">✓ Auto-filled from your profile</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                    Your Message
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      required
                      rows="5"
                      className="w-full p-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                    ></textarea>
                    <span className="absolute left-4 top-4 text-gray-400">💬</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formData.message.length}/500 characters</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <span>→</span>
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* FAQ and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Why Contact Us */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-3xl mr-3">💡</span>
                  Why Contact Us?
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span><strong>Technical Support:</strong> Get help with any issues you're facing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span><strong>Feature Requests:</strong> Share ideas to improve HabitTracker</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span><strong>Partnership Inquiries:</strong> Explore collaboration opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 text-xl mr-3">✓</span>
                    <span><strong>General Questions:</strong> Ask us anything about our platform</span>
                  </li>
                </ul>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-3xl mr-3">❓</span>
                  Quick Answers
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">{faq.q}</h4>
                      <p className="text-gray-600 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Time Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
                <div className="flex items-center mb-4">
                  <span className="text-5xl mr-4">⏱️</span>
                  <div>
                    <h3 className="text-2xl font-bold">Quick Response</h3>
                    <p className="text-white/80">We value your time</p>
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed">
                  Our dedicated support team responds to all inquiries within <strong>24 hours</strong> during business days. 
                  For urgent matters, please call us directly.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
            <p className="text-gray-600 text-lg">We'd love to meet you in person</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-200 rounded-3xl overflow-hidden shadow-2xl h-96 flex items-center justify-center"
          >
            <div className="text-center">
              <span className="text-6xl mb-4 block">🗺️</span>
              <p className="text-gray-600 text-lg">Interactive Map Coming Soon</p>
              <p className="text-gray-500 mt-2">11 Bhandup Tulshet Pada, Mumbai, India</p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default ContactUs;
