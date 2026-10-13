import type { Employee } from '../types/employee.types';
import type {
  Lead,
  ClientProfile,
  CallLog,
  FollowUpTask,
  MatchRecommendation,
  ClientAssignmentHistory,
  SalesTransaction,
  ActivityTimelineEvent,
  EmployeeSummaryMetrics,
  MatchResponseOption,
  TaskStatus,
  LeadStatus,
  LeadAssignmentRecord,
  LeadCallResponseRecord,
  TeamChatMessage,
  CallOutcome,
  CallStatus,
  MatchSourceType,
  MatchAuditRecord,
  MatchNotificationLog,
  SuccessStory,
  ReviewItem,
  AbuseReport,
  BlacklistedIdentity,
  SafetyActionType,
} from '../types/crm.types';
import { getDefaultPermissionsForRole, getDefaultAllowedSectionsForRole } from '../utils/rbac';
import { subcasteGotraService } from './subcasteGotraService';

const STORAGE_KEY = 'sindhi_matrimony_crm_state_v1';

// Initial Mock Employees
export const initialEmployees: Employee[] = [
  {
    id: 'emp_001',
    employeeId: 'EMP001',
    fullName: 'Rajesh Mulchandani',
    email: 'rajesh.m@sindhimatrimony.com',
    mobile: '+91 98200 11223',
    role: 'SUPER_ADMIN',
    department: 'Executive Management',
    designation: 'Managing Director & Super Admin',
    team: 'Executive Leadership',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('SUPER_ADMIN'),
    allowedSections: getDefaultAllowedSectionsForRole('SUPER_ADMIN'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 100,
    activeLeadsCount: 5,
    regions: ['Mumbai', 'Pune', 'Dubai'],
    languages: ['Sindhi', 'English', 'Hindi'],
    joiningDate: '2024-01-01',
    employmentStatus: 'ACTIVE',
    targetLeadsMonthly: 50,
    targetCallsDaily: 20,
    targetSalesMonthly: 15,
    lastActiveAt: 'Just now',
    createdAt: '2024-01-01',
  },
  {
    id: 'emp_002',
    employeeId: 'EMP002',
    fullName: 'Kavita Chhabria',
    email: 'kavita.c@sindhimatrimony.com',
    mobile: '+91 98211 44556',
    role: 'ADMIN',
    department: 'Operations',
    designation: 'Chief Operating Officer',
    team: 'Operations Head',
    managerId: 'emp_001',
    managerName: 'Rajesh Mulchandani',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('ADMIN'),
    allowedSections: getDefaultAllowedSectionsForRole('ADMIN'),
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 80,
    activeLeadsCount: 14,
    regions: ['Mumbai', 'Ahmedabad'],
    languages: ['Sindhi', 'Hindi', 'English'],
    joiningDate: '2024-02-15',
    employmentStatus: 'ACTIVE',
    targetLeadsMonthly: 40,
    targetCallsDaily: 25,
    targetSalesMonthly: 12,
    lastActiveAt: '12 mins ago',
    createdAt: '2024-02-15',
  },
  {
    id: 'emp_003',
    employeeId: 'EMP003',
    fullName: 'Priya Sharma',
    email: 'priya.s@sindhimatrimony.com',
    mobile: '+91 98333 77889',
    role: 'CRM_MANAGER',
    department: 'Sales & CRM',
    designation: 'Senior Matchmaking Lead & Manager',
    team: 'Mumbai Matchmaking Alpha',
    managerId: 'emp_002',
    managerName: 'Kavita Chhabria',
    recordScope: 'TEAM',
    permissions: getDefaultPermissionsForRole('CRM_MANAGER'),
    allowedSections: ['dashboard', 'leads', 'tasks', 'chat', 'matchmaking', 'match_responses', 'member_search', 'members', 'employees'],
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 60,
    activeLeadsCount: 42,
    regions: ['Mumbai', 'Delhi NCR'],
    languages: ['Sindhi', 'English', 'Hindi'],
    joiningDate: '2024-03-01',
    employmentStatus: 'ACTIVE',
    targetLeadsMonthly: 60,
    targetCallsDaily: 35,
    targetSalesMonthly: 20,
    lastActiveAt: '3 mins ago',
    createdAt: '2024-03-01',
  },
  {
    id: 'emp_004',
    employeeId: 'EMP004',
    fullName: 'Amit Bajaj',
    email: 'amit.b@sindhimatrimony.com',
    mobile: '+91 98765 43210',
    role: 'CRM_AGENT',
    department: 'Sales & CRM',
    designation: 'Relationship Manager (Assisted Matchmaker)',
    team: 'Mumbai Matchmaking Alpha',
    managerId: 'emp_003',
    managerName: 'Priya Sharma',
    recordScope: 'OWN',
    permissions: getDefaultPermissionsForRole('CRM_AGENT'),
    allowedSections: ['leads', 'tasks'],
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 35,
    activeLeadsCount: 28,
    regions: ['Pune', 'Nagpur'],
    languages: ['Sindhi', 'Hindi', 'Marathi'],
    joiningDate: '2024-04-10',
    employmentStatus: 'ACTIVE',
    targetLeadsMonthly: 30,
    targetCallsDaily: 25,
    targetSalesMonthly: 10,
    lastActiveAt: '5 mins ago',
    createdAt: '2024-04-10',
  },
  {
    id: 'emp_005',
    employeeId: 'EMP005',
    fullName: 'Neha Lulla',
    email: 'neha.l@sindhimatrimony.com',
    mobile: '+91 98450 99887',
    role: 'CRM_AGENT',
    department: 'Sales & CRM',
    designation: 'Senior Relationship Executive',
    team: 'Central India Matchmaking',
    managerId: 'emp_003',
    managerName: 'Priya Sharma',
    recordScope: 'OWN',
    permissions: getDefaultPermissionsForRole('CRM_AGENT'),
    allowedSections: ['leads', 'chat'],
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 35,
    activeLeadsCount: 22,
    regions: ['Indore', 'Bhopal'],
    languages: ['Sindhi', 'Hindi'],
    joiningDate: '2024-05-01',
    employmentStatus: 'ACTIVE',
    targetLeadsMonthly: 30,
    targetCallsDaily: 25,
    targetSalesMonthly: 10,
    lastActiveAt: '18 mins ago',
    createdAt: '2024-05-01',
  },
  {
    id: 'emp_006',
    employeeId: 'EMP006',
    fullName: 'Sunil Wadhwani',
    email: 'sunil.w@sindhimatrimony.com',
    mobile: '+91 98111 22334',
    role: 'FINANCE_MANAGER',
    department: 'Accounts & Billing',
    designation: 'Head of Billing & Refunds',
    team: 'Finance & Accounts',
    managerId: 'emp_001',
    managerName: 'Rajesh Mulchandani',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('FINANCE_MANAGER'),
    allowedSections: ['dashboard', 'finance'],
    isActive: true,
    isChatEnabled: false,
    maxLeadCapacity: 0,
    activeLeadsCount: 0,
    regions: ['All India'],
    languages: ['English', 'Hindi'],
    joiningDate: '2024-02-01',
    employmentStatus: 'ACTIVE',
    lastActiveAt: '1 hour ago',
    createdAt: '2024-02-01',
  },
  {
    id: 'emp_007',
    employeeId: 'EMP007',
    fullName: 'Meena Advani',
    email: 'meena.a@sindhimatrimony.com',
    mobile: '+91 98999 55667',
    role: 'MODERATOR',
    department: 'Trust & Safety',
    designation: 'KYC & Profile Integrity Officer',
    team: 'Trust & Verification',
    managerId: 'emp_002',
    managerName: 'Kavita Chhabria',
    recordScope: 'ALL',
    permissions: getDefaultPermissionsForRole('MODERATOR'),
    allowedSections: ['verifications', 'member_search'],
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 0,
    activeLeadsCount: 0,
    regions: ['All Regions'],
    languages: ['Sindhi', 'English', 'Hindi'],
    joiningDate: '2024-03-15',
    employmentStatus: 'ACTIVE',
    lastActiveAt: '25 mins ago',
    createdAt: '2024-03-15',
  },
  {
    id: 'emp_008',
    employeeId: 'EMP008',
    fullName: 'Vikram Talreja',
    email: 'vikram.t@sindhimatrimony.com',
    mobile: '+91 98777 88990',
    role: 'SUPPORT_AGENT',
    department: 'Member Care',
    designation: 'Customer Success & In-App Help',
    team: 'Member Support',
    managerId: 'emp_003',
    managerName: 'Priya Sharma',
    recordScope: 'ASSIGNED',
    permissions: getDefaultPermissionsForRole('SUPPORT_AGENT'),
    allowedSections: ['dashboard', 'chat', 'inbox', 'member_search'],
    isActive: true,
    isChatEnabled: true,
    maxLeadCapacity: 20,
    activeLeadsCount: 12,
    regions: ['Global NRI Support'],
    languages: ['Sindhi', 'English'],
    joiningDate: '2024-04-01',
    employmentStatus: 'ACTIVE',
    lastActiveAt: '7 mins ago',
    createdAt: '2024-04-01',
  },
];

// Initial Mock Clients (Registered matrimonial profiles)
export const initialClients: ClientProfile[] = [
  {
    id: 'cl_001',
    clientId: 'SIND001',
    fullName: 'Roshni Motwani',
    gender: 'FEMALE',
    age: 26,
    dateOfBirth: '1998-05-14',
    subcaste: 'Amil',
    gotra: 'Shandilya',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    education: 'MBA in Finance (NMIMS)',
    profession: 'Investment Banker',
    annualIncome: '₹22 - 25 Lakhs',
    height: "5'4\"",
    maritalStatus: 'NEVER_MARRIED',
    membershipPlan: 'PLATINUM',
    membershipExpiry: '2026-12-31',
    contactCreditsRemaining: 45,
    relationshipStatus: 'MATCHMAKING_ACTIVE',
    leadSource: 'WEBSITE_FORM',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedDate: '2025-01-10',
    lastContactDate: '2025-10-09',
    totalCalls: 14,
    connectedCalls: 12,
    matchesShared: 8,
    clientResponses: 7,
    nextFollowUp: '2025-10-12 11:00 AM',
    isVerified: true,
    partnerPreferences: {
      ageRange: [27, 32],
      subcastes: ['Amil', 'Baibhand'],
      cities: ['Mumbai', 'Pune', 'Dubai'],
      educationMin: 'Post Graduate',
      incomeMin: '₹25 Lakhs+',
    },
  },
  {
    id: 'cl_002',
    clientId: 'SIND002',
    fullName: 'Kunal Advani',
    gender: 'MALE',
    age: 29,
    dateOfBirth: '1995-09-22',
    subcaste: 'Baibhand',
    gotra: 'Kashyap',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    education: 'B.Tech + MS in Computer Science',
    profession: 'Senior Software Engineer',
    annualIncome: '₹35 - 40 Lakhs',
    height: "5'11\"",
    maritalStatus: 'NEVER_MARRIED',
    membershipPlan: 'PLATINUM',
    membershipExpiry: '2027-03-15',
    contactCreditsRemaining: 38,
    relationshipStatus: 'MATCHMAKING_ACTIVE',
    leadSource: 'MOBILE_APP',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedDate: '2025-01-15',
    lastContactDate: '2025-10-10',
    totalCalls: 18,
    connectedCalls: 15,
    matchesShared: 10,
    clientResponses: 9,
    nextFollowUp: '2025-10-13 03:00 PM',
    isVerified: true,
    partnerPreferences: {
      ageRange: [24, 28],
      subcastes: ['Amil', 'Baibhand', 'Sahiti'],
      cities: ['Mumbai', 'Pune'],
      educationMin: 'Graduate',
      incomeMin: '₹15 Lakhs+',
    },
  },
  {
    id: 'cl_003',
    clientId: 'SIND003',
    fullName: 'Simran Chandnani',
    gender: 'FEMALE',
    age: 25,
    dateOfBirth: '1999-11-04',
    subcaste: 'Sahiti',
    gotra: 'Vatsa',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    education: 'CA (Chartered Accountant)',
    profession: 'Senior Auditor at Deloitte',
    annualIncome: '₹18 - 20 Lakhs',
    height: "5'3\"",
    maritalStatus: 'NEVER_MARRIED',
    membershipPlan: 'GOLD',
    membershipExpiry: '2026-06-30',
    contactCreditsRemaining: 20,
    relationshipStatus: 'FOLLOW_UP_REQUIRED',
    leadSource: 'AD_CAMPAIGN',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    assignedDate: '2025-02-01',
    lastContactDate: '2025-10-08',
    totalCalls: 9,
    connectedCalls: 7,
    matchesShared: 5,
    clientResponses: 4,
    nextFollowUp: '2025-10-11 04:30 PM',
    isVerified: true,
    partnerPreferences: {
      ageRange: [26, 30],
      subcastes: ['Sahiti', 'Amil', 'Larkana'],
      cities: ['Ahmedabad', 'Mumbai', 'Baroda'],
      educationMin: 'CA / MBA',
      incomeMin: '₹20 Lakhs+',
    },
  },
  {
    id: 'cl_004',
    clientId: 'SIND004',
    fullName: 'Deepak Vazirani',
    gender: 'MALE',
    age: 31,
    dateOfBirth: '1993-04-18',
    subcaste: 'Larkana',
    gotra: 'Bharadwaj',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    education: 'M.Com + Family Business',
    profession: 'Textile & Garment Exporter',
    annualIncome: '₹50 Lakhs+',
    height: "5'9\"",
    maritalStatus: 'NEVER_MARRIED',
    membershipPlan: 'TILL_MARRIAGE',
    membershipExpiry: '2029-12-31',
    contactCreditsRemaining: 95,
    relationshipStatus: 'MATCHMAKING_ACTIVE',
    leadSource: 'REFERRAL',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    assignedDate: '2025-02-15',
    lastContactDate: '2025-10-07',
    totalCalls: 12,
    connectedCalls: 10,
    matchesShared: 6,
    clientResponses: 5,
    nextFollowUp: '2025-10-14 11:30 AM',
    isVerified: true,
  },
  {
    id: 'cl_005',
    clientId: 'SIND005',
    fullName: 'Varun Hingorani',
    gender: 'MALE',
    age: 28,
    dateOfBirth: '1996-08-11',
    subcaste: 'Amil',
    gotra: 'Gautama',
    city: 'Dubai',
    state: 'Dubai',
    country: 'UAE',
    education: 'B.E Computer Engineering',
    profession: 'Fintech Product Lead (Dubai)',
    annualIncome: 'AED 360,000 (~₹80 Lakhs)',
    height: "6'0\"",
    maritalStatus: 'NEVER_MARRIED',
    membershipPlan: 'PLATINUM',
    membershipExpiry: '2026-11-20',
    contactCreditsRemaining: 50,
    relationshipStatus: 'MATCHMAKING_ACTIVE',
    leadSource: 'WEBSITE_FORM',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedDate: '2025-03-01',
    lastContactDate: '2025-10-10',
    totalCalls: 11,
    connectedCalls: 9,
    matchesShared: 7,
    clientResponses: 6,
    nextFollowUp: '2025-10-12 06:00 PM',
    isVerified: true,
  },
  {
    id: 'cl_006',
    clientId: 'SIND006',
    fullName: 'Pooja Mirchandani',
    gender: 'FEMALE',
    age: 27,
    dateOfBirth: '1997-03-05',
    subcaste: 'Baibhand',
    gotra: 'Parashar',
    city: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    education: 'Doctor (MD Dermatology)',
    profession: 'Consultant Dermatologist',
    annualIncome: '₹28 - 30 Lakhs',
    height: "5'5\"",
    maritalStatus: 'NEVER_MARRIED',
    membershipPlan: 'GOLD',
    membershipExpiry: '2026-08-15',
    contactCreditsRemaining: 25,
    relationshipStatus: 'MATCHMAKING_ACTIVE',
    leadSource: 'ORGANIC_SEARCH',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedDate: '2025-03-10',
    lastContactDate: '2025-10-09',
    totalCalls: 8,
    connectedCalls: 7,
    matchesShared: 4,
    clientResponses: 4,
    nextFollowUp: '2025-10-13 01:00 PM',
    isVerified: true,
  },
];

// Initial Mock Leads (CRM Inquiries before full client conversion)
// Initial Mock Leads (60 Website Inquiries & Visitor Leads with 20-per-page pagination support)
export const initialLeads: Lead[] = [
  // --- Already Assigned Leads (15 leads assigned to CRM Agents) ---
  {
    id: 'ld_001',
    leadId: 'LEAD-2025-001',
    name: 'Karan Advani',
    mobile: '+91 98200 44321',
    email: 'karan.a@gmail.com',
    gender: 'MALE',
    age: 28,
    city: 'Mumbai',
    subcaste: 'Amil',
    profession: 'Architect',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Today, 2:30 PM',
    slaStatus: 'ON_TIME',
    notes: 'Father submitted website form seeking Amil/Baibhand girl in Mumbai.',
    createdAt: '2025-10-05',
    callResponses: [
      {
        id: 'cresp_init_001',
        callLogId: 'CALL-2025-001',
        calledAt: '2025-10-06 11:20 AM',
        callerEmployeeId: 'emp_003',
        callerEmployeeName: 'Priya Sharma',
        callDurationSec: 195,
        status: 'CONNECTED',
        outcome: 'INTERESTED',
        userResponse: 'Spoke with groom\'s father (Shri Haresh Advani). Confirmed looking for well-educated Amil or Bhaibhand girl, working in Mumbai. Very receptive to assisted matchmaking. Asked to share 2-3 shortlisted biodatas on WhatsApp.',
        conversationNotes: 'Family is well established in Bandra. High priority prospect for Silver/Gold membership.',
        nextFollowUp: 'Today, 2:30 PM',
        newStatus: 'ASSIGNED',
      },
    ],
  },
  {
    id: 'ld_002',
    leadId: 'LEAD-2025-002',
    name: 'Roshni Motwani',
    mobile: '+91 98450 77744',
    email: 'roshni.m@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Mumbai',
    subcaste: 'Sahiti',
    profession: 'Chartered Accountant',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'INTERESTED',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Friday, 4:00 PM',
    slaStatus: 'ON_TIME',
    notes: 'Requested callback after discussing with parents. Ready for profile verification.',
    createdAt: '2025-10-04',
    callResponses: [
      {
        id: 'cresp_init_002',
        callLogId: 'CALL-2025-002',
        calledAt: '2025-10-05 03:45 PM',
        callerEmployeeId: 'emp_003',
        callerEmployeeName: 'Priya Sharma',
        callDurationSec: 240,
        status: 'CONNECTED',
        outcome: 'WANTS_MORE_PROFILES',
        userResponse: 'Client herself answered the call. CA in Big 4 firm. Looking for CA/Engineer/MBA partner in Mumbai/Pune. Father will join call on Friday for Assisted Matchmaker onboarding.',
        conversationNotes: 'Shared brochure on WhatsApp. Scheduled joint parent-candidate video call Friday.',
        nextFollowUp: 'Friday, 4:00 PM',
        newStatus: 'INTERESTED',
      },
    ],
  },
  {
    id: 'ld_003',
    leadId: 'LEAD-2025-003',
    name: 'Deepak Vazirani',
    mobile: '+91 98333 22211',
    email: 'deepak.v@gmail.com',
    gender: 'MALE',
    age: 31,
    city: 'Pune',
    subcaste: 'Larkana',
    profession: 'Business Owner',
    source: 'MOBILE_APP',
    priority: 'MEDIUM',
    status: 'CONTACTED',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Tomorrow, 11:00 AM',
    slaStatus: 'ON_TIME',
    notes: 'Spoke with candidate directly. Interested in Till Marriage assisted plan.',
    createdAt: '2025-10-06',
  },
  {
    id: 'ld_004',
    leadId: 'LEAD-2025-004',
    name: 'Manish Gidwani',
    mobile: '+91 98111 33322',
    email: 'manish.g@gmail.com',
    gender: 'MALE',
    age: 33,
    city: 'Indore',
    subcaste: 'Shikarpuri',
    profession: 'Software Consultant',
    source: 'WEBSITE_FORM',
    priority: 'LOW',
    status: 'CONVERTED',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Converted to Client SIND004',
    slaStatus: 'ON_TIME',
    notes: 'Upgraded to Gold Assisted membership after reassignment.',
    createdAt: '2025-09-25',
    convertedClientId: 'SIND004',
    assignmentHistory: [
      {
        id: 'lar_001',
        leadId: 'LEAD-2025-004',
        leadName: 'Manish Gidwani',
        previousEmployeeId: 'emp_005',
        previousEmployeeName: 'Neha Lulla',
        newEmployeeId: 'emp_004',
        newEmployeeName: 'Amit Bajaj',
        reassignedAt: '2025-09-20 11:30 AM',
        reassignedBy: 'Priya Sharma (CRM_MANAGER)',
        reason: 'Agent unable to convince / Customer requested matchmaker with MP network',
        handoverNotes: 'Neha followed up twice but candidate was undecided. Amit Bajaj took over and closed Gold membership.',
        previousStatus: 'CONTACTED',
        newStatus: 'ASSIGNED',
      },
    ],
  },
  {
    id: 'ld_005',
    leadId: 'LEAD-2025-005',
    name: 'Pooja Mirchandani',
    mobile: '+91 98999 55441',
    email: 'pooja.m@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Delhi NCR',
    subcaste: 'Baibhand',
    profession: 'Dermatologist',
    source: 'ORGANIC_SEARCH',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Today, 5:00 PM',
    slaStatus: 'ON_TIME',
    notes: 'Enquired about Assisted Matchmaking for doctors.',
    createdAt: '2025-10-07',
  },
  {
    id: 'ld_006',
    leadId: 'LEAD-2025-006',
    name: 'Varun Hingorani',
    mobile: '+971 50 1234567',
    email: 'varun.h@gmail.com',
    gender: 'MALE',
    age: 29,
    city: 'Dubai',
    subcaste: 'Amil',
    profession: 'Fintech Product Lead',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'CONTACTED',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Tomorrow, 3:00 PM',
    slaStatus: 'ON_TIME',
    notes: 'NRI profile. Open for Mumbai / Pune Sindhi matches.',
    createdAt: '2025-10-08',
  },
  {
    id: 'ld_007',
    leadId: 'LEAD-2025-007',
    name: 'Simran Chandnani',
    mobile: '+91 98222 66778',
    email: 'simran.c@gmail.com',
    gender: 'FEMALE',
    age: 25,
    city: 'Ahmedabad',
    subcaste: 'Sahiti',
    profession: 'Chartered Accountant',
    source: 'AD_CAMPAIGN',
    priority: 'MEDIUM',
    status: 'INTERESTED',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Thursday, 12:00 PM',
    slaStatus: 'ON_TIME',
    notes: 'Looking for Sindhi boy in Gujarat or Mumbai.',
    createdAt: '2025-10-08',
  },
  {
    id: 'ld_008',
    leadId: 'LEAD-2025-008',
    name: 'Rahul Bhavnani',
    mobile: '+91 98333 44556',
    email: 'rahul.b@gmail.com',
    gender: 'MALE',
    age: 30,
    city: 'Mumbai',
    subcaste: 'Amil',
    profession: 'Investment Banker',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Today, 4:00 PM',
    slaStatus: 'ON_TIME',
    notes: 'Father requested expedited verification.',
    createdAt: '2025-10-09',
  },
  {
    id: 'ld_009',
    leadId: 'LEAD-2025-009',
    name: 'Sneha Khemlani',
    mobile: '+91 98111 88990',
    email: 'sneha.k@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Jaipur',
    subcaste: 'Larkana',
    profession: 'Fashion Designer',
    source: 'MOBILE_APP',
    priority: 'MEDIUM',
    status: 'CONTACTED',
    assignedEmployeeId: 'emp_005',
    assignedEmployeeName: 'Neha Lulla',
    assignedTeam: 'Central India Matchmaking',
    nextFollowUp: 'Tomorrow, 2:00 PM',
    slaStatus: 'ON_TIME',
    notes: 'Spoke with mother. Family interested in business families.',
    createdAt: '2025-10-09',
  },
  {
    id: 'ld_010',
    leadId: 'LEAD-2025-010',
    name: 'Mohit Dudani',
    mobile: '+91 98777 11223',
    email: 'mohit.d@gmail.com',
    gender: 'MALE',
    age: 32,
    city: 'Bhopal',
    subcaste: 'Shikarpuri',
    profession: 'Pharma Distributor',
    source: 'CALLBACK_REQ',
    priority: 'LOW',
    status: 'ASSIGNED',
    assignedEmployeeId: 'emp_005',
    assignedEmployeeName: 'Neha Lulla',
    assignedTeam: 'Central India Matchmaking',
    nextFollowUp: 'Saturday, 11:30 AM',
    slaStatus: 'ON_TIME',
    notes: 'Inquired about membership fee structures.',
    createdAt: '2025-10-09',
  },
  {
    id: 'ld_011',
    leadId: 'LEAD-2025-011',
    name: 'Tina Panjwani',
    mobile: '+91 98444 33221',
    email: 'tina.p@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Pune',
    subcaste: 'Baibhand',
    profession: 'UI/UX Designer',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'INTERESTED',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Friday, 11:00 AM',
    slaStatus: 'ON_TIME',
    notes: 'Candidate registered through landing page campaign.',
    createdAt: '2025-10-10',
  },
  {
    id: 'ld_012',
    leadId: 'LEAD-2025-012',
    name: 'Harsh Shivdasani',
    mobile: '+91 98666 55443',
    email: 'harsh.s@gmail.com',
    gender: 'MALE',
    age: 29,
    city: 'Nagpur',
    subcaste: 'Amil',
    profession: 'Civil Contractor',
    source: 'ORGANIC_SEARCH',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    assignedEmployeeId: 'emp_005',
    assignedEmployeeName: 'Neha Lulla',
    assignedTeam: 'Central India Matchmaking',
    nextFollowUp: 'Tomorrow, 5:30 PM',
    slaStatus: 'ON_TIME',
    notes: 'Looking for matches in Vidarbha / Maharashtra.',
    createdAt: '2025-10-10',
  },
  {
    id: 'ld_013',
    leadId: 'LEAD-2025-013',
    name: 'Ritu Lalwani',
    mobile: '+91 98888 77665',
    email: 'ritu.l@gmail.com',
    gender: 'FEMALE',
    age: 28,
    city: 'Indore',
    subcaste: 'Sahiti',
    profession: 'Assistant Professor',
    source: 'AD_CAMPAIGN',
    priority: 'LOW',
    status: 'CONTACTED',
    assignedEmployeeId: 'emp_005',
    assignedEmployeeName: 'Neha Lulla',
    assignedTeam: 'Central India Matchmaking',
    nextFollowUp: 'Monday, 11:00 AM',
    slaStatus: 'ON_TIME',
    notes: 'Initial introductory discussion done.',
    createdAt: '2025-10-10',
  },
  {
    id: 'ld_014',
    leadId: 'LEAD-2025-014',
    name: 'Kunal Tolani',
    mobile: '+91 98222 99110',
    email: 'kunal.t@gmail.com',
    gender: 'MALE',
    age: 31,
    city: 'Mumbai',
    subcaste: 'Thattai',
    profession: 'Real Estate Developer',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Today, 6:00 PM',
    slaStatus: 'ON_TIME',
    notes: 'Looking for educated girl from reputable Sindhi family.',
    createdAt: '2025-10-10',
  },
  {
    id: 'ld_015',
    leadId: 'LEAD-2025-015',
    name: 'Priya Mansukhani',
    mobile: '+91 98333 88112',
    email: 'priya.m@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Thane',
    subcaste: 'Amil',
    profession: 'Dentist (BDS)',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'ASSIGNED',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    assignedTeam: 'Mumbai Matchmaking Alpha',
    nextFollowUp: 'Tomorrow, 10:30 AM',
    slaStatus: 'ON_TIME',
    notes: 'Parents requested personal consultation.',
    createdAt: '2025-10-10',
  },

  // --- UNASSIGNED LEADS (45 Fresh Website Leads ready for Batch Assignment) ---
  {
    id: 'ld_016',
    leadId: 'LEAD-2025-016',
    name: 'Neha Chawla',
    mobile: '+91 98211 88901',
    email: 'neha.chawla@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Delhi NCR',
    subcaste: 'Baibhand',
    profession: 'Marketing Lead',
    source: 'WEBSITE_FORM',
    priority: 'URGENT',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Immediate SLA Target',
    slaStatus: 'URGENT',
    notes: 'Inquiry received via website registration banner. Looking for NRI or Tier-1 groom.',
    createdAt: '2025-10-10 14:10',
  },
  {
    id: 'ld_017',
    leadId: 'LEAD-2025-017',
    name: 'Vicky Sadhwani',
    mobile: '+91 98444 11229',
    email: 'vicky.s@gmail.com',
    gender: 'MALE',
    age: 29,
    city: 'Mumbai',
    subcaste: 'Larkana',
    profession: 'Chartered Accountant (KPMG)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Candidate submitted contact form on website pricing page.',
    createdAt: '2025-10-10 14:25',
  },
  {
    id: 'ld_018',
    leadId: 'LEAD-2025-018',
    name: 'Divya Wadhwani',
    mobile: '+91 98555 33441',
    email: 'divya.w@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Pune',
    subcaste: 'Amil',
    profession: 'Software Engineer (Infosys)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Inquiry for verified Amil matches in Pune/Mumbai.',
    createdAt: '2025-10-10 14:40',
  },
  {
    id: 'ld_019',
    leadId: 'LEAD-2025-019',
    name: 'Sunil Vaswani',
    mobile: '+91 98111 66774',
    email: 'sunil.v@gmail.com',
    gender: 'MALE',
    age: 32,
    city: 'Ahmedabad',
    subcaste: 'Sahiti',
    profession: 'Chemical Exporter',
    source: 'CALLBACK_REQ',
    priority: 'URGENT',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Immediate SLA Target',
    slaStatus: 'URGENT',
    notes: 'Requested immediate callback regarding VIP matrimony membership.',
    createdAt: '2025-10-10 15:05',
  },
  {
    id: 'ld_020',
    leadId: 'LEAD-2025-020',
    name: 'Bhavna Jagtiani',
    mobile: '+91 98222 44119',
    email: 'bhavna.j@gmail.com',
    gender: 'FEMALE',
    age: 28,
    city: 'Jaipur',
    subcaste: 'Baibhand',
    profession: 'High School Teacher',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Father filled inquiry form on Sindhi matrimony home page.',
    createdAt: '2025-10-10 15:15',
  },
  {
    id: 'ld_021',
    leadId: 'LEAD-2025-021',
    name: 'Sanjay Balani',
    mobile: '+91 98333 55221',
    email: 'sanjay.b@gmail.com',
    gender: 'MALE',
    age: 30,
    city: 'Indore',
    subcaste: 'Shikarpuri',
    profession: 'Architect & Interior Designer',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 3 hours',
    slaStatus: 'ON_TIME',
    notes: 'Website lead looking for educated Shikarpuri bride.',
    createdAt: '2025-10-10 15:30',
  },
  {
    id: 'ld_022',
    leadId: 'LEAD-2025-022',
    name: 'Aarti Tejwani',
    mobile: '+91 98777 66332',
    email: 'aarti.t@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Mumbai',
    subcaste: 'Amil',
    profession: 'HR Manager (Deloitte)',
    source: 'ORGANIC_SEARCH',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Found portal via Google Search for Sindhi Amil matches.',
    createdAt: '2025-10-10 15:45',
  },
  {
    id: 'ld_023',
    leadId: 'LEAD-2025-023',
    name: 'Vijay Rijhwani',
    mobile: '+91 98666 77884',
    email: 'vijay.r@gmail.com',
    gender: 'MALE',
    age: 31,
    city: 'Bhopal',
    subcaste: 'Larkana',
    profession: 'Senior Data Scientist',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Website lead; candidate resides in Bangalore, roots in MP.',
    createdAt: '2025-10-10 16:00',
  },
  {
    id: 'ld_024',
    leadId: 'LEAD-2025-024',
    name: 'Muskaan Chainani',
    mobile: '+91 98444 88223',
    email: 'muskaan.c@gmail.com',
    gender: 'FEMALE',
    age: 25,
    city: 'Ulhasnagar',
    subcaste: 'Sahiti',
    profession: 'Chartered Financial Analyst',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Mother filled website form; prefers Mumbai/Thane alliance.',
    createdAt: '2025-10-10 16:15',
  },
  {
    id: 'ld_025',
    leadId: 'LEAD-2025-025',
    name: 'Ajay Melwani',
    mobile: '+91 98555 99112',
    email: 'ajay.m@gmail.com',
    gender: 'MALE',
    age: 33,
    city: 'Nagpur',
    subcaste: 'Amil',
    profession: 'Automobile Dealership Owner',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Requested callback after watching YouTube review.',
    createdAt: '2025-10-10 16:30',
  },
  {
    id: 'ld_026',
    leadId: 'LEAD-2025-026',
    name: 'Kajal Gidwani',
    mobile: '+91 98111 22448',
    email: 'kajal.g@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Delhi NCR',
    subcaste: 'Shikarpuri',
    profession: 'Corporate Lawyer',
    source: 'WEBSITE_FORM',
    priority: 'URGENT',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Immediate SLA Target',
    slaStatus: 'URGENT',
    notes: 'Website lead; requires verified lawyer or business profile.',
    createdAt: '2025-10-10 16:45',
  },
  {
    id: 'ld_027',
    leadId: 'LEAD-2025-027',
    name: 'Rohit Tharwani',
    mobile: '+91 98222 33557',
    email: 'rohit.t@gmail.com',
    gender: 'MALE',
    age: 28,
    city: 'Pune',
    subcaste: 'Baibhand',
    profession: 'Cloud Solutions Architect',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Website inquiry from Pune tech corridor.',
    createdAt: '2025-10-10 17:00',
  },
  {
    id: 'ld_028',
    leadId: 'LEAD-2025-028',
    name: 'Payal Ramnani',
    mobile: '+91 98333 11994',
    email: 'payal.r@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Mumbai',
    subcaste: 'Amil',
    profession: 'Clinical Psychologist',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Submitted registration form; interested in assisted relationship manager.',
    createdAt: '2025-10-10 17:15',
  },
  {
    id: 'ld_029',
    leadId: 'LEAD-2025-029',
    name: 'Tarun Bhojwani',
    mobile: '+91 98444 66110',
    email: 'tarun.b@gmail.com',
    gender: 'MALE',
    age: 30,
    city: 'Surat',
    subcaste: 'Thattai',
    profession: 'Diamond & Jewelry Merchant',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Requested call back from Surat branch manager.',
    createdAt: '2025-10-10 17:30',
  },
  {
    id: 'ld_030',
    leadId: 'LEAD-2025-030',
    name: 'Shilpa Khubchandani',
    mobile: '+91 98555 44882',
    email: 'shilpa.k@gmail.com',
    gender: 'FEMALE',
    age: 28,
    city: 'Ahmedabad',
    subcaste: 'Larkana',
    profession: 'Senior Product Manager',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Registered on website; open to Mumbai or Gujarat matches.',
    createdAt: '2025-10-10 17:45',
  },
  {
    id: 'ld_031',
    leadId: 'LEAD-2025-031',
    name: 'Mahesh Jhamnani',
    mobile: '+91 98666 22119',
    email: 'mahesh.j@gmail.com',
    gender: 'MALE',
    age: 32,
    city: 'Jaipur',
    subcaste: 'Sahiti',
    profession: 'Textile Manufacturing Unit Owner',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 5 hours',
    slaStatus: 'ON_TIME',
    notes: 'Traditional Sindhi business family alliance sought.',
    createdAt: '2025-10-10 18:00',
  },
  {
    id: 'ld_032',
    leadId: 'LEAD-2025-032',
    name: 'Nikita Rohira',
    mobile: '+91 98777 55991',
    email: 'nikita.r@gmail.com',
    gender: 'FEMALE',
    age: 25,
    city: 'Mumbai',
    subcaste: 'Amil',
    profession: 'Brand Strategist (Ogilvy)',
    source: 'ORGANIC_SEARCH',
    priority: 'URGENT',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Immediate SLA Target',
    slaStatus: 'URGENT',
    notes: 'Urgent inquiry from Bandra Mumbai Amil family.',
    createdAt: '2025-10-10 18:15',
  },
  {
    id: 'ld_033',
    leadId: 'LEAD-2025-033',
    name: 'Anil Talreja',
    mobile: '+91 98888 11442',
    email: 'anil.t@gmail.com',
    gender: 'MALE',
    age: 29,
    city: 'Indore',
    subcaste: 'Shikarpuri',
    profession: 'Chartered Accountant & Tax Consultant',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 3 hours',
    slaStatus: 'ON_TIME',
    notes: 'Candidate registered through website contact form.',
    createdAt: '2025-10-10 18:30',
  },
  {
    id: 'ld_034',
    leadId: 'LEAD-2025-034',
    name: 'Barkha Asrani',
    mobile: '+91 98999 44331',
    email: 'barkha.a@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Pune',
    subcaste: 'Baibhand',
    profession: 'Senior Software Engineer (Google)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'High synergy profile. Looking for tech professional.',
    createdAt: '2025-10-10 18:45',
  },
  {
    id: 'ld_035',
    leadId: 'LEAD-2025-035',
    name: 'Jitendra Lalchandani',
    mobile: '+91 98222 77118',
    email: 'jitendra.l@gmail.com',
    gender: 'MALE',
    age: 30,
    city: 'Dubai',
    subcaste: 'Amil',
    profession: 'Civil Engineer (Emaar Properties)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 3 hours',
    slaStatus: 'ON_TIME',
    notes: 'NRI lead seeking matches willing to relocate to UAE.',
    createdAt: '2025-10-10 19:00',
  },
  {
    id: 'ld_036',
    leadId: 'LEAD-2025-036',
    name: 'Mehak Israni',
    mobile: '+91 98333 99220',
    email: 'mehak.i@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Mumbai',
    subcaste: 'Larkana',
    profession: 'Nutritionist & Wellness Consultant',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Callback request regarding assisted profile curation.',
    createdAt: '2025-10-10 19:15',
  },
  {
    id: 'ld_037',
    leadId: 'LEAD-2025-037',
    name: 'Haresh Moriani',
    mobile: '+91 98444 33118',
    email: 'haresh.m@gmail.com',
    gender: 'MALE',
    age: 31,
    city: 'Ulhasnagar',
    subcaste: 'Sahiti',
    profession: 'Hardware & Construction Supplies Exporter',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Website lead; candidate looking for traditional match.',
    createdAt: '2025-10-10 19:30',
  },
  {
    id: 'ld_038',
    leadId: 'LEAD-2025-038',
    name: 'Soniya Jethnani',
    mobile: '+91 98555 11993',
    email: 'soniya.j@gmail.com',
    gender: 'FEMALE',
    age: 28,
    city: 'Delhi NCR',
    subcaste: 'Shikarpuri',
    profession: 'Senior Journalist & Content Head',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Registered on website; looking for Delhi or Mumbai alliances.',
    createdAt: '2025-10-10 19:45',
  },
  {
    id: 'ld_039',
    leadId: 'LEAD-2025-039',
    name: 'Vishal Kodwani',
    mobile: '+91 98666 44881',
    email: 'vishal.k@gmail.com',
    gender: 'MALE',
    age: 29,
    city: 'Nagpur',
    subcaste: 'Baibhand',
    profession: 'Senior Operations Manager (Amazon)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Submitted inquiry regarding verified horoscope compatibility.',
    createdAt: '2025-10-10 20:00',
  },
  {
    id: 'ld_040',
    leadId: 'LEAD-2025-040',
    name: 'Rashi Sajnani',
    mobile: '+91 98777 22114',
    email: 'rashi.s@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Mumbai',
    subcaste: 'Amil',
    profession: 'Chartered Accountant (EY)',
    source: 'WEBSITE_FORM',
    priority: 'URGENT',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Immediate SLA Target',
    slaStatus: 'URGENT',
    notes: 'Urgent inquiry from Khar Amil family; requires senior relationship manager.',
    createdAt: '2025-10-10 20:05',
  },
  {
    id: 'ld_041',
    leadId: 'LEAD-2025-041',
    name: 'Naresh Kodwani',
    mobile: '+91 98888 33559',
    email: 'naresh.k@gmail.com',
    gender: 'MALE',
    age: 32,
    city: 'Ahmedabad',
    subcaste: 'Larkana',
    profession: 'Plastic Goods Manufacturer',
    source: 'CALLBACK_REQ',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Requested callback regarding membership charges and matches.',
    createdAt: '2025-10-10 20:10',
  },
  {
    id: 'ld_042',
    leadId: 'LEAD-2025-042',
    name: 'Preeti Kukreja',
    mobile: '+91 98999 11448',
    email: 'preeti.k@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Jaipur',
    subcaste: 'Sahiti',
    profession: 'Architectural Photographer',
    source: 'WEBSITE_FORM',
    priority: 'LOW',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 6 hours',
    slaStatus: 'ON_TIME',
    notes: 'Inquiry received via website gallery showcase.',
    createdAt: '2025-10-10 20:12',
  },
  {
    id: 'ld_043',
    leadId: 'LEAD-2025-043',
    name: 'Govind Mirpuri',
    mobile: '+91 98111 77332',
    email: 'govind.m@gmail.com',
    gender: 'MALE',
    age: 30,
    city: 'Mumbai',
    subcaste: 'Thattai',
    profession: 'Logistics & Supply Chain Director',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Inquiry for high net worth Sindhi matchmaking.',
    createdAt: '2025-10-10 20:15',
  },
  {
    id: 'ld_044',
    leadId: 'LEAD-2025-044',
    name: 'Juhi Chawla',
    mobile: '+91 98222 55883',
    email: 'juhi.c@gmail.com',
    gender: 'FEMALE',
    age: 28,
    city: 'Bhopal',
    subcaste: 'Shikarpuri',
    profession: 'Pediatrician (MD Pediatrics)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Doctor candidate seeking doctor or civil servant Sindhi groom.',
    createdAt: '2025-10-10 20:18',
  },
  {
    id: 'ld_045',
    leadId: 'LEAD-2025-045',
    name: 'Prakash Harchandani',
    mobile: '+91 98333 44991',
    email: 'prakash.h@gmail.com',
    gender: 'MALE',
    age: 31,
    city: 'Pune',
    subcaste: 'Amil',
    profession: 'Senior Product Marketing Lead',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Requested callback regarding profile visibility controls.',
    createdAt: '2025-10-10 20:20',
  },
  {
    id: 'ld_046',
    leadId: 'LEAD-2025-046',
    name: 'Karishma Pahuja',
    mobile: '+91 98444 22770',
    email: 'karishma.p@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Indore',
    subcaste: 'Baibhand',
    profession: 'Chartered Accountant (PwC)',
    source: 'WEBSITE_FORM',
    priority: 'URGENT',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Immediate SLA Target',
    slaStatus: 'URGENT',
    notes: 'Candidate submitted form directly; looking for early alliance.',
    createdAt: '2025-10-10 20:22',
  },
  {
    id: 'ld_047',
    leadId: 'LEAD-2025-047',
    name: 'Sagar Dembla',
    mobile: '+91 98555 88334',
    email: 'sagar.d@gmail.com',
    gender: 'MALE',
    age: 29,
    city: 'Ulhasnagar',
    subcaste: 'Larkana',
    profession: 'Footwear Manufacturing Business',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Family seeks well-educated Larkana/Sahiti bride.',
    createdAt: '2025-10-10 20:24',
  },
  {
    id: 'ld_048',
    leadId: 'LEAD-2025-048',
    name: 'Riya Bhatia',
    mobile: '+91 98666 33117',
    email: 'riya.b@gmail.com',
    gender: 'FEMALE',
    age: 25,
    city: 'Mumbai',
    subcaste: 'Sahiti',
    profession: 'Data Analyst (Morgan Stanley)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Registered on website; requested assisted relationship manager.',
    createdAt: '2025-10-10 20:25',
  },
  {
    id: 'ld_049',
    leadId: 'LEAD-2025-049',
    name: 'Naresh Hingorani',
    mobile: '+91 98777 99442',
    email: 'naresh.h@gmail.com',
    gender: 'MALE',
    age: 33,
    city: 'Delhi NCR',
    subcaste: 'Amil',
    profession: 'Management Consultant (BCG)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Candidate registered through website portal.',
    createdAt: '2025-10-10 20:26',
  },
  {
    id: 'ld_050',
    leadId: 'LEAD-2025-050',
    name: 'Simran Motwani',
    mobile: '+91 98888 66225',
    email: 'simran.m@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Ahmedabad',
    subcaste: 'Shikarpuri',
    profession: 'Fashion Merchandiser',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Website lead looking for matches in Gujarat or Mumbai.',
    createdAt: '2025-10-10 20:27',
  },
  {
    id: 'ld_051',
    leadId: 'LEAD-2025-051',
    name: 'Deepak Chhabria',
    mobile: '+91 98999 88331',
    email: 'deepak.c@gmail.com',
    gender: 'MALE',
    age: 30,
    city: 'Jaipur',
    subcaste: 'Baibhand',
    profession: 'Marble & Granites Exporter',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Requested callback regarding Gold membership package.',
    createdAt: '2025-10-10 20:28',
  },
  {
    id: 'ld_052',
    leadId: 'LEAD-2025-052',
    name: 'Pooja Mulchandani',
    mobile: '+91 98111 44559',
    email: 'pooja.mulchandani@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Nagpur',
    subcaste: 'Amil',
    profession: 'Senior Bio-statistician',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Father filled online inquiry form.',
    createdAt: '2025-10-10 20:29',
  },
  {
    id: 'ld_053',
    leadId: 'LEAD-2025-053',
    name: 'Rohit Advani',
    mobile: '+91 98222 11447',
    email: 'rohit.a@gmail.com',
    gender: 'MALE',
    age: 28,
    city: 'Mumbai',
    subcaste: 'Amil',
    profession: 'Associate Vice President (Axis Bank)',
    source: 'WEBSITE_FORM',
    priority: 'URGENT',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Immediate SLA Target',
    slaStatus: 'URGENT',
    notes: 'Candidate wants high-speed profile verification and assisted matches.',
    createdAt: '2025-10-10 20:30',
  },
  {
    id: 'ld_054',
    leadId: 'LEAD-2025-054',
    name: 'Geeta Wadhwani',
    mobile: '+91 98333 77114',
    email: 'geeta.w@gmail.com',
    gender: 'FEMALE',
    age: 29,
    city: 'Pune',
    subcaste: 'Larkana',
    profession: 'UX Researcher (Microsoft)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Candidate registered through modern landing page.',
    createdAt: '2025-10-10 20:31',
  },
  {
    id: 'ld_055',
    leadId: 'LEAD-2025-055',
    name: 'Ashish Vazirani',
    mobile: '+91 98444 99228',
    email: 'ashish.v@gmail.com',
    gender: 'MALE',
    age: 31,
    city: 'Bhopal',
    subcaste: 'Sahiti',
    profession: 'Packaging Materials Industrialist',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Requested callback regarding assisted marriage packages.',
    createdAt: '2025-10-10 20:32',
  },
  {
    id: 'ld_056',
    leadId: 'LEAD-2025-056',
    name: 'Nisha Gidwani',
    mobile: '+91 98555 22661',
    email: 'nisha.g@gmail.com',
    gender: 'FEMALE',
    age: 26,
    city: 'Indore',
    subcaste: 'Shikarpuri',
    profession: 'Interior Designer',
    source: 'WEBSITE_FORM',
    priority: 'MEDIUM',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 4 hours',
    slaStatus: 'ON_TIME',
    notes: 'Website lead; parents looking for Indore / MP Sindhi matches.',
    createdAt: '2025-10-10 20:33',
  },
  {
    id: 'ld_057',
    leadId: 'LEAD-2025-057',
    name: 'Rajesh Panjwani',
    mobile: '+91 98666 88115',
    email: 'rajesh.p@gmail.com',
    gender: 'MALE',
    age: 32,
    city: 'Ulhasnagar',
    subcaste: 'Baibhand',
    profession: 'Electronics Retailing Chain Owner',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Family submitted website form seeking Baibhand/Amil alliance.',
    createdAt: '2025-10-10 20:34',
  },
  {
    id: 'ld_058',
    leadId: 'LEAD-2025-058',
    name: 'Shweta Khemlani',
    mobile: '+91 98777 44996',
    email: 'shweta.k@gmail.com',
    gender: 'FEMALE',
    age: 28,
    city: 'Mumbai',
    subcaste: 'Amil',
    profession: 'Chartered Financial Analyst (Credit Suisse)',
    source: 'WEBSITE_FORM',
    priority: 'URGENT',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Immediate SLA Target',
    slaStatus: 'URGENT',
    notes: 'Urgent inquiry submitted on landing page.',
    createdAt: '2025-10-10 20:35',
  },
  {
    id: 'ld_059',
    leadId: 'LEAD-2025-059',
    name: 'Anand Dudani',
    mobile: '+91 98888 22773',
    email: 'anand.d@gmail.com',
    gender: 'MALE',
    age: 30,
    city: 'Delhi NCR',
    subcaste: 'Thattai',
    profession: 'Corporate Real Estate Advisory',
    source: 'CALLBACK_REQ',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Callback request from South Delhi Sindhi business family.',
    createdAt: '2025-10-10 20:36',
  },
  {
    id: 'ld_060',
    leadId: 'LEAD-2025-060',
    name: 'Heena Shivdasani',
    mobile: '+91 98999 66112',
    email: 'heena.s@gmail.com',
    gender: 'FEMALE',
    age: 27,
    city: 'Ahmedabad',
    subcaste: 'Larkana',
    profession: 'Senior Software Engineer (Oracle)',
    source: 'WEBSITE_FORM',
    priority: 'HIGH',
    status: 'NEW',
    assignedEmployeeId: '',
    assignedEmployeeName: 'Unassigned',
    assignedTeam: 'Unassigned Queue',
    nextFollowUp: 'Within 2 hours',
    slaStatus: 'ON_TIME',
    notes: 'Candidate registered through website portal for verified matches.',
    createdAt: '2025-10-10 20:37',
  },
];

// Initial Mock Call Logs
export const initialCallLogs: CallLog[] = [
  {
    id: 'clog_001',
    callLogId: 'CALL-2025-001',
    clientId: 'SIND001',
    clientName: 'Roshni Motwani',
    clientPhone: '+91 98****4321',
    date: '2025-10-10',
    startTime: '10:15 AM',
    endTime: '10:24 AM',
    durationSec: 540,
    direction: 'OUTGOING',
    status: 'CONNECTED',
    purpose: 'Share New Verified Match (Kunal Advani - SIND002)',
    outcome: 'MATCH_APPROVED',
    clientResponse: 'Client and mother reviewed Kunal Advani profile. Very happy with education and family background, agreed to send interest.',
    nextAction: 'Initiate candidate outreach call to Kunal Advani and verify his interest.',
    followUpDateTime: '2025-10-11 11:30 AM',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    notes: 'Exotel Telephony audio recording verified. High compatibility match discussed in depth.',
    recordedBy: 'Priya Sharma (EMP003)',
    callSource: 'TELEPHONY_EXOTEL',
    verificationStatus: 'VERIFIED',
    recordingUrl: 'https://cdn.sindhimatrimony.com/recordings/call_001.mp3',
    matchId: 'MATCH-2025-001',
  },
  {
    id: 'clog_002',
    callLogId: 'CALL-2025-002',
    clientId: 'SIND002',
    clientName: 'Kunal Advani',
    clientPhone: '+91 98****8901',
    date: '2025-10-10',
    startTime: '11:45 AM',
    endTime: '11:53 AM',
    durationSec: 480,
    direction: 'OUTGOING',
    status: 'CONNECTED',
    purpose: 'Candidate Mutual Interest Follow-up for Roshni Motwani',
    outcome: 'MATCH_APPROVED',
    clientResponse: 'Kunal reviewed Roshni Motwani biodata and photos. Stated he finds profile highly suitable. Mutual consent established.',
    nextAction: 'Schedule mutual family video conference call.',
    followUpDateTime: '2025-10-13 03:00 PM',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    notes: 'Candidate was very polite and confirmed willingness to connect with Roshni family.',
    recordedBy: 'Priya Sharma (EMP003)',
    callSource: 'TELEPHONY_EXOTEL',
    verificationStatus: 'VERIFIED',
    matchId: 'MATCH-2025-001',
  },
  {
    id: 'clog_003',
    callLogId: 'CALL-2025-003',
    clientId: 'SIND005',
    clientName: 'Varun Hingorani (Dubai)',
    clientPhone: '+971 50****1234',
    date: '2025-10-09',
    startTime: '04:00 PM',
    endTime: '04:12 PM',
    durationSec: 720,
    direction: 'OUTGOING',
    status: 'CONNECTED',
    purpose: 'NRI Assisted Matchmaking Monthly Review',
    outcome: 'WANTS_MORE_PROFILES',
    clientResponse: 'Varun requested 2 additional Amil profiles who are open to relocating to UAE.',
    nextAction: 'Filter Dubai-relocation open female candidates and curate next batch.',
    followUpDateTime: '2025-10-12 06:00 PM',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    notes: 'Candidate preferences updated in CRM database.',
    recordedBy: 'Priya Sharma (EMP003)',
    callSource: 'TELEPHONY_EXOTEL',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'clog_004',
    callLogId: 'CALL-2025-004',
    clientId: 'SIND003',
    clientName: 'Simran Chandnani',
    clientPhone: '+91 98****2211',
    date: '2025-10-08',
    startTime: '02:30 PM',
    endTime: '02:32 PM',
    durationSec: 0,
    direction: 'OUTGOING',
    status: 'NO_ANSWER',
    purpose: 'Membership renewal & new matches briefing',
    outcome: 'REQUESTED_CALLBACK',
    clientResponse: 'Call rang without answer. Sent WhatsApp follow-up reminder.',
    nextAction: 'Redial client next morning at 11 AM.',
    followUpDateTime: '2025-10-11 11:00 AM',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    notes: 'Auto-logged by system dialer.',
    recordedBy: 'Amit Bajaj (EMP004)',
    callSource: 'TELEPHONY_EXOTEL',
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'clog_005',
    callLogId: 'CALL-2025-005',
    clientId: 'SIND006',
    clientName: 'Pooja Mirchandani',
    clientPhone: '+91 98****9988',
    date: '2025-10-07',
    startTime: '05:10 PM',
    endTime: '05:22 PM',
    durationSec: 600,
    direction: 'INCOMING',
    status: 'CONNECTED',
    purpose: 'Client Feedback on Match Deep Vazirani',
    outcome: 'MATCH_REJECTED',
    clientResponse: 'Pooja family declined Deep Vazirani match due to city preference difference (prefers Delhi or Mumbai).',
    nextAction: 'Mark match as Declined by Client and archive suggestion.',
    followUpDateTime: '2025-10-13 01:00 PM',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    notes: 'Client was appreciative of prompt response and requested Delhi NCR candidates.',
    recordedBy: 'Priya Sharma (EMP003)',
    callSource: 'MANUAL',
    verificationStatus: 'MANUAL_ENTRY',
  },
];

// Initial Mock Tasks & Follow-ups
export const initialTasks: FollowUpTask[] = [
  {
    id: 'tsk_001',
    taskId: 'TSK-2025-001',
    clientId: 'SIND001',
    clientName: 'Roshni Motwani',
    taskType: 'PROFILE_SHARE',
    createdDate: '2025-10-09',
    dueDate: '2025-10-11',
    dueTime: '11:30 AM',
    priority: 'HIGH',
    status: 'DUE_TODAY',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    notes: 'Share Kunal Advani full horoscope & verified contact coordinates after mutual approval.',
  },
  {
    id: 'tsk_002',
    taskId: 'TSK-2025-002',
    clientId: 'SIND002',
    clientName: 'Kunal Advani',
    taskType: 'MEETING',
    createdDate: '2025-10-10',
    dueDate: '2025-10-13',
    dueTime: '03:00 PM',
    priority: 'URGENT',
    status: 'PENDING',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    notes: 'Coordinate Zoom introductory call between Advani and Motwani families.',
  },
  {
    id: 'tsk_003',
    taskId: 'TSK-2025-003',
    clientId: 'SIND003',
    clientName: 'Simran Chandnani',
    taskType: 'CALL',
    createdDate: '2025-10-08',
    dueDate: '2025-10-10',
    dueTime: '04:30 PM',
    priority: 'MEDIUM',
    status: 'OVERDUE',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    notes: 'Follow up on Gold membership renewal discount inquiry.',
  },
  {
    id: 'tsk_004',
    taskId: 'TSK-2025-004',
    clientId: 'SIND005',
    clientName: 'Varun Hingorani',
    taskType: 'CALL',
    createdDate: '2025-10-09',
    dueDate: '2025-10-12',
    dueTime: '06:00 PM',
    priority: 'HIGH',
    status: 'PENDING',
    assignedEmployeeId: 'emp_003',
    assignedEmployeeName: 'Priya Sharma',
    notes: 'Review 3 shortlisted NRI female candidates open for Dubai relocation.',
  },
  {
    id: 'tsk_005',
    taskId: 'TSK-2025-005',
    clientId: 'SIND004',
    clientName: 'Deepak Vazirani',
    taskType: 'PAYMENT_FOLLOWUP',
    createdDate: '2025-10-01',
    dueDate: '2025-10-05',
    dueTime: '12:00 PM',
    priority: 'LOW',
    status: 'COMPLETED',
    assignedEmployeeId: 'emp_004',
    assignedEmployeeName: 'Amit Bajaj',
    completionDate: '2025-10-05',
    outcome: 'Payment confirmed via Razorpay for Till Marriage plan.',
    notes: 'Invoice generated and delivered via email.',
  },
];

// Initial Mock Matches (Assisted Matchmaking & Hybrid Engine)
export const initialMatches: MatchRecommendation[] = [
  {
    id: 'mtc_001',
    matchId: 'MATCH-2025-001',
    pairKey: 'SIND001:SIND002',
    clientId: 'SIND001',
    clientName: 'Roshni Motwani',
    clientGender: 'FEMALE',
    clientCity: 'Mumbai',
    clientSubcaste: 'Amil',
    candidateId: 'SIND002',
    candidateName: 'Kunal Advani',
    candidateGender: 'MALE',
    candidateCity: 'Pune',
    candidateSubcaste: 'Baibhand',
    compatibilityScore: 94,
    compatibilityReasons: [
      'Compatible Subcaste Alliance (Amil & Baibhand)',
      'Gotra Different (Shandilya vs Kashyap - Verified Non-Conflict)',
      'Education Match: Both Postgraduates in Tech & Finance',
      'Location: Mumbai - Pune 2-hour proximity compatible',
      'Mutual Age criteria satisfied (26 & 29)',
    ],
    primarySource: 'EMPLOYEE_ASSISTED',
    sources: ['EMPLOYEE_ASSISTED'],
    reviewedByEmployeeId: 'emp_003',
    reviewedByEmployeeName: 'Priya Sharma',
    reviewStatus: 'APPROVED',
    reviewedAt: '2025-10-09 10:00 AM',
    sharedWithClientAt: '2025-10-09 10:30 AM',
    clientResponse: 'ACCEPTED',
    clientResponseAt: '2025-10-10 10:20 AM',
    clientResponseRecordedBy: 'EMPLOYEE',
    candidateResponse: 'ACCEPTED',
    candidateResponseAt: '2025-10-10 11:50 AM',
    candidateResponseRecordedBy: 'EMPLOYEE',
    overallStatus: 'MUTUAL_INTEREST',
    followUpDate: '2025-10-13',
    notes: 'High synergy match. Both families enthusiastic.',
    createdAt: '2025-10-08',
    auditHistory: [
      {
        id: 'aud_init_001',
        matchId: 'MATCH-2025-001',
        actorId: 'emp_003',
        actorName: 'Priya Sharma',
        actorRole: 'CRM_MANAGER',
        sourceType: 'EMPLOYEE_ASSISTED',
        actionType: 'INITIAL_GENERATION',
        timestamp: '2025-10-08T10:00:00Z',
        reason: 'Curated assisted recommendation for VIP client',
        previousStatus: 'NONE',
        resultingStatus: 'MUTUAL_INTEREST',
      },
    ],
    notifications: [
      {
        id: 'notif_init_001',
        recipientId: 'SIND001',
        recipientType: 'CLIENT',
        channel: 'PUSH_FCM',
        event: 'ASSISTED_MATCH_SUGGESTION',
        dispatchedAt: '2025-10-09T10:30:00Z',
        status: 'DELIVERED',
        deliveryNote: 'Delivered to Roshni Motwani mobile app',
      },
    ],
  },
  {
    id: 'mtc_002',
    matchId: 'MATCH-2025-002',
    pairKey: 'SIND001:SIND005',
    clientId: 'SIND001',
    clientName: 'Roshni Motwani',
    clientGender: 'FEMALE',
    clientCity: 'Mumbai',
    clientSubcaste: 'Amil',
    candidateId: 'SIND005',
    candidateName: 'Varun Hingorani',
    candidateGender: 'MALE',
    candidateCity: 'Dubai',
    candidateSubcaste: 'Amil',
    compatibilityScore: 89,
    compatibilityReasons: [
      'Same Subcaste (Amil)',
      'Gotra Non-Conflict (Shandilya vs Gautama)',
      'High Income synergy (Finance & Product)',
      'International lifestyle compatibility',
    ],
    primarySource: 'EMPLOYEE_ASSISTED',
    sources: ['EMPLOYEE_ASSISTED'],
    reviewedByEmployeeId: 'emp_003',
    reviewedByEmployeeName: 'Priya Sharma',
    reviewStatus: 'SHARED_WITH_CLIENT',
    reviewedAt: '2025-10-08 02:00 PM',
    sharedWithClientAt: '2025-10-08 04:00 PM',
    clientResponse: 'REQUESTED_MORE_INFO',
    clientResponseAt: '2025-10-09 11:00 AM',
    clientResponseRecordedBy: 'CLIENT',
    candidateResponse: 'PENDING',
    overallStatus: 'AWAITING_CLIENT_RESPONSE',
    followUpDate: '2025-10-12',
    notes: 'Client requested info on whether Varun plans to visit Mumbai soon.',
    createdAt: '2025-10-07',
    auditHistory: [
      {
        id: 'aud_init_002',
        matchId: 'MATCH-2025-002',
        actorId: 'emp_003',
        actorName: 'Priya Sharma',
        actorRole: 'CRM_MANAGER',
        sourceType: 'EMPLOYEE_ASSISTED',
        actionType: 'INITIAL_GENERATION',
        timestamp: '2025-10-07T14:00:00Z',
        reason: 'Curated Dubai-Mumbai high income profile',
        previousStatus: 'NONE',
        resultingStatus: 'AWAITING_CLIENT_RESPONSE',
      },
    ],
    notifications: [],
  },
  {
    id: 'mtc_003',
    matchId: 'MATCH-2025-003',
    pairKey: 'SIND004:SIND006',
    clientId: 'SIND006',
    clientName: 'Pooja Mirchandani',
    clientGender: 'FEMALE',
    clientCity: 'Delhi NCR',
    clientSubcaste: 'Baibhand',
    candidateId: 'SIND004',
    candidateName: 'Deepak Vazirani',
    candidateGender: 'MALE',
    candidateCity: 'Mumbai',
    candidateSubcaste: 'Larkana',
    compatibilityScore: 78,
    compatibilityReasons: [
      'Compatible Gotra',
      'Both from established Sindhi business/professional families',
    ],
    primarySource: 'AUTOMATIC_BACKEND',
    sources: ['AUTOMATIC_BACKEND'],
    reviewedByEmployeeId: 'emp_003',
    reviewedByEmployeeName: 'Priya Sharma',
    reviewStatus: 'APPROVED',
    reviewedAt: '2025-10-06 09:30 AM',
    sharedWithClientAt: '2025-10-06 10:00 AM',
    clientResponse: 'DECLINED',
    clientResponseAt: '2025-10-07 05:20 PM',
    clientResponseRecordedBy: 'EMPLOYEE',
    candidateResponse: 'PENDING',
    overallStatus: 'DECLINED_BY_CLIENT',
    followUpDate: '2025-10-13',
    notes: 'Declined by Pooja due to city relocation constraint.',
    createdAt: '2025-10-05',
    auditHistory: [
      {
        id: 'aud_init_003',
        matchId: 'MATCH-2025-003',
        actorId: 'system',
        actorName: 'Automated Match Engine',
        actorRole: 'SYSTEM',
        sourceType: 'AUTOMATIC_BACKEND',
        actionType: 'INITIAL_GENERATION',
        timestamp: '2025-10-05T08:00:00Z',
        reason: 'Daily Cron Match Generation',
        previousStatus: 'NONE',
        resultingStatus: 'PENDING_REVIEW',
      },
    ],
    notifications: [],
  },
  {
    id: 'mtc_004',
    matchId: 'MATCH-2025-004',
    pairKey: 'SIND002:SIND003',
    clientId: 'SIND003',
    clientName: 'Simran Chandnani',
    clientGender: 'FEMALE',
    clientCity: 'Ahmedabad',
    clientSubcaste: 'Sahiti',
    candidateId: 'SIND002',
    candidateName: 'Kunal Advani',
    candidateGender: 'MALE',
    candidateCity: 'Pune',
    candidateSubcaste: 'Baibhand',
    compatibilityScore: 82,
    compatibilityReasons: [
      'Education: Both high achievers (CA & MS Tech)',
      'Gotra Non-Conflict (Vatsa vs Kashyap)',
    ],
    primarySource: 'AUTOMATIC_BACKEND',
    sources: ['AUTOMATIC_BACKEND'],
    reviewedByEmployeeId: 'emp_004',
    reviewedByEmployeeName: 'Amit Bajaj',
    reviewStatus: 'PENDING_EMPLOYEE_REVIEW',
    clientResponse: 'PENDING',
    candidateResponse: 'PENDING',
    overallStatus: 'PENDING_REVIEW',
    notes: 'Generated by AI engine, awaiting employee verification before sharing.',
    createdAt: '2025-10-10',
    auditHistory: [
      {
        id: 'aud_init_004',
        matchId: 'MATCH-2025-004',
        actorId: 'system',
        actorName: 'Automated Match Engine',
        actorRole: 'SYSTEM',
        sourceType: 'AUTOMATIC_BACKEND',
        actionType: 'INITIAL_GENERATION',
        timestamp: '2025-10-10T08:00:00Z',
        reason: 'Daily Cron Match Generation',
        previousStatus: 'NONE',
        resultingStatus: 'PENDING_REVIEW',
      },
    ],
    notifications: [],
  },
];

// Initial Client Reassignment History
export const initialAssignmentsHistory: ClientAssignmentHistory[] = [
  {
    id: 'asg_001',
    clientId: 'SIND004',
    clientName: 'Deepak Vazirani',
    previousEmployeeId: 'emp_005',
    previousEmployeeName: 'Neha Lulla',
    newEmployeeId: 'emp_004',
    newEmployeeName: 'Amit Bajaj',
    reassignedAt: '2025-05-15 02:30 PM',
    reassignedBy: 'Priya Sharma (CRM_MANAGER)',
    reason: 'Workload balancing: Amit Bajaj has local Pune/Maharashtra network expertise.',
    previousStatus: 'CONTACTED',
    newStatus: 'MATCHMAKING_ACTIVE',
  },
  {
    id: 'asg_002',
    clientId: 'SIND001',
    clientName: 'Roshni Motwani',
    previousEmployeeId: 'emp_004',
    previousEmployeeName: 'Amit Bajaj',
    newEmployeeId: 'emp_003',
    newEmployeeName: 'Priya Sharma',
    reassignedAt: '2025-03-01 11:00 AM',
    reassignedBy: 'Kavita Chhabria (ADMIN)',
    reason: 'Client upgraded to Platinum VIP Tier; assigned to Senior Matchmaker Priya Sharma.',
    previousStatus: 'INTERESTED',
    newStatus: 'MATCHMAKING_ACTIVE',
  },
];

// Initial Lead Reassignment Audit Records (Tracking agent unable to convince / lead transfers)
export const initialLeadAssignmentRecords: LeadAssignmentRecord[] = [
  {
    id: 'lar_001',
    leadId: 'LEAD-2025-004',
    leadName: 'Manish Gidwani',
    previousEmployeeId: 'emp_005',
    previousEmployeeName: 'Neha Lulla',
    newEmployeeId: 'emp_004',
    newEmployeeName: 'Amit Bajaj',
    reassignedAt: '2025-09-20 11:30 AM',
    reassignedBy: 'Priya Sharma (CRM_MANAGER)',
    reason: 'Agent unable to convince / Customer requested matchmaker with MP/Indore network',
    handoverNotes: 'Neha followed up twice but candidate had questions on business profiles. Amit Bajaj intervened and closed Gold plan.',
    previousStatus: 'CONTACTED',
    newStatus: 'ASSIGNED',
  },
];

// Initial Sales Transactions
export const initialTransactions: SalesTransaction[] = [
  {
    id: 'txn_001',
    transactionId: 'TXN-2025-1001',
    clientId: 'SIND001',
    clientName: 'Roshni Motwani',
    employeeId: 'emp_003',
    employeeName: 'Priya Sharma',
    planName: 'PLATINUM',
    amount: 45000,
    tax: 8100,
    totalAmount: 53100,
    paymentGateway: 'RAZORPAY',
    paymentStatus: 'SUCCESS',
    date: '2025-09-15',
    isRenewal: false,
  },
  {
    id: 'txn_002',
    transactionId: 'TXN-2025-1002',
    clientId: 'SIND002',
    clientName: 'Kunal Advani',
    employeeId: 'emp_003',
    employeeName: 'Priya Sharma',
    planName: 'PLATINUM',
    amount: 45000,
    tax: 8100,
    totalAmount: 53100,
    paymentGateway: 'RAZORPAY',
    paymentStatus: 'SUCCESS',
    date: '2025-08-20',
    isRenewal: false,
  },
  {
    id: 'txn_003',
    transactionId: 'TXN-2025-1003',
    clientId: 'SIND004',
    clientName: 'Deepak Vazirani',
    employeeId: 'emp_004',
    employeeName: 'Amit Bajaj',
    planName: 'TILL_MARRIAGE',
    amount: 85000,
    tax: 15300,
    totalAmount: 100300,
    paymentGateway: 'RAZORPAY',
    paymentStatus: 'SUCCESS',
    date: '2025-07-10',
    isRenewal: false,
  },
  {
    id: 'txn_004',
    transactionId: 'TXN-2025-1004',
    clientId: 'SIND003',
    clientName: 'Simran Chandnani',
    employeeId: 'emp_004',
    employeeName: 'Amit Bajaj',
    planName: 'GOLD',
    amount: 25000,
    tax: 4500,
    totalAmount: 29500,
    paymentGateway: 'RAZORPAY',
    paymentStatus: 'SUCCESS',
    date: '2025-06-05',
    isRenewal: false,
  },
  {
    id: 'txn_005',
    transactionId: 'TXN-2025-1005',
    clientId: 'SIND005',
    clientName: 'Varun Hingorani',
    employeeId: 'emp_003',
    employeeName: 'Priya Sharma',
    planName: 'PLATINUM',
    amount: 55000,
    tax: 9900,
    totalAmount: 64900,
    paymentGateway: 'RAZORPAY',
    paymentStatus: 'SUCCESS',
    date: '2025-10-01',
    isRenewal: false,
  },
];

// Initial Unified Activity Timeline
export const initialActivities: ActivityTimelineEvent[] = [
  {
    id: 'act_001',
    employeeId: 'emp_003',
    timestamp: '2025-10-10 11:50 AM',
    type: 'CANDIDATE_RESPONSE_RECEIVED',
    title: 'Candidate Accepted Match',
    description: 'Kunal Advani accepted match with Roshni Motwani (MATCH-2025-001). Status transitioned to Mutual Interest.',
    entityType: 'MATCH',
    entityId: 'MATCH-2025-001',
    badgeColor: 'emerald',
  },
  {
    id: 'act_002',
    employeeId: 'emp_003',
    timestamp: '2025-10-10 10:20 AM',
    type: 'CLIENT_RESPONSE_RECEIVED',
    title: 'Client Approved Match',
    description: 'Roshni Motwani reviewed and approved candidate Kunal Advani via assisted call.',
    entityType: 'MATCH',
    entityId: 'MATCH-2025-001',
    badgeColor: 'blue',
  },
  {
    id: 'act_003',
    employeeId: 'emp_003',
    timestamp: '2025-10-10 10:15 AM',
    type: 'CALL_LOGGED',
    title: 'Outbound Exotel Call Logged',
    description: 'Logged 9 min verified call with Roshni Motwani. Outcome: Match Approved.',
    entityType: 'CALL',
    entityId: 'CALL-2025-001',
    badgeColor: 'purple',
  },
  {
    id: 'act_004',
    employeeId: 'emp_003',
    timestamp: '2025-10-09 10:30 AM',
    type: 'PROFILE_SHARED',
    title: 'Match Profile Shared',
    description: 'Shared verified profile of Kunal Advani with Roshni Motwani.',
    entityType: 'MATCH',
    entityId: 'MATCH-2025-001',
    badgeColor: 'indigo',
  },
  {
    id: 'act_005',
    employeeId: 'emp_003',
    timestamp: '2025-10-09 10:00 AM',
    type: 'MATCH_REVIEWED',
    title: 'Assisted Match Approved',
    description: 'Priya Sharma verified gotra & subcaste compatibility for Roshni Motwani and Kunal Advani.',
    entityType: 'MATCH',
    entityId: 'MATCH-2025-001',
    badgeColor: 'teal',
  },
  {
    id: 'act_006',
    employeeId: 'emp_003',
    timestamp: '2025-10-01 03:00 PM',
    type: 'MEMBERSHIP_PURCHASED',
    title: 'Platinum Membership Sold',
    description: 'Varun Hingorani purchased Platinum NRI Plan (₹64,900 incl tax). Attributed to Priya Sharma.',
    entityType: 'TRANSACTION',
    entityId: 'TXN-2025-1005',
    badgeColor: 'amber',
  },
];

// Initial Staff/Team Chat Messages (Super Admin <-> Employee)
export const initialTeamChatMessages: TeamChatMessage[] = [
  {
    id: 'msg_001',
    senderId: 'emp_001',
    senderName: 'Rajesh Mulchandani',
    senderRole: 'SUPER_ADMIN',
    recipientId: 'emp_003',
    recipientName: 'Priya Sharma',
    recipientRole: 'CRM_MANAGER',
    content: 'Hi Priya, I have assigned 5 high-priority Sindhi Bhaiband leads to your queue this morning. Please make sure to connect with them today and record what responses come from the customers.',
    timestamp: '10:15 AM',
    read: true,
  },
  {
    id: 'msg_002',
    senderId: 'emp_003',
    senderName: 'Priya Sharma',
    senderRole: 'CRM_MANAGER',
    recipientId: 'emp_001',
    recipientName: 'Rajesh Mulchandani',
    recipientRole: 'SUPER_ADMIN',
    content: 'Good morning sir! Yes, I called Karan Advani (LEAD-2025-001) and Roshni Motwani. Karan\'s father was very responsive and asked for 2-3 shortlisted Bhaiband CA/Engineer biodatas on WhatsApp. I have logged the response in the CRM lead details.',
    timestamp: '11:30 AM',
    read: true,
    leadReference: {
      leadId: 'LEAD-2025-001',
      leadName: 'Karan Advani',
      status: 'ASSIGNED',
      subcaste: 'Amil',
      mobile: '+91 98200 44321',
    },
  },
  {
    id: 'msg_003',
    senderId: 'emp_001',
    senderName: 'Rajesh Mulchandani',
    senderRole: 'SUPER_ADMIN',
    recipientId: 'emp_003',
    recipientName: 'Priya Sharma',
    recipientRole: 'CRM_MANAGER',
    content: 'Excellent! If their family asks for our Gold Assisted Matchmaking membership, you have approval to offer a 10% Sindhi community concession. Keep me posted on conversion.',
    timestamp: '12:05 PM',
    read: true,
  },
  {
    id: 'msg_004',
    senderId: 'emp_004',
    senderName: 'Amit Bajaj',
    senderRole: 'CRM_AGENT',
    recipientId: 'emp_001',
    recipientName: 'Rajesh Mulchandani',
    recipientRole: 'SUPER_ADMIN',
    content: 'Sir, I reached out to Deepak Vazirani. The customer said they are currently traveling in Dubai and requested a callback next Tuesday at 4:00 PM. I updated the follow-up and user response in CRM.',
    timestamp: '01:20 PM',
    read: true,
    leadReference: {
      leadId: 'LEAD-2025-003',
      leadName: 'Deepak Vazirani',
      status: 'CONTACTED',
      subcaste: 'Larkana',
      mobile: '+91 98333 22211',
    },
  },
  {
    id: 'msg_005',
    senderId: 'emp_001',
    senderName: 'Rajesh Mulchandani',
    senderRole: 'SUPER_ADMIN',
    recipientId: 'emp_004',
    recipientName: 'Amit Bajaj',
    recipientRole: 'CRM_AGENT',
    content: 'Noted Amit. Please ensure the CRM reminder is set so follow-up is not missed.',
    timestamp: '01:45 PM',
    read: true,
  },
];

export const initialSuccessStories: SuccessStory[] = [
  {
    id: 'story_001',
    storyId: 'SUCC-2025-001',
    groomId: 'cl_001',
    groomName: 'Rahul Jagtiani',
    groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    brideId: 'cl_002',
    brideName: 'Priya Mansukhani',
    bridePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    couplePhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
    weddingDate: '2025-11-20',
    engagementDate: '2025-05-14',
    storyTitle: 'From Assisted Matchmaking to Royal Vivah in Jaipur',
    storyDescription: 'Our families connected through Sindhi Matrimony. Both of us were looking for traditional Sindhi values with modern thinking. RM Priya Sharma assisted throughout the horoscope match and family meetup.',
    city: 'Mumbai',
    subcaste: 'Amil',
    attributedEmployeeId: 'emp_003',
    attributedEmployeeName: 'Priya Sharma',
    status: 'PUBLISHED',
    featuredOnHome: true,
    profilesArchived: true,
    createdAt: '2025-11-25',
    updatedAt: '2025-11-25',
  },
  {
    id: 'story_002',
    storyId: 'SUCC-2025-002',
    groomId: 'cl_004',
    groomName: 'Kunal Advani',
    groomPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    brideId: 'cl_005',
    brideName: 'Simran Chhabria',
    bridePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    couplePhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    weddingDate: '2025-12-10',
    engagementDate: '2025-07-22',
    storyTitle: 'Destined Alliance in Pune',
    storyDescription: 'We matched through the automated 36 Guna Kundli score (32 Gunas!). Kunal was in Tech and Simran in Finance. Huge gratitude to the team for making biodata exchange so transparent.',
    city: 'Pune',
    subcaste: 'Bhaiband',
    attributedEmployeeId: 'emp_004',
    attributedEmployeeName: 'Amit Bajaj',
    status: 'PUBLISHED',
    featuredOnHome: true,
    profilesArchived: true,
    createdAt: '2025-12-15',
    updatedAt: '2025-12-15',
  },
  {
    id: 'story_003',
    storyId: 'SUCC-2026-003',
    groomId: 'cl_007',
    groomName: 'Varun Wadhwani',
    groomPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    brideId: 'cl_008',
    brideName: 'Muskaan Rohra',
    bridePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    couplePhoto: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    weddingDate: '2026-02-14',
    engagementDate: '2025-09-10',
    storyTitle: 'Cross-City Match: Delhi to Dubai',
    storyDescription: 'Finding a reliable Sindhi match across countries seemed daunting until we used VIP Concierge. Virtual family meetings were arranged by the portal with complete privacy.',
    city: 'Dubai / Delhi',
    subcaste: 'Sahiti',
    attributedEmployeeId: 'emp_003',
    attributedEmployeeName: 'Priya Sharma',
    status: 'PUBLISHED',
    featuredOnHome: false,
    profilesArchived: true,
    createdAt: '2026-02-18',
    updatedAt: '2026-02-18',
  },
  {
    id: 'story_004',
    storyId: 'SUCC-2026-004',
    groomId: 'cl_010',
    groomName: 'Deepak Motwani',
    groomPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    brideId: 'cl_011',
    brideName: 'Ananya Gurnani',
    bridePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    couplePhoto: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80',
    weddingDate: '2026-04-05',
    engagementDate: '2025-12-01',
    storyTitle: 'Sammelan Meetup to Happy Forever',
    storyDescription: 'Met at the Indore Sindhi Parichay Sammelan event badge scan. The team was supportive and verified all details swiftly.',
    city: 'Indore',
    subcaste: 'Larkana',
    attributedEmployeeId: 'emp_004',
    attributedEmployeeName: 'Amit Bajaj',
    status: 'DRAFT',
    featuredOnHome: false,
    profilesArchived: false,
    createdAt: '2026-04-06',
    updatedAt: '2026-04-06',
  },
];

export const initialReviews: ReviewItem[] = [
  {
    id: 'rev_001',
    reviewId: 'REV-2026-001',
    memberId: 'cl_001',
    memberName: 'Haresh Jagtiani (Parent)',
    memberPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Extremely professional and family-friendly service',
    comment: 'The relationship manager took care of gotra checks and verified documents before suggesting matches. Saved our family countless hours of awkward calls.',
    source: 'GOOGLE',
    category: 'MATCHMAKING',
    status: 'APPROVED',
    adminResponse: 'Thank you Haresh ji! It was an absolute honour serving your family. Wishing the couple all the happiness!',
    adminRespondedAt: '2026-02-12',
    createdAt: '2026-02-10',
    helpfulCount: 24,
  },
  {
    id: 'rev_002',
    reviewId: 'REV-2026-002',
    memberId: 'cl_003',
    memberName: 'Pooja Mirchandani',
    memberPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Kundli Milan feature is spot on!',
    comment: 'The 36 gunas breakdown and Manglik analysis directly on the portal gave our elders immense confidence. Beautiful UI as well.',
    source: 'IN_APP',
    category: 'HOROSCOPE',
    status: 'APPROVED',
    createdAt: '2026-03-01',
    helpfulCount: 18,
  },
  {
    id: 'rev_003',
    reviewId: 'REV-2026-003',
    memberId: 'cl_005',
    memberName: 'Suresh Lulla',
    rating: 4,
    title: 'Good profiles, verified phone numbers',
    comment: 'Almost 90% of profiles I connected with had verified identities. Would love more filters for foreign NRI Sindhis.',
    source: 'WEBSITE',
    category: 'MATCHMAKING',
    status: 'APPROVED',
    adminResponse: 'Thanks Suresh ji! We are rolling out dedicated UAE & US NRI search filters this month.',
    adminRespondedAt: '2026-03-06',
    createdAt: '2026-03-05',
    helpfulCount: 11,
  },
  {
    id: 'rev_004',
    reviewId: 'REV-2026-004',
    memberId: 'cl_009',
    memberName: 'Vandana Rohra',
    rating: 5,
    title: 'Photo privacy and Parda mode gave great safety',
    comment: 'As a working professional woman, I did not want my photos public. The request-to-view feature was respected by everyone.',
    source: 'IN_APP',
    category: 'OVERALL',
    status: 'APPROVED',
    createdAt: '2026-03-12',
    helpfulCount: 30,
  },
  {
    id: 'rev_005',
    reviewId: 'REV-2026-005',
    memberId: 'cl_012',
    memberName: 'Ramesh Vazirani',
    rating: 2,
    title: 'Support response took 2 days over weekend',
    comment: 'I submitted payment for Gold renewal on Saturday night but activation happened on Monday afternoon.',
    source: 'GOOGLE',
    category: 'CUSTOMER_SUPPORT',
    status: 'PENDING',
    createdAt: '2026-04-01',
    helpfulCount: 3,
  },
  {
    id: 'rev_006',
    reviewId: 'REV-2026-006',
    memberId: 'cl_014',
    memberName: 'Divya Chawla',
    rating: 5,
    title: 'Found my life partner within 3 months',
    comment: 'Smooth experience, genuine profiles, and dedicated support from RM Amit Bajaj.',
    source: 'RELATIONSHIP_MANAGER',
    category: 'MATCHMAKING',
    status: 'APPROVED',
    adminResponse: 'Warmest congratulations to Divya and family from the entire team!',
    adminRespondedAt: '2026-04-05',
    createdAt: '2026-04-04',
    helpfulCount: 15,
  },
];

export const initialBlacklistedIdentities: BlacklistedIdentity[] = [
  {
    id: 'blk_001',
    memberId: 'cl_fake_99',
    fullName: 'Vikram Grover (Impersonator)',
    phone: '+91 99887 76655',
    aadhaarHash: 'XXXX-XXXX-9901',
    deviceId: 'DEV-IPHONE-A15-B9901',
    reason: 'Financial extortion: Demanded ₹50,000 for emergency medical travel before meeting',
    severity: 'CRITICAL',
    blacklistedBy: 'Rajesh Mulchandani (SUPER_ADMIN)',
    blacklistedAt: '2026-03-28',
  },
  {
    id: 'blk_002',
    memberId: 'cl_fake_88',
    fullName: 'Sunil Nagpal',
    phone: '+91 98200 44332',
    aadhaarHash: 'XXXX-XXXX-4432',
    deviceId: 'DEV-SM-G998B-7721',
    reason: 'Already married with 2 children; falsified NEVER_MARRIED status with forged documents',
    severity: 'CRITICAL',
    blacklistedBy: 'Operations Admin',
    blacklistedAt: '2026-04-02',
  },
];

export const initialAbuseReports: AbuseReport[] = [
  {
    id: 'rep_001',
    reportId: 'REP-2026-001',
    reporterId: 'cl_002',
    reporterName: 'Priya Mansukhani',
    reporterPhone: '+91 98111 22334',
    reportedMemberId: 'cl_015',
    reportedMemberName: 'Kailash Chawla',
    reportedMemberPhone: '+91 98765 00112',
    reportedMemberAadhaarHash: 'XXXX-XXXX-7812',
    reportedMemberDeviceId: 'DEV-PIXEL7-0011',
    reportedMemberPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    reason: 'MONEY_EXTORTION',
    severity: 'CRITICAL',
    evidenceText: 'Candidate claimed his wallet and international cards were stolen at Dubai airport and insisted that our family wire ₹35,000 via UPI immediately to prove our commitment to the match.',
    chatSnippet: 'Candidate: "If your family really wants this alliance, send ₹35k urgently to my friend\'s GPay number. Will adjust in wedding gifts."',
    callLogSnippet: 'Call on 11 Apr: Repeated aggressive monetary demands reported by girl\'s father.',
    status: 'OPEN',
    createdAt: '2026-04-11',
    updatedAt: '2026-04-11',
  },
  {
    id: 'rep_002',
    reportId: 'REP-2026-002',
    reporterId: 'cl_008',
    reporterName: 'Muskaan Rohra',
    reporterPhone: '+91 98222 33445',
    reportedMemberId: 'cl_016',
    reportedMemberName: 'Rohan Talreja',
    reportedMemberPhone: '+91 98333 44556',
    reportedMemberAadhaarHash: 'XXXX-XXXX-3344',
    reportedMemberDeviceId: 'DEV-ONEPLUS11-99',
    reportedMemberPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    reason: 'MISBEHAVIOR_CALL',
    severity: 'HIGH',
    evidenceText: 'Used inappropriate and abusive language when my parents declined the proposal due to horoscope mismatch (Nadi Dosha). Threatened to post false claims.',
    callLogSnippet: 'Call recorded on 12 Apr, duration 4m 12s: Hostile and unparliamentary tone confirmed.',
    status: 'OPEN',
    createdAt: '2026-04-12',
    updatedAt: '2026-04-12',
  },
  {
    id: 'rep_003',
    reportId: 'REP-2026-003',
    reporterId: 'cl_003',
    reporterName: 'Vikram Advani',
    reporterPhone: '+91 98444 55667',
    reportedMemberId: 'cl_017',
    reportedMemberName: 'Simran Lalwani',
    reportedMemberPhone: '+91 98666 77889',
    reportedMemberAadhaarHash: 'XXXX-XXXX-9988',
    reportedMemberDeviceId: 'DEV-IPHONE13-88',
    reportedMemberPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    reason: 'FAKE_PROFILE',
    severity: 'MEDIUM',
    evidenceText: 'Photos uploaded belong to a known fashion influencer in Spain. When asked for video call verification on WhatsApp, candidate refused repeatedly.',
    chatSnippet: 'Reporter: "Can we do a quick video call with parents?" / Suspect: "My front camera is broken, just trust the pictures."',
    status: 'UNDER_INVESTIGATION',
    createdAt: '2026-04-09',
    updatedAt: '2026-04-10',
  },
  {
    id: 'rep_004',
    reportId: 'REP-2026-004',
    reporterId: 'cl_005',
    reporterName: 'Suresh Lulla',
    reporterPhone: '+91 98555 66778',
    reportedMemberId: 'cl_018',
    reportedMemberName: 'Manish Chhabria',
    reportedMemberPhone: '+91 98999 11223',
    reportedMemberAadhaarHash: 'XXXX-XXXX-1122',
    reportedMemberDeviceId: 'DEV-VIVO-V27-33',
    reportedMemberPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    reason: 'ALREADY_MARRIED',
    severity: 'CRITICAL',
    evidenceText: 'Candidate is already married to a woman in Ulhasnagar since 2021. Mutual family friends confirmed marriage and sent wedding invitation card photo.',
    status: 'OPEN',
    createdAt: '2026-04-13',
    updatedAt: '2026-04-13',
  },
];

// Central Reactive CRM Store Class
class CRMDataService {
  private employees: Employee[] = initialEmployees;
  private clients: ClientProfile[] = initialClients;
  private leads: Lead[] = initialLeads;
  private callLogs: CallLog[] = initialCallLogs;
  private tasks: FollowUpTask[] = initialTasks;
  private successStories: SuccessStory[] = initialSuccessStories;
  private reviews: ReviewItem[] = initialReviews;
  private abuseReports: AbuseReport[] = initialAbuseReports;
  private blacklistedIdentities: BlacklistedIdentity[] = initialBlacklistedIdentities;
  private matches: MatchRecommendation[] = initialMatches;
  private assignmentHistory: ClientAssignmentHistory[] = initialAssignmentsHistory;
  private leadAssignmentRecords: LeadAssignmentRecord[] = initialLeadAssignmentRecords;
  private transactions: SalesTransaction[] = initialTransactions;
  private activities: ActivityTimelineEvent[] = initialActivities;
  private teamChatMessages: TeamChatMessage[] = initialTeamChatMessages;
  private blockedPairs: Map<string, { blockerId: string; blockedId: string; reason: string; timestamp: string }> = new Map();
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.employees && Array.isArray(parsed.employees)) {
          this.employees = parsed.employees.map((emp: Employee) => ({
            ...emp,
            allowedSections: emp.allowedSections || getDefaultAllowedSectionsForRole(emp.role),
          }));
        }
        if (parsed.clients) this.clients = parsed.clients;
        if (parsed.leads && Array.isArray(parsed.leads) && parsed.leads.length >= 20) {
          this.leads = parsed.leads;
        } else {
          this.leads = initialLeads;
        }
        // Ensure callResponses array on each lead
        this.leads.forEach((l) => {
          if (!l.callResponses) {
            const foundInInit = initialLeads.find((il) => il.id === l.id);
            l.callResponses = foundInInit?.callResponses || [];
          }
        });
        if (parsed.callLogs) this.callLogs = parsed.callLogs;
        if (parsed.tasks) this.tasks = parsed.tasks;
        if (parsed.matches) {
          this.matches = parsed.matches.map((m: MatchRecommendation) => ({
            ...m,
            pairKey: m.pairKey || [m.clientId, m.candidateId].sort().join(':'),
            primarySource: m.primarySource || 'EMPLOYEE_ASSISTED',
            sources: m.sources || [m.primarySource || 'EMPLOYEE_ASSISTED'],
            auditHistory: m.auditHistory || [],
            notifications: m.notifications || [],
          }));
        }
        if (parsed.blockedPairs && Array.isArray(parsed.blockedPairs)) {
          parsed.blockedPairs.forEach(([k, v]: [string, any]) => this.blockedPairs.set(k, v));
        }
        if (parsed.assignmentHistory) this.assignmentHistory = parsed.assignmentHistory;
        if (parsed.leadAssignmentRecords) this.leadAssignmentRecords = parsed.leadAssignmentRecords;
        if (parsed.transactions) this.transactions = parsed.transactions;
        if (parsed.activities) this.activities = parsed.activities;
        if (parsed.teamChatMessages && Array.isArray(parsed.teamChatMessages)) {
          this.teamChatMessages = parsed.teamChatMessages;
        } else {
          this.teamChatMessages = initialTeamChatMessages;
        }
        if (parsed.successStories && Array.isArray(parsed.successStories)) {
          this.successStories = parsed.successStories;
        } else {
          this.successStories = initialSuccessStories;
        }
        if (parsed.reviews && Array.isArray(parsed.reviews)) {
          this.reviews = parsed.reviews;
        } else {
          this.reviews = initialReviews;
        }
        if (parsed.abuseReports && Array.isArray(parsed.abuseReports)) {
          this.abuseReports = parsed.abuseReports;
        } else {
          this.abuseReports = initialAbuseReports;
        }
        if (parsed.blacklistedIdentities && Array.isArray(parsed.blacklistedIdentities)) {
          this.blacklistedIdentities = parsed.blacklistedIdentities;
        } else {
          this.blacklistedIdentities = initialBlacklistedIdentities;
        }
      }
    } catch (e) {
      console.error('Failed to load CRM state from localStorage:', e);
    }
  }

  private saveState() {
    try {
      if (typeof window === 'undefined') return;
      const data = {
        employees: this.employees,
        clients: this.clients,
        leads: this.leads,
        callLogs: this.callLogs,
        tasks: this.tasks,
        matches: this.matches,
        successStories: this.successStories,
        reviews: this.reviews,
        abuseReports: this.abuseReports,
        blacklistedIdentities: this.blacklistedIdentities,
        blockedPairs: Array.from(this.blockedPairs.entries()),
        assignmentHistory: this.assignmentHistory,
        leadAssignmentRecords: this.leadAssignmentRecords,
        transactions: this.transactions,
        activities: this.activities,
        teamChatMessages: this.teamChatMessages,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to persist CRM state:', e);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  // --- Employees ---
  public getEmployees(): Employee[] {
    return [...this.employees];
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.employees.find((e) => e.id === id || e.employeeId === id);
  }

  public getEmployeeByEmail(email: string): Employee | undefined {
    const clean = email.trim().toLowerCase();
    return this.employees.find((e) => e.email.trim().toLowerCase() === clean);
  }

  public addEmployee(emp: Employee): Employee {
    const idx = this.employees.findIndex((e) => e.id === emp.id || e.employeeId === emp.employeeId);
    if (idx !== -1) {
      this.employees[idx] = { ...this.employees[idx], ...emp };
    } else {
      this.employees.unshift(emp);
    }
    this.saveState();
    return emp;
  }

  public updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const idx = this.employees.findIndex((e) => e.id === id || e.employeeId === id);
    if (idx === -1) return null;
    this.employees[idx] = { ...this.employees[idx], ...updates };
    this.saveState();
    return this.employees[idx];
  }

  // --- Clients ---
  public getClients(): ClientProfile[] {
    return [...this.clients];
  }

  public getClientById(id: string): ClientProfile | undefined {
    return this.clients.find((c) => c.id === id || c.clientId === id);
  }

  public getClientsByEmployee(employeeId: string): ClientProfile[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.clients.filter(
      (c) => c.assignedEmployeeId === emp.id || c.assignedEmployeeId === emp.employeeId
    );
  }

  // --- Leads ---
  public getLeads(): Lead[] {
    return [...this.leads];
  }

  public getUnassignedLeads(): Lead[] {
    return this.leads.filter((l) => l.status === 'NEW' || !l.assignedEmployeeId);
  }

  public getLeadById(id: string): Lead | undefined {
    return this.leads.find((l) => l.id === id || l.leadId === id);
  }

  public getLeadsByEmployee(employeeId: string): Lead[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.leads.filter(
      (l) => l.assignedEmployeeId === emp.id || l.assignedEmployeeId === emp.employeeId
    );
  }

  /**
   * Batch assign leads to an employee with strict exclusivity and capacity validations
   * Required: "20, 20 data assign honge and jo users ka data employees ko assign ho gya to baki k employees ko assign nhi ho sakta hai"
   */
  public assignLeadsBatch(
    leadIds: string[],
    employeeId: string,
    assignedBy: string,
    notes?: string
  ): {
    success: boolean;
    assignedCount: number;
    error?: string;
    failures?: { leadId: string; reason: string }[];
  } {
    if (!leadIds || leadIds.length === 0) {
      return { success: false, assignedCount: 0, error: 'No leads selected for assignment.' };
    }

    const targetEmp = this.getEmployeeById(employeeId);
    if (!targetEmp) {
      return { success: false, assignedCount: 0, error: 'Selected employee not found.' };
    }

    if (!targetEmp.isActive) {
      return {
        success: false,
        assignedCount: 0,
        error: `${targetEmp.fullName} is currently marked inactive and cannot receive new leads.`,
      };
    }

    // No restriction on lead assignment count as per business rules
    // Admin can assign any number of leads without capacity caps

    // Exclusivity Check: Once assigned, cannot be assigned to another employee
    const alreadyAssigned = this.leads.filter(
      (l) => leadIds.includes(l.id) && l.status !== 'NEW' && l.assignedEmployeeId && l.assignedEmployeeId !== ''
    );

    if (alreadyAssigned.length > 0) {
      const conflictNames = alreadyAssigned
        .map((l) => `${l.name} (${l.leadId} - Assigned to ${l.assignedEmployeeName})`)
        .slice(0, 3)
        .join(', ');
      const extra = alreadyAssigned.length > 3 ? ` and ${alreadyAssigned.length - 3} more` : '';

      return {
        success: false,
        assignedCount: 0,
        error: `Exclusivity Locked: ${alreadyAssigned.length} selected lead(s) are already assigned to employees (${conflictNames}${extra}). Once assigned to an employee, leads cannot be assigned to another employee.`,
      };
    }

    // Execute Assignment
    let assignedCount = 0;
    const nowTime = new Date().toLocaleString();

    this.leads = this.leads.map((l) => {
      if (leadIds.includes(l.id)) {
        assignedCount++;
        return {
          ...l,
          status: 'ASSIGNED',
          assignedEmployeeId: targetEmp.id,
          assignedEmployeeName: targetEmp.fullName,
          assignedTeam: targetEmp.team,
          nextFollowUp: 'Immediate outreach SLA (Today)',
          slaStatus: 'URGENT',
          notes: notes
            ? `${l.notes || ''} [Batch assigned to ${targetEmp.fullName} by ${assignedBy} on ${nowTime}: ${notes}]`
            : l.notes,
        };
      }
      return l;
    });

    // Update Employee lead count
    targetEmp.activeLeadsCount += assignedCount;

    // Log Activity
    this.addActivity({
      employeeId: targetEmp.id,
      timestamp: nowTime,
      type: 'LEAD_ASSIGNED',
      title: `Batch Assigned: ${assignedCount} Website Leads`,
      description: `${assignedCount} leads assigned to ${targetEmp.fullName} (${targetEmp.employeeId}) by ${assignedBy}.`,
      entityType: 'LEAD',
      entityId: `BATCH-${Date.now()}`,
      badgeColor: 'emerald',
    });

    this.saveState();
    return { success: true, assignedCount };
  }

  public getLeadAssignmentHistory(leadId?: string): LeadAssignmentRecord[] {
    if (leadId) {
      return this.leadAssignmentRecords.filter((r) => r.leadId === leadId);
    }
    return [...this.leadAssignmentRecords];
  }

  public reassignLead(
    leadId: string,
    newEmployeeId: string,
    reassignedBy: string,
    reason: string,
    handoverNotes?: string
  ): { success: boolean; error?: string; record?: LeadAssignmentRecord } {
    const lead = this.leads.find((l) => l.id === leadId || l.leadId === leadId);
    if (!lead) return { success: false, error: 'Lead not found.' };

    const newEmp = this.getEmployeeById(newEmployeeId);
    if (!newEmp) return { success: false, error: 'Target employee not found.' };

    if (!reason || reason.trim() === '') {
      return { success: false, error: 'Reassignment reason is mandatory for audit records.' };
    }

    const prevEmp = this.getEmployeeById(lead.assignedEmployeeId);
    const prevEmpName = prevEmp ? prevEmp.fullName : lead.assignedEmployeeName || 'Unassigned';

    // Workload rebalance
    if (prevEmp && prevEmp.activeLeadsCount > 0) {
      prevEmp.activeLeadsCount -= 1;
    }
    newEmp.activeLeadsCount += 1;

    const record: LeadAssignmentRecord = {
      id: `lar_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      leadId: lead.leadId,
      leadName: lead.name,
      previousEmployeeId: lead.assignedEmployeeId || '',
      previousEmployeeName: prevEmpName,
      newEmployeeId: newEmp.id,
      newEmployeeName: newEmp.fullName,
      reassignedAt: new Date().toLocaleString(),
      reassignedBy,
      reason,
      handoverNotes,
      previousStatus: lead.status,
      newStatus: 'ASSIGNED',
    };

    this.leadAssignmentRecords = [record, ...this.leadAssignmentRecords];

    // Append to lead history
    lead.assignmentHistory = [record, ...(lead.assignmentHistory || [])];
    lead.assignedEmployeeId = newEmp.id;
    lead.assignedEmployeeName = newEmp.fullName;
    lead.assignedTeam = newEmp.team;
    lead.status = 'ASSIGNED';
    lead.notes = `${lead.notes || ''} [Reassigned from ${prevEmpName} to ${newEmp.fullName}: ${reason}]`;

    this.addActivity({
      employeeId: newEmp.id,
      timestamp: new Date().toLocaleString(),
      type: 'LEAD_REASSIGNED',
      title: `Lead Reassigned (${lead.leadId})`,
      description: `${lead.name} reassigned from ${prevEmpName} to ${newEmp.fullName}. Reason: ${reason}. Authorized by: ${reassignedBy}.`,
      entityType: 'LEAD',
      entityId: lead.leadId,
      badgeColor: 'amber',
    });

    this.saveState();
    return { success: true, record };
  }

  public reassignLeadsBatch(
    leadIds: string[],
    newEmployeeId: string,
    reassignedBy: string,
    reason: string,
    handoverNotes?: string
  ): { success: boolean; reassignedCount: number; error?: string } {
    if (!leadIds || leadIds.length === 0) {
      return { success: false, reassignedCount: 0, error: 'No leads selected for reassignment.' };
    }

    const newEmp = this.getEmployeeById(newEmployeeId);
    if (!newEmp) return { success: false, reassignedCount: 0, error: 'Target employee not found.' };

    if (!reason || reason.trim() === '') {
      return { success: false, reassignedCount: 0, error: 'Reassignment reason is mandatory for audit compliance.' };
    }

    let reassignedCount = 0;
    for (const id of leadIds) {
      const res = this.reassignLead(id, newEmployeeId, reassignedBy, reason, handoverNotes);
      if (res.success) reassignedCount++;
    }

    return { success: true, reassignedCount };
  }

  public updateLeadStatus(
    leadId: string,
    status: LeadStatus,
    notes?: string
  ): { success: boolean; error?: string } {
    const lead = this.leads.find((l) => l.id === leadId || l.leadId === leadId);
    if (!lead) return { success: false, error: 'Lead not found.' };

    const prevStatus = lead.status;
    lead.status = status;
    if (notes) {
      lead.notes = `${lead.notes || ''} [${new Date().toLocaleDateString()}: ${notes}]`;
    }

    this.addActivity({
      employeeId: lead.assignedEmployeeId || 'emp_001',
      timestamp: new Date().toLocaleString(),
      type: 'LEAD_STATUS_CHANGED',
      title: `Lead Status Changed (${lead.leadId})`,
      description: `${lead.name} status updated from ${prevStatus} to ${status}.`,
      entityType: 'LEAD',
      entityId: lead.leadId,
      badgeColor: status === 'CONVERTED' ? 'emerald' : status === 'LOST' ? 'rose' : 'blue',
    });

    this.saveState();
    return { success: true };
  }

  // --- Calls ---
  public getCallLogs(): CallLog[] {
    return [...this.callLogs];
  }

  public getCallsByEmployee(employeeId: string): CallLog[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.callLogs.filter(
      (c) => c.assignedEmployeeId === emp.id || c.assignedEmployeeId === emp.employeeId
    );
  }

  public addCallLog(newCall: Omit<CallLog, 'id' | 'callLogId'>): CallLog {
    const id = `clog_${Date.now()}`;
    const callLogId = `CALL-2025-${String(this.callLogs.length + 1).padStart(3, '0')}`;
    const record: CallLog = {
      ...newCall,
      id,
      callLogId,
    };
    this.callLogs = [record, ...this.callLogs];

    // Update client last contact and call counts
    const client = this.clients.find((c) => c.id === newCall.clientId || c.clientId === newCall.clientId);
    if (client) {
      client.lastContactDate = newCall.date;
      client.totalCalls += 1;
      if (newCall.status === 'CONNECTED') {
        client.connectedCalls += 1;
      }
    }

    // Add activity
    this.addActivity({
      employeeId: newCall.assignedEmployeeId,
      timestamp: `${newCall.date} ${newCall.startTime}`,
      type: 'CALL_LOGGED',
      title: `${newCall.direction === 'OUTGOING' ? 'Outbound' : 'Inbound'} Call (${newCall.status})`,
      description: `Logged call with ${newCall.clientName}. Outcome: ${newCall.outcome}. Duration: ${Math.floor(newCall.durationSec / 60)}m ${newCall.durationSec % 60}s.`,
      entityType: 'CALL',
      entityId: callLogId,
      badgeColor: newCall.status === 'CONNECTED' ? 'emerald' : 'amber',
    });

    this.saveState();
    return record;
  }

  // --- Lead Specific Call & User Response Logging ---
  public logLeadCallResponse(params: {
    leadId: string;
    employeeId: string;
    employeeName: string;
    durationSec: number;
    status: CallStatus;
    outcome: CallOutcome;
    userResponse: string;
    conversationNotes?: string;
    nextFollowUp?: string;
    newLeadStatus?: LeadStatus;
  }): { success: boolean; record?: LeadCallResponseRecord; error?: string } {
    const lead = this.leads.find((l) => l.id === params.leadId || l.leadId === params.leadId);
    if (!lead) {
      return { success: false, error: 'Lead not found in database.' };
    }

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const callLogId = `CALL-2025-${String(this.callLogs.length + 1).padStart(3, '0')}`;
    const recordId = `cresp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const responseRecord: LeadCallResponseRecord = {
      id: recordId,
      callLogId,
      calledAt: `${formattedDate} ${formattedTime}`,
      callerEmployeeId: params.employeeId,
      callerEmployeeName: params.employeeName,
      callDurationSec: params.durationSec,
      status: params.status,
      outcome: params.outcome,
      userResponse: params.userResponse,
      conversationNotes: params.conversationNotes,
      nextFollowUp: params.nextFollowUp,
      newStatus: params.newLeadStatus || lead.status,
    };

    // Update Lead object
    if (!lead.callResponses) {
      lead.callResponses = [];
    }
    lead.callResponses = [responseRecord, ...lead.callResponses];

    if (params.newLeadStatus) {
      lead.status = params.newLeadStatus;
    }
    if (params.nextFollowUp) {
      lead.nextFollowUp = params.nextFollowUp;
    }

    // Keep notes updated
    const entryNote = `[${formattedDate} ${formattedTime} • ${params.employeeName}]: User Response: "${params.userResponse}" (${params.outcome})`;
    lead.notes = lead.notes ? `${entryNote}\n${lead.notes}` : entryNote;

    // Create CallLog entry so it appears in Call Management Screen & employee stats
    const newCallLog: CallLog = {
      id: `clog_${Date.now()}`,
      callLogId,
      clientId: lead.leadId,
      clientName: lead.name,
      clientPhone: lead.mobile,
      date: formattedDate,
      startTime: formattedTime,
      durationSec: params.durationSec,
      direction: 'OUTGOING',
      status: params.status,
      purpose: 'Lead Verification & Matchmaking Follow-up',
      outcome: params.outcome,
      clientResponse: params.userResponse,
      notes: params.conversationNotes || params.userResponse,
      assignedEmployeeId: params.employeeId,
      assignedEmployeeName: params.employeeName,
      recordedBy: params.employeeName,
      callSource: 'CLOUD_VOIP',
      verificationStatus: 'MANUAL_ENTRY',
      followUpDateTime: params.nextFollowUp,
    };
    this.callLogs = [newCallLog, ...this.callLogs];

    // Activity timeline
    this.addActivity({
      employeeId: params.employeeId,
      timestamp: `${formattedDate} ${formattedTime}`,
      type: 'CALL_LOGGED',
      title: `Call Response: ${lead.name}`,
      description: `${params.employeeName} called ${lead.name} (${params.status}). User response: "${params.userResponse}". Outcome: ${params.outcome}.`,
      entityType: 'LEAD',
      entityId: lead.leadId,
      badgeColor: params.status === 'CONNECTED' ? 'emerald' : 'amber',
    });

    this.saveState();
    return { success: true, record: responseRecord };
  }

  // --- Team Internal Chat (Super Admin <-> Employee) ---
  public getTeamChatMessages(userId1?: string, userId2?: string): TeamChatMessage[] {
    if (!userId1 && !userId2) {
      return [...this.teamChatMessages];
    }
    if (userId1 && !userId2) {
      return this.teamChatMessages.filter(
        (m) => m.senderId === userId1 || m.recipientId === userId1
      );
    }
    return this.teamChatMessages.filter(
      (m) =>
        (m.senderId === userId1 && m.recipientId === userId2) ||
        (m.senderId === userId2 && m.recipientId === userId1)
    );
  }

  public sendTeamChatMessage(msg: Omit<TeamChatMessage, 'id' | 'timestamp' | 'read'>): TeamChatMessage {
    const newMsg: TeamChatMessage = {
      ...msg,
      id: `tmsg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    this.teamChatMessages = [...this.teamChatMessages, newMsg];
    this.saveState();
    return newMsg;
  }

  public markMessagesAsRead(senderId: string, recipientId: string): void {
    let changed = false;
    this.teamChatMessages = this.teamChatMessages.map((m) => {
      if (m.senderId === senderId && m.recipientId === recipientId && !m.read) {
        changed = true;
        return { ...m, read: true };
      }
      return m;
    });
    if (changed) {
      this.saveState();
    }
  }

  public getUnreadMessageCount(recipientId: string): number {
    return this.teamChatMessages.filter((m) => m.recipientId === recipientId && !m.read).length;
  }

  // --- Tasks & Follow-ups ---
  public getTasks(): FollowUpTask[] {
    return [...this.tasks];
  }

  public getTasksByEmployee(employeeId: string): FollowUpTask[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.tasks.filter(
      (t) => t.assignedEmployeeId === emp.id || t.assignedEmployeeId === emp.employeeId
    );
  }

  public addTask(newTask: Omit<FollowUpTask, 'id' | 'taskId'>): FollowUpTask {
    const id = `tsk_${Date.now()}`;
    const taskId = `TSK-2025-${String(this.tasks.length + 1).padStart(3, '0')}`;
    const task: FollowUpTask = {
      ...newTask,
      id,
      taskId,
    };
    this.tasks = [task, ...this.tasks];

    this.addActivity({
      employeeId: newTask.assignedEmployeeId,
      timestamp: `${newTask.createdDate} ${new Date().toLocaleTimeString()}`,
      type: 'FOLLOWUP_CREATED',
      title: `Scheduled Task: ${newTask.taskType}`,
      description: `Task for ${newTask.clientName} due on ${newTask.dueDate} ${newTask.dueTime}.`,
      entityType: 'TASK',
      entityId: taskId,
      badgeColor: 'blue',
    });

    this.saveState();
    return task;
  }

  public updateTaskStatus(taskId: string, status: TaskStatus, outcome?: string): boolean {
    const task = this.tasks.find((t) => t.id === taskId || t.taskId === taskId);
    if (!task) return false;
    task.status = status;
    if (status === 'COMPLETED') {
      task.completionDate = new Date().toISOString().split('T')[0];
      if (outcome) task.outcome = outcome;
      this.addActivity({
        employeeId: task.assignedEmployeeId,
        timestamp: new Date().toLocaleString(),
        type: 'FOLLOWUP_COMPLETED',
        title: `Task Completed: ${task.taskId}`,
        description: `Follow-up with ${task.clientName} finished. Outcome: ${outcome || 'Done'}.`,
        entityType: 'TASK',
        entityId: task.taskId,
        badgeColor: 'emerald',
      });
    }
    this.saveState();
    return true;
  }

  // --- Assisted Matches ---
  public getMatches(): MatchRecommendation[] {
    return [...this.matches];
  }

  public getMatchesByEmployee(employeeId: string): MatchRecommendation[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.matches.filter(
      (m) => m.reviewedByEmployeeId === emp.id || m.reviewedByEmployeeId === emp.employeeId
    );
  }

  // --- Canonical Hybrid Matchmaking & Deduplication ---

  /**
   * Generates a deterministic, lexicographically sorted canonical pair key.
   * Ensures (A, B) and (B, A) resolve to identical canonical pair identity.
   */
  public getCanonicalPairKey(id1: string, id2: string): string {
    return [id1, id2].sort().join(':');
  }

  /**
   * Finds any existing match for the given pair, regardless of direction.
   */
  public findMatchByPair(id1: string, id2: string): MatchRecommendation | undefined {
    const targetKey = this.getCanonicalPairKey(id1, id2);
    return this.matches.find(
      (m) =>
        (m.pairKey && m.pairKey === targetKey) ||
        this.getCanonicalPairKey(m.clientId, m.candidateId) === targetKey
    );
  }

  /**
   * Checks whether an active recommendation already exists between client and candidate
   */
  public isDuplicateMatch(clientId: string, candidateId: string): boolean {
    return !!this.findMatchByPair(clientId, candidateId);
  }

  /**
   * Blocks a member pair, ensuring no future automatic or manual suggestions bypass it.
   */
  public blockMemberPair(blockerId: string, blockedId: string, reason: string = 'User Blocked'): void {
    const key = `${blockerId}->${blockedId}`;
    this.blockedPairs.set(key, { blockerId, blockedId, reason, timestamp: new Date().toISOString() });
    const match = this.findMatchByPair(blockerId, blockedId);
    if (match) {
      match.isBlocked = true;
      match.blockReason = reason;
      const prevStatus = match.overallStatus;
      match.overallStatus = 'CLOSED';
      this.addMatchAudit(match.matchId, {
        actorId: blockerId,
        actorName: 'Member',
        actorRole: 'USER',
        sourceType: match.primarySource || 'AUTOMATIC_BACKEND',
        actionType: 'BLOCKED',
        reason,
        previousStatus: prevStatus,
        resultingStatus: 'CLOSED',
      });
      this.saveState();
    }
  }

  public unblockMemberPair(blockerId: string, blockedId: string): void {
    this.blockedPairs.delete(`${blockerId}->${blockedId}`);
    this.saveState();
  }

  public isBlockedPair(id1: string, id2: string): boolean {
    return this.blockedPairs.has(`${id1}->${id2}`) || this.blockedPairs.has(`${id2}->${id1}`);
  }

  /**
   * Dismisses a match for a member.
   */
  public dismissMatch(matchId: string, memberId: string): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;
    if (match.clientId === memberId) {
      match.isDismissedByClient = true;
    } else if (match.candidateId === memberId) {
      match.isDismissedByCandidate = true;
    }
    this.addMatchAudit(match.matchId, {
      actorId: memberId,
      actorName: 'Member',
      actorRole: 'USER',
      sourceType: match.primarySource || 'AUTOMATIC_BACKEND',
      actionType: 'DISMISSED',
      reason: 'Member dismissed match recommendation',
      previousStatus: match.overallStatus,
      resultingStatus: match.overallStatus,
    });
    this.saveState();
    return true;
  }

  /**
   * Retrieves immutable audit trail for a match.
   */
  public getMatchAuditHistory(matchId: string): MatchAuditRecord[] {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    return match?.auditHistory ? [...match.auditHistory] : [];
  }

  /**
   * Records an immutable audit log entry for a match.
   */
  public addMatchAudit(matchId: string, audit: Omit<MatchAuditRecord, 'id' | 'timestamp' | 'matchId'>): void {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return;
    const record: MatchAuditRecord = {
      ...audit,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      matchId: match.matchId,
      timestamp: new Date().toISOString(),
    };
    match.auditHistory = [...(match.auditHistory || []), record];
  }

  /**
   * Central Unified Hybrid Matchmaker:
   * Handles Automatic Backend, Admin Suggested, and Employee Assisted matchmaking
   * with unified canonical identity, eligibility validation, and duplicate prevention.
   */
  public suggestHybridMatch(params: {
    client: ClientProfile;
    candidate: ClientProfile;
    actorId: string;
    actorRole?: string;
    sourceType?: MatchSourceType;
    reason?: string;
    notes?: string;
    assignedEmployeeId?: string;
    allowReactivation?: boolean;
  }): {
    success: boolean;
    match?: MatchRecommendation;
    error?: string;
    isExisting?: boolean;
    action?: 'NEW_MATCH_CREATED' | 'EXISTING_MATCH_ATTACHED' | 'REACTIVATED';
    notificationDispatched?: boolean;
  } {
    const { client, candidate, actorId, actorRole = 'ADMIN', sourceType = 'ADMIN_SUGGESTED' } = params;

    // 1. Gender check
    if (client.gender === candidate.gender) {
      return {
        success: false,
        error: 'Cannot pair profiles of the same gender.',
      };
    }

    // 2. Profile Active & Eligibility Validation
    const invalidStatuses = ['SUSPENDED', 'DEACTIVATED', 'DELETED', 'ON_HOLD', 'LOST'];
    if (client.relationshipStatus && invalidStatuses.includes(client.relationshipStatus)) {
      return {
        success: false,
        error: `Client profile is inactive or suspended (Status: ${client.relationshipStatus}).`,
      };
    }
    if (candidate.relationshipStatus && invalidStatuses.includes(candidate.relationshipStatus)) {
      return {
        success: false,
        error: `Candidate profile is inactive or suspended (Status: ${candidate.relationshipStatus}).`,
      };
    }

    // 3. Block Exclusions
    if (this.isBlockedPair(client.clientId, candidate.clientId)) {
      return {
        success: false,
        error: 'Cannot recommend: A block relationship exists between these members.',
      };
    }

    // 4. Cultural & Gotra Policy Validation
    const compatResult = subcasteGotraService.checkMatchCompatibility(client, candidate);
    if (!compatResult.isCompatible) {
      return {
        success: false,
        error: `Matrimonial Rule Violation: ${compatResult.reasons.join(' ')}`,
      };
    }

    // 5. Canonical Match Lookup (Check if already exists)
    const existingMatch = this.findMatchByPair(client.clientId, candidate.clientId);

    if (existingMatch) {
      // Check block flag on record
      if (existingMatch.isBlocked) {
        return {
          success: false,
          error: 'Cannot recommend: A block relationship exists between these members.',
          match: existingMatch,
          isExisting: true,
        };
      }

      // Check if previously declined or dismissed
      const isDeclined =
        existingMatch.clientResponse === 'DECLINED' || existingMatch.candidateResponse === 'DECLINED';
      const isDismissed =
        existingMatch.isDismissedByClient || existingMatch.isDismissedByCandidate;

      if ((isDeclined || isDismissed) && !params.allowReactivation) {
        return {
          success: false,
          error: 'This match was previously declined or dismissed. Reactivation requires explicit authorization.',
          match: existingMatch,
          isExisting: true,
        };
      }

      let actionResult: 'EXISTING_MATCH_ATTACHED' | 'REACTIVATED' = 'EXISTING_MATCH_ATTACHED';
      if ((isDeclined || isDismissed) && params.allowReactivation) {
        existingMatch.isDismissedByClient = false;
        existingMatch.isDismissedByCandidate = false;
        if (existingMatch.clientResponse === 'DECLINED') existingMatch.clientResponse = 'PENDING';
        if (existingMatch.candidateResponse === 'DECLINED') existingMatch.candidateResponse = 'PENDING';
        existingMatch.overallStatus = 'AWAITING_CLIENT_RESPONSE';
        actionResult = 'REACTIVATED';
      }

      // Append new source attribution without overwriting existing sources
      if (!existingMatch.sources) {
        existingMatch.sources = [existingMatch.primarySource || 'AUTOMATIC_BACKEND'];
      }
      if (!existingMatch.sources.includes(sourceType)) {
        existingMatch.sources.push(sourceType);
      }

      if (sourceType === 'ADMIN_SUGGESTED') {
        existingMatch.suggestedByAdminId = actorId;
        const actor = this.getEmployeeById(actorId);
        existingMatch.suggestedByAdminName = actor ? actor.fullName : 'Administrator';
        existingMatch.suggestedReason = params.reason || 'Admin suggested match for assisted follow-up.';
      }

      // Append audit record
      const actor = this.getEmployeeById(actorId);
      const auditEntry: MatchAuditRecord = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        matchId: existingMatch.matchId,
        actorId,
        actorName: actor ? actor.fullName : 'System Administrator',
        actorRole,
        sourceType,
        actionType: actionResult === 'REACTIVATED' ? 'REACTIVATED' : 'ADMIN_SUGGESTION_ADDED',
        timestamp: new Date().toISOString(),
        reason: params.reason || 'Admin suggested match for assisted follow-up.',
        notes: params.notes,
        previousStatus: existingMatch.overallStatus,
        resultingStatus: existingMatch.overallStatus,
      };
      existingMatch.auditHistory = [...(existingMatch.auditHistory || []), auditEntry];

      // Notification Deduplication (Check if client was already notified of assisted recommendation)
      let notificationDispatched = false;
      if (!existingMatch.notifications) existingMatch.notifications = [];
      const alreadyNotified = existingMatch.notifications.some(
        (n) =>
          n.recipientId === client.clientId &&
          n.event === 'ASSISTED_MATCH_SUGGESTION' &&
          n.status === 'SENT'
      );

      if (!alreadyNotified) {
        existingMatch.notifications.push({
          id: `notif_${Date.now()}`,
          recipientId: client.clientId,
          recipientType: 'CLIENT',
          channel: 'PUSH_FCM',
          event: 'ASSISTED_MATCH_SUGGESTION',
          dispatchedAt: new Date().toISOString(),
          status: 'SENT',
          deliveryNote: `Notified ${client.fullName} about match ${existingMatch.matchId}`,
        });
        notificationDispatched = true;
      } else {
        existingMatch.notifications.push({
          id: `notif_${Date.now()}`,
          recipientId: client.clientId,
          recipientType: 'CLIENT',
          channel: 'PUSH_FCM',
          event: 'ASSISTED_MATCH_SUGGESTION',
          dispatchedAt: new Date().toISOString(),
          status: 'SUPPRESSED_DUPLICATE',
          deliveryNote: 'Duplicate notification suppressed per anti-spam policy.',
        });
      }

      this.saveState();
      return {
        success: true,
        match: existingMatch,
        isExisting: true,
        action: actionResult,
        notificationDispatched,
      };
    }

    // 6. Creating Brand New Match
    let score = 70;
    const reasons: string[] = [];
    score += compatResult.scoreModifier;
    reasons.push(...compatResult.reasons);

    if (client.city === candidate.city) {
      score += 8;
      reasons.push(`Same home city (${client.city})`);
    } else {
      reasons.push(`Different cities (${client.city} & ${candidate.city})`);
    }

    const ageDiff = Math.abs(client.age - candidate.age);
    if (ageDiff <= 4) {
      score += 7;
      reasons.push(`Ideal age proximity (diff of ${ageDiff} years)`);
    }

    const matchId = `MATCH-2025-${String(this.matches.length + 1).padStart(3, '0')}`;
    const actor = this.getEmployeeById(actorId);
    const actorName = actor ? actor.fullName : 'Assisted Matchmaker';
    const pairKey = this.getCanonicalPairKey(client.clientId, candidate.clientId);

    const auditEntry: MatchAuditRecord = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      matchId,
      actorId,
      actorName,
      actorRole,
      sourceType,
      actionType: 'INITIAL_GENERATION',
      timestamp: new Date().toISOString(),
      reason: params.reason || 'Initial candidate match created.',
      notes: params.notes,
      previousStatus: 'NONE',
      resultingStatus: 'PENDING_REVIEW',
    };

    const notifLog: MatchNotificationLog = {
      id: `notif_${Date.now()}`,
      recipientId: client.clientId,
      recipientType: 'CLIENT',
      channel: 'PUSH_FCM',
      event: 'ASSISTED_MATCH_SUGGESTION',
      dispatchedAt: new Date().toISOString(),
      status: 'SENT',
      deliveryNote: `First-time notification sent to ${client.fullName}`,
    };

    const newMatch: MatchRecommendation = {
      id: `mtc_${Date.now()}`,
      matchId,
      pairKey,
      clientId: client.clientId,
      clientName: client.fullName,
      clientGender: client.gender,
      clientCity: client.city,
      clientSubcaste: client.subcaste,
      candidateId: candidate.clientId,
      candidateName: candidate.fullName,
      candidateGender: candidate.gender,
      candidateCity: candidate.city,
      candidateSubcaste: candidate.subcaste,
      compatibilityScore: Math.min(score, 98),
      compatibilityReasons: reasons,
      primarySource: sourceType,
      sources: [sourceType],
      suggestedByAdminId: sourceType === 'ADMIN_SUGGESTED' ? actorId : undefined,
      suggestedByAdminName: sourceType === 'ADMIN_SUGGESTED' ? actorName : undefined,
      suggestedReason: params.reason,
      reviewedByEmployeeId: params.assignedEmployeeId || actorId,
      reviewedByEmployeeName: actorName,
      reviewStatus: 'PENDING_EMPLOYEE_REVIEW',
      clientResponse: 'PENDING',
      candidateResponse: 'PENDING',
      overallStatus: 'PENDING_REVIEW',
      createdAt: new Date().toISOString().split('T')[0],
      notes: params.notes || 'Generated via Hybrid Matchmaking System.',
      auditHistory: [auditEntry],
      notifications: [notifLog],
    };

    this.matches = [newMatch, ...this.matches];

    this.addActivity({
      employeeId: actorId,
      timestamp: new Date().toLocaleString(),
      type: 'MATCH_GENERATED',
      title: `Generated Match: ${matchId}`,
      description: `Paired ${client.fullName} with ${candidate.fullName} (Score: ${newMatch.compatibilityScore}%).`,
      entityType: 'MATCH',
      entityId: matchId,
      badgeColor: 'teal',
    });

    this.saveState();
    return {
      success: true,
      match: newMatch,
      isExisting: false,
      action: 'NEW_MATCH_CREATED',
      notificationDispatched: true,
    };
  }

  public generateMatch(
    client: ClientProfile,
    candidate: ClientProfile,
    employeeId: string
  ): { success: boolean; match?: MatchRecommendation; error?: string } {
    if (this.isDuplicateMatch(client.clientId, candidate.clientId)) {
      return {
        success: false,
        error: `Active match recommendation already exists between ${client.fullName} and ${candidate.fullName}!`,
      };
    }

    const res = this.suggestHybridMatch({
      client,
      candidate,
      actorId: employeeId,
      actorRole: 'CRM_MANAGER',
      sourceType: 'EMPLOYEE_ASSISTED',
      reason: 'Generated via Assisted Compatibility Engine.',
    });

    if (!res.success) {
      return { success: false, error: res.error };
    }
    return { success: true, match: res.match };
  }

  public reviewMatch(
    matchId: string,
    employeeId: string,
    decision: 'APPROVED' | 'REJECTED_BY_EMPLOYEE',
    notes?: string
  ): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;

    const prevStatus = match.overallStatus;
    match.reviewStatus = decision;
    match.reviewedAt = new Date().toLocaleString();
    if (notes) match.notes = notes;

    if (decision === 'APPROVED') {
      match.overallStatus = 'AWAITING_CLIENT_RESPONSE';
    } else {
      match.overallStatus = 'CLOSED';
    }

    this.addMatchAudit(match.matchId, {
      actorId: employeeId,
      actorName: this.getEmployeeById(employeeId)?.fullName || 'Employee',
      actorRole: 'CRM_MANAGER',
      sourceType: 'EMPLOYEE_ASSISTED',
      actionType: 'EMPLOYEE_REVIEW_SUBMITTED',
      reason: `Assisted review decision: ${decision}`,
      notes,
      previousStatus: prevStatus,
      resultingStatus: match.overallStatus,
    });

    this.addActivity({
      employeeId,
      timestamp: new Date().toLocaleString(),
      type: 'MATCH_REVIEWED',
      title: `Match ${decision === 'APPROVED' ? 'Approved' : 'Rejected'} (${match.matchId})`,
      description: `Assisted review completed for ${match.clientName} & ${match.candidateName}. Decision: ${decision}.`,
      entityType: 'MATCH',
      entityId: match.matchId,
      badgeColor: decision === 'APPROVED' ? 'emerald' : 'rose',
    });

    this.saveState();
    return true;
  }

  public shareMatchWithClient(matchId: string): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;

    const prevStatus = match.overallStatus;
    match.reviewStatus = 'SHARED_WITH_CLIENT';
    match.sharedWithClientAt = new Date().toLocaleString();
    match.overallStatus = 'AWAITING_CLIENT_RESPONSE';

    // Increment client matches shared count
    const client = this.clients.find((c) => c.clientId === match.clientId);
    if (client) client.matchesShared += 1;

    this.addMatchAudit(match.matchId, {
      actorId: match.reviewedByEmployeeId,
      actorName: match.reviewedByEmployeeName,
      actorRole: 'CRM_MANAGER',
      sourceType: 'EMPLOYEE_ASSISTED',
      actionType: 'SHARED_WITH_CLIENT',
      reason: 'Dispatched candidate profile to client',
      previousStatus: prevStatus,
      resultingStatus: match.overallStatus,
    });

    this.addActivity({
      employeeId: match.reviewedByEmployeeId,
      timestamp: new Date().toLocaleString(),
      type: 'PROFILE_SHARED',
      title: `Match Shared with Client (${match.matchId})`,
      description: `Dispatched ${match.candidateName} profile to ${match.clientName}.`,
      entityType: 'MATCH',
      entityId: match.matchId,
      badgeColor: 'indigo',
    });

    this.saveState();
    return true;
  }

  /**
   * Record client's response independently from candidate response
   */
  public recordClientResponse(
    matchId: string,
    response: MatchResponseOption,
    recordedBy: 'CLIENT' | 'EMPLOYEE' = 'EMPLOYEE',
    notes?: string
  ): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;

    const prevStatus = match.overallStatus;
    match.clientResponse = response;
    match.clientResponseAt = new Date().toLocaleString();
    match.clientResponseRecordedBy = recordedBy;
    if (notes) match.notes = `${match.notes || ''} [Client: ${notes}]`;

    // Increment client responses count
    const client = this.clients.find((c) => c.clientId === match.clientId);
    if (client) client.clientResponses += 1;

    // Check mutual status independently
    if (response === 'ACCEPTED' && match.candidateResponse === 'ACCEPTED') {
      match.overallStatus = 'MUTUAL_INTEREST';
    } else if (response === 'DECLINED') {
      match.overallStatus = 'DECLINED_BY_CLIENT';
    } else if (response === 'ACCEPTED') {
      match.overallStatus = 'AWAITING_CANDIDATE_RESPONSE';
    }

    this.addMatchAudit(match.matchId, {
      actorId: recordedBy === 'CLIENT' ? match.clientId : match.reviewedByEmployeeId,
      actorName: recordedBy === 'CLIENT' ? match.clientName : match.reviewedByEmployeeName,
      actorRole: recordedBy === 'CLIENT' ? 'USER' : 'CRM_MANAGER',
      sourceType: match.primarySource || 'EMPLOYEE_ASSISTED',
      actionType: 'CLIENT_RESPONSE_RECORDED',
      reason: `Client responded: ${response}`,
      notes,
      previousStatus: prevStatus,
      resultingStatus: match.overallStatus,
    });

    this.addActivity({
      employeeId: match.reviewedByEmployeeId,
      timestamp: new Date().toLocaleString(),
      type: 'CLIENT_RESPONSE_RECEIVED',
      title: `Client Response: ${response}`,
      description: `${match.clientName} responded: ${response} for ${match.candidateName}. (Recorded by: ${recordedBy})`,
      entityType: 'MATCH',
      entityId: match.matchId,
      badgeColor: response === 'ACCEPTED' ? 'emerald' : 'rose',
    });

    this.saveState();
    return true;
  }

  /**
   * Record candidate's response independently
   */
  public recordCandidateResponse(
    matchId: string,
    response: MatchResponseOption,
    recordedBy: 'CANDIDATE' | 'EMPLOYEE' = 'EMPLOYEE',
    notes?: string
  ): boolean {
    const match = this.matches.find((m) => m.id === matchId || m.matchId === matchId);
    if (!match) return false;

    const prevStatus = match.overallStatus;
    match.candidateResponse = response;
    match.candidateResponseAt = new Date().toLocaleString();
    match.candidateResponseRecordedBy = recordedBy;
    if (notes) match.notes = `${match.notes || ''} [Candidate: ${notes}]`;

    // Check mutual status independently
    if (match.clientResponse === 'ACCEPTED' && response === 'ACCEPTED') {
      match.overallStatus = 'MUTUAL_INTEREST';
    } else if (response === 'DECLINED') {
      match.overallStatus = 'DECLINED_BY_CANDIDATE';
    }

    this.addMatchAudit(match.matchId, {
      actorId: recordedBy === 'CANDIDATE' ? match.candidateId : match.reviewedByEmployeeId,
      actorName: recordedBy === 'CANDIDATE' ? match.candidateName : match.reviewedByEmployeeName,
      actorRole: recordedBy === 'CANDIDATE' ? 'USER' : 'CRM_MANAGER',
      sourceType: match.primarySource || 'EMPLOYEE_ASSISTED',
      actionType: 'CANDIDATE_RESPONSE_RECORDED',
      reason: `Candidate responded: ${response}`,
      notes,
      previousStatus: prevStatus,
      resultingStatus: match.overallStatus,
    });

    this.addActivity({
      employeeId: match.reviewedByEmployeeId,
      timestamp: new Date().toLocaleString(),
      type: 'CANDIDATE_RESPONSE_RECEIVED',
      title: `Candidate Response: ${response}`,
      description: `${match.candidateName} responded: ${response} for ${match.clientName}. (Recorded by: ${recordedBy})`,
      entityType: 'MATCH',
      entityId: match.matchId,
      badgeColor: response === 'ACCEPTED' ? 'emerald' : 'rose',
    });

    this.saveState();
    return true;
  }

  // --- Client Reassignments ---
  public reassignClient(
    clientId: string,
    newEmployeeId: string,
    reassignedBy: string,
    reason: string
  ): { success: boolean; error?: string } {
    const client = this.clients.find((c) => c.id === clientId || c.clientId === clientId);
    if (!client) return { success: false, error: 'Client profile not found' };

    const newEmp = this.getEmployeeById(newEmployeeId);
    if (!newEmp) return { success: false, error: 'Target employee not found' };

    const prevEmp = this.getEmployeeById(client.assignedEmployeeId);
    const prevEmpName = prevEmp ? prevEmp.fullName : client.assignedEmployeeName;

    // Record immutable assignment history
    const historyRecord: ClientAssignmentHistory = {
      id: `asg_${Date.now()}`,
      clientId: client.clientId,
      clientName: client.fullName,
      previousEmployeeId: client.assignedEmployeeId,
      previousEmployeeName: prevEmpName,
      newEmployeeId: newEmp.id,
      newEmployeeName: newEmp.fullName,
      reassignedAt: new Date().toLocaleString(),
      reassignedBy,
      reason,
      previousStatus: client.relationshipStatus,
      newStatus: client.relationshipStatus,
    };

    this.assignmentHistory = [historyRecord, ...this.assignmentHistory];

    // Update client record
    client.assignedEmployeeId = newEmp.id;
    client.assignedEmployeeName = newEmp.fullName;
    client.assignedDate = new Date().toISOString().split('T')[0];

    // Log timeline event
    this.addActivity({
      employeeId: newEmp.id,
      timestamp: new Date().toLocaleString(),
      type: 'LEAD_REASSIGNED',
      title: `Client Reassigned (${client.clientId})`,
      description: `${client.fullName} reassigned from ${prevEmpName} to ${newEmp.fullName}. Reason: ${reason}. Authorized by: ${reassignedBy}.`,
      entityType: 'CLIENT',
      entityId: client.clientId,
      badgeColor: 'amber',
    });

    this.saveState();
    return { success: true };
  }

  public getAssignmentHistory(clientIdOrEmployeeId?: string): ClientAssignmentHistory[] {
    if (!clientIdOrEmployeeId) return [...this.assignmentHistory];
    return this.assignmentHistory.filter(
      (h) =>
        h.clientId === clientIdOrEmployeeId ||
        h.previousEmployeeId === clientIdOrEmployeeId ||
        h.newEmployeeId === clientIdOrEmployeeId
    );
  }

  // --- Transactions & Revenue ---
  public getTransactions(): SalesTransaction[] {
    return [...this.transactions];
  }

  public getTransactionsByEmployee(employeeId: string): SalesTransaction[] {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.transactions.filter(
      (t) => t.employeeId === emp.id || t.employeeId === emp.employeeId
    );
  }

  // --- Activities ---
  public getActivities(employeeId?: string): ActivityTimelineEvent[] {
    if (!employeeId) return [...this.activities];
    const emp = this.getEmployeeById(employeeId);
    if (!emp) return [];
    return this.activities.filter(
      (a) => a.employeeId === emp.id || a.employeeId === emp.employeeId
    );
  }

  public addActivity(event: Omit<ActivityTimelineEvent, 'id'>): ActivityTimelineEvent {
    const act: ActivityTimelineEvent = {
      ...event,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    };
    this.activities = [act, ...this.activities];
    return act;
  }

  /**
   * Single authoritative Employee 360° metrics calculator
   * Excludes duplicate records and calculates transparent, audit-ready rates!
   */
  public calculateEmployeeMetrics(
    employeeId: string,
    dateRange: 'TODAY' | 'WEEK' | 'MONTH' | 'ALL' = 'ALL'
  ): EmployeeSummaryMetrics {
    const emp = this.getEmployeeById(employeeId);
    if (!emp) {
      return {
        totalLeadsAssigned: 0,
        totalClientsAssigned: 0,
        activeClients: 0,
        totalCallsLogged: 0,
        connectedCalls: 0,
        successfulConversations: 0,
        followUpsCompleted: 0,
        overdueFollowUps: 0,
        matchesGenerated: 0,
        matchesReviewed: 0,
        clientResponsesReceived: 0,
        positiveResponses: 0,
        membershipSales: 0,
        revenueAttributed: 0,
        conversionRate: 0,
        callsPerDayAverage: 0,
        verifiedConnectedRate: 0,
        followUpCompletionRate: 0,
        matchAcceptanceRate: 0,
        averageResponseTimeHours: 0,
      };
    }

    const leads = this.getLeadsByEmployee(emp.id);
    const clients = this.getClientsByEmployee(emp.id);
    let calls = this.getCallsByEmployee(emp.id);
    let tasks = this.getTasksByEmployee(emp.id);
    let matches = this.getMatchesByEmployee(emp.id);
    let txns = this.getTransactionsByEmployee(emp.id);

    // Filter by Date Range if not ALL
    if (dateRange === 'TODAY') {
      const today = new Date().toISOString().split('T')[0];
      calls = calls.filter((c) => c.date >= today);
      tasks = tasks.filter((t) => t.createdDate >= today);
      matches = matches.filter((m) => m.createdAt >= today);
      txns = txns.filter((t) => t.date >= today);
    } else if (dateRange === 'WEEK') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekStr = weekAgo.toISOString().split('T')[0];
      calls = calls.filter((c) => c.date >= weekStr);
      tasks = tasks.filter((t) => t.createdDate >= weekStr);
      matches = matches.filter((m) => m.createdAt >= weekStr);
      txns = txns.filter((t) => t.date >= weekStr);
    } else if (dateRange === 'MONTH') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      const monthStr = monthAgo.toISOString().split('T')[0];
      calls = calls.filter((c) => c.date >= monthStr);
      tasks = tasks.filter((t) => t.createdDate >= monthStr);
      matches = matches.filter((m) => m.createdAt >= monthStr);
      txns = txns.filter((t) => t.date >= monthStr);
    }

    const totalLeadsAssigned = leads.length;
    const totalClientsAssigned = clients.length;
    const activeClients = clients.filter(
      (c) => c.relationshipStatus === 'MATCHMAKING_ACTIVE' || c.relationshipStatus === 'FOLLOW_UP_REQUIRED'
    ).length;

    // Use Set of call IDs to guarantee no double counting
    const callIds = new Set(calls.map((c) => c.id));
    const totalCallsLogged = callIds.size;
    const connectedCalls = calls.filter((c) => c.status === 'CONNECTED').length;
    const successfulConversations = calls.filter(
      (c) =>
        c.status === 'CONNECTED' &&
        (c.outcome === 'MATCH_APPROVED' ||
          c.outcome === 'INTERESTED' ||
          c.outcome === 'MEMBERSHIP_INQUIRY' ||
          c.outcome === 'PROFILE_SHARED')
    ).length;

    const followUpsCompleted = tasks.filter((t) => t.status === 'COMPLETED').length;
    const overdueFollowUps = tasks.filter((t) => t.status === 'OVERDUE').length;

    const matchesGenerated = matches.length;
    const matchesReviewed = matches.filter((m) => m.reviewStatus !== 'GENERATED').length;

    const clientResponsesReceived = matches.filter(
      (m) => m.clientResponse && m.clientResponse !== 'PENDING'
    ).length;
    const positiveResponses = matches.filter(
      (m) => m.clientResponse === 'ACCEPTED' || m.candidateResponse === 'ACCEPTED'
    ).length;

    const successfulTxns = txns.filter((t) => t.paymentStatus === 'SUCCESS');
    const membershipSales = successfulTxns.length;
    const revenueAttributed = successfulTxns.reduce((acc, t) => acc + t.totalAmount, 0);

    const conversionRate =
      totalLeadsAssigned > 0
        ? Math.round((membershipSales / totalLeadsAssigned) * 100)
        : 0;

    const verifiedConnectedRate =
      totalCallsLogged > 0
        ? Math.round((connectedCalls / totalCallsLogged) * 100)
        : 0;

    const totalFollowUps = tasks.length;
    const followUpCompletionRate =
      totalFollowUps > 0
        ? Math.round((followUpsCompleted / totalFollowUps) * 100)
        : 100;

    const matchAcceptanceRate =
      clientResponsesReceived > 0
        ? Math.round((positiveResponses / clientResponsesReceived) * 100)
        : 0;

    return {
      totalLeadsAssigned,
      totalClientsAssigned,
      activeClients,
      totalCallsLogged,
      connectedCalls,
      successfulConversations,
      followUpsCompleted,
      overdueFollowUps,
      matchesGenerated,
      matchesReviewed,
      clientResponsesReceived,
      positiveResponses,
      membershipSales,
      revenueAttributed,
      conversionRate,
      callsPerDayAverage: totalCallsLogged > 0 ? Number((totalCallsLogged / 7).toFixed(1)) : 0,
      verifiedConnectedRate,
      followUpCompletionRate,
      matchAcceptanceRate,
      averageResponseTimeHours: 2.4,
    };
  }

  // --- SUCCESS STORIES API ---
  getSuccessStories(): SuccessStory[] {
    return [...this.successStories];
  }

  getSuccessStoryById(id: string): SuccessStory | undefined {
    return this.successStories.find((s) => s.id === id || s.storyId === id);
  }

  addSuccessStory(story: Omit<SuccessStory, 'id' | 'storyId' | 'createdAt' | 'updatedAt'>): SuccessStory {
    const nextNum = this.successStories.length + 1;
    const newStory: SuccessStory = {
      ...story,
      id: `story_${Date.now()}`,
      storyId: `SUCC-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (story.profilesArchived) {
      this.archiveCoupleProfiles(story.groomId, story.brideId);
    }

    this.successStories = [newStory, ...this.successStories];
    this.saveState();
    return newStory;
  }

  updateSuccessStory(id: string, updates: Partial<SuccessStory>): SuccessStory | null {
    const idx = this.successStories.findIndex((s) => s.id === id || s.storyId === id);
    if (idx === -1) return null;

    const existing = this.successStories[idx];
    const updated: SuccessStory = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (updates.profilesArchived && !existing.profilesArchived) {
      this.archiveCoupleProfiles(updated.groomId, updated.brideId);
    }

    this.successStories[idx] = updated;
    this.saveState();
    return updated;
  }

  togglePublishSuccessStory(id: string): boolean {
    const story = this.successStories.find((s) => s.id === id || s.storyId === id);
    if (!story) return false;
    story.status = story.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    story.updatedAt = new Date().toISOString().split('T')[0];
    this.saveState();
    return true;
  }

  deleteSuccessStory(id: string): boolean {
    const beforeLen = this.successStories.length;
    this.successStories = this.successStories.filter((s) => s.id !== id && s.storyId !== id);
    if (this.successStories.length !== beforeLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  archiveCoupleProfiles(groomId: string, brideId: string): void {
    const groom = this.clients.find((c) => c.id === groomId || c.clientId === groomId);
    if (groom) {
      groom.relationshipStatus = 'MARRIED';
    }
    const bride = this.clients.find((c) => c.id === brideId || c.clientId === brideId);
    if (bride) {
      bride.relationshipStatus = 'MARRIED';
    }
    this.saveState();
  }

  // --- REVIEWS & RATINGS API ---
  getReviews(): ReviewItem[] {
    return [...this.reviews];
  }

  getReviewById(id: string): ReviewItem | undefined {
    return this.reviews.find((r) => r.id === id || r.reviewId === id);
  }

  addReview(review: Omit<ReviewItem, 'id' | 'reviewId' | 'createdAt' | 'helpfulCount'>): ReviewItem {
    const nextNum = this.reviews.length + 1;
    const newReview: ReviewItem = {
      ...review,
      id: `rev_${Date.now()}`,
      reviewId: `REV-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
    };
    this.reviews = [newReview, ...this.reviews];
    this.saveState();
    return newReview;
  }

  updateReviewStatus(id: string, status: 'APPROVED' | 'PENDING' | 'REJECTED'): boolean {
    const rev = this.reviews.find((r) => r.id === id || r.reviewId === id);
    if (!rev) return false;
    rev.status = status;
    this.saveState();
    return true;
  }

  addAdminReviewResponse(id: string, adminResponse: string): boolean {
    const rev = this.reviews.find((r) => r.id === id || r.reviewId === id);
    if (!rev) return false;
    rev.adminResponse = adminResponse;
    rev.adminRespondedAt = new Date().toISOString().split('T')[0];
    this.saveState();
    return true;
  }

  deleteReview(id: string): boolean {
    const beforeLen = this.reviews.length;
    this.reviews = this.reviews.filter((r) => r.id !== id && r.reviewId !== id);
    if (this.reviews.length !== beforeLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  getReviewStats() {
    const total = this.reviews.length;
    if (total === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        approvedCount: 0,
        pendingCount: 0,
      };
    }
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = Number((sum / total).toFixed(1));
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let approvedCount = 0;
    let pendingCount = 0;

    this.reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      breakdown[star] = (breakdown[star] || 0) + 1;
      if (r.status === 'APPROVED') approvedCount++;
      if (r.status === 'PENDING') pendingCount++;
    });

    return {
      totalReviews: total,
      averageRating: avg,
      breakdown,
      approvedCount,
      pendingCount,
    };
  }

  // --- TRUST & SAFETY / ABUSE DESK API ---
  getAbuseReports(): AbuseReport[] {
    return [...this.abuseReports];
  }

  getAbuseReportById(id: string): AbuseReport | undefined {
    return this.abuseReports.find((r) => r.id === id || r.reportId === id);
  }

  getBlacklistedIdentities(): BlacklistedIdentity[] {
    return [...this.blacklistedIdentities];
  }

  executeSafetyAction(
    reportId: string,
    actionType: SafetyActionType,
    actedBy: string,
    reasonNotes: string
  ): { success: boolean; message: string; report?: AbuseReport } {
    const report = this.abuseReports.find((r) => r.id === reportId || r.reportId === reportId);
    if (!report) {
      return { success: false, message: 'Abuse report ticket not found' };
    }

    const suspect = this.clients.find(
      (c) => c.id === report.reportedMemberId || c.clientId === report.reportedMemberId
    );

    report.updatedAt = new Date().toISOString().split('T')[0];
    report.adminAction = {
      actionType,
      actedBy,
      actedAt: new Date().toISOString().split('T')[0],
      reasonNotes,
    };

    if (actionType === 'WARNING_NUDGE') {
      report.status = 'WARNED';
      this.addActivity({
        employeeId: 'safety_desk',
        timestamp: new Date().toLocaleString(),
        type: 'CLIENT_STATUS_CHANGED',
        title: `Warning Issued (${report.reportedMemberId})`,
        description: `Formal compliance warning issued to ${report.reportedMemberName} for ${report.reason}. Authorized by ${actedBy}.`,
        entityType: 'CLIENT',
        entityId: report.reportedMemberId,
        badgeColor: 'amber',
      });
      this.saveState();
      return { success: true, message: `Warning nudge dispatched to ${report.reportedMemberName}`, report };
    }

    if (actionType === 'SHADOW_FREEZE_7D') {
      report.status = 'SHADOW_FROZEN';
      if (suspect) {
        suspect.relationshipStatus = 'SHADOW_FROZEN';
      }
      this.addActivity({
        employeeId: 'safety_desk',
        timestamp: new Date().toLocaleString(),
        type: 'CLIENT_STATUS_CHANGED',
        title: `7-Day Shadow Freeze Applied (${report.reportedMemberId})`,
        description: `${report.reportedMemberName} placed on 7-day shadow freeze. Match suggestions and calling suspended.`,
        entityType: 'CLIENT',
        entityId: report.reportedMemberId,
        badgeColor: 'purple',
      });
      this.saveState();
      return { success: true, message: `7-Day Shadow Freeze applied on ${report.reportedMemberName}`, report };
    }

    if (actionType === 'PERMANENT_BLACKLIST') {
      report.status = 'BLACKLISTED';
      if (suspect) {
        suspect.relationshipStatus = 'BLACKLISTED';
      }

      // Add to blacklisted identities vault
      const newBlacklistEntry: BlacklistedIdentity = {
        id: `blk_${Date.now()}`,
        memberId: report.reportedMemberId,
        fullName: report.reportedMemberName,
        phone: report.reportedMemberPhone,
        aadhaarHash: report.reportedMemberAadhaarHash,
        deviceId: report.reportedMemberDeviceId,
        reason: `${report.reason}: ${report.evidenceText}`,
        severity: report.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        blacklistedBy: actedBy,
        blacklistedAt: new Date().toISOString().split('T')[0],
      };

      this.blacklistedIdentities = [newBlacklistEntry, ...this.blacklistedIdentities];

      // Block all pair relationships with this suspect in match recommendations
      this.matches.forEach((m) => {
        if (m.clientId === report.reportedMemberId || m.candidateId === report.reportedMemberId) {
          m.overallStatus = 'CLOSED';
        }
      });

      this.addActivity({
        employeeId: 'safety_desk',
        timestamp: new Date().toLocaleString(),
        type: 'CLIENT_STATUS_CHANGED',
        title: `Permanent Blacklist Enforced (${report.reportedMemberId})`,
        description: `${report.reportedMemberName} permanently banned. Phone ${report.reportedMemberPhone}, Aadhaar ${report.reportedMemberAadhaarHash}, and Device ${report.reportedMemberDeviceId} blacklisted globally.`,
        entityType: 'CLIENT',
        entityId: report.reportedMemberId,
        badgeColor: 'rose',
      });

      this.saveState();
      return { success: true, message: `Permanent Blacklist enforced on Phone, Aadhaar, and Device ID`, report };
    }

    if (actionType === 'DISMISSED') {
      report.status = 'DISMISSED';
      this.saveState();
      return { success: true, message: `Report dismissed as false alarm / insufficient proof`, report };
    }

    this.saveState();
    return { success: true, message: 'Action recorded successfully', report };
  }

  removeBlacklist(id: string): boolean {
    const beforeLen = this.blacklistedIdentities.length;
    this.blacklistedIdentities = this.blacklistedIdentities.filter((b) => b.id !== id);
    if (this.blacklistedIdentities.length !== beforeLen) {
      this.saveState();
      return true;
    }
    return false;
  }

  getSafetyKPIs() {
    const openReports = this.abuseReports.filter((r) => r.status === 'OPEN').length;
    const criticalCount = this.abuseReports.filter((r) => r.severity === 'CRITICAL' && r.status === 'OPEN').length;
    const shadowFrozen = this.abuseReports.filter((r) => r.status === 'SHADOW_FROZEN').length;
    const totalBlacklisted = this.blacklistedIdentities.length;
    return { openReports, criticalCount, shadowFrozen, totalBlacklisted };
  }
}

export const crmDataService = new CRMDataService();
