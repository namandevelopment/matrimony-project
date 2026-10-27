import mongoose from "mongoose";
import Advertisement from "../../models/campaigns/advertisement.model.js";
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
  OK,
  ERROR_FALSE,
  ERROR_TRUE,
} from "../../utils/constants.js";
import { apiHTTPResponse, logMessage, asyncHandler } from "../../utils/globalFunction.js";

import { DEFAULT_PARTNER_DEALS } from "../../constants/seedCandidateData.js";


const getPlatformDefaults = (platform = "Amazon") => {
  switch (platform) {
    case "Amazon":
      return { platformLogoBg: "bg-[#232F3E]", platformTextColor: "text-amber-400" };
    case "Meesho":
      return { platformLogoBg: "bg-[#570741]", platformTextColor: "text-fuchsia-300" };
    case "Flipkart":
      return { platformLogoBg: "bg-[#2874F0]", platformTextColor: "text-yellow-300" };
    case "Myntra":
      return { platformLogoBg: "bg-[#E11B55]", platformTextColor: "text-pink-100" };
    case "Nykaa":
      return { platformLogoBg: "bg-[#FC2779]", platformTextColor: "text-white" };
    default:
      return { platformLogoBg: "bg-stone-900", platformTextColor: "text-white" };
  }
};

let inMemoryAds = DEFAULT_PARTNER_DEALS.map((d, i) => ({
  ...d,
  _id: `ad_mem_${i + 1}`,
  clicks: 14 + i * 5,
  impressions: 120 + i * 40,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

/**
 * 🌟 Ensure database has seed ads on cold start if empty
 */
const ensureSeedAds = async () => {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const count = await Advertisement.countDocuments();
    if (count === 0) {
      await Advertisement.insertMany(DEFAULT_PARTNER_DEALS);
      logMessage("info", "[Ads Management] Seeded 4 initial partner deals successfully.");
    }
  } catch (err) {
    logMessage("warn", `[Ads Management] Seed check skipped: ${err?.message}`);
  }
};

/**
 * 1. GET /api/v1/admin/ads - List all ads with filters, search, and pagination
 */
export const getAdminAds = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const stats = {
      totalAds: inMemoryAds.length,
      activeAds: inMemoryAds.filter((a) => a.status === "ACTIVE").length,
      inactiveAds: inMemoryAds.filter((a) => a.status === "INACTIVE").length,
    };
    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Advertisements retrieved successfully",
      {
        list: inMemoryAds,
        pagination: { page: 1, limit: inMemoryAds.length, total: inMemoryAds.length, totalPages: 1 },
        stats,
      },
      OK,
      ERROR_FALSE
    );
  }
  await ensureSeedAds();

  const {
    page = 1,
    limit = 20,
    search = "",
    status = "",
    platform = "",
    category = "",
    sortBy = "priority",
    sortOrder = "desc",
  } = req.query;

  const query = {};

  if (status && status !== "ALL") {
    query.status = status;
  }

  if (platform && platform !== "ALL") {
    query.platform = platform;
  }

  if (category && category !== "ALL") {
    query.$or = [
      { categoryLabel: { $regex: category, $options: "i" } },
      { categories: { $in: [new RegExp(category, "i")] } },
    ];
  }

  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { name: { $regex: s, $options: "i" } },
      { description: { $regex: s, $options: "i" } },
      { couponCode: { $regex: s, $options: "i" } },
      { badge: { $regex: s, $options: "i" } },
      { adId: { $regex: s, $options: "i" } },
    ];
  }

  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortDirection, createdAt: -1 };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [total, ads] = await Promise.all([
    Advertisement.countDocuments(query),
    Advertisement.find(query).sort(sort).skip(skip).limit(limitNum).lean(),
  ]);

  const stats = {
    totalAds: await Advertisement.countDocuments(),
    activeAds: await Advertisement.countDocuments({ status: "ACTIVE" }),
    inactiveAds: await Advertisement.countDocuments({ status: "INACTIVE" }),
  };

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Advertisements retrieved successfully",
    {
      list: ads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      stats,
    },
    OK,
    ERROR_FALSE
  );
});

