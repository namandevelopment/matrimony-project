import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Smartphone,
  MessageSquare,
} from 'lucide-react';
import {
  homeBannerService,
  type HomeBannersData,
} from '../../../services/homeBannerService';
import { toast } from '../../../toastMessage/toast';

export const HomeBannersManagementSection: React.FC = () => {
  const [banners, setBanners] = useState<HomeBannersData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await homeBannerService.fetchBanners();
      setBanners(data);
    } catch {
      toast.error('Failed to load banner settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    if (!banners) return;
    setIsSaving(true);
    try {
      await homeBannerService.updateBanners(banners);
      toast.success('Home banners and placements updated successfully!');
    } catch {
      toast.error('Failed to update banner configurations');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !banners) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B2500] border-t-transparent" />
      </div>
    );
  }

  const { celebratingBanner, planAdBanner } = banners;

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-white p-5 border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#8B2500]" />
            <h2 className="text-lg font-bold text-stone-900">Home Banners & Placement Management</h2>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            Control real-time banner display, prices, discount tags, and placement for Mobile App & Web home feeds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold text-white bg-[#8B2500] hover:bg-[#721F00] shadow-sm disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Placements'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Celebrating Banner Configuration */}
        <div className="flex flex-col bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="border-b border-stone-200 bg-stone-50/70 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h3 className="font-bold text-stone-800 text-sm">Celebrating Milestone Banner (Top Placement)</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={celebratingBanner?.isVisible ?? true}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    celebratingBanner: { ...celebratingBanner, isVisible: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className="ml-2 text-xs font-semibold text-stone-600">
                {celebratingBanner?.isVisible ? 'Visible' : 'Hidden'}
              </span>
            </label>
          </div>

          <div className="p-5 space-y-4 flex-1">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Banner Title</label>
              <input
                type="text"
                value={celebratingBanner.title || ''}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    celebratingBanner: { ...celebratingBanner, title: e.target.value },
                  })
                }
                className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                placeholder="Celebrating 26 Years of Matchmaking"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Discount %</label>
                <input
                  type="number"
                  value={celebratingBanner.discountPercent || ''}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      celebratingBanner: {
                        ...celebratingBanner,
                        discountPercent: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                  placeholder="78"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={celebratingBanner.ctaText || ''}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      celebratingBanner: { ...celebratingBanner, ctaText: e.target.value },
                    })
                  }
                  className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                  placeholder="Get upto 78% OFF"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Action / Route</label>
              <input
                type="text"
                value={celebratingBanner.ctaUrl || ''}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    celebratingBanner: { ...celebratingBanner, ctaUrl: e.target.value },
                  })
                }
                className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                placeholder="Upgrade"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Custom Image URL (Optional)</label>
              <input
                type="text"
                value={celebratingBanner.imageUrl || ''}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    celebratingBanner: { ...celebratingBanner, imageUrl: e.target.value || null },
                  })
                }
                className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                placeholder="https://... (leave empty for built-in high-res banner)"
              />
            </div>

            {/* Live Preview Box */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> Live Placement Preview
              </span>
              <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 p-4 text-center">
                <p className="text-xs font-medium text-stone-500">Celebrating</p>
                <div className="text-xl font-extrabold text-stone-900 my-1">
                  26 <span className="text-sm font-semibold">Years of Matchmaking</span>
                </div>
                <div className="inline-block mt-1 px-4 py-1.5 rounded-full bg-[#3b2064] text-white text-xs font-bold shadow-sm">
                  {celebratingBanner.ctaText || 'Get upto 78% OFF'} &gt;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Silver Plan Offer Banner Configuration */}
        <div className="flex flex-col bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="border-b border-stone-200 bg-stone-50/70 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-[#8B2500]" />
              <h3 className="font-bold text-stone-800 text-sm">Silver Plan Ad Banner (Home In-Feed)</h3>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
              Active Placement
            </span>
          </div>

          <div className="p-5 space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Plan Header</label>
                <input
                  type="text"
                  value={planAdBanner.planName || ''}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      planAdBanner: { ...planAdBanner, planName: e.target.value },
                    })
                  }
                  className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                  placeholder="Silver - 1 month"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Offer Tag</label>
                <input
                  type="text"
                  value={planAdBanner.offerTag || ''}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      planAdBanner: { ...planAdBanner, offerTag: e.target.value },
                    })
                  }
                  className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                  placeholder="Special offer only for you"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={planAdBanner.tagline || ''}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    planAdBanner: { ...planAdBanner, tagline: e.target.value },
                  })
                }
                className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                placeholder="Your only starter pack to find the right match"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Original (₹)</label>
                <input
                  type="number"
                  value={planAdBanner.originalPrice || ''}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      planAdBanner: {
                        ...planAdBanner,
                        originalPrice: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                  placeholder="1800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Offer Price (₹)</label>
                <input
                  type="number"
                  value={planAdBanner.discountedPrice || ''}
                  onChange={(e) => {
                    const price = Number(e.target.value) || 0;
                    setBanners({
                      ...banners,
                      planAdBanner: {
                        ...planAdBanner,
                        discountedPrice: price,
                        buttonText: `Pay ₹${price}`,
                      },
                    });
                  }}
                  className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                  placeholder="990"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={planAdBanner.buttonText || ''}
                  onChange={(e) =>
                    setBanners({
                      ...banners,
                      planAdBanner: { ...planAdBanner, buttonText: e.target.value },
                    })
                  }
                  className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                  placeholder="Pay ₹990"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">GST Disclaimer</label>
              <input
                type="text"
                value={planAdBanner.disclaimer || ''}
                onChange={(e) =>
                  setBanners({
                    ...banners,
                    planAdBanner: { ...planAdBanner, disclaimer: e.target.value },
                  })
                }
                className="w-full text-sm rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#8B2500]"
                placeholder="*Prices are exclusive of GST"
              />
            </div>

            {/* Live Preview Box */}
            <div className="mt-4 pt-3 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> Mobile App Placement Preview
              </span>
              <div className="rounded-xl border border-stone-200 bg-[#FFFDF9] p-4 text-left space-y-2">
                <div className="text-base font-bold text-stone-900">{planAdBanner.planName}</div>
                <div className="text-xs text-stone-600">{planAdBanner.tagline}</div>
                <div className="rounded-lg bg-stone-100 p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 line-through mr-2">
                      ₹{planAdBanner.originalPrice?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-base font-extrabold text-stone-900">
                      ₹{planAdBanner.discountedPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {planAdBanner.offerTag}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-stone-700 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-stone-600" />
                      <span>View <strong>10 Phone Nos</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-stone-600" />
                      <span>Send <strong>messages to matches</strong></span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-700">
                      <Clock className="h-5 w-5" />
                    </div>
                    <span className="text-[9px] font-bold text-amber-800 mt-1">LIMITED OFFER</span>
                  </div>
                </div>
                <div className="w-full py-2 bg-[#4A261A] text-white text-center rounded-lg text-xs font-bold shadow-sm mt-2">
                  {planAdBanner.buttonText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

