import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: "General" },       // NEW
  startDate: { type: Date, default: Date.now },         // NEW
  endDate: { type: Date, default: () => new Date(Date.now() + 7*24*60*60*1000) }, // NEW
  completedDates: [{ type: Date }], // track each completed day
  streak: { type: Number, default: 0 },
  reminderTime: { type: String, default: "07:00" }, // NEW
  missedDays: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },

  //new for email
  _missedEmailSent: { type: Boolean, default: false },
  _lastMissedEmailDate: { type: String, default: "" },
  _reminderSentToday: { type: Boolean, default: false },      // prevents duplicate reminders
  _lastFlagResetDate: { type: String, default: "" }, 
});

// ⚡ PERFORMANCE: Add indexes for faster queries
habitSchema.index({ user: 1, startDate: 1, endDate: 1 }); // For date range queries
habitSchema.index({ user: 1, completedDates: 1 }); // For completion checks

// Virtual field for today completion
habitSchema.virtual("doneToday").get(function () {
  const today = new Date().toDateString();
  return this.completedDates.some(
    (date) => new Date(date).toDateString() === today
  );
});

habitSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Habit", habitSchema);
