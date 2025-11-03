// models/Contact.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  name: { type: String, required: true, trim: true, maxLength: 50 },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true, maxLength: 500 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Contact", contactSchema);