/**
 * 2. POST /api/v1/admin/ads - Create a new advertisement / partner deal
 */
export const createAdminAd = asyncHandler(async (req, res) => {
  const {
    name,
    categoryLabel,
    categories,
    price,
    originalPrice,
    platform = "Amazon",
    platformLogoBg,
    platformTextColor,
    badge = "Special Deal",
    badgeColor,
    imageSrc,
    images = [],
    description,
    couponCode = "",
    affiliateUrl,
    status = "ACTIVE",
    priority = 0,
    targetAudience = "ALL",
  } = req.body;

  if (!name || price === undefined || originalPrice === undefined || !affiliateUrl) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_BAD_REQUEST,
      "Name, deal price, original price, and affiliate URL are required.",
      null,
      "MISSING_REQUIRED_FIELDS",
      ERROR_TRUE
    );
  }

  const normalizedImages = Array.isArray(images) && images.length > 0
    ? images.filter(Boolean)
    : imageSrc ? [imageSrc] : [];

  const primaryImage = imageSrc || normalizedImages[0] || "/images/dashboard/gift_couple_rings.jpg";

  const numPrice = Number(price);
  const numOriginal = Number(originalPrice);
  const discountPercent = numOriginal > 0
    ? Math.max(0, Math.round(((numOriginal - numPrice) / numOriginal) * 100))
    : 0;

  const styleDefaults = getPlatformDefaults(platform);

  const adId = req.body.adId || `AD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const newAd = new Advertisement({
    adId,
    name: name.trim(),
    categoryLabel: categoryLabel || "🎁 Gifts",
    categories: Array.isArray(categories) && categories.length > 0 ? categories : ["Gifts"],
    price: numPrice,
    originalPrice: numOriginal,
    discountPercent,
    platform,
    platformLogoBg: platformLogoBg || styleDefaults.platformLogoBg,
    platformTextColor: platformTextColor || styleDefaults.platformTextColor,
    badge,
    badgeColor: badgeColor || "bg-amber-50 text-amber-800 border-amber-200",
    imageSrc: primaryImage,
    images: normalizedImages.length > 0 ? normalizedImages : [primaryImage],
    description: description || name,
    couponCode: (couponCode || "").trim().toUpperCase(),
    affiliateUrl: affiliateUrl.trim(),
    status,
    priority: Number(priority) || 0,
    targetAudience,
    createdBy: req.user?.email || req.user?.id || "SUPER_ADMIN",
  });

  if (mongoose.connection.readyState !== 1) {
    const memAd = {
      ...newAd.toObject(),
      _id: `ad_mem_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    inMemoryAds.unshift(memAd);
    return apiHTTPResponse(
      req,
      res,
      HTTP_CREATED,
      "Advertisement created successfully",
      memAd,
      OK,
      ERROR_FALSE
    );
  }

  await newAd.save();

  return apiHTTPResponse(
    req,
    res,
    HTTP_CREATED,
    "Advertisement created successfully",
    newAd,
    OK,
    ERROR_FALSE
  );
});

/**
 * 3. GET /api/v1/admin/ads/:id - Get advertisement detail
 */
export const getAdminAdDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState !== 1) {
    const ad = inMemoryAds.find((a) => a.adId === id || a._id === id);
    if (!ad) {
      return apiHTTPResponse(req, res, HTTP_NOT_FOUND, "Advertisement not found", null, "NOT_FOUND", ERROR_TRUE);
    }
    return apiHTTPResponse(req, res, HTTP_OK, "Advertisement retrieved successfully", ad, OK, ERROR_FALSE);
  }

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { adId: id };
  const ad = await Advertisement.findOne(query).lean();

  if (!ad) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_NOT_FOUND,
      "Advertisement not found",
      null,
      "NOT_FOUND",
      ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Advertisement retrieved successfully",
    ad,
    OK,
    ERROR_FALSE
  );
});

