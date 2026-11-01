import api from '../redux/apiService';
import { ApiURL } from '../redux/apiService/endpoint';

export interface PlanFeatureItem {
  id: string;
  icon: string;
  prefixText?: string;
  highlightText: string;
  hasInfo?: boolean;
}

export interface PlanAdBannerConfig {
  planName: string;
  tagline: string;
  offerTag: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent?: number;
  discountEndsInSeconds?: number;
  features: PlanFeatureItem[];
  buttonText: string;
  disclaimer: string;
  badge?: {
    title: string;
    subtitle: string;
  };
  isVisible?: boolean;
}

export interface CelebratingBannerConfig {
  title: string;
  subtitle: string;
  badge: string;
  discountPercent: number;
  ctaText: string;
  ctaUrl: string;
  imageUrl?: string | null;
  isVisible: boolean;
}

export interface HomeBannersData {
  celebratingBanner: CelebratingBannerConfig;
  planAdBanner: PlanAdBannerConfig;
  assistedServiceBanner?: any;
  limcaRecordBanner?: any;
}

export const homeBannerService = {
  async fetchBanners(): Promise<HomeBannersData> {
    try {
      const res = await api.get(ApiURL.homeBanners);
      return res?.data?.data || res?.data || res;
    } catch {
      return {
        celebratingBanner: {
          title: 'Celebrating 26 Years of Matchmaking',
          subtitle: "Find your ideal Sindhi life partner with India's most trusted matrimony",
          badge: '26 Years Milestone',
          discountPercent: 78,
          ctaText: 'Get upto 78% OFF',
          ctaUrl: 'Upgrade',
          imageUrl: null,
          isVisible: true,
        },
        planAdBanner: {
          planName: 'Silver - 1 month',
          tagline: 'Your only starter pack to find the right match',
          offerTag: 'Special offer only for you',
          originalPrice: 1800,
          discountedPrice: 990,
          discountPercent: 45,
          discountEndsInSeconds: 86400,
          features: [
            { id: 'feat_1', icon: 'smartphone', prefixText: 'View ', highlightText: '10 Phone Nos', hasInfo: false },
            { id: 'feat_2', icon: 'message-square', prefixText: 'Send ', highlightText: 'messages to matches', hasInfo: true },
            { id: 'feat_3', icon: 'sparkles', prefixText: 'View ', highlightText: 'unlimited horoscopes', hasInfo: false },
          ],
          buttonText: 'Pay ₹990',
          disclaimer: '*Prices are exclusive of GST',
          badge: { title: 'LIMITED', subtitle: 'PERIOD OFFER' },
          isVisible: true,
        },
      };
    }
  },

  async updateBanners(payload: Partial<HomeBannersData>): Promise<HomeBannersData> {
    const res = await api.put(ApiURL.homeBanners, payload);
    return res?.data?.data || res?.data || res;
  },
};

