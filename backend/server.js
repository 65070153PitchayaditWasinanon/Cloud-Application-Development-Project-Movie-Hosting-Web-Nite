import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User, Movie } from './model.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// เชื่อม MongoDB (เปลี่ยนตอนใช้ DynamoDB)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));

const userRouter = express.Router();

// GET all users (ไม่เอา passwordHash)
userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 });
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
      passwordHash: hashedPassword,
      promotionPoint: promotionPoint || 0,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.use("/api", userRouter);

const movieRouter = express.Router();

// GET all movies
movieRouter.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET movie by ID
movieRouter.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new movie
movieRouter.post("/movies_create", async (req, res) => {
  try {
    const { _id, title, description, imagePath, rentalPrice } = req.body;

    const newMovie = new Movie({ _id, title, description, imagePath, rentalPrice });
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.use("/api", movieRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
