import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB (ถ้าใช้ DynamoDB เดี๋ยวเปลี่ยน)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

//User Schema
import { Schema } from "mongoose";

const userSchema = new Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  promotionPoint: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model("users", userSchema);

// User Routes
const userRouter = express.Router();

// GET all users (ไม่ส่ง passwordHash)
userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({}); // exclude passwordHash
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user by ID
userRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { passwordHash: 0 });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new user
userRouter.post("/users_create", async (req, res) => {
  try {
    const { _id, username, email, passwordHash, promotionPoint } = req.body;

    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    const newUser = new User({
      _id,
      username,
      email,
      passwordHash: hashedPassword, // เก็บ hashed password
      promotionPoint: promotionPoint || 0,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Use Routes
app.use("/api", userRouter);

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