/**
 * 4. PUT /api/v1/admin/ads/:id - Update advertisement
 */
export const updateAdminAd = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (updateData.price !== undefined && updateData.originalPrice !== undefined) {
    const numPrice = Number(updateData.price);
    const numOrig = Number(updateData.originalPrice);
    if (numOrig > 0) {
      updateData.discountPercent = Math.max(0, Math.round(((numOrig - numPrice) / numOrig) * 100));
    }
  }

  if (Array.isArray(updateData.images) && updateData.images.length > 0) {
    if (!updateData.imageSrc) {
      updateData.imageSrc = updateData.images[0];
    }
  } else if (updateData.imageSrc && (!updateData.images || updateData.images.length === 0)) {
    updateData.images = [updateData.imageSrc];
  }

  if (updateData.platform && (!updateData.platformLogoBg || !updateData.platformTextColor)) {
    const styleDefaults = getPlatformDefaults(updateData.platform);
    if (!updateData.platformLogoBg) updateData.platformLogoBg = styleDefaults.platformLogoBg;
    if (!updateData.platformTextColor) updateData.platformTextColor = styleDefaults.platformTextColor;
  }

  if (mongoose.connection.readyState !== 1) {
    const idx = inMemoryAds.findIndex((a) => a.adId === id || a._id === id);
    if (idx === -1) {
      return apiHTTPResponse(req, res, HTTP_NOT_FOUND, "Advertisement not found", null, "NOT_FOUND", ERROR_TRUE);
    }
    inMemoryAds[idx] = { ...inMemoryAds[idx], ...updateData, updatedAt: new Date() };
    return apiHTTPResponse(req, res, HTTP_OK, "Advertisement updated successfully", inMemoryAds[idx], OK, ERROR_FALSE);
  }

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { adId: id };

  const updated = await Advertisement.findOneAndUpdate(query, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_NOT_FOUND,
      "Advertisement not found",
      null,
      "NOT_FOUND",
      ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Advertisement updated successfully",
    updated,
    OK,
    ERROR_FALSE
  );
});

/**
 * 5. PATCH /api/v1/admin/ads/:id/status - Toggle active/inactive status
 */
export const updateAdminAdStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (mongoose.connection.readyState !== 1) {
    const item = inMemoryAds.find((a) => a.adId === id || a._id === id);
    if (!item) {
      return apiHTTPResponse(req, res, HTTP_NOT_FOUND, "Advertisement not found", null, "NOT_FOUND", ERROR_TRUE);
    }
    const nextStatus = status || (item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
    item.status = nextStatus;
    item.updatedAt = new Date();
    return apiHTTPResponse(req, res, HTTP_OK, `Advertisement is now ${nextStatus}`, item, OK, ERROR_FALSE);
  }

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { adId: id };
  const existing = await Advertisement.findOne(query);

  if (!existing) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_NOT_FOUND,
      "Advertisement not found",
      null,
      "NOT_FOUND",
      ERROR_TRUE
    );
  }

  const nextStatus = status || (existing.status === "ACTIVE" ? "INACTIVE" : "ACTIVE");
  existing.status = nextStatus;
  await existing.save();

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    `Advertisement is now ${nextStatus}`,
    existing,
    OK,
    ERROR_FALSE
  );
});

/**
 * 6. DELETE /api/v1/admin/ads/:id - Delete advertisement
 */
export const deleteAdminAd = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState !== 1) {
    const deleted = inMemoryAds.find((a) => a.adId === id || a._id === id);
    inMemoryAds = inMemoryAds.filter((a) => a.adId !== id && a._id !== id);
    return apiHTTPResponse(req, res, HTTP_OK, "Advertisement deleted successfully", deleted || { id }, OK, ERROR_FALSE);
  }

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { adId: id };
  const deleted = await Advertisement.findOneAndDelete(query);

  if (!deleted) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_NOT_FOUND,
      "Advertisement not found",
      null,
      "NOT_FOUND",
      ERROR_TRUE
    );
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Advertisement deleted successfully",
    { adId: deleted.adId, _id: deleted._id },
    OK,
    ERROR_FALSE
  );
});

