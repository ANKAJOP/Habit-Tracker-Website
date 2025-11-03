import Habit from "../models/Habit.js";

// Get all habits
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });

    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    // Check streaks and reset if user missed yesterday
    const updatedHabits = habits.map((habit) => {
      const doneToday = habit.completedDates.some(
        (date) => new Date(date).toDateString() === today
      );
      const doneYesterday = habit.completedDates.some(
        (date) => new Date(date).toDateString() === yesterdayStr
      );

      if (!doneToday && !doneYesterday && habit.streak > 0) {
        habit.streak = 0; // reset streak
      }
      return habit;
    });

    // Save any changes to streaks
    await Promise.all(updatedHabits.map((h) => h.save()));

    res.json(updatedHabits);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch habits", error: error.message });
  }
};


// Add new habit
export const addHabit = async (req, res) => {
  try {
    const { name, description, category, startDate, endDate, reminderTime } = req.body;

    const habit = new Habit({
      user: req.user._id,
      name,
      description,
      category: category || "General",
      startDate: startDate || new Date(),
      endDate: endDate || new Date(new Date().setDate(new Date().getDate() + 7)),
      completedDates: [],
      streak: 0,
      reminderTime: reminderTime || "07:00", // save reminder time
      _missedEmailSent: false,
      _lastMissedEmailDate: "",
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: "Failed to add habit", error: error.message });
  }
};


// Mark habit done today
export const markHabitDone = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    const today = new Date();
    if (today < new Date(habit.startDate) || today > new Date(habit.endDate)) {
      return res.status(400).json({ message: "Cannot mark habit outside start/end dates" });
    }

    const doneToday = habit.completedDates.some(
      (date) => new Date(date).toDateString() === today.toDateString()
    );
    if (doneToday) return res.status(400).json({ message: "Already done today" });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const doneYesterday = habit.completedDates.some(
      (date) => new Date(date).toDateString() === yesterday.toDateString()
    );

    if (!doneYesterday) habit.streak = 0;

    habit.completedDates.push(today);
    habit.streak += 1;

    // --- Calculate missed days and store in DB ---
    habit.missedDays = calculateMissedDays(habit);

    await habit.save();

    // --- Check if ALL habits are now completed for today ---
    const todayStr = today.toDateString();
    const allHabits = await Habit.find({ 
      user: req.user._id,
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    const allCompleted = allHabits.every(h => 
      h.completedDates.some(d => new Date(d).toDateString() === todayStr)
    );

    res.json({ 
      habit,
      allHabitsCompleted: allCompleted,
      completedCount: allHabits.filter(h => 
        h.completedDates.some(d => new Date(d).toDateString() === todayStr)
      ).length,
      totalHabits: allHabits.length,
      message: allCompleted ? "🎉 All habits completed for today! Check your rewards!" : "Great! Keep going!"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark habit", error: error.message });
  }
};



// Reset habit (streak + completedDays + doneToday)
// Reset habit (streak + completedDates)
export const resetHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    habit.streak = 0;
    habit.completedDates = []; // clear all completion history

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: "Failed to reset habit", error: error.message });
  }
};

// Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });
    if (habit.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    await habit.deleteOne();
    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete habit", error: error.message });
  }
};

export const calculateMissedDays = (habit) => {
  const today = new Date();
  let missed = 0;

  for (let d = new Date(habit.startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const done = habit.completedDates.some(
      (cd) => new Date(cd).toDateString() === d.toDateString()
    );
    if (!done) missed++;
  }

  return missed;
};

export const getMissedDays = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Habit not found" });

    const today = new Date();
    let missed = 0;

    for (let d = new Date(habit.startDate); d < today; d.setDate(d.getDate() + 1)) {
      const done = habit.completedDates.some(
        (cd) => new Date(cd).toDateString() === d.toDateString()
      );
      if (!done) missed++;
    }

    res.json({ missedDays: missed });
  } catch (err) {
    res.status(500).json({ message: "Failed to calculate missed days", error: err.message });
  }
};
