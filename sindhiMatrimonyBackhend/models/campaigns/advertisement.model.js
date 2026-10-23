import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    adId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryLabel: {
      type: String,
      required: true,
      trim: true,
      default: "🎁 Gifts",
    },
    categories: {
      type: [String],
      default: ["Gifts"],
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    platform: {
      type: String,
      enum: ["Amazon", "Flipkart", "Meesho", "Myntra", "Nykaa", "Custom", "Other"],
      default: "Amazon",
    },
    platformLogoBg: {
      type: String,
      default: "bg-[#232F3E]",
    },
    platformTextColor: {
      type: String,
      default: "text-amber-400",
    },
    badge: {
      type: String,
      default: "Special Deal",
    },
    badgeColor: {
      type: String,
      default: "bg-amber-50 text-amber-800 border-amber-200",
    },
    imageSrc: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    couponCode: {
      type: String,
      trim: true,
      default: "",
    },
    affiliateUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    targetAudience: {
      type: String,
      enum: ["ALL", "PAID_MEMBERS", "FREE_MEMBERS", "MALE", "FEMALE"],
      default: "ALL",
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      default: "SUPER_ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save to auto-calculate discount percentage and sync primary photo
advertisementSchema.pre("save", function (next) {
  if (this.originalPrice > 0 && this.price >= 0) {
    this.discountPercent = Math.max(
      0,
      Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
    );
  }
  if ((!this.images || this.images.length === 0) && this.imageSrc) {
    this.images = [this.imageSrc];
  } else if (this.images && this.images.length > 0 && !this.imageSrc) {
    this.imageSrc = this.images[0];
  }
  next();
});

export const Advertisement =
  mongoose.models.Advertisement ||
  mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;
