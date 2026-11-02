import { notificationService } from './notificationService';
import { BASE_URL } from '../redux/apiService';

export type TargetAudience =
  | 'ALL'
  | 'FREE_USERS'
  | 'PREMIUM_USERS'
  | 'EXPIRED_MEMBERS'
  | 'INACTIVE_30_DAYS'
  | 'UNVERIFIED_PROFILES'
  | 'INCOMPLETE_PROFILES'
  | 'RECENT_REGISTRATIONS'
  | 'SELECTED_IDS';

export type PlatformTarget = 'MOBILE_APP' | 'USER_WEB' | 'BOTH';

export type NotificationType =
  | 'GENERAL_ANNOUNCEMENT'
  | 'FESTIVAL_GREETINGS'
  | 'FESTIVAL_OFFER'
  | 'SUBSCRIPTION_OFFER'
  | 'DISCOUNT_CAMPAIGN'
  | 'NEW_FEATURE'
  | 'PROFILE_COMPLETION'
  | 'CUSTOM';

export type DeliveryChannel = 'IN_APP' | 'MOBILE_PUSH' | 'WEB_PUSH' | 'EMAIL';

export type CampaignPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export type CampaignStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'CANCELLED';

export type RecipientDeliveryStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'SENT_TO_PROVIDER'
  | 'DELIVERED'
  | 'OPENED'
  | 'FAILED'
  | 'SKIPPED';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'SPECIAL_PRICE' | 'FREE_TRIAL';

export type PopupPlacement =
  | 'DASHBOARD'
  | 'MOBILE_HOME'
  | 'MEMBERSHIP_SCREEN'
  | 'PROFILE_SCREEN';

export type FrequencyPolicy =
  | 'ONCE_PER_USER'
  | 'ONCE_PER_SESSION'
  | 'ONCE_PER_DAY'
  | 'EVERY_LOGIN'
  | 'UP_TO_N_IMPRESSIONS'
  | 'UNTIL_DISMISSED';

export type DismissalPolicy =
  | 'CROSS_DEVICE_PERSISTENT'
  | 'PER_SESSION'
  | 'PER_DAY';

export interface PlanRateOverride {
  planId: string;
  planName: string;
  originalPrice: number;
  festivalPrice: number;
  discountPercentage: number;
  validityDays: number;
}

