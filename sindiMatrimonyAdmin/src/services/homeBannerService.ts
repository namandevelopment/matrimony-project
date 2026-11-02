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
    const res = await api.get(ApiURL.homeBanners);
    return res?.data?.data || res?.data || res;
  },

  async updateBanners(payload: Partial<HomeBannersData>): Promise<HomeBannersData> {
    const res = await api.put(ApiURL.homeBanners, payload);
    return res?.data?.data || res?.data || res;
  },
};

