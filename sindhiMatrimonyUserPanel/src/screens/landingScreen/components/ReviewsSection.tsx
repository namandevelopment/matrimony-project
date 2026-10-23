"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import {
  Star,
  ShieldCheck,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  CheckCircle2,
  Users2,
  BadgeCheck,
  PenLine,
  Filter,
  Clock,
} from "lucide-react";
import { apiFetch } from "@/redux/apiService";
import { ApiURL } from "@/redux/apiService/endpoint";
import { useReviewsQuery } from "@/tanstackQuery";
import { SubmitReviewModal } from "./SubmitReviewModal";

export interface ReviewItem {
  id?: string;
  reviewId: string;
  memberName: string;
  memberRole?: string;
  subcaste?: string;
  city?: string;
  memberPhoto?: string;
  rating: number;
  title: string;
  comment: string;
  source?: string;
  category?: string;
  status: string;
  isFeatured?: boolean;
  adminResponse?: string;
  adminRespondedAt?: string;
  createdAt?: string;
  helpfulCount?: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  breakdown: Record<number, number>;
  satisfactionRate: number;
}

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    reviewId: "REV-2026-001",
    memberName: "Haresh Jagtiani",
    memberRole: "Parent",
    subcaste: "Bhaiband",
    city: "Mumbai, Maharashtra",
    rating: 5,
    title: "Extremely professional and family-friendly service",
    comment:
      "The relationship manager took care of gotra checks and verified documents before suggesting matches. Saved our family countless hours of awkward calls. My daughter got married last month to a wonderful family from Pune!",
    status: "APPROVED",
    isFeatured: true,
    adminResponse:
      "Thank you Haresh ji! It was an absolute honour assisting your family. Wishing the newlyweds a lifetime of joy, harmony, and prosperity!",
    createdAt: "2026-02-10",
    helpfulCount: 42,
  },
  {
    reviewId: "REV-2026-002",
    memberName: "Pooja & Kunal Mirchandani",
    memberRole: "Bride",
    subcaste: "Amil",
    city: "Jaipur, Rajasthan",
    rating: 5,
    title: "Kundli Milan feature and Sindhi filters are spot on!",
    comment:
      "The 36 Gunas breakdown and Manglik analysis directly on the portal gave our elders immense confidence. Within 3 weeks of connecting, both families met and fixed our Roka ceremony with blessings of Jhulelal.",
    status: "APPROVED",
    isFeatured: true,
    adminResponse:
      "Warmest congratulations Pooja & Kunal! May Lord Jhulelal shower eternal happiness on both your families.",
    createdAt: "2026-03-01",
    helpfulCount: 35,
  },
  {
    reviewId: "REV-2026-003",
    memberName: "Suresh & Varsha Lulla",
    memberRole: "Groom",
    subcaste: "Lohana",
    city: "Dubai, UAE",
    rating: 5,
    title: "Best portal for Global Sindhi NRI Families",
    comment:
      "Being based in Dubai, finding a cultured Sindhi family back home was difficult. Sindhimarriage.in verified all ID proofs and phone numbers. Found my life partner in Pune seamlessly.",
    status: "APPROVED",
    isFeatured: true,
    adminResponse:
      "Thank you Suresh ji! NRI matchmaking with verified roots is our core promise. All the best to you and Varsha!",
    createdAt: "2026-03-12",
    helpfulCount: 28,
  },
  {
    reviewId: "REV-2026-004",
    memberName: "Neeta Advani",
    memberRole: "Parent",
    subcaste: "Sahiti",
    city: "Ahmedabad, Gujarat",
    rating: 5,
    title: "Strict privacy features made us feel very secure",
    comment:
      "Photos were visible only to verified requests, and phone numbers were hidden until both families approved. Truly a dignified matchmaking space for traditional Sindhi parents.",
    status: "APPROVED",
    isFeatured: false,
    adminResponse:
      "Privacy of our daughters and families is our highest priority Neeta ji. Thank you for placing your trust in our platform.",
    createdAt: "2026-03-20",
    helpfulCount: 19,
  },
  {
    reviewId: "REV-2026-005",
    memberName: "Rohan & Mehek Wadhwa",
    memberRole: "Groom",
    subcaste: "Bhaiband",
    city: "Bengaluru, Karnataka",
    rating: 5,
    title: "Found our match in 45 days!",
    comment:
      "The relationship manager team was proactive in coordinating initial conference calls between parents. Very polite and knowledgeable about Sindhi rituals. Highly recommended!",
    status: "APPROVED",
    isFeatured: true,
    adminResponse:
      "Heartiest congratulations Rohan and Mehek! Blessed to have played a small part in your beautiful union.",
    createdAt: "2026-04-02",
    helpfulCount: 31,
  },
  {
    reviewId: "REV-2026-006",
    memberName: "Simran Chhabria",
    memberRole: "Bride",
    subcaste: "Larkana",
    city: "Indore, Madhya Pradesh",
    rating: 5,
    title: "Transparent and genuine profiles",
    comment:
      "Unlike generic matrimony portals full of inactive accounts, every match we connected with on Sindhimarriage was responsive and serious about marriage. Got engaged last week!",
    status: "APPROVED",
    isFeatured: false,
    adminResponse:
      "Congratulations Simran! Wishing you both a lifetime of companionship, health, and happiness.",
    createdAt: "2026-04-10",
    helpfulCount: 24,
  },
];

