export type LeadSource =
  | 'WEBSITE_FORM'
  | 'MOBILE_APP'
  | 'AD_CAMPAIGN'
  | 'REFERRAL'
  | 'ORGANIC_SEARCH'
  | 'EMPLOYEE_CREATED'
  | 'IMPORTED'
  | 'CALLBACK_REQ';

export type LeadStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'PROFILE_VERIFICATION_PENDING'
  | 'MATCHMAKING_ACTIVE'
  | 'MEMBERSHIP_PURCHASED'
  | 'CONVERTED'
  | 'ON_HOLD'
  | 'LOST'
  | 'CLOSED';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Lead {
  id: string;
  leadId: string;
  name: string;
  mobile: string;
  email?: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  city: string;
  subcaste: string;
  gotra?: string;
  profession: string;
  source: LeadSource;
  priority: LeadPriority;
  status: LeadStatus;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  assignedTeam?: string;
  nextFollowUp?: string;
  slaStatus: 'ON_TIME' | 'BREACH' | 'URGENT';
  notes?: string;
  createdAt: string;
  assignmentHistory?: LeadAssignmentRecord[];
  convertedClientId?: string;
  lostReason?: string;
  callResponses?: LeadCallResponseRecord[];
}

export interface LeadCallResponseRecord {
  id: string;
  callLogId?: string;
  calledAt: string;
  callerEmployeeId: string;
  callerEmployeeName: string;
  callDurationSec: number;
  status: CallStatus;
  outcome: CallOutcome;
  userResponse: string; // The specific feedback/response received from this user
  conversationNotes?: string;
  nextFollowUp?: string;
  newStatus?: LeadStatus;
}

export interface TeamChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  recipientRole?: string;
  content: string;
  timestamp: string;
  read: boolean;
  leadReference?: {
    leadId: string;
    leadName: string;
    status: string;
    subcaste: string;
    mobile?: string;
  };
  escalationType?: 'NORMAL' | 'URGENT' | 'DISCOUNT_APPROVAL' | 'LEAD_HANDOVER';
}

export interface LeadAssignmentRecord {
  id: string;
  leadId: string;
  leadName: string;
  previousEmployeeId: string;
  previousEmployeeName: string;
  newEmployeeId: string;
  newEmployeeName: string;
  reassignedAt: string;
  reassignedBy: string;
  reason: string;
  handoverNotes?: string;
  previousStatus: LeadStatus;
  newStatus: LeadStatus;
}

export type ClientRelationshipStatus =
  | 'NEW_CLIENT'
  | 'CONTACT_PENDING'
  | 'CONTACTED'
  | 'INTERESTED'
  | 'PROFILE_VERIFICATION_PENDING'
  | 'MATCHMAKING_ACTIVE'
  | 'MEMBERSHIP_PURCHASED'
  | 'FOLLOW_UP_REQUIRED'
  | 'ON_HOLD'
  | 'CONVERTED'
  | 'LOST'
  | 'CLOSED'
  | 'MARRIED'
  | 'SHADOW_FROZEN'
  | 'BLACKLISTED';

export type MembershipPlanName = 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'TILL_MARRIAGE';

export interface ClientProfile {
  id: string;
  clientId: string; // e.g. 'SIND001'
  fullName: string;
  gender: 'MALE' | 'FEMALE';
  age: number;
  dateOfBirth: string;
  subcaste: string;
  gotra: string;
  city: string;
  state: string;
  country: string;
  education: string;
  profession: string;
  annualIncome: string;
  height: string;
  maritalStatus: 'NEVER_MARRIED' | 'DIVORCED' | 'WIDOWED';
  membershipPlan: MembershipPlanName;
  membershipExpiry: string;
  contactCreditsRemaining: number;
  relationshipStatus: ClientRelationshipStatus;
  leadSource: LeadSource;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  assignedDate: string;
  lastContactDate?: string;
  totalCalls: number;
  connectedCalls: number;
  matchesShared: number;
  clientResponses: number;
  nextFollowUp?: string;
  isVerified: boolean;
  photoUrl?: string;
  partnerPreferences?: {
    ageRange: [number, number];
    subcastes: string[];
    cities: string[];
    educationMin: string;
    incomeMin: string;
  };
}

export type CallDirection = 'OUTGOING' | 'INCOMING';

