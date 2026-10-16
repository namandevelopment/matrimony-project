import mongoose from "mongoose";
import { addTimeStamp } from "../../utils/globalFunction.js";
import { MANGLIK_STATUS, MARITAL_STATUS, SINDHI_SUBCASTES } from "../../utils/variables.js";

const { Schema } = mongoose;

const partnerPreferenceSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    ageMin: {
      type: Number,
      default: 21,
    },
    ageMax: {
      type: Number,
      default: 35,
    },
    heightMin: {
      type: Number, // in cm (e.g. 155)
      default: 150,
    },
    heightMax: {
      type: Number,
      default: 195,
    },
    maritalStatus: {
      type: [String],
      enum: MARITAL_STATUS,
      default: ["NEVER_MARRIED"],
    },
    subcastes: {
      type: [String],
      enum: SINDHI_SUBCASTES,
      default: [], // Empty means open to all Sindhi subcastes
    },
    excludedGotras: {
      type: [String],
      default: [], // Sindhi Swagotra exogamy rules
    },
    manglikPreference: {
      type: [String],
      enum: MANGLIK_STATUS,
      default: ["NON_MANGLIK", "ANSHIK_MANGLIK", "DONT_KNOW"],
    },
    preferredCities: {
      type: [String],
      default: [],
    },
    minAnnualIncome: {
      type: Number,
      default: 0,
    },
    ...addTimeStamp(),
  },
  {
    timestamps: true,
  }
);

export const PartnerPreference = mongoose.model("PartnerPreference", partnerPreferenceSchema);
export default PartnerPreference;
