import mongoose from "mongoose";

const { Schema } = mongoose;

const shortlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    candidateProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

shortlistSchema.index({ userId: 1, candidateProfileId: 1 }, { unique: true });

const Shortlist =
  mongoose.models.Shortlist ||
  mongoose.model("Shortlist", shortlistSchema);

export default Shortlist;

