// =============================================================================
// CENTRALIZED QUERY KEYS (Equivalent to Redux slices state keys)
// =============================================================================

export const QUERY_KEYS = {
  // 1. Profile & Account
  profile: ['profile', 'me'] as const,
  userProfile: (userId: string) => ['profile', 'user', userId] as const,
  myProfiles: ['profile', 'my-profiles'] as const,

  // 2. Dashboard & Home Feeds
  dashboard: ['dashboard', 'home'] as const,
  dailyRecommendations: ['dashboard', 'recommendations'] as const,
  successStories: ['dashboard', 'success-stories'] as const,
  banners: ['dashboard', 'banners'] as const,

  // 3. Matches & Discover (Paginated Feeds)
  allMatches: (filters: Record<string, any> = {}) => ['matches', 'all', filters] as const,
  recommendedMatches: (filters: Record<string, any> = {}) => ['matches', 'recommended', filters] as const,
  newMatches: ['matches', 'new'] as const,
  whoViewedYou: ['matches', 'who-viewed-you'] as const,
  profilesYouViewed: ['matches', 'profiles-you-viewed'] as const,
  shortlist: ['matches', 'shortlist'] as const,
  mutualMatches: ['matches', 'mutual'] as const,
  searchMembers: (params: Record<string, any> = {}) => ['matches', 'search', params] as const,

  // 4. Interests & Requests
  interestsReceived: ['interests', 'received'] as const,
  interestsSent: ['interests', 'sent'] as const,
  interestsBadgeCount: ['interests', 'badge-count'] as const,

  // 5. Chat & Messaging
  conversations: ['chat', 'conversations'] as const,
  messages: (conversationId: string) => ['chat', 'messages', conversationId] as const,

  // 6. Notifications
  notifications: ['notifications', 'list'] as const,
  unreadNotificationsCount: ['notifications', 'unread-count'] as const,

  // 7. Master Data & Locations
  masterDropdowns: ['master', 'dropdowns'] as const,
  countries: ['master', 'countries'] as const,
  cities: (countryId?: string) => ['master', 'cities', countryId] as const,

  // 8. Membership & Plans
  plans: ['plans', 'all'] as const,
};

export default QUERY_KEYS;
