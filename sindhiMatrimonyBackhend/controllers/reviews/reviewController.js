import mongoose from "mongoose";
import Review from "../../models/reviews/review.model.js";
import { DEFAULT_REVIEWS } from "../../constants/reviewSeed.js";
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  OK,
  ERROR_FALSE,
  ERROR_TRUE,
} from "../../utils/constants.js";
import { apiHTTPResponse, asyncHandler } from "../../utils/globalFunction.js";

// In-memory runtime cache for serverless / offline resilience
let inMemoryReviews = [...DEFAULT_REVIEWS];

/**
 * 🌟 1. GET PUBLIC REVIEWS (Approved Only)
 * Route: GET /api/v1/reviews/public-list
 * Route: GET /api/v1/reviews
 * Route: GET /api/v1/common/reviews
 */
export const getPublicReviews = asyncHandler(async (req, res) => {
  let reviews = [];

  if (mongoose.connection.readyState === 1) {
    try {
      reviews = await Review.find({ status: "APPROVED" })
        .sort({ isFeatured: -1, createdAt: -1 })
        .lean();

      // Auto-seed if database is currently empty
      if (reviews.length === 0) {
        try {
          await Review.insertMany(DEFAULT_REVIEWS);
          reviews = await Review.find({ status: "APPROVED" })
            .sort({ isFeatured: -1, createdAt: -1 })
            .lean();
        } catch {
          reviews = inMemoryReviews.filter((r) => r.status === "APPROVED");
        }
      }
    } catch {
      reviews = inMemoryReviews.filter((r) => r.status === "APPROVED");
    }
  } else {
    reviews = inMemoryReviews.filter((r) => r.status === "APPROVED");
  }

  // Calculate statistics
  const totalReviews = reviews.length;
  const ratingSum = reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 5), 0);
  const averageRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "5.0";

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    breakdown[star] = (breakdown[star] || 0) + 1;
  });

  // Pagination
  const page = Math.max(1, Number(req.query.pageNo || req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));
  const total = totalReviews;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = reviews.slice((page - 1) * limit, (page - 1) * limit + limit);

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Public approved reviews retrieved successfully.",
    {
      reviews: paginated,
      list: paginated,
      total,
      totalPages,
      page,
      limit,
      hasMore: page < totalPages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
      stats: {
        totalReviews,
        averageRating: Number(averageRating),
        happyCouplesCount: 1240,
        breakdown,
      },
    },
    OK,
    ERROR_FALSE
  );
});

/**
 * ✍️ 2. SUBMIT USER REVIEW (Landing Screen / User Panel)
 * Route: POST /api/v1/reviews
 * Route: POST /api/v1/reviews/submit
 * Status starts as 'PENDING' and requires Admin moderation before appearing publicly.
 */
export const submitUserReview = asyncHandler(async (req, res) => {
  const {
    memberName,
    memberRole,
    subcaste,
    city,
    rating,
    title,
    comment,
    contactPhone,
    contactEmail,
    memberPhoto,
  } = req.body;

  if (!memberName || !title || !comment) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_BAD_REQUEST,
      "Please fill in your Name, Review Title, and Review Experience.",
      null,
      HTTP_BAD_REQUEST,
      ERROR_TRUE
    );
  }

  const numRating = Math.min(5, Math.max(1, Number(rating) || 5));
  const dateStr = new Date().toISOString().slice(0, 10);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const reviewId = `REV-${new Date().getFullYear()}-${randomSuffix}`;

  const newReviewData = {
    reviewId,
    memberId: req.user?._id || req.user?.id || `guest_${Date.now().toString().slice(-4)}`,
    memberName: String(memberName).trim(),
    memberRole: memberRole || "Member",
    subcaste: subcaste ? String(subcaste).trim() : "Sindhi",
    city: city ? String(city).trim() : "India",
    rating: numRating,
    title: String(title).trim(),
    comment: String(comment).trim(),
    memberPhoto: memberPhoto || "",
    source: "WEBSITE",
    category: "MATCHMAKING",
    status: "PENDING", // Strictly Pending until Admin reviews & approves
    contactPhone: contactPhone ? String(contactPhone).trim() : "",
    contactEmail: contactEmail ? String(contactEmail).trim() : "",
    helpfulCount: 0,
    createdAt: dateStr,
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await Review.create(newReviewData);
    } catch {
      // In-memory fallback
      inMemoryReviews = [newReviewData, ...inMemoryReviews];
    }
  } else {
    inMemoryReviews = [newReviewData, ...inMemoryReviews];
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_CREATED,
    "Thank you! Your review has been submitted for moderation and will appear on the website once verified by our team.",
    {
      reviewId,
      status: "PENDING",
      memberName: newReviewData.memberName,
      createdAt: dateStr,
    },
    HTTP_CREATED,
    ERROR_FALSE
  );
});

