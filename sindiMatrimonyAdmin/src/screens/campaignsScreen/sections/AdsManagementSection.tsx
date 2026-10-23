import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Tag,
  Eye,
  MousePointerClick,
  CheckCircle2,
  XCircle,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  type AdvertisementDeal,
  adsService,
} from '../../../services/adsService';
import { CreateAdModal } from '../components/CreateAdModal';
import { toast } from '../../../toastMessage/toast';

export const AdsManagementSection: React.FC = () => {
  const [ads, setAds] = useState<AdvertisementDeal[]>([]);
  const [stats, setStats] = useState({ totalAds: 0, activeAds: 0, inactiveAds: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdvertisementDeal | null>(null);

  const loadAdsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adsService.fetchAds();
      setAds(data.list);
      setStats(data.stats);
    } catch {
      toast.error('Failed to load advertisements');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdsData();
  }, [loadAdsData]);

  const filteredAds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ads.filter((ad) => {
      if (statusFilter !== 'ALL' && ad.status !== statusFilter) return false;
      if (platformFilter !== 'ALL' && ad.platform !== platformFilter) return false;
      if (q) {
        const matchesName = ad.name.toLowerCase().includes(q);
        const matchesCat = (ad.categoryLabel || '').toLowerCase().includes(q);
        const matchesTags = (ad.categories || []).some((c) => c.toLowerCase().includes(q));
        const matchesCoupon = (ad.couponCode || '').toLowerCase().includes(q);
        const matchesPlatform = (ad.platform || '').toLowerCase().includes(q);
        return matchesName || matchesCat || matchesTags || matchesCoupon || matchesPlatform;
      }
      return true;
    });
  }, [ads, searchQuery, platformFilter, statusFilter]);

  const handleOpenCreate = () => {
    setEditingAd(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad: AdvertisementDeal) => {
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleSaveAd = async (data: Partial<AdvertisementDeal>) => {
    try {
      if (editingAd) {
        await adsService.updateAd(editingAd.id, data);
        toast.success(`Updated deal: ${data.name || editingAd.name}`);
      } else {
        await adsService.createAd(data);
        toast.success(`Published new partner deal: ${data.name}`);
      }
      await loadAdsData();
    } catch {
      toast.error('Failed to save advertisement deal');
    }
  };

  const handleToggleStatus = async (ad: AdvertisementDeal) => {
    try {
      const nextStatus = await adsService.toggleStatus(ad.id);
      setAds((prev) =>
        prev.map((item) => (item.id === ad.id ? { ...item, status: nextStatus as any } : item))
      );
      toast.success(`${ad.name} is now ${nextStatus}`);
    } catch {
      toast.error('Could not toggle deal status');
    }
  };

  const handleDeleteAd = async (ad: AdvertisementDeal) => {
    if (!window.confirm(`Are you sure you want to delete "${ad.name}"?`)) return;
    try {
      await adsService.deleteAd(ad.id);
      setAds((prev) => prev.filter((item) => item.id !== ad.id));
      toast.success(`Deleted deal: ${ad.name}`);
    } catch {
      toast.error('Failed to delete deal');
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Affiliate URL copied to clipboard');
  };

  const totalClicks = useMemo(() => {
    return ads.reduce((acc, ad) => acc + (ad.clicks || 0), 0);
  }, [ads]);

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Ads / Deals
            </span>
            <span className="text-2xl font-black text-stone-900 mt-1 block">
              {stats.totalAds || ads.length}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">All partner deals in catalog</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-[#DB2F3C] flex items-center justify-center border border-rose-100">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Live in User Dashboard
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {stats.activeAds || ads.filter((a) => a.status === 'ACTIVE').length}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Active & rotating</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Paused Deals
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {stats.inactiveAds || ads.filter((a) => a.status !== 'ACTIVE').length}
            </span>
            <span className="text-[10px] text-stone-400 font-medium">Hidden from candidates</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Total Affiliate Clicks
            </span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">
              {totalClicks}
            </span>
            <span className="text-[10px] text-blue-600 font-semibold">Tracked outbound redirects</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <MousePointerClick className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Control Toolbar: Search, Filters & Action Button */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, category, or coupon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#DB2F3C] bg-stone-50/60"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#DB2F3C]"
          >
            <option value="ALL">All Platforms</option>
            <option value="Amazon">Amazon</option>
            <option value="Flipkart">Flipkart</option>
            <option value="Meesho">Meesho</option>
            <option value="Myntra">Myntra</option>
            <option value="Nykaa">Nykaa</option>
            <option value="Custom">Custom / Direct</option>
          </select>
        </div>

        {/* Status Filter & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {s === 'ALL' ? 'All' : s === 'ACTIVE' ? 'Live' : 'Paused'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-gradient-to-r from-[#DB2F3C] to-rose-600 hover:from-[#c22834] hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Partner Deal</span>
          </button>
        </div>
      </div>

      {/* 3. Deals Grid */}
      {filteredAds.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#DB2F3C] flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-extrabold text-stone-800">No Advertisements Found</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || platformFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try modifying your search or filter criteria.'
              : 'Add your first partner deal or sponsored product to show inside candidates dashboard.'}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#DB2F3C] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#c22834] transition-colors cursor-pointer"
          >
            + Create First Deal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAds.map((ad) => {
            const isLive = ad.status === 'ACTIVE';
            const photosCount = (ad.images && ad.images.length > 0) ? ad.images.length : 1;
            return (
              <div
                key={ad.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Photo & Platform Banner */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100 border-b border-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.imageSrc || (ad.images && ad.images[0]) || '/images/dashboard/gift_couple_rings.jpg'}
                    alt={ad.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as any).src = '/images/dashboard/gift_couple_rings.jpg';
                    }}
                  />

                  {/* Top Left Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-xs backdrop-blur-md ${ad.badgeColor}`}
                    >
                      {ad.badge}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isLive
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-stone-800/80 text-stone-300'
                      }`}
                    >
                      {isLive ? '● Live' : '○ Paused'}
                    </span>
                  </div>

                  {/* Top Right Discount Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="bg-[#DB2F3C] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                      {ad.discountPercent}% OFF
                    </span>
                  </div>

                  {/* Bottom Bar: Platform pill + multiple photos badge */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xs ${ad.platformLogoBg} ${ad.platformTextColor}`}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>{ad.platform}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold">
                      <Layers className="w-2.5 h-2.5" />
                      <span>{photosCount} photos</span>
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category Label & Category Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <span className="text-[10px] font-extrabold text-[#DB2F3C] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {ad.categoryLabel}
                      </span>
                      {ad.categories &&
                        ad.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat}
                            className="text-[9px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded"
                          >
                            #{cat}
                          </span>
                        ))}
                    </div>

                    <h4 className="text-xs sm:text-[13px] font-bold text-stone-900 leading-snug line-clamp-1">
                      {ad.name}
                    </h4>

                    {/* Price row */}
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-base font-black text-[#DB2F3C]">
                        ₹{ad.price}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        ₹{ad.originalPrice}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        Save ₹{Math.max(0, ad.originalPrice - ad.price)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {ad.description}
                    </p>

                    {/* Coupon Box if exists */}
                    {ad.couponCode && (
                      <div className="mt-2.5 p-1.5 rounded-xl bg-stone-50 border border-dashed border-stone-300 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-stone-800">
                          <Tag className="w-3 h-3 text-[#DB2F3C]" />
                          <span>{ad.couponCode}</span>
                        </div>
                        <span className="text-[9px] text-stone-400 uppercase font-semibold">
                          Coupon
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Analytics & Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    {/* Impressions & Clicks */}
                    <div className="flex items-center gap-3 text-[10px] text-stone-500 font-semibold">
                      <span className="flex items-center gap-1" title="Impressions in user dashboard">
                        <Eye className="w-3 h-3 text-stone-400" />
                        {ad.impressions || 0}
                      </span>
                      <span className="flex items-center gap-1 text-blue-600" title="Outbound clicks">
                        <MousePointerClick className="w-3 h-3" />
                        {ad.clicks || 0}
                      </span>
                      <span className="text-stone-400">Order: {ad.priority || 0}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(ad)}
                        title={isLive ? 'Pause this deal' : 'Publish this deal live'}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isLive
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-stone-500 bg-stone-100 hover:bg-stone-200'
                        }`}
                      >
                        {isLive ? 'Live' : 'Paused'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyLink(ad.affiliateUrl)}
                        title="Copy affiliate link"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => window.open(ad.affiliateUrl, '_blank', 'noopener,noreferrer')}
                        title="Test link destination"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-blue-600 hover:bg-stone-100 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ad)}
                        title="Edit deal details"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 cursor-pointer transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAd(ad)}
                        title="Delete deal"
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Create / Edit Modal */}
      <CreateAdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveAd}
        editingAd={editingAd}
      />
    </div>
  );
};
