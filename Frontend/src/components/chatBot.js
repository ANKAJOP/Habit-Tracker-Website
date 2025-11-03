import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hi! 👋 I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

 const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { id: Date.now(), sender: "user", text: input };
  const messageToSend = input; // Store input before clearing
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsTyping(true);
  setError(null);

  try {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const res = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageToSend }),
    });
    
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }
    
    const data = await res.json();
    setIsTyping(false);
    const botMessage = { 
      id: Date.now() + 1, 
      sender: "bot", 
      text: data.reply || data.message || "I received your message!" 
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (err) {
    setIsTyping(false);
    setError(err.message);
    const botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      text: "😔 Sorry, I'm having trouble connecting. Please try again.",
    };
    setMessages((prev) => [...prev, botMessage]);
  }
};

  const handleClearChat = () => {
    setMessages([
      { id: 1, sender: "bot", text: "Hi! 👋 I'm your AI assistant. How can I help you today?" },
    ]);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="w-80 md:w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <div className="font-bold text-lg">AI Assistant</div>
                  <div className="text-xs opacity-90">Online • Ready to help</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleClearChat} 
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition"
                  title="Clear chat"
                >
                  🗑️
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                      msg.sender === "user" 
                        ? "bg-indigo-500 text-white" 
                        : "bg-gradient-to-br from-purple-400 to-indigo-400 text-white"
                    }`}>
                      {msg.sender === "user" ? "👤" : "🤖"}
                    </div>
                    {/* Message bubble */}
                    <div className={`p-3 rounded-2xl shadow-md ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
                    }`}>
                      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 text-white flex items-center justify-center text-sm flex-shrink-0">
                      🤖
                    </div>
                    <div className="bg-white text-gray-800 border border-gray-200 p-3 rounded-2xl rounded-tl-sm shadow-md">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {error && (
                <div className="mb-2 text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                  ⚠️ {error}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isTyping}
                  className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isTyping ? "..." : "Send"}
                </motion.button>
              </div>
              <div className="mt-2 text-xs text-gray-400 text-center">
                Powered by Gemini AI ✨
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Icon */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl flex items-center justify-center text-3xl hover:shadow-indigo-500/50 transition-shadow relative"
        >
          <motion.div
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            💬
          </motion.div>
          {/* Notification dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
          />
        </motion.button>
      )}
    </div>
  );
};

export default FloatingChatbot;
