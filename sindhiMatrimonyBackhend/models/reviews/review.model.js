import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    memberId: {
      type: String,
      trim: true,
      default: "guest",
    },
    memberName: {
      type: String,
      required: true,
      trim: true,
    },
    memberRole: {
      type: String,
      enum: ["Bride", "Groom", "Parent", "Sibling", "Relative", "Member"],
      default: "Member",
    },
    subcaste: {
      type: String,
      trim: true,
      default: "Sindhi",
    },
    city: {
      type: String,
      trim: true,
      default: "India",
    },
    memberPhoto: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ["WEBSITE", "IN_APP", "GOOGLE", "RELATIONSHIP_MANAGER"],
      default: "WEBSITE",
    },
    category: {
      type: String,
      enum: ["MATCHMAKING", "CUSTOMER_SUPPORT", "HOROSCOPE", "OVERALL"],
      default: "OVERALL",
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    adminResponse: {
      type: String,
      default: "",
    },
    adminRespondedAt: {
      type: String,
      default: "",
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    contactPhone: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-friendly reviewId if missing
reviewSchema.pre("save", function (next) {
  if (!this.reviewId) {
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    this.reviewId = `REV-${year}-${rand}`;
  }
  next();
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