export type CallStatus = 'CONNECTED' | 'NO_ANSWER' | 'BUSY' | 'FAILED' | 'CANCELLED' | 'WRONG_NUMBER';

export type CallOutcome =
  | 'INTERESTED'
  | 'NOT_INTERESTED'
  | 'WANTS_MORE_PROFILES'
  | 'REQUESTED_CALLBACK'
  | 'PROFILE_SHARED'
  | 'MATCH_APPROVED'
  | 'MATCH_REJECTED'
  | 'MEMBERSHIP_INQUIRY'
  | 'PAYMENT_FOLLOWUP'
  | 'NUMBER_UNREACHABLE'
  | 'WRONG_NUMBER'
  | 'NO_RESPONSE'
  | 'OTHER';

export type CallSource = 'MANUAL' | 'TELEPHONY_EXOTEL' | 'CLOUD_VOIP';

export interface CallLog {
  id: string;
  callLogId: string; // e.g. 'CALL-2025-001'
  clientId: string;
  clientName: string;
  clientPhone: string;
  date: string;
  startTime: string;
  endTime?: string;
  durationSec: number;
  direction: CallDirection;
  status: CallStatus;
  purpose: string;
  outcome: CallOutcome;
  clientResponse?: string;
  nextAction?: string;
  followUpDateTime?: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  notes: string;
  recordedBy: string;
  callSource: CallSource;
  verificationStatus: 'VERIFIED' | 'MANUAL_ENTRY';
  recordingUrl?: string;
  matchId?: string;
}

export type CommunicationChannel =
  | 'CALL'
  | 'WHATSAPP'
  | 'EMAIL'
  | 'SMS'
  | 'IN_APP'
  | 'MEETING'
  | 'NOTE';

export interface CommunicationLog {
  id: string;
  clientId: string;
  clientName: string;
  employeeId: string;
  employeeName: string;
  channel: CommunicationChannel;
  timestamp: string;
  direction: 'INBOUND' | 'OUTBOUND' | 'INTERNAL';
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'COMPLETED';
  outcome?: string;
  contentSummary: string;
  verified: boolean;
}

export type TaskType =
  | 'CALL'
  | 'MEETING'
  | 'PROFILE_SHARE'
  | 'PAYMENT_FOLLOWUP'
  | 'VERIFICATION_CHECK'
  | 'DOCUMENT_REVIEW';

export type TaskStatus =
  | 'PENDING'
  | 'DUE_TODAY'
  | 'COMPLETED'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'RESCHEDULED';

export interface FollowUpTask {
  id: string;
  taskId: string;
  clientId: string;
  clientName: string;
  taskType: TaskType;
  createdDate: string;
  dueDate: string;
  dueTime: string;
  priority: LeadPriority;
  status: TaskStatus;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  completionDate?: string;
  outcome?: string;
  notes: string;
  leadSource?: LeadSource;
}

export type MatchReviewStatus =
  | 'GENERATED'
  | 'PENDING_EMPLOYEE_REVIEW'
  | 'APPROVED'
  | 'REJECTED_BY_EMPLOYEE'
  | 'SHARED_WITH_CLIENT'
  | 'CLOSED';

export type MatchResponseOption =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'REQUESTED_MORE_INFO'
  | 'CALLBACK_REQUESTED';

export type MatchOverallStatus =
  | 'PENDING_REVIEW'
  | 'AWAITING_CLIENT_RESPONSE'
  | 'AWAITING_CANDIDATE_RESPONSE'
  | 'ACCEPTED_BY_BOTH'
  | 'DECLINED_BY_CLIENT'
  | 'DECLINED_BY_CANDIDATE'
  | 'MUTUAL_INTEREST'
  | 'CONTACT_INITIATED'
  | 'CLOSED';

export type MatchSourceType =
  | 'AUTOMATIC_BACKEND'
  | 'ADMIN_SUGGESTED'
  | 'EMPLOYEE_ASSISTED';

export type MatchActionType =
  | 'INITIAL_GENERATION'
  | 'ADMIN_SUGGESTION_ADDED'
  | 'EMPLOYEE_REVIEW_SUBMITTED'
  | 'SHARED_WITH_CLIENT'
  | 'CLIENT_RESPONSE_RECORDED'
  | 'CANDIDATE_RESPONSE_RECORDED'
  | 'REACTIVATED'
  | 'DISMISSED'
  | 'BLOCKED'
  | 'NOTIFICATION_DISPATCHED';