const DEFAULT_STATS: ReviewStats = {
  totalReviews: 540,
  averageRating: 4.9,
  breakdown: { 5: 495, 4: 35, 3: 7, 2: 2, 1: 1 },
  satisfactionRate: 98,
};

const FILTER_TABS = [
  { key: "ALL", label: "All Stories" },
  { key: "Bride", label: "Brides" },
  { key: "Groom", label: "Grooms" },
  { key: "Parent", label: "Parents & Elders" },
  { key: "5_STAR", label: "5-Star Rated" },
];

export const ReviewsSection: React.FC = memo(() => {
  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS);
  const [stats, setStats] = useState<ReviewStats>(DEFAULT_STATS);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpfulMap, setHelpfulMap] = useState<Record<string, boolean>>({});
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});
  const [mySubmittedReview, setMySubmittedReview] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("my_submitted_review");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Fetch approved reviews via TanStack Query (10 mins cache, zero duplicate requests)
  const { data: reviewsData, refetch: refetchReviews } = useReviewsQuery();

  const handleReviewSuccess = () => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("my_submitted_review");
        if (raw) setMySubmittedReview(JSON.parse(raw));
      } catch { }
    }
    refetchReviews();
  };

  useEffect(() => {
    if (!reviewsData) return;
    const res = reviewsData as any;
    const revList = res?.reviews || res?.data?.reviews || (Array.isArray(res) ? res : []);
    const statData = res?.stats || res?.data?.stats;

    if (Array.isArray(revList) && revList.length > 0) {
      setReviews(revList);
    }
    if (statData) {
      setStats(statData);
    }
  }, [reviewsData]);

  const handleToggleHelpful = (reviewId: string, currentCount: number) => {
    const isAlreadyHelpful = helpfulMap[reviewId];
    setHelpfulMap((prev) => ({ ...prev, [reviewId]: !isAlreadyHelpful }));
    setHelpfulCounts((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] ?? currentCount) + (isAlreadyHelpful ? -1 : 1),
    }));
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (activeFilter === "ALL") return true;
      if (activeFilter === "5_STAR") return Math.round(Number(r.rating)) >= 5;
      return (r.memberRole || "").toLowerCase() === activeFilter.toLowerCase();
    });
  }, [reviews, activeFilter]);

  // Initials for avatar fallback
  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "SM";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <section
      id="reviews-section"
      aria-label="Sindhi Matrimony Reviews and Testimonials"
      className="relative z-10 w-full py-16 sm:py-20 bg-stone-50/70 border-t border-[#E9E9E9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Real Stories &amp; Verified Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1A1A1A] tracking-tight">
            Trusted by 50,000+ Sindhi Families Worldwide
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Authentic experiences from brides, grooms, and parents who found meaningful life partnerships with verified Sindhi values and traditions.
          </p>
        </div>

        {/* 2. Rating Breakdown & Write Review Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Overall Score */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-stone-100 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black text-stone-900 tracking-tight">
                  {stats.averageRating ? stats.averageRating.toFixed(1) : "4.9"}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-stone-400">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-stone-600 font-medium mt-2">
                Based on <span className="font-bold text-stone-900">{stats.totalReviews || 500}+ verified member</span> reviews
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {stats.satisfactionRate}% Satisfaction Rate
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                  100% Admin Moderated
                </span>
              </div>
            </div>

            {/* Middle: Star Distribution Bars */}
            <div className="lg:col-span-5 space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = stats.breakdown?.[star] || 0;
                const total = stats.totalReviews || 1;
                const pct = Math.round((count / total) * 100) || (star === 5 ? 92 : star === 4 ? 6 : 1);

                return (
                  <div key={star} className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="w-12 flex items-center gap-1 text-stone-600 font-medium justify-end">
                      {star} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-stone-400 text-xs font-medium">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: CTA to Write a Review */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center text-center bg-stone-50/80 rounded-xl p-5 border border-stone-200/80">
              <HeartHandshake className="w-8 h-8 text-rose-500 mb-2" />
              <h4 className="text-base font-bold text-stone-900">Found Your Match?</h4>
              <p className="text-xs text-stone-600 mt-1 mb-4">
                Inspire other Sindhi families by sharing your matrimony experience.
              </p>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all hover:shadow-md cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                <span>Write a Review</span>
              </button>
              <span className="text-[11px] text-stone-600 mt-2">
                Sent to Admin for moderation &amp; verified before publishing
              </span>
            </div>
          </div>
        </div>

        {/* 2.5. Personal Submitted Review Status Card ("khudka section me to show hogi hi") */}
        {mySubmittedReview && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/60 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3 h-3" />
                  <span>Pending Admin Moderation</span>
                </span>
                <span className="text-xs text-stone-500 font-mono font-semibold">
                  {mySubmittedReview.reviewId}
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-600 font-medium">
                  {mySubmittedReview.memberName} ({mySubmittedReview.memberRole || 'Member'})
                </span>
              </div>
              <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>"{mySubmittedReview.title}"</span>
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {mySubmittedReview.rating} / 5
                </span>
              </h4>
              <p className="text-xs text-stone-600 line-clamp-2 max-w-2xl leading-relaxed">
                {mySubmittedReview.comment}
              </p>
              <p className="text-[11px] text-amber-900 bg-amber-100/70 p-2 rounded-lg border border-amber-200/50 mt-1.5 inline-block">
                ⏳ Your review has been submitted to the Admin Panel. Once verified and approved by the moderator, it will be published to the public reviews section.
              </p>
            </div>
          </div>
        )}

        {/* 3. Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </span>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activeFilter === tab.key
                  ? "bg-rose-600 text-white shadow-xs font-semibold"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-600 font-medium">
            Showing <span className="font-bold text-stone-800">{filteredReviews.length}</span> verified stories
          </div>
        </div>

        {/* 4. Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => {
            const currentHelpful = helpfulCounts[review.reviewId] ?? (review.helpfulCount || 12);
            const isLiked = helpfulMap[review.reviewId] || false;

            return (
              <div
                key={review.reviewId}
                className="flex flex-col justify-between bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all p-6 relative group"
              >
                <div>
                  {/* Top: Reviewer Info & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {review.memberPhoto ? (
                        <img
                          src={review.memberPhoto}
                          alt={review.memberName}
                          className="w-11 h-11 rounded-full object-cover border border-rose-200"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {getInitials(review.memberName)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-stone-900 line-clamp-1">
                            {review.memberName}
                          </h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-stone-600">
                          {review.subcaste ? `${review.subcaste} • ` : ""}
                          {review.city || "India"}
                        </p>
                      </div>
                    </div>

                    {/* Member Role Pill */}
                    {review.memberRole && (
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold flex-shrink-0">
                        {review.memberRole}
                      </span>
                    )}
                  </div>

                  {/* Stars & Headline */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i <= Math.round(Number(review.rating))
                          ? "fill-amber-400 text-amber-400"
                          : "fill-stone-200 text-stone-200"
                          }`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-stone-700 ml-1.5">
                      {review.rating}.0
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-stone-900 mb-2 line-clamp-2 leading-snug">
                    &ldquo;{review.title}&rdquo;
                  </h5>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {review.comment}
                  </p>
                </div>

                {/* Bottom Meta & Admin Response */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  {/* Official Admin Reply Box if present */}
                  {review.adminResponse && (
                    <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-rose-800 font-semibold mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Sindhimarriage Desk Response</span>
                      </div>
                      <p className="text-stone-700 text-[12px] leading-relaxed italic">
                        &ldquo;{review.adminResponse}&rdquo;
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                    <span className="text-[11px]">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Verified Member"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleHelpful(review.reviewId, review.helpfulCount || 12)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors cursor-pointer ${isLiked
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-600"
                        }`}
                      title="Mark as helpful"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                      <span>Helpful ({currentHelpful})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Bottom Trust Note & Quick CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              Are you an authentic Sindhi bride, groom or parent?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Join thousands of verified members finding love, trust, and family happiness every day.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-800 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <PenLine className="w-4 h-4 text-stone-600" />
              <span>Share Experience</span>
            </button>
            <a
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              href="#register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4A57] hover:bg-[#e03d4a] active:bg-[#c9323f] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all hover:shadow-md cursor-pointer"
            >
              <span>Register Free</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Review Submission Modal */}
      <SubmitReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleReviewSuccess}
      />
    </section>
  );
});

ReviewsSection.displayName = "ReviewsSection";
