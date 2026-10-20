import mongoose from "mongoose";

const { Schema } = mongoose;

const successStorySchema = new Schema(
  {
    coupleName: {
      type: String,
      required: [true, "Couple name is required"],
      trim: true,
      index: true,
    },
    groomName: {
      type: String,
      trim: true,
    },
    brideName: {
      type: String,
      trim: true,
    },
    groomUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    brideUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    weddingDate: {
      type: Date,
    },
    postedOn: {
      type: String,
      default: () =>
        new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    city: {
      type: String,
      trim: true,
      default: "Mumbai",
    },
    storySnippet: {
      type: String,
      required: [true, "Story snippet is required"],
      trim: true,
      maxlength: 350,
    },
    fullStory: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80",
    },
    badge: {
      type: String,
      trim: true,
      default: "Just Married",
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for fast retrieval of active, featured stories ordered by displayOrder / createdAt
successStorySchema.index({ isActive: 1, isFeatured: 1, displayOrder: 1, createdAt: -1 });

const SuccessStory =
  mongoose.models.SuccessStory ||
  mongoose.model("SuccessStory", successStorySchema);

export default SuccessStory;