/**
 * 🛡️ 3. ADMIN GET REVIEWS (Full List with Moderation Filters)
 * Route: GET /api/v1/admin/reviews
 */
export const getAdminReviews = asyncHandler(async (req, res) => {
  const { status, rating, search } = req.query;

  let allReviews = [];
  if (mongoose.connection.readyState === 1) {
    try {
      allReviews = await Review.find().sort({ createdAt: -1 }).lean();
      if (allReviews.length === 0) {
        allReviews = [...inMemoryReviews];
      }
    } catch {
      allReviews = [...inMemoryReviews];
    }
  } else {
    allReviews = [...inMemoryReviews];
  }

  // Filter in memory
  let filtered = [...allReviews];

  if (status && status !== "ALL") {
    filtered = filtered.filter((r) => r.status === status);
  }

  if (rating && rating !== "ALL") {
    filtered = filtered.filter((r) => String(r.rating) === String(rating));
  }

  if (search && String(search).trim()) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.memberName?.toLowerCase().includes(q) ||
        r.title?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        r.subcaste?.toLowerCase().includes(q) ||
        r.city?.toLowerCase().includes(q)
    );
  }

  const pendingCount = allReviews.filter((r) => r.status === "PENDING").length;
  const approvedCount = allReviews.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = allReviews.filter((r) => r.status === "REJECTED").length;

  const page = Math.max(1, Number(req.query.pageNo || req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, (page - 1) * limit + limit);

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Admin reviews retrieved successfully.",
    {
      reviews: paginated,
      list: paginated,
      total,
      totalPages,
      page,
      limit,
      hasMore: page < totalPages,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
      counts: {
        total: allReviews.length,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    },
    OK,
    ERROR_FALSE
  );
});

/**
 * ✏️ 4. ADMIN EDIT REVIEW (Edit Text, Rating, Name, Status, Response)
 * Route: PUT /api/v1/admin/reviews/:id
 */
export const updateAdminReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatePayload = { ...req.body };

  if (mongoose.connection.readyState === 1) {
    try {
      const updated = await Review.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { reviewId: id }, { id }] },
        { $set: updatePayload },
        { new: true }
      ).lean();

      if (updated) {
        // Synchronize in-memory cache
        inMemoryReviews = inMemoryReviews.map((r) =>
          r.id === id || r.reviewId === id ? { ...r, ...updated } : r
        );

        return apiHTTPResponse(
          req,
          res,
          HTTP_OK,
          "Review updated successfully by administrator.",
          updated,
          OK,
          ERROR_FALSE
        );
      }
    } catch {
      // Fall through to in-memory updater
    }
  }

  // In-memory update
  let found = false;
  inMemoryReviews = inMemoryReviews.map((r) => {
    if (r.id === id || r.reviewId === id) {
      found = true;
      return { ...r, ...updatePayload };
    }
    return r;
  });

  if (!found) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_NOT_FOUND,
      `Review '${id}' not found.`,
      null,
      HTTP_NOT_FOUND,
      ERROR_TRUE
    );
  }

  const updatedReview = inMemoryReviews.find((r) => r.id === id || r.reviewId === id);

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Review updated successfully by administrator.",
    updatedReview,
    OK,
    ERROR_FALSE
  );
});

/**
 * ⚖️ 5. ADMIN QUICK MODERATION (Approve or Reject)
 * Route: POST /api/v1/admin/reviews/:id/moderation
 */
export const moderateReviewStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["APPROVED", "PENDING", "REJECTED"].includes(status)) {
    return apiHTTPResponse(
      req,
      res,
      HTTP_BAD_REQUEST,
      "Status must be APPROVED, PENDING, or REJECTED.",
      null,
      HTTP_BAD_REQUEST,
      ERROR_TRUE
    );
  }

  return updateAdminReview(req, res);
});

/**
 * 🗑️ 6. ADMIN DELETE REVIEW
 * Route: DELETE /api/v1/admin/reviews/:id
 */
export const deleteAdminReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      await Review.findOneAndDelete({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { reviewId: id }, { id }],
      });
    } catch {
      // Continue to in-memory delete
    }
  }

  inMemoryReviews = inMemoryReviews.filter((r) => r.id !== id && r.reviewId !== id);

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Review deleted successfully by administrator.",
    { deletedId: id },
    OK,
    ERROR_FALSE
  );
});
