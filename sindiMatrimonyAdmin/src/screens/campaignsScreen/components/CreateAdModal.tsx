import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Tag,
  ExternalLink,
  Plus,
  Trash2,
  Image as ImageIcon,
  Check,
  Sparkles,
  Gift,
  Copy,
} from 'lucide-react';
import {
  type AdvertisementDeal,
  PLATFORM_STYLE_PRESETS,
  BADGE_COLOR_PRESETS,
  CATEGORY_EMOJI_PRESETS,
} from '../../../services/adsService';
import { CustomTextInput } from '../../../components/CustomTextInput';
import { CustomDropDown } from '../../../components/CustomDropDown';

export interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<AdvertisementDeal>) => Promise<void>;
  editingAd?: AdvertisementDeal | null;
}

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingAd,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryLabel: '💍 Rings',
    categories: ['Rings', 'Engagement', 'Jewellery'],
    price: 599,
    originalPrice: 1999,
    discountPercent: 70,
    platform: 'Amazon' as AdvertisementDeal['platform'],
    platformLogoBg: 'bg-[#232F3E]',
    platformTextColor: 'text-amber-400',
    badge: 'Top Engagement Gift',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    imageSrc: '/images/dashboard/gift_couple_rings.jpg',
    images: ['/images/dashboard/gift_couple_rings.jpg'],
    description: 'Adjustable pure 925 silver couple rings with solitaire crystal & luxury gift box.',
    couponCode: 'AMZMATCH50',
    affiliateUrl: 'https://www.amazon.in',
    status: 'ACTIVE' as AdvertisementDeal['status'],
    priority: 10,
    targetAudience: 'ALL' as AdvertisementDeal['targetAudience'],
  });

  const [newTagInput, setNewTagInput] = useState('');
  const [newImageInput, setNewImageInput] = useState('');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingAd) {
      const images =
        editingAd.images && editingAd.images.length > 0
          ? editingAd.images
          : [editingAd.imageSrc || ''];
      setFormData({
        name: editingAd.name || '',
        categoryLabel: editingAd.categoryLabel || '🎁 Gifts',
        categories: editingAd.categories || ['Gifts'],
        price: editingAd.price || 0,
        originalPrice: editingAd.originalPrice || 0,
        discountPercent: editingAd.discountPercent || 0,
        platform: editingAd.platform || 'Amazon',
        platformLogoBg: editingAd.platformLogoBg || 'bg-[#232F3E]',
        platformTextColor: editingAd.platformTextColor || 'text-amber-400',
        badge: editingAd.badge || 'Special Deal',
        badgeColor: editingAd.badgeColor || BADGE_COLOR_PRESETS[0].value,
        imageSrc: editingAd.imageSrc || images[0] || '',
        images: images,
        description: editingAd.description || '',
        couponCode: editingAd.couponCode || '',
        affiliateUrl: editingAd.affiliateUrl || '',
        status: editingAd.status || 'ACTIVE',
        priority: editingAd.priority || 0,
        targetAudience: editingAd.targetAudience || 'ALL',
      });
      setActivePhotoIdx(0);
    } else {
      setFormData({
        name: '',
        categoryLabel: '💍 Rings',
        categories: ['Rings', 'Engagement'],
        price: 499,
        originalPrice: 1499,
        discountPercent: 67,
        platform: 'Amazon',
        platformLogoBg: 'bg-[#232F3E]',
        platformTextColor: 'text-amber-400',
        badge: 'Top Engagement Gift',
        badgeColor: BADGE_COLOR_PRESETS[0].value,
        imageSrc: '/images/dashboard/gift_couple_rings.jpg',
        images: ['/images/dashboard/gift_couple_rings.jpg'],
        description: 'Luxury couples gift combo with personalized message card.',
        couponCode: 'SAVE50',
        affiliateUrl: 'https://www.amazon.in',
        status: 'ACTIVE',
        priority: 5,
        targetAudience: 'ALL',
      });
      setActivePhotoIdx(0);
    }
  }, [editingAd, isOpen]);

  if (!isOpen) return null;

  // Auto-recalculate discount percent
  const handlePriceChange = (dealPrice: number, origPrice: number) => {
    const discount =
      origPrice > 0 ? Math.max(0, Math.round(((origPrice - dealPrice) / origPrice) * 100)) : 0;
    setFormData((prev) => ({
      ...prev,
      price: dealPrice,
      originalPrice: origPrice,
      discountPercent: discount,
    }));
  };

  const handlePlatformChange = (p: AdvertisementDeal['platform']) => {
    const preset = PLATFORM_STYLE_PRESETS[p] || PLATFORM_STYLE_PRESETS.Amazon;
    setFormData((prev) => ({
      ...prev,
      platform: p,
      platformLogoBg: preset.platformLogoBg,
      platformTextColor: preset.platformTextColor,
    }));
  };

  const handleAddCategoryTag = () => {
    const tag = newTagInput.trim();
    if (tag && !formData.categories.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, tag],
      }));
      setNewTagInput('');
    }
  };

  const handleRemoveCategoryTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== tagToRemove),
    }));
  };

  const handleAddPhotoUrl = () => {
    const url = newImageInput.trim();
    if (url && !formData.images.includes(url)) {
      const nextImages = [...formData.images, url];
      setFormData((prev) => ({
        ...prev,
        images: nextImages,
        imageSrc: prev.imageSrc || url,
      }));
      setNewImageInput('');
    }
  };

  const handleRemovePhoto = (idx: number) => {
    const nextImages = formData.images.filter((_, i) => i !== idx);
    setFormData((prev) => ({
      ...prev,
      images: nextImages,
      imageSrc: nextImages[0] || '',
    }));
    if (activePhotoIdx >= nextImages.length) {
      setActivePhotoIdx(Math.max(0, nextImages.length - 1));
    }
  };

  const handleSetPrimaryPhoto = (url: string, idx: number) => {
    setFormData((prev) => ({
      ...prev,
      imageSrc: url,
    }));
    setActivePhotoIdx(idx);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.affiliateUrl.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        imageSrc: formData.imageSrc || formData.images[0] || '/images/dashboard/gift_couple_rings.jpg',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImage =
    formData.images[activePhotoIdx] ||
    formData.imageSrc ||
    '/images/dashboard/gift_couple_rings.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-linear-to-r from-stone-50 via-white to-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#DB2F3C] to-rose-400 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900 leading-tight">
                {editingAd ? 'Edit Advertisement / Partner Deal' : 'Add New Partner Deal / Ad'}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Configure sponsored gifts & deals visible to candidates on user dashboard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split into Form (Left) and Live Preview (Right) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Product Name */}
              <CustomTextInput
                label="Product / Deal Title *"
                placeholder="e.g. Sterling Silver Couple Promise Rings"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              {/* Category Label + Preset Buttons */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Category Tag / Label (Shown on widget pill)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.categoryLabel}
                    onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
                    placeholder="e.g. 💍 Rings"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#DB2F3C] focus:ring-1 focus:ring-[#DB2F3C]"
                  />
                </div>
                {/* Emoji quick presets */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
                  {CATEGORY_EMOJI_PRESETS.slice(0, 6).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, categoryLabel: preset })}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                        formData.categoryLabel === preset
                          ? 'bg-rose-50 border-rose-300 text-[#DB2F3C]'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multiple Categories / Tags */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Multiple Categories & Tags (Search & Filter)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCategoryTag();
                      }
                    }}
                    placeholder="Type category & press Add (e.g. Jewellery)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#DB2F3C]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategoryTag}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.categories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold rounded-md"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => handleRemoveCategoryTag(cat)}
                        className="text-rose-400 hover:text-rose-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Price, Original Price, Discount */}
              <div className="grid grid-cols-3 gap-3">
                <CustomTextInput
                  label="Deal Price (₹) *"
                  type="number"
                  value={String(formData.price)}
                  onChange={(e) =>
                    handlePriceChange(Number(e.target.value), formData.originalPrice)
                  }
                  required
                />
                <CustomTextInput
                  label="Original MRP (₹) *"
                  type="number"
                  value={String(formData.originalPrice)}
                  onChange={(e) =>
                    handlePriceChange(formData.price, Number(e.target.value))
                  }
                  required
                />
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Discount %</label>
                  <div className="h-10 px-3 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between text-xs font-black text-rose-600">
                    <span>{formData.discountPercent}% OFF</span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Save ₹{Math.max(0, formData.originalPrice - formData.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Platform Selector & Styling */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Platform *</label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      handlePlatformChange(e.target.value as AdvertisementDeal['platform'])
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#DB2F3C]"
                  >
                    <option value="Amazon">Amazon India</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Meesho">Meesho</option>
                    <option value="Myntra">Myntra</option>
                    <option value="Nykaa">Nykaa</option>
                    <option value="Custom">Custom Store</option>
                    <option value="Other">Other Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Badge Color</label>
                  <select
                    value={formData.badgeColor}
                    onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#DB2F3C]"
                  >
                    {BADGE_COLOR_PRESETS.map((bp) => (
                      <option key={bp.value} value={bp.value}>
                        {bp.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Badge Text & Coupon Code */}
              <div className="grid grid-cols-2 gap-3">
                <CustomTextInput
                  label="Badge Text"
                  placeholder="e.g. Top Engagement Gift"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
                <CustomTextInput
                  label="Coupon Code (Optional)"
                  placeholder="e.g. AMZMATCH50"
                  value={formData.couponCode}
                  onChange={(e) =>
                    setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })
                  }
                />
              </div>

              {/* Multiple Photos Management */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Product Photos (Multiple Photos Supported)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageInput}
                    onChange={(e) => setNewImageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPhotoUrl();
                      }
                    }}
                    placeholder="Paste image URL (https://...) and press Add"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#DB2F3C]"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Photo
                  </button>
                </div>

                {/* Thumbnails row */}
                <div className="flex items-center gap-2 mt-2.5 overflow-x-auto p-1.5 bg-stone-50 rounded-xl border border-stone-200">
                  {formData.images.map((imgUrl, idx) => {
                    const isPrimary = formData.imageSrc === imgUrl;
                    const isSelected = activePhotoIdx === idx;
                    return (
                      <div
                        key={imgUrl + idx}
                        onClick={() => handleSetPrimaryPhoto(imgUrl, idx)}
                        className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer group transition-all ${
                          isSelected
                            ? 'border-[#DB2F3C] ring-2 ring-rose-200'
                            : 'border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = '/images/dashboard/gift_couple_rings.jpg';
                          }}
                        />
                        {isPrimary && (
                          <span className="absolute bottom-0 inset-x-0 bg-[#DB2F3C] text-[8px] font-black text-white text-center py-0.2">
                            PRIMARY
                          </span>
                        )}
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePhoto(idx);
                            }}
                            className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Affiliate Buy Link */}
              <CustomTextInput
                label="Affiliate / Buy URL *"
                placeholder="https://www.amazon.in/s?k=...&tag=sindhimatrimony-21"
                value={formData.affiliateUrl}
                onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                required
              />

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short, persuasive copy for candidates..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#DB2F3C]"
                  required
                />
              </div>

              {/* Priority & Target Audience */}
              <div className="grid grid-cols-2 gap-3">
                <CustomTextInput
                  label="Display Priority (Higher = First)"
                  type="number"
                  value={String(formData.priority)}
                  onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                />
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetAudience: e.target.value as AdvertisementDeal['targetAudience'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#DB2F3C]"
                  >
                    <option value="ALL">All Registered Users</option>
                    <option value="PAID_MEMBERS">Paid Members Only</option>
                    <option value="FREE_MEMBERS">Free Members Only</option>
                    <option value="MALE">Male Profiles Only</option>
                    <option value="FEMALE">Female Profiles Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Column: Live User-Panel Widget Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full sticky top-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#DB2F3C]" />
                    Live Candidate View Preview
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Real-time
                  </span>
                </div>

                {/* Simulated Sidebar Widget Card */}
                <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-md p-3.5 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#DB2F3C] flex items-center justify-center border border-rose-200">
                        <Gift className="w-3.5 h-3.5 text-[#DB2F3C]" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#DB2F3C] block leading-none">
                          Gift Store
                        </span>
                        <h4 className="text-xs font-extrabold text-[#1A1A1A] leading-tight">
                          Surprise Your Match
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-stone-400">1/1</span>
                  </div>

                  {/* Category Pill */}
                  <div className="py-1.5 flex gap-1">
                    <span className="py-0.5 px-2.5 rounded-full text-[10px] font-bold bg-[#1A1A1A] text-white">
                      {formData.categoryLabel || '💍 Rings'}
                    </span>
                  </div>

                  {/* Deal Card */}
                  <div className="bg-gradient-to-br from-[#FFF9F6] via-white to-[#FFF5F7] border border-rose-100 rounded-xl p-2.5 shadow-2xs">
                    {/* Image with badges */}
                    <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-white border border-stone-200 shadow-2xs group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewImage}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).src = '/images/dashboard/gift_couple_rings.jpg';
                        }}
                      />

                      {/* Top Left Badge */}
                      <div className="absolute top-1.5 left-1.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${formData.badgeColor}`}
                        >
                          {formData.badge}
                        </span>
                      </div>

                      {/* Top Right Discount Badge */}
                      <div className="absolute top-1.5 right-1.5">
                        <span className="bg-[#DB2F3C] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                          {formData.discountPercent}% OFF
                        </span>
                      </div>

                      {/* Platform Pill Bottom Left */}
                      <div className="absolute bottom-1.5 left-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${formData.platformLogoBg} ${formData.platformTextColor} shadow-xs`}
                        >
                          <ShoppingBag className="w-2.5 h-2.5" />
                          <span>{formData.platform}</span>
                        </span>
                      </div>

                      {/* Multiple photos indicator */}
                      {formData.images.length > 1 && (
                        <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                          {activePhotoIdx + 1}/{formData.images.length} photos
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="mt-2">
                      <h5 className="text-xs font-bold text-[#1A1A1A] leading-snug truncate">
                        {formData.name || 'Sample Product Name'}
                      </h5>

                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-sm font-black text-[#DB2F3C]">
                          ₹{formData.price}
                        </span>
                        <span className="text-[10px] text-stone-400 line-through">
                          ₹{formData.originalPrice}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          Save ₹{Math.max(0, formData.originalPrice - formData.price)}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-[#555555] line-clamp-2 leading-relaxed">
                        {formData.description || 'Product details will appear here.'}
                      </p>
                    </div>

                    {/* Coupon Box */}
                    {formData.couponCode && (
                      <div className="mt-2 p-1.5 rounded-lg bg-white border border-dashed border-stone-300 flex items-center justify-between gap-1 shadow-2xs">
                        <div className="flex items-center gap-1.5 min-w-0 pl-1">
                          <Tag className="w-3.5 h-3.5 text-[#DB2F3C] shrink-0" />
                          <div className="truncate">
                            <span className="text-[7.5px] text-[#777777] uppercase block font-semibold leading-none">
                              {formData.platform} Coupon
                            </span>
                            <span className="text-[10px] font-mono font-black text-[#1A1A1A] tracking-wider">
                              {formData.couponCode}
                            </span>
                          </div>
                        </div>
                        <div className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-stone-100 text-stone-700 flex items-center gap-1">
                          <Copy className="w-2.5 h-2.5" />
                          Copy
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      type="button"
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#FF4D5A] via-[#E53935] to-[#B71C1C] flex items-center justify-center gap-1 shadow-xs pointer-events-none"
                    >
                      <span>Buy / Send on {formData.platform}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500 space-y-1">
                  <div className="flex items-center justify-between text-stone-700 font-semibold">
                    <span>Audience Visibility:</span>
                    <span className="text-stone-900 font-bold">{formData.targetAudience}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-700 font-semibold">
                    <span>Display Order Priority:</span>
                    <span className="text-[#DB2F3C] font-bold">{formData.priority}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-700 font-semibold">
                    <span>Active Photos:</span>
                    <span className="text-stone-900 font-bold">{formData.images.length} images</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#DB2F3C] to-rose-600 hover:from-[#c22834] hover:to-rose-700 shadow-md cursor-pointer transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Saving Deal...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{editingAd ? 'Save Changes' : 'Publish Partner Deal'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
