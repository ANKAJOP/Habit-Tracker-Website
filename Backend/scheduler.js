import cron from "node-cron";
import Habit from "./models/Habit.js";
import { sendEmail } from "./emailService.js";
import User from "./models/User.js";

console.log("📅 Habit Reminder Scheduler Started!");
console.log("⏰ Checking for reminders every minute...\n");

// Run every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const todayStr = now.toDateString();

  try {
    // Find all active habits (within start and end date)
    const habits = await Habit.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).populate("user");

    if (habits.length === 0) {
      return; // No active habits to process
    }

    // console.log(`🔍 [${now.toLocaleTimeString()}] Checking ${habits.length} active habit(s)...`);

    for (const habit of habits) {
      if (!habit.user || !habit.user.email) {
        console.log(`⚠️  Skipping habit "${habit.name}" - No user email found`);
        continue;
      }

      const [reminderHours, reminderMinutes] = habit.reminderTime.split(":").map(Number);

      // --- 1️⃣ Daily Reminder Email ---
      if (nowHours === reminderHours && nowMinutes === reminderMinutes && !habit._reminderSentToday) {
        console.log(`📧 Sending reminder for "${habit.name}" to ${habit.user.email}`);
        
        const emailResult = await sendEmail(
          habit.user.email,
          `🎯 Reminder: ${habit.name}`,
          `Hi ${habit.user.name},\n\nThis is your daily reminder to complete your habit: "${habit.name}".\n\nDescription: ${habit.description || 'No description'}\nCurrent Streak: ${habit.streak} day(s)\n\nStay consistent and keep building great habits! 💪\n\nBest regards,\nHabit Tracker Team`
        );

        if (emailResult.success) {
          habit._reminderSentToday = true;
          await habit.save();
          console.log(`✅ Reminder sent successfully for "${habit.name}"`);
        } else {
          console.log(`❌ Failed to send reminder for "${habit.name}": ${emailResult.error}`);
        }
      }

      // --- 2️⃣ Missed Streak Email (check at 11:59 PM or next day) ---
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      const doneYesterday = habit.completedDates.some(
        d => new Date(d).toDateString() === yesterdayStr
      );

      // Send missed email once per day if habit was missed yesterday
      if (!doneYesterday && habit._lastMissedEmailDate !== yesterdayStr && !habit._missedEmailSent) {
        console.log(`📧 Sending missed streak notification for "${habit.name}" to ${habit.user.email}`);
        
        const emailResult = await sendEmail(
          habit.user.email,
          `⚠️ Streak Alert: ${habit.name}`,
          `Hi ${habit.user.name},\n\nWe noticed you missed your habit "${habit.name}" yesterday (${yesterdayStr}).\n\nYour previous streak was: ${habit.streak} day(s)\n\nDon't worry! Every day is a new opportunity to start fresh. Get back on track today! 💪\n\nBest regards,\nHabit Tracker Team`
        );

        if (emailResult.success) {
          habit._missedEmailSent = true;
          habit._lastMissedEmailDate = yesterdayStr;
          await habit.save();
          console.log(`✅ Missed streak email sent for "${habit.name}"`);
        } else {
          console.log(`❌ Failed to send missed streak email for "${habit.name}": ${emailResult.error}`);
        }
      }

      // --- 3️⃣ Reset daily flags at midnight ---
      if (habit._lastFlagResetDate !== todayStr) {
        habit._reminderSentToday = false;
        habit._missedEmailSent = false;
        habit._lastFlagResetDate = todayStr;
        await habit.save();
        console.log(`🔄 Reset daily flags for "${habit.name}"`);
      }
    }
  } catch (err) {
    console.error("❌ Scheduler error:", err.message);
    console.error(err);
  }
});
