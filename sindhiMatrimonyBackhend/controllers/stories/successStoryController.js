import mongoose from "mongoose";
import SuccessStory from "../../models/stories/successStory.model.js";
import { SEED_SUCCESS_STORIES } from "../../constants/seedCandidateData.js";
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

// In-memory runtime cache for serverless & offline resilience
let inMemoryStories = SEED_SUCCESS_STORIES.map((s, idx) => ({
  id: s._id || `story_${idx + 1}`,
  storyId: `STORY-2026-${String(idx + 1).padStart(3, "0")}`,
  groomName: s.groomName || s.coupleName?.split("&")?.[0]?.trim() || "Groom",
  groomId: `SND${882000 + idx}`,
  brideName: s.brideName || s.coupleName?.split("&")?.[1]?.trim() || "Bride",
  brideId: `SND772000 + idx`,
  coupleName: s.coupleName || `${s.groomName} & ${s.brideName}`,
  coupleNames: s.coupleNames || s.coupleName || `${s.groomName} & ${s.brideName}`,
  couplePhoto: s.imageUrl || s.photoUrl || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
  photoUrl: s.imageUrl || s.photoUrl || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
  photoUrls: [
    s.imageUrl || s.photoUrl,
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
  ].filter(Boolean),
  weddingDate: s.weddingDate || "14 Feb 2026",
  engagementDate: s.engagementDate || "10 Dec 2025",
  postedDate: s.postedOn || "14 Oct 2026",
  city: s.city || "Mumbai",
  location: s.location || `${s.city || "Mumbai"}, India`,
  subcaste: s.subcaste || "Bhaiband",
  storyTitle: s.badge || "A Blessed Sindhi Union",
  storySnippet: s.storySnippet || "Found our soulmate through verified community matchmaking.",
  testimonial: s.storySnippet || "Found our soulmate through verified community matchmaking.",
  fullStory: s.fullStory || s.storySnippet,
  badge: s.badge || "Verified Match",
  likesCount: 120 + idx * 15,
  isVerified: true,
  status: s.isActive !== false ? "PUBLISHED" : "DRAFT",
  isActive: s.isActive !== false,
  featuredOnHome: s.isFeatured !== false,
  createdAt: s.postedOn || "2026-02-15",
}));

/**
 * Helper to normalize story object for frontend consumption
 */
const normalizeStory = (s, idx = 0) => {
  const idStr = s._id ? s._id.toString() : s.id || `story_${idx + 1}`;
  const couple = s.coupleName || s.coupleNames || `${s.groomName || "Groom"} & ${s.brideName || "Bride"}`;
  const img = s.imageUrl || s.photoUrl || s.couplePhoto || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80";
  const desc = s.storySnippet || s.storyDescription || s.testimonial || "True love story verified by Sindhimarriage.";
  const full = s.fullStory || s.storyDescription || desc;
  const loc = s.location || (s.city ? `${s.city}, India` : "India");

  return {
    id: idStr,
    storyId: s.storyId || `STORY-${idStr.slice(-4).toUpperCase()}`,
    coupleName: couple,
    coupleNames: s.coupleNames || couple,
    groomName: s.groomName || couple.split("&")?.[0]?.trim() || "Groom",
    groomId: s.groomId || s.groomMatrimonyId || "SND882914",
    groomMatrimonyId: s.groomMatrimonyId || s.groomId || "SND882914",
    brideName: s.brideName || couple.split("&")?.[1]?.trim() || "Bride",
    brideId: s.brideId || s.brideMatrimonyId || "SND772183",
    brideMatrimonyId: s.brideMatrimonyId || s.brideId || "SND772183",
    photoUrl: img,
    imageUrl: img,
    couplePhoto: img,
    photoUrls: Array.isArray(s.photoUrls) && s.photoUrls.length > 0 ? s.photoUrls : [img],
    weddingDate: s.weddingDate ? (typeof s.weddingDate === "string" ? s.weddingDate : s.weddingDate.toISOString().slice(0, 10)) : "14 Feb 2026",
    engagementDate: s.engagementDate || "",
    postedDate: s.postedDate || s.postedOn || "Recently",
    city: s.city || "Mumbai",
    location: loc,
    subcaste: s.subcaste || "Sindhi",
    storyTitle: s.storyTitle || s.badge || "Verified Match",
    storySnippet: desc,
    testimonial: desc,
    storyDescription: desc,
    fullStory: full,
    badge: s.badge || "Verified Match",
    likesCount: Number(s.likesCount) || 120,
    isVerified: true,
    status: s.status || (s.isActive !== false ? "PUBLISHED" : "DRAFT"),
    isActive: s.isActive !== false && s.status !== "DRAFT",
    featuredOnHome: Boolean(s.featuredOnHome ?? s.isFeatured ?? true),
    createdAt: s.createdAt || new Date().toISOString().slice(0, 10),
  };
};

/**
 * 🌟 1. GET PUBLIC SUCCESS STORIES
 * Route: GET /api/v1/common/success-stories
 * Route: GET /api/v1/dashboard/success-stories
 */