export interface MatchAuditRecord {
  id: string;
  matchId: string;
  actorId: string;
  actorName: string;
  actorRole: string; // 'SUPER_ADMIN' | 'ADMIN' | 'CRM_MANAGER' | 'CRM_AGENT' | 'SYSTEM'
  sourceType: MatchSourceType;
  actionType: MatchActionType;
  timestamp: string;
  reason?: string;
  notes?: string;
  previousStatus?: string;
  resultingStatus?: string;
}

export interface MatchNotificationLog {
  id: string;
  recipientId: string;
  recipientType: 'CLIENT' | 'CANDIDATE';
  channel: 'PUSH_FCM' | 'WHATSAPP' | 'IN_APP' | 'SMS' | 'EMAIL';
  event: string;
  dispatchedAt: string;
  status: 'SENT' | 'DELIVERED' | 'SUPPRESSED_DUPLICATE';
  deliveryNote?: string;
}

export interface MatchRecommendation {
  id: string;
  matchId: string; // e.g. 'MATCH-2025-001'
  pairKey?: string; // Symmetrical canonical key: min(clientId, candidateId) + ":" + max(clientId, candidateId)
  clientId: string;
  clientName: string;
  clientGender: 'MALE' | 'FEMALE';
  clientCity: string;
  clientSubcaste: string;
  candidateId: string;
  candidateName: string;
  candidateGender: 'MALE' | 'FEMALE';
  candidateCity: string;
  candidateSubcaste: string;
  compatibilityScore: number; // 0 - 100
  compatibilityReasons: string[];

  // Hybrid Sources & Attribution (Supports automatic, admin suggestion, and employee review concurrently)
  primarySource?: MatchSourceType;
  sources?: MatchSourceType[]; // e.g. ['AUTOMATIC_BACKEND', 'ADMIN_SUGGESTED']
  suggestedByAdminId?: string;
  suggestedByAdminName?: string;
  suggestedReason?: string;

  reviewedByEmployeeId: string;
  reviewedByEmployeeName: string;
  reviewStatus: MatchReviewStatus;
  reviewedAt?: string;
  sharedWithClientAt?: string;

  // Independent Response Tracking (Client vs Candidate)
  clientResponse: MatchResponseOption;
  clientResponseAt?: string;
  clientResponseRecordedBy?: 'CLIENT' | 'EMPLOYEE';
  candidateResponse: MatchResponseOption;
  candidateResponseAt?: string;
  candidateResponseRecordedBy?: 'CANDIDATE' | 'EMPLOYEE';
  overallStatus: MatchOverallStatus;

  // Lifecycle, Privacy & Exclusion Flags
  isDismissedByClient?: boolean;
  isDismissedByCandidate?: boolean;
  isBlocked?: boolean;
  blockReason?: string;
  isStale?: boolean;

