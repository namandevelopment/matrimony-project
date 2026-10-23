"use client";

import React, { memo, useState, useCallback, useEffect, useRef } from "react";
import {
  Tag,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Gift,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

export interface GiftProduct {
  id: string;
  name: string;
  categoryLabel: string;
  categories?: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  platform: string;
  platformLogoBg: string;
  platformTextColor: string;
  badge: string;
  badgeColor: string;
  imageSrc: string;
  images?: string[];
  description: string;
  couponCode: string;
  affiliateUrl: string;
}

const GIFT_PRODUCTS: GiftProduct[] = [
  {
    id: "couple-rings",
    name: "Sterling Silver Couple Promise Rings",
    categoryLabel: "💍 Rings",
    price: 599,
    originalPrice: 1999,
    discountPercent: 70,
    platform: "Amazon",
    platformLogoBg: "bg-[#232F3E]",
    platformTextColor: "text-amber-400",
    badge: "Top Engagement Gift",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    imageSrc: "/images/dashboard/gift_couple_rings.jpg",
    description: "Adjustable pure 925 silver couple rings with solitaire crystal & luxury gift box.",
    couponCode: "AMZMATCH50",
    affiliateUrl: "https://www.amazon.in/s?k=couple+rings+silver&tag=sindhimatrimony-21",
  },
  {
    id: "heart-locket",
    name: "Rose Gold Heart Neck Locket & Chain",
    categoryLabel: "💖 Lockets",
    price: 249,
    originalPrice: 899,
    discountPercent: 72,
    platform: "Meesho",
    platformLogoBg: "bg-[#570741]",
    platformTextColor: "text-fuchsia-300",
    badge: "Trending on Meesho",
    badgeColor: "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200",
    imageSrc: "/images/dashboard/gift_neck_locket.jpg",
    description: "Delicate opening heart pendant with crystal border for photos & initials.",
    couponCode: "MEESHOLOVE",
    affiliateUrl: "https://www.meesho.com/search?q=heart+locket+pendant&ref=sindhimatrimony",
  },
  {
    id: "charm-bracelet",
    name: "Crystal Heart Charm Bracelet for Girls",
    categoryLabel: "✨ Bracelets",
    price: 399,
    originalPrice: 1299,
    discountPercent: 69,
    platform: "Flipkart",
    platformLogoBg: "bg-[#2874F0]",
    platformTextColor: "text-yellow-300",
    badge: "Most Loved by Girls",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    imageSrc: "/images/dashboard/gift_crystal_bracelet.jpg",
    description: "Sparkling rose gold & silver charm bracelet with velvet presentation box.",
    couponCode: "FLIPWED40",
    affiliateUrl: "https://www.flipkart.com/search?q=charm+bracelet+for+girls&affid=sindhimatrimony",
  },
  {
    id: "teddy-hamper",
    name: "Cute Teddy Bear & Chocolate Gift Hamper",
    categoryLabel: "🧸 Soft Toys",
    price: 699,
    originalPrice: 1599,
    discountPercent: 56,
    platform: "Amazon",
    platformLogoBg: "bg-[#232F3E]",
    platformTextColor: "text-amber-400",
    badge: "Romantic Surprise",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    imageSrc: "/images/dashboard/gift_teddy_hamper.jpg",
    description: "Fluffy LOVE teddy bear with luxury chocolates & roses in a satin bow box.",
    couponCode: "AMZTEDDY",
    affiliateUrl: "https://www.amazon.in/s?k=teddy+bear+chocolate+gift+box&tag=sindhimatrimony-21",
  },
];

export interface SidebarPartnerDealsWidgetProps {
  className?: string;
  onUpgradeClick?: () => void;
  isPaidMember?: boolean;
}

const SidebarPartnerDealsWidgetComponent: React.FC<SidebarPartnerDealsWidgetProps> = ({
  className = "",
  onUpgradeClick,
  isPaidMember = false,
}) => {
  const [deals, setDeals] = useState<GiftProduct[]>(GIFT_PRODUCTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePhotoMap, setActivePhotoMap] = useState<Record<string, number>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAds = async () => {
      try {
        const res = await fetch("/api/v1/ads", { credentials: "omit" });
        if (res.ok) {
          const json = await res.json();
          const items = json?.data?.list || json?.data;
          if (isMounted && Array.isArray(items) && items.length > 0) {
            setDeals(items);
          }
        }
      } catch {}
    };
    fetchAds();
    return () => {
      isMounted = false;
    };
  }, []);

  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  const totalSlides = deals.length || 1;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play slider every 4.5 seconds (pauses on hover)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 40) {
      // Swipe left -> next slide
      nextSlide();
    } else if (diff < -40) {
      // Swipe right -> prev slide
      prevSlide();
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  const handleCopyCoupon = useCallback((code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode(null);
      }, 2500);
    }
  }, []);

  const handleOpenAffiliate = useCallback((product: GiftProduct) => {
    try {
      fetch(`/api/v1/ads/${product.id}/click`, { method: "POST", credentials: "omit" }).catch(() => {});
    } catch {}
    window.open(product.affiliateUrl, "_blank", "noopener,noreferrer");
  }, []);

  const activeProduct = deals[currentIndex] || deals[0];

  return (
    <div
      aria-label="Send Gifts & Jewellery to Your Match - Swiper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full bg-white rounded-2xl border border-stone-200 shadow-sm p-4 flex flex-col transition-all duration-200 hover:shadow-md ${className}`}
    >
      {/* 1. Header with Controls & Category Pills */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 text-[#DB2F3C] flex items-center justify-center shadow-2xs border border-rose-200">
            <Gift className="w-4 h-4 text-[#DB2F3C]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#DB2F3C]">
                Gift Store
              </span>
              <Heart className="w-2.5 h-2.5 text-[#DB2F3C] fill-current" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-extrabold text-[#1A1A1A] leading-tight">
              Surprise Your Match
            </h4>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous gift"
            className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-[#DB2F3C] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-bold text-stone-400 px-0.5">
            {currentIndex + 1}/{totalSlides}
          </span>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next gift"
            className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-[#DB2F3C] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Quick Category Tag Tabs */}
      <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
        {deals.map((prod, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={prod.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`shrink-0 py-1 px-2.5 rounded-full text-[10px] font-bold transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#1A1A1A] text-white shadow-2xs scale-[1.02]"
                  : "bg-stone-100 text-[#555555] hover:bg-stone-200/80 hover:text-[#1A1A1A]"
              }`}
            >
              {prod.categoryLabel}
            </button>
          );
        })}
      </div>

      {/* 3. Swiper / Slider Container (Touch & Swipe Support) */}
      <div
        className="relative overflow-hidden rounded-2xl my-1 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {deals.map((product) => {
            const activePhotoIdx = activePhotoMap[product.id] || 0;
            const currentImage =
              (product.images && product.images[activePhotoIdx]) ||
              product.imageSrc;
            const hasMultiplePhotos = product.images && product.images.length > 1;

            return (
              <div
                key={product.id}
                className="w-full shrink-0 flex flex-col bg-gradient-to-br from-[#FFF9F6] via-white to-[#FFF5F7] border border-rose-100 rounded-2xl p-3 shadow-2xs"
              >
                {/* Image with overlay badge and platform */}
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-white border border-stone-200/80 shadow-2xs group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Badge Top Left */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-xs ${product.badgeColor}`}
                    >
                      {product.badge}
                    </span>
                  </div>

                  {/* Discount Badge Top Right */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-[#DB2F3C] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                      {product.discountPercent}% OFF
                    </span>
                  </div>

                  {/* Platform Pill Bottom Left */}
                  <div className="absolute bottom-2 left-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${product.platformLogoBg} ${product.platformTextColor} shadow-xs`}
                    >
                      <ShoppingBag className="w-2.5 h-2.5" />
                      <span>{product.platform}</span>
                    </span>
                  </div>

                  {/* Multi-Photo Dots Bottom Right */}
                  {hasMultiplePhotos && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-full">
                      {product.images!.map((_, pIdx) => {
                        const isCurPhoto = activePhotoIdx === pIdx;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePhotoMap((prev) => ({ ...prev, [product.id]: pIdx }));
                            }}
                            className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${
                              isCurPhoto ? "bg-white scale-125" : "bg-white/40 hover:bg-white/75"
                            }`}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

              {/* Product Info */}
              <div className="mt-2.5">
                <h5 className="text-xs font-bold text-[#1A1A1A] leading-snug truncate">
                  {product.name}
                </h5>

                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-black text-[#DB2F3C]">
                    ₹{product.price}
                  </span>
                  <span className="text-[10px] text-stone-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">
                    Save ₹{product.originalPrice - product.price}
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-[#555555] line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Coupon Code Box */}
              <div className="mt-2 p-1.5 rounded-xl bg-white border border-dashed border-stone-300 flex items-center justify-between gap-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 min-w-0 pl-1">
                  <Tag className="w-3.5 h-3.5 text-[#DB2F3C] shrink-0" />
                  <div className="truncate">
                    <span className="text-[7.5px] text-[#777777] uppercase block font-semibold leading-none">
                      {product.platform} Coupon
                    </span>
                    <span className="text-[11px] font-mono font-black text-[#1A1A1A] tracking-wider">
                      {product.couponCode}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCopyCoupon(product.couponCode, e)}
                  className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    copiedCode === product.couponCode
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-stone-100 hover:bg-stone-200 text-[#333333]"
                  }`}
                >
                  {copiedCode === product.couponCode ? (
                    <>
                      <Check className="w-2.5 h-2.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Button: Linear Gradient */}
              <button
                type="button"
                onClick={() => handleOpenAffiliate(product)}
                className="mt-2.5 w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#FF4D5A] via-[#E53935] to-[#B71C1C] hover:from-[#FF5E6B] hover:via-[#EF4444] hover:to-[#C62828] active:scale-[0.98] shadow-md hover:shadow-red-500/25 transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 tracking-wide"
              >
                <span>Buy / Send on {product.platform}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          );
        })}
        </div>
      </div>

      {/* 4. Dots Pagination Indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {deals.map((_, dotIdx) => {
          const isActive = dotIdx === currentIndex;
          return (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? "w-6 bg-[#DB2F3C]" : "w-1.5 bg-stone-200 hover:bg-stone-300"
              }`}
            />
          );
        })}
      </div>

      {/* 5. Footer Transparency & Membership Incentive */}
      <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[9px] text-[#777777]">
        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
          Verified Stores
        </span>
        {!isPaidMember && onUpgradeClick ? (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="text-[#DB2F3C] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>More Member Deals &raquo;</span>
          </button>
        ) : (
          <span className="font-bold text-emerald-600">VIP Active</span>
        )}
      </div>
    </div>
  );
};

export const SidebarPartnerDealsWidget = memo(SidebarPartnerDealsWidgetComponent);
SidebarPartnerDealsWidget.displayName = "SidebarPartnerDealsWidget";
export default SidebarPartnerDealsWidget;
