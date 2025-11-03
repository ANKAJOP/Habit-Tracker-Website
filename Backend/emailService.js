// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('YOUR_SENDGRID_API_KEY'); // replace with your key

// function sendReminderEmail(to, habitName) {
//   const msg = {
//     to,
//     from: 'verified_sender@example.com', // your verified sender
//     subject: `Reminder: ${habitName}`,
//     text: `Hey! It's time for your habit: ${habitName}`,
//   };

//   return sgMail.send(msg);
// }

// module.exports = { sendReminderEmail };
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Habit Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4F46E5;">🎯 Habit Tracker</h2>
          <div style="margin: 20px 0; line-height: 1.6; color: #333;">
            ${text.replace(/\n/g, '<br>')}
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Keep building great habits! 💪<br>
            <a href="http://localhost:3000" style="color: #4F46E5;">Visit Habit Tracker</a>
          </p>
        </div>
      </div>`,
    });
    
    console.log("✅ Email sent successfully to", to);
    console.log("📧 Message ID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Failed to send email:");
    console.error("Error:", err.message);
    return { success: false, error: err.message };
  }
};
