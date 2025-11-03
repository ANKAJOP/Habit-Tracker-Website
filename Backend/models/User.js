// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   points: { type: Number, default: 0 },
//   streak: { type: Number, default: 0 },
//   claimedRewards: [{ type: String }], // store reward IDs as strings
//   createdAt: { type: Date, default: Date.now },
// });

// // Hash password before saving
// userSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // Compare password
// userSchema.methods.matchPassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastPointDate: { type: Date }, // track last day points awarded
  claimedRewards: [
    {
      rewardId: String,
      claimedAt: Date,
      link: String
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

// Password hashing
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password compare
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
