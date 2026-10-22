// =============================================================================
// CENTRALIZED QUERY KEYS (Equivalent to Redux slices state keys)
// Mirroring User Panel & Mobile + Admin Management Keys
// =============================================================================

export const QUERY_KEYS = {
  // 1. Profile & Account (Exact same keys as User Panel & Mobile)
  profile: ['profile', 'me'] as const,
  userProfile: (userId: string) => ['profile', 'user', userId] as const,
  myProfiles: ['profile', 'my-profiles'] as const,

  // 2. Dashboard & Home Feeds (Exact same keys as User Panel & Mobile)
  dashboard: ['dashboard', 'home'] as const,
  dailyRecommendations: ['dashboard', 'recommendations'] as const,
  successStories: ['dashboard', 'success-stories'] as const,
  banners: ['dashboard', 'banners'] as const,

  // 3. Matches & Discover (Exact same keys as User Panel & Mobile)
  allMatches: (filters: Record<string, any> = {}) => ['matches', 'all', filters] as const,
  recommendedMatches: (filters: Record<string, any> = {}) => ['matches', 'recommended', filters] as const,
  newMatches: ['matches', 'new'] as const,
  whoViewedYou: ['matches', 'who-viewed-you'] as const,
  profilesYouViewed: ['matches', 'profiles-you-viewed'] as const,
  shortlist: ['matches', 'shortlist'] as const,
  mutualMatches: ['matches', 'mutual'] as const,
  searchMembers: (params: Record<string, any> = {}) => ['matches', 'search', params] as const,

  // 4. Interests & Requests (Exact same keys as User Panel & Mobile)
  interestsReceived: ['interests', 'received'] as const,
  interestsSent: ['interests', 'sent'] as const,
  interestsBadgeCount: ['interests', 'badge-count'] as const,

  // 5. Chat & Messaging (Exact same keys as User Panel & Mobile)
  conversations: ['chat', 'conversations'] as const,
  messages: (conversationId: string) => ['chat', 'messages', conversationId] as const,

  // 6. Notifications (Exact same keys as User Panel & Mobile)
  notifications: ['notifications', 'list'] as const,
  unreadNotificationsCount: ['notifications', 'unread-count'] as const,

  // 7. Master Data & Locations (Exact same keys as User Panel & Mobile)
  masterDropdowns: ['master', 'dropdowns'] as const,
  countries: ['master', 'countries'] as const,
  cities: (countryId?: string) => ['master', 'cities', countryId] as const,

  // 8. Membership & Plans (Exact same keys as User Panel & Mobile)
  plans: ['plans', 'all'] as const,

  // =========================================================================
  // 9. ADMIN SPECIFIC QUERY KEYS
  // =========================================================================
  dashboardStats: ['admin', 'dashboard', 'stats'] as const,
  dashboardActionQueues: ['admin', 'dashboard', 'action-queues'] as const,
  dashboardChartsOverview: ['admin', 'dashboard', 'charts-overview'] as const,
  dashboardCharts: (type: string) => ['admin', 'dashboard', 'charts', type] as const,
  leads: (filters: Record<string, any> = {}) => ['admin', 'leads', filters] as const,
  leadDetail: (id: string) => ['admin', 'leads', id] as const,
  members: (filters: Record<string, any> = {}) => ['admin', 'members', filters] as const,
  memberDetail: (id: string) => ['admin', 'members', id] as const,
  pendingVerifications: ['admin', 'verifications', 'pending'] as const,
  financeSummary: ['admin', 'finance', 'summary'] as const,
  transactions: (filters: Record<string, any> = {}) => ['admin', 'finance', 'transactions', filters] as const,
  pendingRefunds: ['admin', 'finance', 'refunds', 'pending'] as const,
  subscriptions: (filters: Record<string, any> = {}) => ['admin', 'subscriptions', filters] as const,
  campaigns: ['admin', 'campaigns'] as const,
  employees: (filters: Record<string, any> = {}) => ['admin', 'employees', filters] as const,
  employeeDetail: (id: string) => ['admin', 'employees', id] as const,
  auditLogs: (filters: Record<string, any> = {}) => ['admin', 'audit-logs', filters] as const,
  subcastes: ['admin', 'master-data', 'subcastes'] as const,
  gotras: ['admin', 'master-data', 'gotras'] as const,
};

export default QUERY_KEYS;
