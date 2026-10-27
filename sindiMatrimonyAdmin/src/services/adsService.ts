import api from '../redux/apiService';
import { ApiURL } from '../redux/apiService/endpoint';

export interface AdvertisementDeal {
  _id?: string;
  id: string;
  adId?: string;
  name: string;
  categoryLabel: string;
  categories: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  platform: 'Amazon' | 'Flipkart' | 'Meesho' | 'Myntra' | 'Nykaa' | 'Custom' | 'Other';
  platformLogoBg: string;
  platformTextColor: string;
  badge: string;
  badgeColor: string;
  imageSrc: string;
  images: string[];
  description: string;
  couponCode: string;
  affiliateUrl: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  priority: number;
  targetAudience: 'ALL' | 'PAID_MEMBERS' | 'FREE_MEMBERS' | 'MALE' | 'FEMALE';
  impressions?: number;
  clicks?: number;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEY_ADS = 'sindhi_admin_ads_cache_v1';

const INITIAL_LOCAL_ADS: AdvertisementDeal[] = [];


export const PLATFORM_STYLE_PRESETS: Record<
  string,
  { platformLogoBg: string; platformTextColor: string; label: string }
> = {
  Amazon: {
    platformLogoBg: 'bg-[#232F3E]',
    platformTextColor: 'text-amber-400',
    label: 'Amazon India',
  },
  Flipkart: {
    platformLogoBg: 'bg-[#2874F0]',
    platformTextColor: 'text-yellow-300',
    label: 'Flipkart',
  },
  Meesho: {
    platformLogoBg: 'bg-[#570741]',
    platformTextColor: 'text-fuchsia-300',
    label: 'Meesho',
  },
  Myntra: {
    platformLogoBg: 'bg-[#E11B55]',
    platformTextColor: 'text-pink-100',
    label: 'Myntra Fashion',
  },
  Nykaa: {
    platformLogoBg: 'bg-[#FC2779]',
    platformTextColor: 'text-white',
    label: 'Nykaa Beauty',
  },
  Custom: {
    platformLogoBg: 'bg-stone-900',
    platformTextColor: 'text-white',
    label: 'Custom Store',
  },
  Other: {
    platformLogoBg: 'bg-stone-800',
    platformTextColor: 'text-stone-200',
    label: 'Direct Partner',
  },
};

export const BADGE_COLOR_PRESETS = [
  { label: 'Amber / Gold (Engagement)', value: 'bg-amber-50 text-amber-800 border-amber-200' },
  { label: 'Fuchsia / Magenta (Trending)', value: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200' },
  { label: 'Blue / Indigo (Most Loved)', value: 'bg-blue-50 text-blue-800 border-blue-200' },
  { label: 'Rose / Pink (Romantic)', value: 'bg-rose-50 text-rose-800 border-rose-200' },
  { label: 'Emerald / Green (Best Seller)', value: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { label: 'Purple / Violet (Luxury)', value: 'bg-purple-50 text-purple-800 border-purple-200' },
];

export const CATEGORY_EMOJI_PRESETS = [
  '💍 Rings',
  '💖 Lockets',
  '✨ Bracelets',
  '🧸 Soft Toys',
  '🎁 Hampers',
  '👗 Bridal Wear',
  '👔 Groom Wear',
  '💎 Diamond Jewellery',
  '🌸 Perfumes & Scents',
  '🍫 Luxury Sweets',
];

class AdsService {
  private localAds: AdvertisementDeal[];

  constructor() {
    this.localAds = this.loadLocalAds();
  }

  private loadLocalAds(): AdvertisementDeal[] {
    try {
      if (typeof window === 'undefined') return INITIAL_LOCAL_ADS;
      const raw = localStorage.getItem(STORAGE_KEY_ADS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(INITIAL_LOCAL_ADS));
        return INITIAL_LOCAL_ADS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_LOCAL_ADS;
    }
  }

  private persistLocalAds() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(this.localAds));
      }
    } catch {}
  }

  async fetchAds(params: Record<string, any> = {}): Promise<{
    list: AdvertisementDeal[];
    total: number;
    stats: { totalAds: number; activeAds: number; inactiveAds: number };
  }> {
    try {
      const response = await api.get(ApiURL.ads, params, { showErrorToast: false });
      if (response && response.data && Array.isArray(response.data.list)) {
        const remoteList: AdvertisementDeal[] = response.data.list.map((item: any) => ({
          ...item,
          id: item.adId || item._id || item.id,
          images: item.images && item.images.length > 0 ? item.images : [item.imageSrc],
        }));
        this.localAds = remoteList;
        this.persistLocalAds();
        return {
          list: remoteList,
          total: response.data.pagination?.total ?? remoteList.length,
          stats: response.data.stats || {
            totalAds: remoteList.length,
            activeAds: remoteList.filter((a) => a.status === 'ACTIVE').length,
            inactiveAds: remoteList.filter((a) => a.status !== 'ACTIVE').length,
          },
        };
      }
    } catch (e) {
      // Gracefully fall back to local store
    }

    return {
      list: [...this.localAds],
      total: this.localAds.length,
      stats: {
        totalAds: this.localAds.length,
        activeAds: this.localAds.filter((a) => a.status === 'ACTIVE').length,
        inactiveAds: this.localAds.filter((a) => a.status !== 'ACTIVE').length,
      },
    };
  }

  async createAd(data: Partial<AdvertisementDeal>): Promise<AdvertisementDeal> {
    const numPrice = Number(data.price) || 0;
    const numOriginal = Number(data.originalPrice) || numPrice;
    const discountPercent =
      numOriginal > 0
        ? Math.max(0, Math.round(((numOriginal - numPrice) / numOriginal) * 100))
        : 0;

    const platformDefaults = PLATFORM_STYLE_PRESETS[data.platform || 'Amazon'] || PLATFORM_STYLE_PRESETS.Amazon;

    const payload = {
      ...data,
      price: numPrice,
      originalPrice: numOriginal,
      discountPercent: data.discountPercent ?? discountPercent,
      platformLogoBg: data.platformLogoBg || platformDefaults.platformLogoBg,
      platformTextColor: data.platformTextColor || platformDefaults.platformTextColor,
      badgeColor: data.badgeColor || BADGE_COLOR_PRESETS[0].value,
      images: data.images && data.images.length > 0 ? data.images : [data.imageSrc || ''],
    };

    try {
      const response = await api.post(ApiURL.ads, payload, { showErrorToast: true });
      if (response?.data) {
        const created: AdvertisementDeal = {
          ...response.data,
          id: response.data.adId || response.data._id,
        };
        this.localAds = [created, ...this.localAds.filter((a) => a.id !== created.id)];
        this.persistLocalAds();
        return created;
      }
    } catch {}

    // Offline / fallback creation
    const fallbackId = `AD_${Date.now()}`;
    const fallbackCreated: AdvertisementDeal = {
      id: fallbackId,
      name: data.name || 'New Sponsored Deal',
      categoryLabel: data.categoryLabel || '🎁 Gifts',
      categories: data.categories || ['Gifts'],
      price: numPrice,
      originalPrice: numOriginal,
      discountPercent,
      platform: data.platform || 'Amazon',
      platformLogoBg: payload.platformLogoBg,
      platformTextColor: payload.platformTextColor,
      badge: data.badge || 'Special Deal',
      badgeColor: payload.badgeColor,
      imageSrc: data.imageSrc || '/images/dashboard/gift_couple_rings.jpg',
      images: payload.images,
      description: data.description || '',
      couponCode: data.couponCode || '',
      affiliateUrl: data.affiliateUrl || 'https://www.amazon.in',
      status: data.status || 'ACTIVE',
      priority: Number(data.priority) || 0,
      targetAudience: data.targetAudience || 'ALL',
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    this.localAds = [fallbackCreated, ...this.localAds];
    this.persistLocalAds();
    return fallbackCreated;
  }

  async updateAd(id: string, data: Partial<AdvertisementDeal>): Promise<AdvertisementDeal> {
    try {
      const response = await api.put(ApiURL.adDetail(id), data, { showErrorToast: true });
      if (response?.data) {
        const updated: AdvertisementDeal = {
          ...response.data,
          id: response.data.adId || response.data._id || id,
        };
        this.localAds = this.localAds.map((a) => (a.id === id || a._id === id ? updated : a));
        this.persistLocalAds();
        return updated;
      }
    } catch {}

    this.localAds = this.localAds.map((a) => {
      if (a.id === id || a._id === id) {
        const merged = { ...a, ...data };
        if (data.price !== undefined || data.originalPrice !== undefined) {
          const np = Number(merged.price) || 0;
          const no = Number(merged.originalPrice) || np;
          merged.discountPercent = no > 0 ? Math.max(0, Math.round(((no - np) / no) * 100)) : 0;
        }
        return merged;
      }
      return a;
    });
    this.persistLocalAds();
    const updated = this.localAds.find((a) => a.id === id || a._id === id);
    return updated || (data as AdvertisementDeal);
  }

  async toggleStatus(id: string): Promise<string> {
    try {
      const response = await api.patch(ApiURL.adStatus(id), {}, { showErrorToast: true });
      const nextStatus = response?.data?.status || 'ACTIVE';
      this.localAds = this.localAds.map((a) =>
        a.id === id || a._id === id ? { ...a, status: nextStatus } : a
      );
      this.persistLocalAds();
      return nextStatus;
    } catch {}

    let nextStatus = 'ACTIVE';
    this.localAds = this.localAds.map((a) => {
      if (a.id === id || a._id === id) {
        nextStatus = a.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...a, status: nextStatus as any };
      }
      return a;
    });
    this.persistLocalAds();
    return nextStatus;
  }

  async deleteAd(id: string): Promise<boolean> {
    try {
      await api.delete(ApiURL.adDetail(id), { showErrorToast: true });
    } catch {}
    this.localAds = this.localAds.filter((a) => a.id !== id && a._id !== id);
    this.persistLocalAds();
    return true;
  }
}

export const adsService = new AdsService();
