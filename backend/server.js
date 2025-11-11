import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Movie, Promotion, Rental, Review } from "./model.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() }); // เก็บไฟล์ใน RAM ชั่วคราว

// เชื่อม MongoDB (เปลี่ยนตอนใช้ DynamoDB)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB error:", err));


//aws service sdk
const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  },
});

const dynamodb = new DynamoDBClient({ region: "ap-southeast-1" });


const awsRouter = express.Router();

awsRouter.post("/test-upload", async (req, res) => {
  try {
    const key = "test/test.txt"; // ชื่อไฟล์ใน S3
    const content = "Hello from Express!"; // เนื้อหาไฟล์

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_RAW,
        Key: key,
        Body: content,
        ContentType: "text/plain",
      })
    );

    res.json({
      ok: true,
      message: "Upload success",
      s3Url: `https://${process.env.S3_BUCKET_RAW}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});


app.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded" });
    }

    const key = `uploads/${Date.now()}_${req.file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_RAW,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype || "video/mp4",
      })
    );

    const url = `https://${process.env.S3_BUCKET_RAW}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({
      ok: true,
      message: "Upload success",
      s3Url: url,
      key,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});




app.use("/api", awsRouter);




const userRouter = express.Router();

// Register
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ตรวจสอบว่ามี user ซ้ำมั้ย
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      promotionPoint: 0,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: { _id: savedUser._id, username: savedUser.username, email: savedUser.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login username หรือ email ก็ได้
userRouter.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // ใช้ "identifier" เพื่อให้ส่งได้ทั้ง email และ username

    // หา email หรือ username ว่ามีมั้ย
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    if (!user) return res.status(400).json({ message: "Invalid username/email or password" });

    // เช็ครหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid username/email or password" });

    // สร้าง JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



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

// GET all movies sort by rental counts
movieRouter.get("/movies/popular", async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ rentalCount: -1 });
    const MostPopmovies = await Movie.findOne({}).sort({ rentalCount: -1 });
    res.json({
      movie: movies,
      mostmovie: MostPopmovies
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET movie by search
movieRouter.get("/movies/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    let movies;
    if (q) {
      movies = await Movie.find({
        title: { $regex: q, $options: "i" }
      })
    }
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

// GET Promotion by CODE
movieRouter.get("/promotions/:code", async (req, res) => {
  try {
    const promotion = await Promotion.findOne({ code: req.params.code })
    if (!promotion) {
      return res.status(404).json({ message: "Promotion code not found." });
    }
    res.json(promotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL Promotion
movieRouter.get("/promotions", async (req, res) => {
  try {
    const promotions = await Promotion.find({});
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use("/api", movieRouter);

// POST Rental
const rentalRouter = express.Router();
rentalRouter.post("/rentals", async (req, res) => {
  try {
    const rentalData = req.body;
    const user = await User.findById(rentalData.userId);
    console.log("Rental Data:", rentalData);
    if (rentalData.payment.promotionUsed && rentalData.payment.promotionUsed.pointUsage > 0) {
      if (user.promotionPoint >= 5) {
        user.promotionPoint -= 5;
      } else {
        return res.status(400).json({ message: "Insufficient points" });
      }
    } else {
      user.promotionPoint += 1;
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  }
  catch (error) {
    console.log(error)
  }
}
);

rentalRouter.get("/checkRental", async (req, res) => {
  const { userID, movieID } = req.query;
  console.log(userID, movieID)
  const rental = await Rental.findOne({
    userId: new mongoose.Types.ObjectId(String(userID)),
    "movie.movieId": new mongoose.Types.ObjectId(String(movieID)),
    dueDate: { $gte: new Date() }
  })

  if (!rental) {
    return res.status(200).json({ status: false })
  }

  return res.status(200).json({ status: true })
})

app.use("/api", rentalRouter);

const reviewRouter = express.Router();

reviewRouter.get("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ movieId: id });
    console.log(reviews);
    console.log(id);
    if (!reviews.length)
      return res.status(404).json({ message: "No reviews found for this movie" });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

reviewRouter.post("/add_reviews", async (req, res) => {
  try {
    const { movieId, userId, username, comment } = req.body;

    const newReview = new Review({
      movieId,
      userId,
      username,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





app.use("/api", movieRouter);
app.use("/api", reviewRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});

