import { Platform } from 'react-native';

// =============================================================================
// 💍 SINDHI MATRIMONY MOBILE APP - API CONFIGURATION & REAL ENDPOINTS
// =============================================================================

// Base URL Configuration:
// - iOS Simulator: 'http://localhost:5001'
// - Android Emulator: 'http://10.0.2.2:5001'
// - Physical Device (Wi-Fi): 'http://192.168.29.126:5001' (Change to your local machine IP if needed)
// - Production Server: 'https://api.sindhimatrimony.co.in'
const getDevBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001';
  }
  return 'http://localhost:5001';
};

export const BASE_URL = __DEV__
  ? getDevBaseUrl()
  : 'https://api.sindhimatrimony.co.in';

// Socket.io Real-time Gateway
export const SOCKET_URL = `${BASE_URL}/socket`;

// Candidate Public Shareable URL
export const SHARE_URL = 'https://sindhimatrimony.co.in/profile/';

export const ApiURL = {
  // =========================================================================
  // 1. SYSTEM & GATEWAY HEALTH
  // =========================================================================
  health: `${BASE_URL}/api/v1/health`,

  // =========================================================================
  // 2. AUTHENTICATION & ONBOARDING
  // =========================================================================
  login: `${BASE_URL}/api/v1/auth/login`,
  authLogin: `${BASE_URL}/api/v1/auth/login`,
  sendOtp: `${BASE_URL}/api/v1/auth/send-otp`,
  authSendOtp: `${BASE_URL}/api/v1/auth/send-otp`,
  verifyOtp: `${BASE_URL}/api/v1/auth/verify-otp`,
  authVerifyOtp: `${BASE_URL}/api/v1/auth/verify-otp`,
  resendOtp: `${BASE_URL}/api/v1/auth/resend-otp`,
  authResendOtp: `${BASE_URL}/api/v1/auth/resend-otp`,
  register: `${BASE_URL}/api/v1/auth/register`,
  authRegister: `${BASE_URL}/api/v1/auth/register`,
  userRegisterSteps: `${BASE_URL}/api/v1/auth/register`,
  forgotPassword: `${BASE_URL}/api/v1/auth/forgot-password`,
  sendOtpForForgotPassword: `${BASE_URL}/api/v1/auth/forgot-password`,
  authForgotPasswordSendOtp: `${BASE_URL}/api/v1/auth/forgot-password`,
  resetPassword: `${BASE_URL}/api/v1/auth/reset-password`,
  changeForgotPassword: `${BASE_URL}/api/v1/auth/reset-password`,
  verifyForgotPasswordOtp: `${BASE_URL}/api/v1/auth/verify-otp`,
  authForgotPasswordReset: `${BASE_URL}/api/v1/auth/reset-password`,
  checkPhone: `${BASE_URL}/api/v1/auth/check-phone`,
  logout: `${BASE_URL}/api/v1/auth/logout`,
  authLogout: `${BASE_URL}/api/v1/auth/logout`,
  refreshToken: `${BASE_URL}/api/v1/auth/refresh-token`,
  authRefreshToken: `${BASE_URL}/api/v1/auth/refresh-token`,

  // =========================================================================
  // 3. MULTI-PROFILE & FAMILY DELEGATION
  // =========================================================================
  myProfiles: `${BASE_URL}/api/v1/auth/my-profiles`,
  createSecondaryProfile: `${BASE_URL}/api/v1/auth/profiles`,
  switchProfile: `${BASE_URL}/api/v1/auth/switch-profile`,

  // =========================================================================
  // 4. CANDIDATE PROFILE MANAGEMENT
  // =========================================================================
  getProfile: `${BASE_URL}/api/v1/profile/getProfile`,
  getUserProfile: `${BASE_URL}/api/v1/profile/getProfile`,
  getProfileMe: `${BASE_URL}/api/v1/profile/me`,
  editProfile: `${BASE_URL}/api/v1/profile/editProfile`,
  updateProfile: `${BASE_URL}/api/v1/profile/editProfile`,
  updateUserProfile: `${BASE_URL}/api/v1/profile/editProfile`,
  updateProfileBasic: `${BASE_URL}/api/v1/profile/basic`,
  updateProfileEducationCareer: `${BASE_URL}/api/v1/profile/education-career`,
  updateProfileFamily: `${BASE_URL}/api/v1/profile/family`,
  updateProfileHoroscope: `${BASE_URL}/api/v1/profile/horoscope`,
  updatePartnerPreferences: `${BASE_URL}/api/v1/profile/partner-preferences`,
  saveOnboardingStep: `${BASE_URL}/api/v1/profile/onboarding/step`,
  uploadProfilePhoto: `${BASE_URL}/api/v1/profile/photos`,
  upload: `${BASE_URL}/api/v1/profile/photos`,
  fileUploaderUpload: `${BASE_URL}/api/v1/profile/photos`,
  deleteProfilePhoto: (photoId: string) => `${BASE_URL}/api/v1/profile/photos/${photoId}`,
  contactCredits: `${BASE_URL}/api/v1/profile/contact-credits`,

  // =========================================================================
  // 5. CANDIDATE DASHBOARD, FEEDS & HOROSCOPE (Mobile HomeScreen)
  // =========================================================================
  dashboard: `${BASE_URL}/api/v1/dashboard`,
  homeFeed: `${BASE_URL}/api/v1/feed/home`,
  mobileHomeFeed: `${BASE_URL}/api/v1/dashboard/mobile-home`,
  dailyRecommendations: `${BASE_URL}/api/v1/dashboard/daily-recommendations`,
  allMatchesFeed: `${BASE_URL}/api/v1/dashboard/all-matches`,
  dashboardMatches: `${BASE_URL}/api/v1/dashboard/matches`,
  matchesRecommendations: `${BASE_URL}/api/v1/matches/recommendations`,
  recommendedMatches: `${BASE_URL}/api/v1/matches/recommendations`,
  newMatchesFeed: `${BASE_URL}/api/v1/dashboard/new-matches`,
  whoViewedYouFeed: `${BASE_URL}/api/v1/dashboard/who-viewed-you`,
  profilesYouViewedFeed: `${BASE_URL}/api/v1/dashboard/profiles-you-viewed`,
  trackProfileView: `${BASE_URL}/api/v1/dashboard/profile-views/track`,
  successStoriesFeed: `${BASE_URL}/api/v1/dashboard/success-stories`,
  homeBanners: `${BASE_URL}/api/v1/dashboard/banners`,
  saveBanner: `${BASE_URL}/api/v1/dashboard/banners`,
  supportInfo: `${BASE_URL}/api/v1/dashboard/support-info`,
  dashboardHoroscope: `${BASE_URL}/api/v1/dashboard/horoscope`,
  dailyHoroscope: `${BASE_URL}/api/v1/dashboard/horoscope`,
  saveRashi: `${BASE_URL}/api/v1/dashboard/horoscope/save-rashi`,


  // =========================================================================
  // 6. MASTER DATA & DROPDOWNS
  // =========================================================================
  masterDropdowns: `${BASE_URL}/api/v1/master/dropdowns`,
  commonDropdowns: `${BASE_URL}/api/v1/master/dropdowns`,
  bootstrapConfig: `${BASE_URL}/api/v1/master/bootstrap`,
  subcastes: `${BASE_URL}/api/v1/master/subcastes`,
  gotras: `${BASE_URL}/api/v1/master/gotras`,
  surnameLookup: `${BASE_URL}/api/v1/master/surnames/lookup`,
  occupations: `${BASE_URL}/api/v1/master/occupations`,
  countries: `${BASE_URL}/api/v1/master/locations/countries`,
  cities: `${BASE_URL}/api/v1/master/locations/cities`,
  getCountriesListForMobile: `${BASE_URL}/api/v1/master/locations/countries`,
  horoscopeOptions: `${BASE_URL}/api/v1/master/horoscope`,

  // =========================================================================
  // 7. SEARCH, DISCOVERY & MATCHMAKING
  // =========================================================================
  searchMembers: `${BASE_URL}/api/v1/matchmaking/search`,
  matchmakingFeed: `${BASE_URL}/api/v1/matchmaking/feed`,
  quickSearch: `${BASE_URL}/api/v1/matchmaking/quick-search`,
  viewedMyProfile: `${BASE_URL}/api/v1/matchmaking/viewed-my-profile`,
  shortlistCandidate: (candidateId: string) => `${BASE_URL}/api/v1/matchmaking/shortlist/${candidateId}`,
  getShortlist: `${BASE_URL}/api/v1/matchmaking/shortlist`,
  mutualMatches: `${BASE_URL}/api/v1/matchmaking/mutual-matches`,
  viewContact: (candidateId: string) => `${BASE_URL}/api/v1/members/view-contact/${candidateId}`,

  // =========================================================================
  // 8. CONNECT REQUESTS & INTERESTS
  // =========================================================================
  interestsSend: `${BASE_URL}/api/v1/matchmaking/interests/send`,
  interestsReceived: `${BASE_URL}/api/v1/matchmaking/interests/received`,
  interestsSent: `${BASE_URL}/api/v1/matchmaking/interests/sent`,
  interestsAccept: (interestId: string) => `${BASE_URL}/api/v1/matchmaking/interests/${interestId}/accept`,
  interestsDecline: (interestId: string) => `${BASE_URL}/api/v1/matchmaking/interests/${interestId}/decline`,
  interestsRemind: (interestId: string) => `${BASE_URL}/api/v1/matchmaking/interests/${interestId}/remind`,
  interestsCancel: (interestId: string) => `${BASE_URL}/api/v1/matchmaking/interests/${interestId}/cancel`,
  interestsBadgeCount: `${BASE_URL}/api/v1/matchmaking/interests/badge-count`,

  // =========================================================================
  // 9. REAL-TIME CHAT & MESSAGING
  // =========================================================================
  chatConversations: `${BASE_URL}/api/v1/chat/conversations`,
  getConversationList: `${BASE_URL}/api/v1/chat/conversations`,
  chatMessages: (conversationId: string) => `${BASE_URL}/api/v1/chat/messages/${conversationId}`,
  getConversationChatList: (conversationId: string) => `${BASE_URL}/api/v1/chat/messages/${conversationId}`,
  chatSendMessage: `${BASE_URL}/api/v1/chat/messages/send`,
  chatMarkAsRead: `${BASE_URL}/api/v1/chat/messages/read`,
  chatClearConversation: (conversationId: string) => `${BASE_URL}/api/v1/chat/conversations/${conversationId}/clear`,

  // =========================================================================
  // 10. KUNDLI & HOROSCOPE MATCHING
  // =========================================================================
  gunaMilan: `${BASE_URL}/api/v1/horoscope/guna-milan`,
  kundliChart: (candidateId: string) => `${BASE_URL}/api/v1/horoscope/chart/${candidateId}`,

  // =========================================================================
  // 11. TRUST, SAFETY & VERIFICATIONS
  // =========================================================================
  uploadIdProof: `${BASE_URL}/api/v1/verifications/id-proof`,
  kycSelfieVerify: `${BASE_URL}/api/v1/verifications/selfie`,
  kycAadhaarVerify: `${BASE_URL}/api/v1/verifications/aadhaar`,
  kycStatus: `${BASE_URL}/api/v1/verifications/status`,
  reportProfile: `${BASE_URL}/api/v1/safety/report`,
  report: `${BASE_URL}/api/v1/safety/report`,
  blockUser: `${BASE_URL}/api/v1/safety/block`,
  blockedUsersList: `${BASE_URL}/api/v1/safety/blocked-list`,
  blockedUsers: `${BASE_URL}/api/v1/safety/blocked-list`,

  // =========================================================================
  // 12. MEMBERSHIP PLANS & PAYMENTS
  // =========================================================================
  getPlans: `${BASE_URL}/api/v1/plans`,
  createPaymentOrder: `${BASE_URL}/api/v1/payments/create-order`,
  verifyPaymentSignature: `${BASE_URL}/api/v1/payments/verify`,

  // =========================================================================
  // 13. IN-APP NOTIFICATIONS & FCM ALERTS
  // =========================================================================
  getNotificationsList: `${BASE_URL}/api/v1/notifications`,
  unreadNotificationsCount: `${BASE_URL}/api/v1/notifications/unread-count`,
  markNotificationAsRead: (notificationId: string) => `${BASE_URL}/api/v1/notifications/${notificationId}/read`,
  markAllNotificationsAsRead: `${BASE_URL}/api/v1/notifications/mark-all-read`,
  deleteNotificationItem: (notificationId: string) => `${BASE_URL}/api/v1/notifications/${notificationId}`,
  updateFcmDeviceToken: `${BASE_URL}/api/v1/notifications/fcm-token`,

  // =========================================================================
  // 14. SUPPORT & HELP CENTER
  // =========================================================================
  supportConfig: `${BASE_URL}/api/v1/support/config`,
  createSupportTicket: `${BASE_URL}/api/v1/support/tickets`,

  // =========================================================================
  // 15. SETTINGS, PRIVACY & ACCOUNT MANAGEMENT
  // =========================================================================
  updatePrivacySettings: `${BASE_URL}/api/v1/settings/privacy`,
  updatePrivacySetting: `${BASE_URL}/api/v1/settings/privacy`,
  updateNotificationPreferences: `${BASE_URL}/api/v1/settings/notifications`,
  updateNotificationSetting: `${BASE_URL}/api/v1/settings/notifications`,
  deleteUserAccount: `${BASE_URL}/api/v1/account/delete`,
  deleteAccount: `${BASE_URL}/api/v1/account/delete`,

  // =========================================================================
  // 16. WATERMELONDB DELTA SYNC ENGINE (Mobile Offline-First)
  // =========================================================================
  syncPullDelta: `${BASE_URL}/api/v1/sync/pull`,
  syncPushDelta: `${BASE_URL}/api/v1/sync/push`,
  syncMasterVersion: `${BASE_URL}/api/v1/sync/version`,

  // =========================================================================
  // 17. DEV PROFILER & TELEMETRY
  // =========================================================================
  devDashboard: `${BASE_URL}/api/v1/dev/dashboard`,
};
