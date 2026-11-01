import mongoose from "mongoose";

const homeBannerSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "DEFAULT_HOME_BANNERS",
      index: true,
    },
    celebratingBanner: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    planAdBanner: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    assistedServiceBanner: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    limcaRecordBanner: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    paidMember: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    assistedService: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    footerSupport: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const HomeBanner =
  mongoose.models.HomeBanner ||
  mongoose.model("HomeBanner", homeBannerSchema);

export default HomeBanner;

