import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import "./scheduler.js";
dotenv.config();
connectDB();

const app = express();

// CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Mount auth routes
app.use("/api/auth", authRoutes);
//habit
app.use("/api/habits", habitRoutes);
//contact
app.use("/api/contact", contactRoutes);
//rewards
app.use("/api/rewards", rewardRoutes);

app.use("/api/chat", chatRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("HabitTracker API Running...");
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
