"use client";

import React, { memo, useState, useCallback, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  Calendar,
  MapPin,
  Heart,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import type { MarriageSuccessStory } from "../types";
import { apiFetch, ApiURL } from "@/redux/apiService";
import { useShareSuccessStoryMutation } from "@/tanstackQuery";

export interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newStory: MarriageSuccessStory) => void;
}

export const ShareStoryModal = memo<ShareStoryModalProps>(
  ({ isOpen, onClose, onSubmit }) => {
    const shareStoryMutation = useShareSuccessStoryMutation();
    const [groomName, setGroomName] = useState("");
    const [groomId, setGroomId] = useState("");
    const [brideName, setBrideName] = useState("");
    const [brideId, setBrideId] = useState("");
    const [weddingDate, setWeddingDate] = useState("");
    const [location, setLocation] = useState("");
    const [storyText, setStoryText] = useState("");
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newUrls: string[] = [];
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        newUrls.push(url);
      });

      setUploadedImages((prev) => [...prev, ...newUrls]);
    };

    const handleRemoveImage = (index: number) => {
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!groomName.trim() || !brideName.trim() || !storyText.trim()) {
          setErrorMsg("Please fill in Groom name, Bride name, and your story narrative.");
          return;
        }

        const newStory: MarriageSuccessStory = {
          id: `user-story-${Date.now()}`,
          coupleNames: `${groomName.trim()} & ${brideName.trim()}`,
          photoUrl:
            uploadedImages[0] ||
            "/images/dashboard/couple_1.jpg",
          photoUrls:
            uploadedImages.length > 0
              ? uploadedImages
              : [
                  "/images/dashboard/couple_1.jpg",
                  "/images/dashboard/couple_5.jpg",
                ],
          weddingDate: weddingDate || "Recent 2026",
          postedDate: "Just now",
          location: location || "India",
          groomMatrimonyId: groomId.trim() || "SND" + Math.floor(100000 + Math.random() * 900000),
          brideMatrimonyId: brideId.trim() || "SND" + Math.floor(100000 + Math.random() * 900000),
          isVerified: true,
          verifiedBy: "Pending Admin Final Review",
          likesCount: 1,
          testimonial:
            storyText.length > 180
              ? storyText.substring(0, 180) + "..."
              : storyText,
          fullStory: storyText,
        };

        // Post to live Backend API for admin moderation with TanStack cache invalidation
        shareStoryMutation.mutate({
          url: ApiURL.shareSuccessStory,
          method: "POST",
          data: {
            groomName: groomName.trim(),
            groomId: groomId.trim(),
            brideName: brideName.trim(),
            brideId: brideId.trim(),
            coupleNames: `${groomName.trim()} & ${brideName.trim()}`,
            weddingDate,
            location: location.trim(),
            city: location.trim().split(",")?.[0]?.trim() || "Mumbai",
            storySnippet: storyText.trim(),
            fullStory: storyText.trim(),
            photoUrl: uploadedImages[0] || "/images/dashboard/couple_1.jpg",
            photoUrls: uploadedImages.length > 0 ? uploadedImages : ["/images/dashboard/couple_1.jpg"],
          },
          isToken: false,
        });

        onSubmit(newStory);
        setIsSubmitted(true);

        setTimeout(() => {
          setIsSubmitted(false);
          onClose();
          // Reset form
          setGroomName("");
          setGroomId("");
          setBrideName("");
          setBrideId("");
          setWeddingDate("");
          setLocation("");
          setStoryText("");
          setUploadedImages([]);
        }, 2200);
      },
      [
        groomName,
        brideName,
        groomId,
        brideId,
        weddingDate,
        location,
        storyText,
        uploadedImages,
        onSubmit,
        onClose,
      ]
    );

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-story-modal-title"
      >
        <div
          className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-stone-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#DB2F3C] flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2
                  id="share-story-modal-title"
                  className="text-lg sm:text-xl font-bold text-stone-900 font-heading"
                >
                  Share Your Success Story
                </h2>
                <p className="text-xs text-stone-500">
                  Inspire thousands of Sindhi brides &amp; grooms
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form / Success Feedback Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7">
            {isSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-heading">
                  Story Submitted Successfully!
                </h3>
                <p className="text-sm text-stone-600 max-w-md">
                  Thank you for sharing your journey! Our Admin verification team
                  will review and publish your story with the verified badge
                  within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Admin Verification Notice */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="font-semibold">Quality &amp; Safety Note:</strong>{" "}
                    All submitted stories undergo authentic verification by the
                    SindhiMatrimony Admin Desk before public display. Admin can verify,
                    curate photos, and edit details for maximum security.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                    {errorMsg}
                  </div>
                )}

                {/* Couple Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                      Groom Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Advani"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#DB2F3C] focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                      Bride Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Simran Chawla"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#DB2F3C] focus:ring-2 focus:ring-red-100"
                    />
                  </div>
                </div>

                {/* Matrimony IDs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Groom Matrimony ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SND882914"
                      value={groomId}
                      onChange={(e) => setGroomId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#DB2F3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Bride Matrimony ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SND772183"
                      value={brideId}
                      onChange={(e) => setBrideId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#DB2F3C]"
                    />
                  </div>
                </div>

                {/* Wedding Date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      Wedding Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14 Feb 2026"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#DB2F3C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai &amp; Dubai"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-hidden focus:border-[#DB2F3C]"
                    />
                  </div>
                </div>

                {/* Story Narrative */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Your Story &amp; Experience *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us how you met, your first conversation, family meetings, and how SindhiMatrimony brought you together..."
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:border-[#DB2F3C] focus:ring-2 focus:ring-red-100 resize-none"
                  />
                </div>

                {/* Multiple Photos Upload Simulation */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span>Wedding &amp; Ceremony Photos (Multiple allowed)</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      Supports PNG, JPG, WebP
                    </span>
                  </label>

                  {/* Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-4 border-2 border-dashed border-stone-200 hover:border-[#DB2F3C] rounded-2xl bg-stone-50/50 hover:bg-red-50/20 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-stone-500 group-hover:text-[#DB2F3C] group-hover:scale-105 transition-all">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="mt-2 text-xs font-semibold text-stone-700">
                      Click to upload wedding pictures
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Upload multiple photos to enable the interactive swiper in your story
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Uploaded Thumbnails Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 mt-3">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-200 shadow-2xs group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-full bg-[#DB2F3C] hover:bg-[#B71F2A] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Submit Story for Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ShareStoryModal.displayName = "ShareStoryModal";
export default ShareStoryModal;
