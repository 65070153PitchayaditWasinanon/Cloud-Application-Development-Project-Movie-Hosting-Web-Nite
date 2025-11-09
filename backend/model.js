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

const movieSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rentalPrice: {
    type: Number,
    required: true
  }
}, { timestamps: true });


// เชื่อมต่อ MongoDB (ถ้าใช้ DynamoDB เดี๋ยวเปลี่ยน)
const User = mongoose.model("User", userSchema);
const Movie = mongoose.model('Movie', movieSchema);
export { User, Movie };