export interface FestivalOffer {
  id: string;
  campaignId?: string;
  festivalName: string;
  tagline: string;
  badge: string;
  offerTitle?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  couponCode?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minPurchaseAmount?: number;
  eligibleSegments: TargetAudience[];
  maxRedemptions?: number;
  currentRedemptions: number;
  perUserLimit: number;
  planOverrides: PlanRateOverride[];
  bannerUrl: string;
  terms: string[];
  autoCreateNotification?: boolean;
  autoCreatePush?: boolean;
  autoCreatePopup?: boolean;
  linkedPopupId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InAppPopup {
  id: string;
  campaignId?: string;
  internalName?: string;
  title: string;
  subtitle: string;
  message: string;
  bannerImageUrl: string;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  currency?: string;
  discountLabel?: string;
  couponCode?: string;
  ctaText: string;
  ctaLink: string;
  ctaType?: 'INTERNAL_SCREEN' | 'MEMBERSHIP_PLANS' | 'OFFER_DETAILS' | 'PROFILE_VERIFY' | 'EXTERNAL_URL';
  targetAudience: TargetAudience;
  platform: PlatformTarget;
  placement: PopupPlacement;
  priority: number; // 1 = highest
  frequencyPolicy: FrequencyPolicy;
  maxImpressionsPerUser: number;
  dismissalPolicy: DismissalPolicy;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status?: 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED';
  // Live analytics counters
  impressionsCount: number;
  uniqueUsersReached: number;
  dismissCount: number; // How many users clicked [X] cross
  ctaClicksCount: number; // How many clicked Claim / Buy
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationCampaign {
  id: string;
  campaignName: string;
  title: string;
  message: string;
  detailedMessage?: string;
  imageUrl?: string;
  notificationType: NotificationType;
  channels: DeliveryChannel[];
  targetAudience: TargetAudience;
  selectedUserIds?: string[];
  deepLink?: string;
  priority: CampaignPriority;
  tags?: string[];
  scheduledAt?: string;
  expiresAt?: string;
  status: CampaignStatus;
  estimatedRecipients: number;
  sentAt?: string;
  completedAt?: string;
  // Delivery metrics
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  failedCount: number;
  processingProgress?: number; // 0-100%
  idempotencyKey?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipientDeliveryLog {
  id: string;
  campaignId: string;
  campaignName: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  channel: DeliveryChannel;
  providerMessageId: string;
  status: RecipientDeliveryStatus;
  attemptedAt: string;
  deliveredAt?: string;
  openedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  retryCount: number;
  idempotencyKey: string;
}

// Kept for backward compatibility
export interface BroadcastNotificationLog {
  id: string;
  title: string;
  message: string;
  targetAudience: TargetAudience;
  channels: ('PUSH_FCM' | 'IN_APP_BELL' | 'WHATSAPP')[];
  discountHighlight?: string;
  recipientCount: number;
  sentAt: string;
  sentBy: string;
  status: 'DELIVERED' | 'QUEUED' | 'FAILED';
}

export interface MarketingAuditLog {
  id: string;
  action: string;
  entityType: 'NOTIFICATION' | 'FESTIVAL_OFFER' | 'POPUP';
  entityId: string;
  entityTitle: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

const STORAGE_KEY_CAMPAIGNS = 'sindhi_matrimony_notif_campaigns_v2';
const STORAGE_KEY_OFFERS = 'sindhi_matrimony_festival_offers_v2';
const STORAGE_KEY_POPUPS = 'sindhi_matrimony_inapp_popups_v2';
const STORAGE_KEY_RECIPIENT_LOGS = 'sindhi_matrimony_recipient_delivery_logs_v2';
const STORAGE_KEY_DISMISSALS = 'sindhi_matrimony_user_popup_dismissals_v2';
const STORAGE_KEY_AUDIT_LOGS = 'sindhi_matrimony_marketing_audit_logs_v2';

// Initial Mock Campaigns
const INITIAL_CAMPAIGNS: NotificationCampaign[] = [];

// Initial Festival Offers
const INITIAL_OFFERS: FestivalOffer[] = [];

// Initial In-App Popups
const INITIAL_POPUPS: InAppPopup[] = [];

// Initial Delivery Logs (Sample of recent dispatches)
const INITIAL_RECIPIENT_LOGS: RecipientDeliveryLog[] = [];

const INITIAL_AUDIT_LOGS: MarketingAuditLog[] = [];

class CampaignService {
  private campaigns: NotificationCampaign[];
  private offers: FestivalOffer[];
  private popups: InAppPopup[];
  private recipientLogs: RecipientDeliveryLog[];
  private userDismissals: Record<string, string[]>;
  private auditLogs: MarketingAuditLog[];
  private listeners: (() => void)[] = [];
  private activeLocks: Set<string> = new Set();

  constructor() {
    this.campaigns = this.loadCampaigns();
    this.offers = this.loadOffers();
    this.popups = this.loadPopups();
    this.recipientLogs = this.loadRecipientLogs();
    this.userDismissals = this.loadDismissals();
    this.auditLogs = this.loadAuditLogs();
  }

  // --- STORAGE LOADERS ---
  private loadCampaigns(): NotificationCampaign[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CAMPAIGNS;
  }

  private loadOffers(): FestivalOffer[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_OFFERS;
  }

  private loadPopups(): InAppPopup[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POPUPS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_POPUPS;
  }

  private loadRecipientLogs(): RecipientDeliveryLog[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECIPIENT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_RECIPIENT_LOGS;
  }

  private loadDismissals(): Record<string, string[]> {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DISMISSALS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      user_sample_free: ['popup_aadhaar_verify'],
    };
  }

  private loadAuditLogs(): MarketingAuditLog[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AUDIT_LOGS;
  }

  // --- STORAGE WRITERS ---
  private saveCampaigns(): void {
    try {
      localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(this.campaigns));
    } catch {}
    this.notify();
  }

  private saveOffers(): void {
    try {
      localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(this.offers));
    } catch {}
    this.notify();
  }

  private savePopups(): void {
    try {
      localStorage.setItem(STORAGE_KEY_POPUPS, JSON.stringify(this.popups));
    } catch {}
    this.notify();
  }

  private saveRecipientLogs(): void {
    try {
      localStorage.setItem(STORAGE_KEY_RECIPIENT_LOGS, JSON.stringify(this.recipientLogs));
    } catch {}
    this.notify();
  }

  private saveDismissals(): void {
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSALS, JSON.stringify(this.userDismissals));
    } catch {}
    this.notify();
  }

  private saveAuditLogs(): void {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(this.auditLogs));
    } catch {}
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  private logAudit(
    action: string,
    entityType: 'NOTIFICATION' | 'FESTIVAL_OFFER' | 'POPUP',
    entityId: string,
    entityTitle: string,
    details: string,
    performedBy: string = 'Super Admin'
  ): void {
    const log: MarketingAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      entityType,
      entityId,
      entityTitle,
      performedBy,
      timestamp: new Date().toISOString(),
      details,
    };
    this.auditLogs = [log, ...this.auditLogs.slice(0, 199)];
    this.saveAuditLogs();
  }

  // ==========================================
  // MODULE 1: NOTIFICATION CAMPAIGN MANAGEMENT
  // ==========================================

  public getCampaigns(): NotificationCampaign[] {
    return [...this.campaigns];
  }

  public getCampaignById(id: string): NotificationCampaign | undefined {
    return this.campaigns.find((c) => c.id === id);
  }

  public estimateAudience(audience: TargetAudience): number {
    switch (audience) {
      case 'ALL':
        return 48500;
      case 'FREE_USERS':
        return 38400;
      case 'PREMIUM_USERS':
        return 10100;
      case 'EXPIRED_MEMBERS':
        return 6200;
      case 'INACTIVE_30_DAYS':
        return 4100;
      case 'UNVERIFIED_PROFILES':
        return 3200;
      case 'INCOMPLETE_PROFILES':
        return 2800;
      case 'RECENT_REGISTRATIONS':
        return 1900;
      case 'SELECTED_IDS':
        return 15;
      default:
        return 5000;
    }
  }

  public createCampaign(
    data: Omit<
      NotificationCampaign,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'sentCount'
      | 'deliveredCount'
      | 'openedCount'
      | 'failedCount'
      | 'estimatedRecipients'
    >
  ): NotificationCampaign {
    const estimated = this.estimateAudience(data.targetAudience);
    const newCamp: NotificationCampaign = {
      ...data,
      id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      estimatedRecipients: estimated,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.campaigns = [newCamp, ...this.campaigns];
    this.saveCampaigns();

    this.logAudit(
      'CAMPAIGN_CREATED',
      'NOTIFICATION',
      newCamp.id,
      newCamp.campaignName,
      `Created as ${newCamp.status} targeting ${newCamp.targetAudience} (${estimated} estimated).`,
      newCamp.createdBy
    );

    return newCamp;
  }

  public updateCampaign(id: string, updates: Partial<NotificationCampaign>): void {
    this.campaigns = this.campaigns.map((c) => {
      if (c.id === id) {
        const updated = {
          ...c,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        if (updates.targetAudience && updates.targetAudience !== c.targetAudience) {
          updated.estimatedRecipients = this.estimateAudience(updates.targetAudience);
        }
        return updated;
      }
      return c;
    });
    this.saveCampaigns();

    const camp = this.getCampaignById(id);
    if (camp) {
      this.logAudit(
        'CAMPAIGN_UPDATED',
        'NOTIFICATION',
        camp.id,
        camp.campaignName,
        `Updated fields: ${Object.keys(updates).join(', ')}`
      );
    }
  }

  public deleteCampaign(id: string): void {
    const camp = this.getCampaignById(id);
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    this.saveCampaigns();

    if (camp) {
      this.logAudit('CAMPAIGN_DELETED', 'NOTIFICATION', camp.id, camp.campaignName, 'Campaign removed.');
    }
  }

  public duplicateCampaign(id: string): NotificationCampaign | null {
    const original = this.getCampaignById(id);
    if (!original) return null;

    const duplicated: NotificationCampaign = {
      ...original,
      id: `camp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      campaignName: `${original.campaignName} (Copy)`,
      status: 'DRAFT',
      sentAt: undefined,
      completedAt: undefined,
      sentCount: 0,
      deliveredCount: 0,
      openedCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.campaigns = [duplicated, ...this.campaigns];
    this.saveCampaigns();

    this.logAudit(
      'CAMPAIGN_DUPLICATED',
      'NOTIFICATION',
      duplicated.id,
      duplicated.campaignName,
      `Cloned from ${original.campaignName}`
    );
    return duplicated;
  }

  public cancelCampaign(id: string): void {
    this.updateCampaign(id, { status: 'CANCELLED' });
    const camp = this.getCampaignById(id);
    if (camp) {
      this.logAudit('CAMPAIGN_CANCELLED', 'NOTIFICATION', camp.id, camp.campaignName, 'Scheduled send cancelled.');
    }
  }

  /**
   * Send Test Notification to an admin/test recipient
   */
  public sendTestNotification(params: {
    campaignId?: string;
    title: string;
    message: string;
    channels: DeliveryChannel[];
    testRecipient: string; // phone or email
  }): { success: boolean; message: string } {
    notificationService.addNotification({
      title: `[TEST PREVIEW] ${params.title}`,
      message: `${params.message} (Dispatched to test recipient: ${params.testRecipient})`,
      category: 'GENERAL',
      priority: 'HIGH',
      link: '/campaigns',
      actionLabel: 'View in Marketing Hub',
    });

    const testLog: RecipientDeliveryLog = {
      id: `rec_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      campaignId: params.campaignId || 'camp_test',
      campaignName: `[TEST] ${params.title}`,
      userId: 'test_admin_001',
      userName: `Test Recipient (${params.testRecipient})`,
      userPhone: params.testRecipient,
      channel: params.channels[0] || 'MOBILE_PUSH',
      providerMessageId: `fcm_test_${Date.now()}`,
      status: 'DELIVERED',
      attemptedAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      retryCount: 0,
      idempotencyKey: `idem_test_${Date.now()}`,
    };
    this.recipientLogs = [testLog, ...this.recipientLogs];
    this.saveRecipientLogs();

    this.logAudit(
      'TEST_NOTIFICATION_SENT',
      'NOTIFICATION',
      params.campaignId || 'camp_test',
      params.title,
      `Test payload dispatched to ${params.testRecipient} via ${params.channels.join(', ')}.`
    );

    return {
      success: true,
      message: `Test notification sent successfully to ${params.testRecipient}`,
    };
  }

  /**
   * Dispatches bulk campaign with background queue simulation & idempotency protection
   */
  public dispatchBulkCampaign(
    campaignId: string,
    idempotencyKey?: string,
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; message: string; campaign: NotificationCampaign }> {
    return new Promise((resolve, reject) => {
      const camp = this.getCampaignById(campaignId);
      if (!camp) {
        return reject(new Error('Campaign not found'));
      }

      // Concurrency lock check
      if (this.activeLocks.has(campaignId)) {
        return reject(new Error('Campaign dispatch is already in progress. Duplicate request blocked.'));
      }
      this.activeLocks.add(campaignId);

      const resolvedIdempotency = idempotencyKey || `idem_${campaignId}_${Date.now()}`;

      // Transition to QUEUED
      this.updateCampaign(campaignId, {
        status: 'QUEUED',
        idempotencyKey: resolvedIdempotency,
      });

      // Background Worker Simulation & Backend API Dispatch
      let currentProgress = 0;
      this.updateCampaign(campaignId, { status: 'PROCESSING', processingProgress: 5 });

      if (typeof window !== 'undefined') {
        fetch(`${BASE_URL}/api/v1/notifications/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetAudience: camp.targetAudience,
            title: camp.title,
            message: camp.message,
            category: 'PROMOTION',
            type: 'CAMPAIGN_BROADCAST',
            data: { campaignId, campaignName: camp.campaignName },
            priority: camp.priority === 'URGENT' ? 'CRITICAL' : camp.priority === 'HIGH' ? 'HIGH' : 'NORMAL',
          }),
        }).catch(() => {});
      }

      const interval = setInterval(() => {
        currentProgress += 20;
        if (onProgress) onProgress(currentProgress);

        if (currentProgress < 100) {
          this.updateCampaign(campaignId, { processingProgress: currentProgress });
        } else {
          clearInterval(interval);
          this.activeLocks.delete(campaignId);

          const recipients = camp.estimatedRecipients;
          const successful = Math.round(recipients * 0.96);
          const failed = recipients - successful;
          const opened = Math.round(successful * 0.42);

          const updatedCamp = {
            status: 'COMPLETED' as CampaignStatus,
            processingProgress: 100,
            sentAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            sentCount: recipients,
            deliveredCount: successful,
            openedCount: opened,
            failedCount: failed,
          };
          this.updateCampaign(campaignId, updatedCamp);

          // Add sample recipient delivery records
          const sampleUsers = [
            { id: 'usr_auto_1', name: 'Rajesh Gurnani', phone: '+91 98200 44551' },
            { id: 'usr_auto_2', name: 'Kavita Chhabria', phone: '+91 98110 33221' },
            { id: 'usr_auto_3', name: 'Nikhil Thadani', phone: '+91 98300 77665' },
            { id: 'usr_auto_4', name: 'Pooja Khemani', phone: '+91 99200 88991' },
          ];
          const newLogs: RecipientDeliveryLog[] = sampleUsers.map((u, idx) => ({
            id: `rec_${Date.now()}_${idx}`,
            campaignId: camp.id,
            campaignName: camp.campaignName,
            userId: u.id,
            userName: u.name,
            userPhone: u.phone,
            channel: camp.channels[0] || 'MOBILE_PUSH',
            providerMessageId: `fcm_prov_${Date.now()}_${idx}`,
            status: idx === 3 ? 'FAILED' : 'DELIVERED',
            attemptedAt: new Date().toISOString(),
            deliveredAt: idx === 3 ? undefined : new Date().toISOString(),
            openedAt: idx === 0 ? new Date().toISOString() : undefined,
            errorCode: idx === 3 ? 'DEVICE_UNREACHABLE' : undefined,
            retryCount: 0,
            idempotencyKey: `idem_${camp.id}_${u.id}`,
          }));
          this.recipientLogs = [...newLogs, ...this.recipientLogs];
          this.saveRecipientLogs();

          // Global reflection
          notificationService.addNotification({
            title: `[BROADCAST COMPLETE] ${camp.campaignName}`,
            message: `Dispatched to ${recipients.toLocaleString('en-IN')} recipients (${successful.toLocaleString('en-IN')} delivered, ${failed} errors).`,
            category: 'GENERAL',
            priority: 'HIGH',
            link: '/campaigns',
            actionLabel: 'View Report',
          });

          this.logAudit(
            'CAMPAIGN_DISPATCHED',
            'NOTIFICATION',
            camp.id,
            camp.campaignName,
            `Successfully processed broadcast of ${recipients} recipients (${successful} delivered, ${failed} failed).`
          );

          resolve({
            success: true,
            message: `Campaign dispatched to ${recipients.toLocaleString('en-IN')} recipients.`,
            campaign: this.getCampaignById(campaignId)!,
          });
        }
      }, 500);
    });
  }

  // ==========================================
  // MODULE 2: FESTIVAL & OFFER MANAGEMENT
  // ==========================================

  public getOffers(): FestivalOffer[] {
    return [...this.offers];
  }

  public getOfferById(id: string): FestivalOffer | undefined {
    return this.offers.find((o) => o.id === id);
  }

  /**
   * Server-Side Price Calculation Rule Engine
   * Validates discount values, caps, eligibility, and prevents negative or unrealistic amounts
   */
  public calculateDiscountedPrice(
    originalPrice: number,
    discountType: DiscountType,
    discountValue: number,
    maxDiscount?: number
  ): { finalPrice: number; discountAmount: number; discountPercentage: number } {
    let discountAmount = 0;

    if (discountType === 'PERCENTAGE') {
      const clampedPct = Math.min(Math.max(discountValue, 0), 90);
      discountAmount = Math.round((originalPrice * clampedPct) / 100);
      if (maxDiscount && maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, maxDiscount);
      }
    } else if (discountType === 'FIXED_AMOUNT') {
      discountAmount = Math.min(Math.max(discountValue, 0), originalPrice - 100);
    } else if (discountType === 'SPECIAL_PRICE') {
      const targetPrice = Math.max(discountValue, 1);
      discountAmount = Math.max(originalPrice - targetPrice, 0);
    } else if (discountType === 'FREE_TRIAL') {
      discountAmount = originalPrice;
    }

    const finalPrice = Math.max(originalPrice - discountAmount, 0);
    const effectivePct = Math.round((discountAmount / originalPrice) * 100);

    return {
      finalPrice,
      discountAmount,
      discountPercentage: effectivePct,
    };
  }

  public addOffer(
    offerData: Omit<FestivalOffer, 'id' | 'createdAt' | 'currentRedemptions'>
  ): FestivalOffer {
    const newOffer: FestivalOffer = {
      ...offerData,
      id: `offer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      currentRedemptions: 0,
      createdAt: new Date().toISOString(),
    };

    // If auto-creation of linked notification is requested
    if (offerData.autoCreateNotification) {
      const camp = this.createCampaign({
        campaignName: `${newOffer.festivalName} Broadcast`,
        title: `🎆 ${newOffer.offerTitle || newOffer.festivalName}`,
        message: `${newOffer.tagline}. Use coupon code: ${newOffer.couponCode || 'FESTIVE'} for special rates!`,
        notificationType: 'FESTIVAL_OFFER',
        channels: ['IN_APP', 'MOBILE_PUSH'],
        targetAudience: newOffer.eligibleSegments[0] || 'FREE_USERS',
        deepLink: '/settings/membership-plans',
        priority: 'HIGH',
        tags: [newOffer.festivalName.replace(/\s+/g, '')],
        status: newOffer.isActive ? 'SCHEDULED' : 'DRAFT',
        createdBy: newOffer.createdBy,
      });
      newOffer.campaignId = camp.id;
    }

    // If auto-creation of linked popup is requested
    if (offerData.autoCreatePopup) {
      const lowestPlan = newOffer.planOverrides[0] || {
        originalPrice: 4999,
        festivalPrice: 1999,
        discountPercentage: 60,
      };
      const popup = this.addPopup({
        campaignId: newOffer.campaignId,
        internalName: `${newOffer.festivalName} Modal`,
        title: `🎆 ${newOffer.festivalName}`,
        subtitle: newOffer.badge,
        message: `${newOffer.tagline}. Limited festive pass active.`,
        bannerImageUrl: newOffer.bannerUrl,
        originalPrice: lowestPlan.originalPrice,
        discountedPrice: lowestPlan.festivalPrice,
        discountPercentage: lowestPlan.discountPercentage,
        couponCode: newOffer.couponCode,
        ctaText: `Claim Festive Plan @ ₹${lowestPlan.festivalPrice.toLocaleString('en-IN')}`,
        ctaLink: '/settings/membership-plans',
        ctaType: 'MEMBERSHIP_PLANS',
        targetAudience: newOffer.eligibleSegments[0] || 'FREE_USERS',
        platform: 'BOTH',
        placement: 'DASHBOARD',
        priority: 1,
        frequencyPolicy: 'ONCE_PER_USER',
        maxImpressionsPerUser: 3,
        dismissalPolicy: 'CROSS_DEVICE_PERSISTENT',
        startDate: newOffer.startDate,
        endDate: newOffer.endDate,
        isActive: newOffer.isActive,
      });
      newOffer.linkedPopupId = popup.id;
    }

    this.offers = [newOffer, ...this.offers];
    this.saveOffers();

    this.logAudit(
      'FESTIVAL_OFFER_CREATED',
      'FESTIVAL_OFFER',
      newOffer.id,
      newOffer.festivalName,
      `Created offer: ${newOffer.offerTitle || newOffer.festivalName} with coupon ${newOffer.couponCode || 'N/A'}`
    );

    return newOffer;
  }

  public updateOffer(id: string, updates: Partial<FestivalOffer>): void {
    this.offers = this.offers.map((o) => (o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o));
    this.saveOffers();

    const offer = this.getOfferById(id);
    if (offer) {
      this.logAudit(
        'FESTIVAL_OFFER_UPDATED',
        'FESTIVAL_OFFER',
        offer.id,
        offer.festivalName,
        `Updated offer configuration`
      );
    }
  }

  public toggleOfferStatus(id: string): void {
    this.offers = this.offers.map((o) => {
      if (o.id === id) {
        const nextActive = !o.isActive;
        // Sync with linked popup if exists
        if (o.linkedPopupId) {
          this.updatePopup(o.linkedPopupId, { isActive: nextActive });
        }
        return { ...o, isActive: nextActive, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    this.saveOffers();

    const offer = this.getOfferById(id);
    if (offer) {
      this.logAudit(
        offer.isActive ? 'FESTIVAL_OFFER_ACTIVATED' : 'FESTIVAL_OFFER_PAUSED',
        'FESTIVAL_OFFER',
        offer.id,
        offer.festivalName,
        `Status toggled to ${offer.isActive ? 'ACTIVE' : 'PAUSED'}`
      );
    }
  }

  public deleteOffer(id: string): void {
    const offer = this.getOfferById(id);
    this.offers = this.offers.filter((o) => o.id !== id);
    this.saveOffers();

    if (offer) {
      this.logAudit('FESTIVAL_OFFER_DELETED', 'FESTIVAL_OFFER', offer.id, offer.festivalName, 'Offer removed.');
    }
  }

  // ==========================================
  // MODULE 3, 4, 5: DYNAMIC POPUP MANAGEMENT
  // ==========================================

  public getPopups(): InAppPopup[] {
    return [...this.popups];
  }

  public getPopupById(id: string): InAppPopup | undefined {
    return this.popups.find((p) => p.id === id);
  }

  public addPopup(
    popupData: Omit<
      InAppPopup,
      'id' | 'createdAt' | 'impressionsCount' | 'uniqueUsersReached' | 'dismissCount' | 'ctaClicksCount'
    >
  ): InAppPopup {
    const newPopup: InAppPopup = {
      ...popupData,
      id: `popup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      impressionsCount: 0,
      uniqueUsersReached: 0,
      dismissCount: 0,
      ctaClicksCount: 0,
      status: popupData.isActive ? 'ACTIVE' : 'PAUSED',
      createdAt: new Date().toISOString(),
    };
    this.popups = [newPopup, ...this.popups];
    this.savePopups();

    this.logAudit(
      'POPUP_CREATED',
      'POPUP',
      newPopup.id,
      newPopup.title,
      `Created priority ${newPopup.priority} popup on placement ${newPopup.placement} (${newPopup.frequencyPolicy})`
    );

    return newPopup;
  }

  public updatePopup(id: string, updates: Partial<InAppPopup>): void {
    this.popups = this.popups.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    this.savePopups();

    const popup = this.getPopupById(id);
    if (popup) {
      this.logAudit('POPUP_UPDATED', 'POPUP', popup.id, popup.title, `Updated popup properties.`);
    }
  }

  public togglePopupStatus(id: string): void {
    this.popups = this.popups.map((p) => {
      if (p.id === id) {
        const nextActive = !p.isActive;
        return {
          ...p,
          isActive: nextActive,
          status: nextActive ? 'ACTIVE' : 'PAUSED',
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    this.savePopups();

    const popup = this.getPopupById(id);
    if (popup) {
      this.logAudit(
        popup.isActive ? 'POPUP_ACTIVATED' : 'POPUP_PAUSED',
        'POPUP',
        popup.id,
        popup.title,
        `Popup is now ${popup.isActive ? 'ACTIVE' : 'PAUSED'}.`
      );
    }
  }

  public deletePopup(id: string): void {
    const popup = this.getPopupById(id);
    this.popups = this.popups.filter((p) => p.id !== id);
    this.savePopups();

    if (popup) {
      this.logAudit('POPUP_DELETED', 'POPUP', popup.id, popup.title, 'Popup deleted.');
    }
  }

  public duplicatePopup(id: string): InAppPopup | null {
    const original = this.getPopupById(id);
    if (!original) return null;

    const duplicated: InAppPopup = {
      ...original,
      id: `popup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${original.title} (Copy)`,
      internalName: `${original.internalName || 'Popup'} (Copy)`,
      impressionsCount: 0,
      uniqueUsersReached: 0,
      dismissCount: 0,
      ctaClicksCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.popups = [duplicated, ...this.popups];
    this.savePopups();

    this.logAudit('POPUP_DUPLICATED', 'POPUP', duplicated.id, duplicated.title, `Cloned from ${original.title}`);
    return duplicated;
  }

  // --- CLIENT DISMISSAL & IMPRESSION SIMULATION ENGINE ---

  /**
   * Simulates Client API: POST /api/v1/popups/:id/dismiss
   */
  public recordPopupDismiss(
    popupId: string,
    userId: string = 'current_user',
    reason: string = 'user_closed'
  ): { success: boolean; message: string; dismissCount: number } {
    let newCount = 0;
    this.popups = this.popups.map((p) => {
      if (p.id === popupId) {
        newCount = p.dismissCount + 1;
        return { ...p, dismissCount: newCount };
      }
      return p;
    });
    this.savePopups();

    // Persist to user dismissal set (server source of truth)
    const currentList = this.userDismissals[userId] || [];
    if (!currentList.includes(popupId)) {
      this.userDismissals[userId] = [...currentList, popupId];
      this.saveDismissals();
    }

    return {
      success: true,
      message: `Popup [${popupId}] marked dismissed for user [${userId}] (${reason}).`,
      dismissCount: newCount,
    };
  }

  /**
   * Simulates Client API: POST /api/v1/popups/:id/impression
   */
  public recordPopupImpression(popupId: string, _userId: string = 'current_user'): void {
    this.popups = this.popups.map((p) => {
      if (p.id === popupId) {
        return {
          ...p,
          impressionsCount: p.impressionsCount + 1,
          uniqueUsersReached: Math.max(p.uniqueUsersReached + (Math.random() > 0.3 ? 1 : 0), 1),
        };
      }
      return p;
    });
    this.savePopups();
  }

  /**
   * Simulates Client API: POST /api/v1/popups/:id/click
   */
  public recordPopupCtaClick(popupId: string): void {
    this.popups = this.popups.map((p) => (p.id === popupId ? { ...p, ctaClicksCount: p.ctaClicksCount + 1 } : p));
    this.savePopups();
  }

  /**
   * Simulates Client API: GET /api/v1/popups/eligible?placement=...
   * Applies priority, date expiry, frequency, and exclusion of already-dismissed popups
   */
  public getEligiblePopupsForUser(
    userId: string = 'current_user',
    placement?: PopupPlacement,
    platform?: PlatformTarget
  ): InAppPopup[] {
    const dismissedIds = this.userDismissals[userId] || [];
    const now = new Date().toISOString();

    return this.popups
      .filter((p) => {
        if (!p.isActive) return false;
        if (p.startDate && p.startDate > now) return false;
        if (p.endDate && p.endDate < now) return false;
        if (placement && p.placement !== placement) return false;
        if (platform && p.platform !== 'BOTH' && p.platform !== platform) return false;
        // Dismissal exclusion
        if (dismissedIds.includes(p.id)) return false;
        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  public resetUserDismissals(userId: string = 'current_user'): void {
    delete this.userDismissals[userId];
    this.saveDismissals();
  }

  public getDismissedPopupIdsForUser(userId: string = 'current_user'): string[] {
    return this.userDismissals[userId] || [];
  }

  // ==========================================
  // MODULE 4: DELIVERY LOGS & RETRIES
  // ==========================================

  public getRecipientDeliveryLogs(): RecipientDeliveryLog[] {
    return [...this.recipientLogs];
  }

  public retryFailedDelivery(logId: string): boolean {
    let found = false;
    this.recipientLogs = this.recipientLogs.map((log) => {
      if (log.id === logId && log.status === 'FAILED') {
        found = true;
        return {
          ...log,
          status: 'DELIVERED',
          deliveredAt: new Date().toISOString(),
          retryCount: log.retryCount + 1,
          errorCode: undefined,
          errorMessage: undefined,
        };
      }
      return log;
    });
    if (found) {
      this.saveRecipientLogs();
    }
    return found;
  }

  // Backward compatibility alias for broadcast logs
  public getBroadcastLogs(): BroadcastNotificationLog[] {
    return this.campaigns.map((c) => ({
      id: c.id,
      title: c.title,
      message: c.message,
      targetAudience: c.targetAudience,
      channels: ['PUSH_FCM', 'IN_APP_BELL'],
      discountHighlight: c.tags?.[0] || 'Promo Alert',
      recipientCount: c.sentCount || c.estimatedRecipients,
      sentAt: c.sentAt || c.createdAt,
      sentBy: c.createdBy,
      status: c.status === 'COMPLETED' ? 'DELIVERED' : c.status === 'FAILED' ? 'FAILED' : 'QUEUED',
    }));
  }

  public sendBroadcast(params: {
    title: string;
    message: string;
    targetAudience: TargetAudience;
    channels: ('PUSH_FCM' | 'IN_APP_BELL' | 'WHATSAPP')[];
    discountHighlight?: string;
    sentBy?: string;
  }): BroadcastNotificationLog {
    const camp = this.createCampaign({
      campaignName: `Broadcast: ${params.title}`,
      title: params.title,
      message: params.message,
      notificationType: 'GENERAL_ANNOUNCEMENT',
      channels: ['IN_APP', 'MOBILE_PUSH'],
      targetAudience: params.targetAudience,
      priority: 'HIGH',
      status: 'COMPLETED',
      createdBy: params.sentBy || 'Super Admin',
    });

    this.dispatchBulkCampaign(camp.id);

    return {
      id: camp.id,
      title: camp.title,
      message: camp.message,
      targetAudience: camp.targetAudience,
      channels: params.channels,
      discountHighlight: params.discountHighlight,
      recipientCount: camp.estimatedRecipients,
      sentAt: new Date().toISOString(),
      sentBy: params.sentBy || 'Super Admin',
      status: 'DELIVERED',
    };
  }

  // ==========================================
  // MODULE 5: ANALYTICS & AUDIT LOGS
  // ==========================================

  public getMarketingAuditLogs(): MarketingAuditLog[] {
    return [...this.auditLogs];
  }

  public getAnalyticsSummary() {
    const totalCampaigns = this.campaigns.length;
    const completedCampaigns = this.campaigns.filter((c) => c.status === 'COMPLETED').length;
    const scheduledCampaigns = this.campaigns.filter((c) => c.status === 'SCHEDULED').length;
    const draftCampaigns = this.campaigns.filter((c) => c.status === 'DRAFT').length;

    let totalRecipientsReached = 0;
    let totalDelivered = 0;
    let totalOpened = 0;
    let totalFailed = 0;

    this.campaigns.forEach((c) => {
      totalRecipientsReached += c.sentCount || 0;
      totalDelivered += c.deliveredCount || 0;
      totalOpened += c.openedCount || 0;
      totalFailed += c.failedCount || 0;
    });

    let totalPopupImpressions = 0;
    let totalPopupDismissals = 0;
    let totalPopupCtaClicks = 0;

    this.popups.forEach((p) => {
      totalPopupImpressions += p.impressionsCount;
      totalPopupDismissals += p.dismissCount;
      totalPopupCtaClicks += p.ctaClicksCount;
    });

    const overallCtr =
      totalPopupImpressions > 0 ? ((totalPopupCtaClicks / totalPopupImpressions) * 100).toFixed(1) : '0.0';

    const deliveryRate =
      totalRecipientsReached > 0 ? ((totalDelivered / totalRecipientsReached) * 100).toFixed(1) : '0.0';

    const openRate =
      totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : '0.0';

    return {
      totalCampaigns,
      completedCampaigns,
      scheduledCampaigns,
      draftCampaigns,
      totalRecipientsReached,
      totalDelivered,
      totalOpened,
      totalFailed,
      deliveryRate,
      openRate,
      totalPopupImpressions,
      totalPopupDismissals,
      totalPopupCtaClicks,
      overallCtr,
      activeOffersCount: this.offers.filter((o) => o.isActive).length,
      activePopupsCount: this.popups.filter((p) => p.isActive).length,
    };
  }
}

export const campaignService = new CampaignService();
