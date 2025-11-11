import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
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

const movieSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  rentalPrice: {
    type: Number,
    required: true
  },
  rentalCount: { type: Number, default: 0 },
}, { timestamps: true });

const reviewSchema = new Schema({
  movieId: { 
    type: mongoose.Schema.Types.ObjectId,  
    ref: "Movie", 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,  
    ref: "User", 
    required: true 
  },
  comment: { 
    type: String, 
    required: true 
  },
  reviewDate: { 
    type: Date, 
    default: Date.now 
  },
  username: { 
    type: String 
  },
}, { timestamps: true });

const promotionSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  discountType: { 
    type: String,  
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true 
  },
  pointUsage: { 
    type: Number, 
    default: 0 
  },
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
}, { timestamps: true });

const rentalSchema = new Schema({
  userId: { 
    type: Number, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["ACTIVE", "COMPLETED"], 
    default: "ACTIVE" 
  },
  rentalDate: { 
    type: Date, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },

  movie: {
    movieId: { 
      type: Number, 
      ref: "Movie", 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    rentalPriceAtTime: { 
      type: Number, 
      required: true 
    },
  },

  payment: {
    paymentId: { 
      type: String, 
      required: true 
    },
    originalAmount: { 
      type: Number, 
      required: true 
    },
    amountPaid: { 
      type: Number, 
      required: true 
    },
    paymentMethod: { 
      type: String, 
      required: true 
    },
    paymentDate: { 
      type: Date, 
      required: true 
    },
    promotionUsed: {
      promotionId: { 
        type: String, 
        ref: "Promotion" 
      },
      code: { 
        type: String 
      },
      discountAmount: { 
        type: Number, 
        default: 0 
      },
      pointUsage: {
        type: Number,
      }
    },
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
const Movie = mongoose.model("Movie", movieSchema);
const Review = mongoose.model("Review", reviewSchema);
const Promotion = mongoose.model("Promotion", promotionSchema);
const Rental = mongoose.model("Rental", rentalSchema);

export { User, Movie, Review, Promotion, Rental };