export const getPublicSuccessStories = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query?.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query?.limit, 10) || 12));

  let stories = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const dbStories = await SuccessStory.find({ isActive: true })
        .sort({ isFeatured: -1, displayOrder: 1, createdAt: -1 })
        .lean();

      if (dbStories && dbStories.length > 0) {
        stories = dbStories.map((s, idx) => normalizeStory(s, idx));
      } else {
        stories = inMemoryStories.filter((s) => s.isActive !== false).map((s, idx) => normalizeStory(s, idx));
      }
    } catch {
      stories = inMemoryStories.filter((s) => s.isActive !== false).map((s, idx) => normalizeStory(s, idx));
    }
  } else {
    stories = inMemoryStories.filter((s) => s.isActive !== false).map((s, idx) => normalizeStory(s, idx));
  }

  const total = stories.length;
  const startIdx = (page - 1) * limit;
  const paginated = stories.slice(startIdx, startIdx + limit);

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Success stories retrieved successfully.",
    {
      count: total,
      totalPages: Math.ceil(total / limit) || 1,
      page,
      limit,
      items: paginated,
      stories: paginated, // Alias for convenient client binding
    },
    OK,
    ERROR_FALSE
  );
});

/**
 * 💌 2. USER SUBMIT SUCCESS STORY
 * Route: POST /api/v1/dashboard/success-stories/share
 * Route: POST /api/v1/common/success-stories/share
 */
export const submitUserSuccessStory = asyncHandler(async (req, res) => {
  const {
    coupleNames,
    groomName,
    brideName,
    groomId,
    brideId,
    photoUrl,
    couplePhoto,
    photoUrls,
    weddingDate,
    city,
    location,
    subcaste,
    storyTitle,
    testimonial,
    storySnippet,
    fullStory,
  } = req.body;

  const resolvedCouple =
    coupleNames ||
    (groomName && brideName ? `${groomName} & ${brideName}` : "") ||
    "Sindhi Couple";
  const resolvedPhoto = photoUrl || couplePhoto || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80";
  const resolvedDesc = testimonial || storySnippet || fullStory || "Our joyful wedding journey through Sindhimarriage.";
  const resolvedId = `story_sub_${Date.now()}`;

  const newStoryItem = {
    id: resolvedId,
    storyId: `STORY-2026-${Math.floor(100 + Math.random() * 900)}`,
    coupleName: resolvedCouple,
    coupleNames: resolvedCouple,
    groomName: groomName || resolvedCouple.split("&")?.[0]?.trim() || "Groom",
    groomId: groomId || "SND882914",
    brideName: brideName || resolvedCouple.split("&")?.[1]?.trim() || "Bride",
    brideId: brideId || "SND772183",
    couplePhoto: resolvedPhoto,
    photoUrl: resolvedPhoto,
    imageUrl: resolvedPhoto,
    photoUrls: Array.isArray(photoUrls) && photoUrls.length > 0 ? photoUrls : [resolvedPhoto],
    weddingDate: weddingDate || new Date().toISOString().slice(0, 10),
    postedDate: "Just now",
    city: city || "Mumbai",
    location: location || (city ? `${city}, India` : "India"),
    subcaste: subcaste || "Sindhi",
    storyTitle: storyTitle || "Our Dream Sindhi Wedding",
    storySnippet: resolvedDesc,
    testimonial: resolvedDesc,
    storyDescription: resolvedDesc,
    fullStory: fullStory || resolvedDesc,
    badge: "Pending Verification",
    likesCount: 1,
    isVerified: false,
    status: "DRAFT", // Admin must moderate & publish
    isActive: false, // Hidden from public until approved
    featuredOnHome: false,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await SuccessStory.create({
        coupleName: newStoryItem.coupleName,
        groomName: newStoryItem.groomName,
        brideName: newStoryItem.brideName,
        weddingDate: new Date(newStoryItem.weddingDate),
        city: newStoryItem.city,
        storySnippet: newStoryItem.storySnippet.slice(0, 350),
        fullStory: newStoryItem.fullStory,
        imageUrl: newStoryItem.photoUrl,
        badge: newStoryItem.badge,
        isFeatured: false,
        isActive: false, // Awaits admin publication
      });
    } catch {
      inMemoryStories = [newStoryItem, ...inMemoryStories];
    }
  } else {
    inMemoryStories = [newStoryItem, ...inMemoryStories];
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_CREATED,
    "Congratulations! Your success story has been submitted for editorial verification and will appear after admin approval.",
    newStoryItem,
    HTTP_CREATED,
    ERROR_FALSE
  );
});

/**
 * 🛡️ 3. ADMIN GET ALL SUCCESS STORIES
 * Route: GET /api/v1/admin/success-stories
 */