/**
 * 7. GET /api/v1/ads & /api/v1/feed/partner-deals - Active deals for User Panel
 */
export const getActiveAdvertisements = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { targetAudience, limit = 20 } = req.query;
    let list = inMemoryAds.filter((a) => a.status === "ACTIVE");
    if (targetAudience && targetAudience !== "ALL") {
      list = list.filter((a) => a.targetAudience === "ALL" || a.targetAudience === targetAudience);
    }
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const formattedDeals = list.slice(0, limitNum).map((ad) => ({
      id: ad.adId || String(ad._id),
      _id: String(ad._id || ad.adId),
      name: ad.name,
      categoryLabel: ad.categoryLabel || "🎁 Gifts",
      categories: ad.categories || [],
      price: ad.price,
      originalPrice: ad.originalPrice,
      discountPercent: ad.discountPercent,
      platform: ad.platform,
      platformLogoBg: ad.platformLogoBg,
      platformTextColor: ad.platformTextColor,
      badge: ad.badge,
      badgeColor: ad.badgeColor,
      imageSrc: ad.imageSrc,
      images: ad.images && ad.images.length > 0 ? ad.images : [ad.imageSrc],
      description: ad.description,
      couponCode: ad.couponCode || "",
      affiliateUrl: ad.affiliateUrl,
      priority: ad.priority,
    }));
    return apiHTTPResponse(
      req,
      res,
      HTTP_OK,
      "Active partner deals retrieved successfully",
      formattedDeals,
      OK,
      ERROR_FALSE
    );
  }

  await ensureSeedAds();

  const { targetAudience, limit = 20 } = req.query;

  const query = { status: "ACTIVE" };
  if (targetAudience) {
    query.targetAudience = { $in: ["ALL", targetAudience] };
  }

  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

  const ads = await Advertisement.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .limit(limitNum)
    .lean();

  // Asynchronously increment impressions in background
  if (ads.length > 0) {
    const ids = ads.map((a) => a._id);
    Advertisement.updateMany({ _id: { $in: ids } }, { $inc: { impressions: 1 } }).catch(() => {});
  }

  // Normalize shape to match SidebarPartnerDealsWidget GiftProduct interface
  const formattedDeals = (ads.length > 0 ? ads : DEFAULT_PARTNER_DEALS).map((ad) => ({
    id: ad.adId || String(ad._id),
    _id: String(ad._id || ad.adId),
    name: ad.name,
    categoryLabel: ad.categoryLabel || "🎁 Gifts",
    categories: ad.categories || [],
    price: ad.price,
    originalPrice: ad.originalPrice,
    discountPercent: ad.discountPercent,
    platform: ad.platform,
    platformLogoBg: ad.platformLogoBg,
    platformTextColor: ad.platformTextColor,
    badge: ad.badge,
    badgeColor: ad.badgeColor,
    imageSrc: ad.imageSrc,
    images: ad.images && ad.images.length > 0 ? ad.images : [ad.imageSrc],
    description: ad.description,
    couponCode: ad.couponCode || "",
    affiliateUrl: ad.affiliateUrl,
    priority: ad.priority,
  }));

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Active partner deals retrieved successfully",
    formattedDeals,
    OK,
    ERROR_FALSE
  );
});

/**
 * 8. POST /api/v1/ads/:id/click - Track click on ad
 */
export const trackAdClick = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState !== 1) {
    const ad = inMemoryAds.find((a) => a.adId === id || a._id === id);
    if (ad) ad.clicks = (ad.clicks || 0) + 1;
    return apiHTTPResponse(req, res, HTTP_OK, "Ad click recorded", { success: true }, OK, ERROR_FALSE);
  }

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { adId: id };

  await Advertisement.updateOne(query, { $inc: { clicks: 1 } });

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Ad click recorded",
    { success: true },
    OK,
    ERROR_FALSE
  );
});
