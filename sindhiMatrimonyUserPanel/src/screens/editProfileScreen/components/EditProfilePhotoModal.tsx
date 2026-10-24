"use client";

import React, { memo, useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, Camera, Check, AlertCircle } from "lucide-react";
import { PhotoItem } from "../types";

export interface EditProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhoto: (photo: PhotoItem) => void;
  className?: string;
}

const SAMPLE_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
];

const EditProfilePhotoModalComponent: React.FC<EditProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  onAddPhoto,
  className = "",
}) => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSelectedPreview(previewUrl);
    }
  };

  const handleSelectSample = (url: string) => {
    setSelectedPreview(url);
  };

  const handleSavePhoto = () => {
    if (!selectedPreview) return;
    const newPhoto: PhotoItem = {
      id: `photo_${Date.now()}`,
      url: selectedPreview,
      isPrimary: true,
      isApproved: true,
      uploadedAt: new Date().toISOString(),
    };
    onAddPhoto(newPhoto);
    setSelectedPreview(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#DB2F3C]" />
            <h3 className="text-base font-bold text-stone-900 font-heading">
              Add Profile Photo
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* File Upload Zone */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {selectedPreview ? (
            <div className="relative w-44 h-52 mx-auto rounded-xl overflow-hidden border-2 border-[#DB2F3C] shadow-md">
              <Image
                src={selectedPreview}
                alt="Selected preview"
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedPreview(null)}
                className="absolute top-2 right-2 p-1 bg-stone-900/70 text-white rounded-full hover:bg-stone-900 transition-colors"
                title="Remove selection"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-[#DB2F3C] rounded-xl p-8 text-center cursor-pointer bg-stone-50 hover:bg-red-50/20 transition-all flex flex-col items-center justify-center group"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 text-[#DB2F3C] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-stone-800">
                Click to browse &amp; upload from device
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                JPG, PNG, or WebP up to 10MB
              </p>
            </div>
          )}

          {/* Quick Sample Avatars for Instant Testing */}
          <div>
            <p className="text-xs font-semibold text-stone-700 mb-2">
              Or pick a sample photo for demonstration:
            </p>
            <div className="flex items-center gap-3 justify-center">
              {SAMPLE_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectSample(url)}
                  className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedPreview === url
                      ? "border-[#DB2F3C] scale-105 shadow-md"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <Image
                    src={url}
                    alt={`Sample ${i + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {selectedPreview === url && (
                    <div className="absolute inset-0 bg-[#DB2F3C]/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Guidelines Tip Box */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-3 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1 text-amber-950">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              Photo Guidelines:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-stone-700">
              <li>Clear, bright front-facing portrait photo</li>
              <li>Avoid wearing sunglasses, side-angles, or group photos</li>
              <li>Photos are reviewed and activated within 15 minutes</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSavePhoto}
            disabled={!selectedPreview}
            className="px-5 py-2 rounded-lg bg-[#DB2F3C] hover:bg-[#C22430] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Upload &amp; Save Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditProfilePhotoModal = memo(EditProfilePhotoModalComponent);
EditProfilePhotoModal.displayName = "EditProfilePhotoModal";
