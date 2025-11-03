// controllers/contactController.js
import Contact from "../models/Contact.js";
import { sendEmail } from "../emailService.js";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, message, user } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = new Contact({
      user: user || null, // optional
      name,
      email,
      message,
    });

    await contact.save();

    // Send confirmation email to user
    await sendEmail(
      email,
      "Thank you for contacting Habit Tracker!",
      `Hi ${name},\n\nThank you for reaching out to us! We have received your message:\n\n"${message}"\n\nOur team will get back to you as soon as possible.\n\nBest regards,\nHabit Tracker Team`
    );

    // Send notification to admin
    await sendEmail(
      process.env.EMAIL_USER,
      `New Contact Form Submission from ${name}`,
      `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n\nPlease respond to them at ${email}`
    );

    res.status(201).json({
      message: "Message received successfully! Check your email for confirmation.",
      contact,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error while sending message" });
  }
};
