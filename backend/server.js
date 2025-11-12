// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    ScanCommand,
    QueryCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() }); // เก็บไฟล์ใน RAM ไว้ชั่วคราว

/**
 * DynamoDB client setup
 * Make sure AWS credentials/region are set in .env or environment
 */
const ddbClient = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    },
});

const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    },
});


const docClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Table names (change if you used different names)
 */
const USERS_TABLE = "Users";
const MOVIES_TABLE = "Movies";
const PROMOTIONS_TABLE = "Promotions";
const RENTALS_TABLE = "Rentals";
const REVIEWS_TABLE = "Reviews";

/**
 * Helpers
 */
function generateId(prefix = "") {
    return prefix ? `${prefix}_${uuidv4()}` : uuidv4();
}

/**
 * ---------- USER ROUTES ----------
 */

// Register
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ message: "username/email/password required" });

        // Check existing by email (scan with FilterExpression)
        const existing = await docClient.send(
            new ScanCommand({
                TableName: USERS_TABLE,
                FilterExpression: "email = :email",
                ExpressionAttributeValues: { ":email": email },
                Limit: 1,
            })
        );

        if (existing.Items && existing.Items.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = generateId("USER");

        const newUser = {
            userId,
            username,
            email,
            passwordHash,
            promotionPoint: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await docClient.send(
            new PutCommand({
                TableName: USERS_TABLE,
                Item: newUser,
            })
        );

        res.status(201).json({
            message: "User registered successfully",
            user: { userId, username, email },
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Login (identifier = email or username)
app.post("/api/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password)
            return res.status(400).json({ message: "identifier and password required" });

        // สแกนทั้งตารางเพื่อหา user ที่ email หรือ username ตรง
        const scanRes = await docClient.send(
            new ScanCommand({
                TableName: USERS_TABLE,
                FilterExpression: "email = :id OR username = :id",
                ExpressionAttributeValues: { ":id": identifier },
            })
        );

        const user = scanRes.Items && scanRes.Items[0];
        if (!user)
            return res.status(400).json({ message: "Invalid username/email or password" });

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid username/email or password" });

        // สร้าง JWT token
        const token = jwt.sign(
            { id: user.userId, email: user.email },
            process.env.JWT_SECRET || "secretkey",
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { userId: user.userId, username: user.username, email: user.email },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: err.message });
    }
});



// GET all users (exclude passwordHash)
app.get("/api/users", async (req, res) => {
    try {
        const scanRes = await docClient.send(new ScanCommand({ TableName: USERS_TABLE }));
        const users = (scanRes.Items || []).map((u) => {
            const copy = { ...u };
            delete copy.passwordHash;
            return copy;
        });
        res.json(users);
    } catch (err) {
        console.error("Get users error:", err);
        res.status(500).json({ message: err.message });
    }
});

// GET user by ID
app.get("/api/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const getRes = await docClient.send(
            new GetCommand({
                TableName: USERS_TABLE,
                Key: { userId },
            })
        );
        if (!getRes.Item) return res.status(404).json({ message: "User not found" });
        const user = { ...getRes.Item };
        delete user.passwordHash;
        res.json(user);
    } catch (err) {
        console.error("Get user error:", err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * ---------- MOVIE ROUTES ----------
 */

// GET all movies
app.get("/api/movies", async (req, res) => {
    try {
        const scanRes = await docClient.send(new ScanCommand({ TableName: MOVIES_TABLE }));
        res.json(scanRes.Items || []);
    } catch (err) {
        console.error("Get movies error:", err);
        res.status(500).json({ message: err.message });
    }
});

//get movie by id
app.get("/api/movies/:id", async (req, res) => {
    try {
        const movieId = req.params.id;
        const getRes = await docClient.send(
            new GetCommand({
                TableName: MOVIES_TABLE,
                Key: { movieId },
            })
        );
        if (!getRes.Item) return res.status(404).json({ message: "Movie not found" });
        res.json(getRes.Item);
    } catch (err) {
        console.error("Get movie error:", err);
        res.status(500).json({ message: err.message });
    }
});

// GET movies popular (sorted by rentalCount desc) + single most popular
app.get("/api/moviespopular", async (req, res) => {
    console.log('test')
    try {
        const scanRes = await docClient.send(new ScanCommand({ TableName: MOVIES_TABLE }));
        const movies = scanRes.Items || [];
        // ensure rentalCount exists
        movies.forEach((m) => {
            if (typeof m.rentalCount !== "number") m.rentalCount = Number(m.rentalCount || 0);
        });
        movies.sort((a, b) => b.rentalCount - a.rentalCount);
        const most = movies.length ? movies[0] : null;
        res.json({ movie: movies, mostmovie: most });
    } catch (err) {
        console.error("Get popular movies error:", err);
        res.status(500).json({ message: err.message });
    }
});

// GET movie by search q (partial match on title, case-insensitive)
app.get("/api/moviessearch", async (req, res) => {
    try {
        const qRaw = (req.query.q || "").trim();
        if (!qRaw) return res.json([]);
        const q = qRaw.toLowerCase();

        // We attempt to search using titleLower (if you insert that) or title as fallback
        const scanRes = await docClient.send(
            new ScanCommand({
                TableName: MOVIES_TABLE,
                // FilterExpression using OR of contains(titleLower, :q) or contains(title, :q)
                FilterExpression: "contains(#tl, :q) OR contains(#t, :q)",
                ExpressionAttributeNames: { "#tl": "titleLower", "#t": "title" },
                ExpressionAttributeValues: { ":q": q },
            })
        );
        res.json(scanRes.Items || []);
    } catch (err) {
        console.error("Search movies error:", err);
        res.status(500).json({ message: err.message });
    }
});

// GET movie by ID
app.get("/movies/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET Promotion by CODE
app.get("/api/promotions/:code", async (req, res) => {
    try {
        const code = req.params.code;
        if (!code) {
            return res.status(400).json({ message: "Promotion code is required" });
        }

        // ใช้ ScanCommand เพื่อค้นหา promotion ตาม code (เพราะ code ไม่ใช่ primary key)
        const scanRes = await docClient.send(
            new ScanCommand({
                TableName: PROMOTIONS_TABLE,
                FilterExpression: "#c = :code",
                ExpressionAttributeNames: { "#c": "code" },
                ExpressionAttributeValues: { ":code": code },
                Limit: 1, // หยุดเมื่อเจออันแรก
            })
        );

        const promotion = scanRes.Items && scanRes.Items[0];
        if (!promotion) {
            return res.status(404).json({ message: "Promotion code not found." });
        }

        res.json(promotion);
    } catch (err) {
        console.error("Get promotion by code error:", err);
        res.status(500).json({ message: err.message });
    }
});

// GET all promotions
app.get("/api/promotions", async (req, res) => {
    try {
        const scanRes = await docClient.send(new ScanCommand({ TableName: PROMOTIONS_TABLE }));
        res.json(scanRes.Items || []);
    } catch (err) {
        console.error("Get promotions error:", err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * ---------- RENTAL ROUTES ----------
 */

// POST rental
app.post("/api/rentals", async (req, res) => {
    try {
        const rentalData = req.body;
        const { userId, movie, payment } = rentalData;

        if (!userId || !movie || !movie.movieId) {
            return res.status(400).json({ message: "Missing userId or movie data" });
        }

        // ดึงข้อมูลผู้ใช้จาก DynamoDB
        const userRes = await docClient.send(
            new GetCommand({
                TableName: USERS_TABLE,
                Key: { userId },
            })
        );

        const user = userRes.Item;
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("Rental Data:", rentalData);

        // จัดการ promotionPoint ของผู้ใช้
        let newPromotionPoint = user.promotionPoint || 0;
        if (payment?.promotionUsed && payment.promotionUsed.pointUsage > 0) {
            if (newPromotionPoint >= 5) {
                newPromotionPoint -= 5;
            } else {
                return res.status(400).json({ message: "Insufficient points" });
            }
        } else {
            newPromotionPoint += 1;
        }

        // อัปเดต promotionPoint ของผู้ใช้
        await docClient.send(
            new UpdateCommand({
                TableName: USERS_TABLE,
                Key: { userId },
                UpdateExpression:
                    "SET promotionPoint = :p, updatedAt = :u",
                ExpressionAttributeValues: {
                    ":p": newPromotionPoint,
                    ":u": new Date().toISOString(),
                },
            })
        );

        // สร้าง rental record ใหม่ใน DynamoDB
        const rentalId = generateId("RENTAL");
        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setDate(now.getDate() + 3); // หมดอายุใน 3 วัน (เปลี่ยนได้)
        const movieId = movie.movieId
        await docClient.send(
            new UpdateCommand({
                TableName: MOVIES_TABLE,
                Key: { movieId },
                UpdateExpression:
                    "SET rentalCount = rentalCount + :incr",
                ExpressionAttributeValues: {
                    ":incr": 1
                },
            })
        );
        const newRental = {
            rentalId,
            userId,
            movie,
            payment,
            rentedAt: now.toISOString(),
            dueDate: dueDate.toISOString(),
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };

        await docClient.send(
            new PutCommand({
                TableName: RENTALS_TABLE,
                Item: newRental,
            })
        );

        res.status(201).json({
            message: "Rental created successfully",
            rental: newRental,
        });
    } catch (err) {
        console.error("Create rental error:", err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * ---------- REVIEW ROUTES ----------
 */

// GET reviews for a given movieId
app.get("/api/reviews/:id", async (req, res) => {
    try {
        const movieId = req.params.id;

        // scan reviews where movieId = :movieId
        const scanRes = await docClient.send(
            new ScanCommand({
                TableName: REVIEWS_TABLE,
                FilterExpression: "movieId = :mid",
                ExpressionAttributeValues: { ":mid": movieId },
            })
        );

        const reviews = scanRes.Items || [];
        if (reviews.length === 0) return res.status(404).json({ message: "No reviews found for this movie" });
        res.json(reviews);
    } catch (err) {
        console.error("Get reviews error:", err);
        res.status(500).json({ message: err.message });
    }
});

// POST add review
app.post("/api/add_reviews", async (req, res) => {
    try {
        const { movieId, userId, username, comment } = req.body;
        if (!movieId || !userId || !comment) {
            return res.status(400).json({ message: "movieId, userId and comment are required" });
        }

        const reviewId = generateId("REVIEW");
        const newReview = {
            reviewId,
            movieId,
            userId,
            username: username || null,
            comment,
            reviewDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await docClient.send(
            new PutCommand({
                TableName: REVIEWS_TABLE,
                Item: newReview,
            })
        );

        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (err) {
        console.error("Add review error:", err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * ---------- OPTIONAL: Add / Update Movie (CRUD helpers) ----------
 * If you want endpoints to create/update movies (useful for admin)
 */

// Create movie
app.post("/api/movies", async (req, res) => {
    try {
        const { title, description, imagePath, moviePath, rentalPrice } = req.body;
        if (!title || !description || !imagePath || !moviePath || rentalPrice == null) {
            return res.status(400).json({ message: "Missing movie fields" });
        }

        const movieId = generateId("MOV");
        const now = new Date().toISOString();

        const item = {
            movieId,
            title,
            titleLower: title.toLowerCase(), // for case-insensitive search
            description,
            imagePath,
            moviePath,
            rentalPrice: Number(rentalPrice),
            rentalCount: 0,
            createdAt: now,
            updatedAt: now,
        };

        await docClient.send(
            new PutCommand({
                TableName: MOVIES_TABLE,
                Item: item,
            })
        );

        res.status(201).json(item);
    } catch (err) {
        console.error("Create movie error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Update movie (partial)
app.put("/api/movies/:id", async (req, res) => {
    try {
        const movieId = req.params.id;
        const updates = req.body;
        const updateParts = [];
        const expressionAttrValues = { ":now": new Date().toISOString() };
        const expressionAttrNames = {};
        let idx = 0;

        for (const key of Object.keys(updates)) {
            idx++;
            const placeholderName = `#f${idx}`;
            const placeholderVal = `:v${idx}`;
            expressionAttrNames[placeholderName] = key;
            expressionAttrValues[placeholderVal] = updates[key];
            updateParts.push(`${placeholderName} = ${placeholderVal}`);
            if (key === "title") {
                // keep titleLower in sync
                idx++;
                const tlName = `#f${idx}`;
                const tlVal = `:v${idx}`;
                expressionAttrNames[tlName] = "titleLower";
                expressionAttrValues[tlVal] = String(updates.title).toLowerCase();
                updateParts.push(`${tlName} = ${tlVal}`);
            }
        }

        const updateExpr = "SET " + updateParts.join(", ") + ", updatedAt = :now";

        const resUpdate = await docClient.send(
            new UpdateCommand({
                TableName: MOVIES_TABLE,
                Key: { movieId },
                UpdateExpression: updateExpr,
                ExpressionAttributeNames: expressionAttrNames,
                ExpressionAttributeValues: expressionAttrValues,
                ReturnValues: "ALL_NEW",
            })
        );

        res.json(resUpdate.Attributes);
    } catch (err) {
        console.error("Update movie error:", err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * ---------- PROMOTIONS CRUD (basic) ----------
 */
app.post("/api/promotions", async (req, res) => {
    try {
        const { name, description, discountType, discountValue, pointUsage, code, startDate, endDate } = req.body;
        if (!name || !discountType || discountValue == null || !code || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing promotion required fields" });
        }

        const promotionId = generateId("PROM");
        const now = new Date().toISOString();

        const item = {
            promotionId,
            name,
            description: description || null,
            discountType,
            discountValue: Number(discountValue),
            pointUsage: pointUsage || 0,
            code,
            startDate,
            endDate,
            createdAt: now,
            updatedAt: now,
        };

        await docClient.send(
            new PutCommand({
                TableName: PROMOTIONS_TABLE,
                Item: item,
            })
        );

        res.status(201).json(item);
    } catch (err) {
        console.error("Create promotion error:", err);
        res.status(500).json({ message: err.message });
    }
});

app.post("/api/upload", upload.single("videoFile"), async (req, res) => {
    try {
        const { title, description, imagePath, rentalPrice } = req.body;
        const videoFile = req.file;

        // ตรวจว่าข้อมูลครบไหม
        if (!title || !description || !imagePath || rentalPrice == null) {
            return res.status(400).json({ message: "Missing required movie fields" });
        }

        if (!videoFile) {
            return res.status(400).json({ message: "ไม่มีไฟล์วิดีโอ" });
        }
        const key = `${title}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_RAW,
                Key: key,
                Body: videoFile.buffer,
                ContentType: videoFile.mimetype || "video/mp4",
            })
        );


        const movieId = generateId("MOV"); // ใช้ฟังก์ชัน generateId ที่มีอยู่แล้ว
        const now = new Date().toISOString();

        const newMovie = {
            movieId,
            title,
            titleLower: title.toLowerCase(),
            description,
            imagePath,
            rentalPrice: Number(rentalPrice),
            moviePath: title + ".mp4",
            rentalCount: 0,
            createdAt: now,
            updatedAt: now,
        };

        // บันทึกลง DynamoDB
        await docClient.send(
            new PutCommand({
                TableName: MOVIES_TABLE,
                Item: newMovie,
            })
        );

        res.status(201).json({
            message: "Upload successfully",
            upload: newMovie,
        });
    } catch (err) {
        console.error("Upload movie error:", err);
        res.status(500).json({ message: err.message });
    }
});



// GET check if user has an active rental for a movie
app.get("/api/checkRental", async (req, res) => {
    try {
        const { userID, movieID } = req.query;
        console.log(movieID)
        if (!userID || !movieID) {
            return res.status(400).json({ message: "userID and movieID are required" });
        }

        const now = new Date().toISOString();

        const scanParams = {
            TableName: RENTALS_TABLE,
            FilterExpression: "userId = :uid AND movie.movieId = :mid AND dueDate >= :now",
            ExpressionAttributeValues: {
                ":uid": userID,
                ":mid": movieID,
                ":now": now,
            },
        };

        const scanRes = await docClient.send(new ScanCommand(scanParams));

        if (scanRes.Items && scanRes.Items.length > 0) {
            //  หา item ที่มี dueDate ล่าสุด (มากที่สุด)
            const latestRental = scanRes.Items.reduce((latest, current) =>
                new Date(current.dueDate) > new Date(latest.dueDate) ? current : latest
            );

            return res.status(200).json({
                status: true,
                latestRental, // ส่งข้อมูลรายการนั้นกลับมาด้วย (optional)
            });
        } else {
            return res.status(200).json({ status: false });
        }
    } catch (err) {
        console.error("CheckRental error:", err);
        res.status(500).json({ message: err.message });
    }
});





/**
 * ---------- START SERVER ----------
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});