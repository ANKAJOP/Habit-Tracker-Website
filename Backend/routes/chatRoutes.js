import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST /api/chat
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text();
    
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    res.status(500).json({ message: "Failed to fetch response from Gemini AI" });
  }
});

export default router;
