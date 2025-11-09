// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  promotionPoint: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// เชื่อมต่อ MongoDB (ถ้าใช้ DynamoDB เดี๋ยวเปลี่ยน)
const User = mongoose.model("User", userSchema);
export default User;