  // Immutable Audit Trail & Notification Deduplication Logs
  auditHistory?: MatchAuditRecord[];
  notifications?: MatchNotificationLog[];

  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

export interface ClientAssignmentHistory {
  id: string;
  clientId: string;
  clientName: string;
  previousEmployeeId: string;
  previousEmployeeName: string;
  newEmployeeId: string;
  newEmployeeName: string;
  reassignedAt: string;
  reassignedBy: string; // Admin / Manager
  reason: string;
  previousStatus: ClientRelationshipStatus;
  newStatus: ClientRelationshipStatus;
}

export interface SalesTransaction {
  id: string;
  transactionId: string;
  clientId: string;
  clientName: string;
  employeeId: string;
  employeeName: string;
  planName: MembershipPlanName;
  amount: number;
  tax: number;
  totalAmount: number;
  paymentGateway: 'RAZORPAY' | 'CASHFREE' | 'OFFLINE_NEFT';
  paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  date: string;
  isRenewal: boolean;
  refundStatus?: 'NONE' | 'REQUESTED' | 'APPROVED' | 'PROCESSED';
  refundAmount?: number;
}

export interface WorkSession {
  id: string;
  employeeId: string;
  date: string;
  loginTime: string;
  logoutTime?: string;
  durationMinutes: number;
  activeStatus: 'ONLINE' | 'AWAY' | 'OFFLINE';
  ipAddress?: string;
}

export interface ActivityTimelineEvent {
  id: string;
  employeeId: string;
  timestamp: string;
  type:
    | 'LEAD_ASSIGNED'
    | 'CLIENT_CONTACTED'
    | 'CALL_LOGGED'
    | 'FOLLOWUP_CREATED'
    | 'FOLLOWUP_COMPLETED'
    | 'MATCH_GENERATED'
    | 'MATCH_REVIEWED'
    | 'PROFILE_SHARED'
    | 'CLIENT_RESPONSE_RECEIVED'
    | 'CANDIDATE_RESPONSE_RECEIVED'
    | 'MEMBERSHIP_PURCHASED'
    | 'PAYMENT_RECORDED'
    | 'LEAD_REASSIGNED'
    | 'LEAD_STATUS_CHANGED'
    | 'CLIENT_STATUS_CHANGED';
  title: string;
  description: string;
  entityType: 'LEAD' | 'CLIENT' | 'CALL' | 'TASK' | 'MATCH' | 'TRANSACTION';
  entityId: string;
  badgeColor?: string;
}

export interface EmployeeSummaryMetrics {
  totalLeadsAssigned: number;
  totalClientsAssigned: number;
  activeClients: number;
  totalCallsLogged: number;
  connectedCalls: number;
  successfulConversations: number;
  followUpsCompleted: number;
  overdueFollowUps: number;
  matchesGenerated: number;
  matchesReviewed: number;
  clientResponsesReceived: number;
  positiveResponses: number;
  membershipSales: number;
  revenueAttributed: number;
  conversionRate: number; // percentage
  // Quality & Productivity Rates
  callsPerDayAverage: number;
  verifiedConnectedRate: number; // percentage
  followUpCompletionRate: number; // percentage
  matchAcceptanceRate: number; // percentage
  averageResponseTimeHours: number;
}

export interface SuccessStory {
  id: string;
  storyId: string;
  groomId: string;
  groomName: string;
  groomPhoto?: string;
  brideId: string;
  brideName: string;
  bridePhoto?: string;
  couplePhoto: string;
  weddingDate: string;
  engagementDate?: string;
  storyTitle: string;
  storyDescription: string;
  city: string;
  subcaste: string;
  attributedEmployeeId?: string;
  attributedEmployeeName?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  featuredOnHome: boolean;
  profilesArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewItem {
  id: string;
  reviewId: string;
  memberId: string;
  memberName: string;
  memberPhoto?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  source: 'GOOGLE' | 'IN_APP' | 'WEBSITE' | 'RELATIONSHIP_MANAGER';
  category: 'MATCHMAKING' | 'CUSTOMER_SUPPORT' | 'HOROSCOPE' | 'OVERALL';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  memberRole?: string;
  subcaste?: string;
  city?: string;
  adminResponse?: string;
  adminRespondedAt?: string;
  createdAt: string;
  helpfulCount: number;
}

export type AbuseReportReason =
  | 'MONEY_EXTORTION'
  | 'FAKE_PROFILE'
  | 'MISBEHAVIOR_CALL'
  | 'ALREADY_MARRIED'
  | 'INAPPROPRIATE_PHOTOS'
  | 'OTHER';

export type AbuseReportStatus =
  | 'OPEN'
  | 'UNDER_INVESTIGATION'
  | 'WARNED'
  | 'SHADOW_FROZEN'
  | 'BLACKLISTED'
  | 'DISMISSED';

export type SafetyActionType =
  | 'WARNING_NUDGE'
  | 'SHADOW_FREEZE_7D'
  | 'PERMANENT_BLACKLIST'
  | 'DISMISSED';

export interface AbuseReport {
  id: string;
  reportId: string;
  reporterId: string;
  reporterName: string;
  reporterPhone?: string;
  reportedMemberId: string;
  reportedMemberName: string;
  reportedMemberPhone: string;
  reportedMemberAadhaarHash: string;
  reportedMemberDeviceId: string;
  reportedMemberPhoto?: string;
  reason: AbuseReportReason;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceText: string;
  chatSnippet?: string;
  callLogSnippet?: string;
  status: AbuseReportStatus;
  adminAction?: {
    actionType: SafetyActionType;
    actedBy: string;
    actedAt: string;
    reasonNotes: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BlacklistedIdentity {
  id: string;
  memberId: string;
  fullName: string;
  phone: string;
  aadhaarHash: string;
  deviceId: string;
  reason: string;
  severity: 'CRITICAL' | 'HIGH';
  blacklistedBy: string;
  blacklistedAt: string;
}