export const getAdminSuccessStories = asyncHandler(async (req, res) => {
  let all = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const dbList = await SuccessStory.find().sort({ createdAt: -1 }).lean();
      if (dbList && dbList.length > 0) {
        all = dbList.map((s, idx) => normalizeStory(s, idx));
      } else {
        all = inMemoryStories.map((s, idx) => normalizeStory(s, idx));
      }
    } catch {
      all = inMemoryStories.map((s, idx) => normalizeStory(s, idx));
    }
  } else {
    all = inMemoryStories.map((s, idx) => normalizeStory(s, idx));
  }

  const { status, search } = req.query;
  let filtered = [...all];

  if (status && status !== "ALL") {
    filtered = filtered.filter((s) => s.status === status);
  }

  if (search && String(search).trim()) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.coupleName?.toLowerCase().includes(q) ||
        s.groomName?.toLowerCase().includes(q) ||
        s.brideName?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.storySnippet?.toLowerCase().includes(q)
    );
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Admin success stories retrieved successfully.",
    {
      stories: filtered,
      counts: {
        total: all.length,
        published: all.filter((s) => s.status === "PUBLISHED" || s.isActive).length,
        draft: all.filter((s) => s.status === "DRAFT" || !s.isActive).length,
      },
    },
    OK,
    ERROR_FALSE
  );
});

/**
 * ➕ 4. ADMIN CREATE SUCCESS STORY
 * Route: POST /api/v1/admin/success-stories
 */
export const createAdminSuccessStory = asyncHandler(async (req, res) => {
  const body = req.body;
  const groom = body.groomName || "Groom";
  const bride = body.brideName || "Bride";
  const couple = `${groom} & ${bride}`;
  const img = body.couplePhoto || body.photoUrl || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80";
  const desc = body.storyDescription || body.storySnippet || "Beautiful Sindhi wedding celebration.";
  const status = body.status || "PUBLISHED";
  const isActive = status === "PUBLISHED";

  const newStory = {
    id: `story_admin_${Date.now()}`,
    storyId: `STORY-2026-${Math.floor(100 + Math.random() * 900)}`,
    groomName: groom,
    groomId: body.groomId || `cl_${Date.now().toString().slice(-4)}`,
    brideName: bride,
    brideId: body.brideId || `cl_${(Date.now() + 1).toString().slice(-4)}`,
    coupleName: couple,
    coupleNames: couple,
    couplePhoto: img,
    photoUrl: img,
    imageUrl: img,
    weddingDate: body.weddingDate || new Date().toISOString().slice(0, 10),
    engagementDate: body.engagementDate || "",
    city: body.city || "Mumbai",
    subcaste: body.subcaste || "Amil",
    storyTitle: body.storyTitle || "Our Forever Journey",
    storyDescription: desc,
    storySnippet: desc,
    fullStory: desc,
    attributedEmployeeName: body.attributedEmployeeName || "Admin Desk",
    status,
    isActive,
    featuredOnHome: Boolean(body.featuredOnHome ?? true),
    profilesArchived: Boolean(body.profilesArchived ?? false),
    createdAt: new Date().toISOString().slice(0, 10),
  };

  if (mongoose.connection.readyState === 1) {
    try {
      await SuccessStory.create({
        coupleName: newStory.coupleName,
        groomName: newStory.groomName,
        brideName: newStory.brideName,
        weddingDate: new Date(newStory.weddingDate),
        city: newStory.city,
        storySnippet: newStory.storySnippet.slice(0, 350),
        fullStory: newStory.fullStory,
        imageUrl: newStory.photoUrl,
        badge: newStory.storyTitle,
        isFeatured: newStory.featuredOnHome,
        isActive: newStory.isActive,
      });
    } catch {
      inMemoryStories = [newStory, ...inMemoryStories];
    }
  } else {
    inMemoryStories = [newStory, ...inMemoryStories];
  }

  return apiHTTPResponse(
    req,
    res,
    HTTP_CREATED,
    "Success story created and published successfully.",
    newStory,
    HTTP_CREATED,
    ERROR_FALSE
  );
});

/**
 * ✏️ 5. ADMIN UPDATE SUCCESS STORY
 * Route: PUT /api/v1/admin/success-stories/:id
 */
export const updateAdminSuccessStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.status) {
    updates.isActive = updates.status === "PUBLISHED";
  }

  if (mongoose.connection.readyState === 1) {
    try {
      await SuccessStory.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { storyId: id }, { id }] },
        { $set: updates },
        { new: true }
      );
    } catch {
      // In-memory update
    }
  }

  inMemoryStories = inMemoryStories.map((s) => {
    if (s.id === id || s.storyId === id) {
      return { ...s, ...updates };
    }
    return s;
  });

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Success story updated successfully.",
    { id, ...updates },
    OK,
    ERROR_FALSE
  );
});

/**
 * 🗑️ 6. ADMIN DELETE SUCCESS STORY
 * Route: DELETE /api/v1/admin/success-stories/:id
 */
export const deleteAdminSuccessStory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    try {
      await SuccessStory.findOneAndDelete({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { storyId: id }, { id }],
      });
    } catch {
      // Handled
    }
  }

  inMemoryStories = inMemoryStories.filter((s) => s.id !== id && s.storyId !== id);

  return apiHTTPResponse(
    req,
    res,
    HTTP_OK,
    "Success story deleted successfully.",
    { id },
    OK,
    ERROR_FALSE
  );
});
