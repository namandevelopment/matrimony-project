// =========================================================================
// SINDHI MATRIMONY — COMMUNITY, CASTE, SUBCASTE, GOTRA & SURNAME MASTER SERVICE
// =========================================================================

export type VerificationStatus = 'VERIFIED' | 'NEEDS_REVIEW' | 'DISPUTED';
export type RuleSeverity = 'BLOCKING' | 'ADVISORY' | 'BOOST';
export type MasterEntityType = 'COMMUNITY' | 'SUBCASTE' | 'GOTRA' | 'SURNAME' | 'RULE';

export interface CommunityMaster {
  id: string;
  name: string;
  category: 'RELIGIOUS_SOCIAL' | 'CASTE_COMMUNITY' | 'REGIONAL_GROUP';
  aliases: string[];
  historicalRegion: string;
  description: string;
  hasGotraSystem: boolean; // Configurable: allows communities with no Gotra system
  verificationStatus: VerificationStatus;
  sourceReference: string;
  adminNotes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubcasteMaster {
  id: string;
  communityId?: string;
  communityName?: string;
  name: string;
  aliases: string[];
  region: string;
  description: string;
  surnames: string[];
  allowedGotraIds?: string[]; // Multiple Gotras configurable for a subcaste
  priorityWeight: number;
  verificationStatus: VerificationStatus;
  sourceReference: string;
  adminNotes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility alias
export type SubcasteItem = SubcasteMaster;

export interface GotraMaster {
  id: string;
  name: string;
  lineage: string; // Vedic root seer / clan
  description: string;
  alternateSpellings: string[];
  prohibitedSameGotra: boolean;
  associatedCommunities?: string[]; // General Vedic Gotra vs. community associations
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationStatus: VerificationStatus;
  sourceReference: string;
  adminNotes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Backward compatibility alias
export type GotraItem = GotraMaster;

export interface SurnameMaster {
  id: string;
  canonicalSurname: string;
  alternateSpellings: string[];
  mappedSubcasteIds: string[];
  mappedSubcasteNames: string[];
  mappedGotraIds?: string[];
  mappedGotraNames?: string[];
  isAmbiguous: boolean; // Surnames belonging to multiple communities
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationStatus: VerificationStatus;
  sourceReference: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GotraCompatibilityRule {
  id: string;
  code: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: RuleSeverity;
  affectedCommunities: string[]; // ['ALL'] or specific IDs
  exemptCommunities?: string[]; // Communities with overrides or no Gotra restrictions
  explanationMessage: string;
}

export interface GotraRulesConfig {
  strictSameGotraRule: boolean;
  subcastePriorityMatching: boolean;
  maternalGotraCheck: boolean;
}

export interface MasterDataAuditLog {
  id: string;
  entityType: MasterEntityType;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'STATUS_CHANGE' | 'IMPORT' | 'RESET';
  performedBy: string;
  timestamp: string;
  details: string;
}

// Storage keys
const STORAGE_KEY_COMMUNITIES = 'sm_admin_communities_v2';
const STORAGE_KEY_SUBCASTES = 'sm_admin_subcastes_v2';
const STORAGE_KEY_GOTRAS = 'sm_admin_gotras_v2';
const STORAGE_KEY_SURNAMES = 'sm_admin_surnames_v2';
const STORAGE_KEY_RULES = 'sm_admin_gotra_rules_v2';
const STORAGE_KEY_AUDIT = 'sm_admin_master_audit_v2';

// -------------------------------------------------------------------------
// COMPREHENSIVE INITIAL SEED DATA
// -------------------------------------------------------------------------

export const INITIAL_COMMUNITIES: CommunityMaster[] = [
  {
    id: 'comm_1',
    name: 'Sindhi Hindu (General)',
    category: 'RELIGIOUS_SOCIAL',
    aliases: ['Sindhi Sanatani', 'Sindhi Hindu Community'],
    historicalRegion: 'Historic Sindh Province & Diaspora',
    description: 'Umbrella identity of Hindu families of Sindhi linguistic and cultural origin across India and worldwide.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'All India Sindhi Council & Census of India Historical Ethnography',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_2',
    name: 'Sindhi Lohana',
    category: 'CASTE_COMMUNITY',
    aliases: ['Luwana', 'Lohana Kshatriya', 'Luv Vanshi'],
    historicalRegion: 'Central and Lower Sindh, Kutch, Saurashtra',
    description: 'Ancient mercantile and warrior clan tracing lineage to Luv, son of Lord Rama. Comprises Amils, Bhaibands, and Sahitis.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'E.H. Aitken, Gazetteer of the Province of Sind (1907)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_3',
    name: 'Sindhi Amil',
    category: 'CASTE_COMMUNITY',
    aliases: ['Aamil', 'Amils of Hyderabad', 'Amil Sindhi'],
    historicalRegion: 'Hyderabad, Khudabad & Central Sindh',
    description: 'Administrative, judicial, and scholarly community serving as executive officers, ministers, and professionals.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Bherumal Mahirchand Advani, "Amilan Jo Ahwal" (1919)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_4',
    name: 'Sindhi Bhaiband',
    category: 'CASTE_COMMUNITY',
    aliases: ['Baibhand', 'Bhaibund', 'Sindwork Merchants'],
    historicalRegion: 'Karachi, Hyderabad, Thatta, Global Trading Ports',
    description: 'Renowned international merchant community established global trade networks (Sindwork) across Asia, Africa, and Europe.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Claude Markovits, "The Global World of Indian Merchants 1750-1947" (Cambridge)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_5',
    name: 'Sindhi Sahiti',
    category: 'REGIONAL_GROUP',
    aliases: ['Saheti', 'Sahito', 'Sahiti Pargana'],
    historicalRegion: 'Sahiti Pargana (Naushahro Feroze, Bhiria, Kandiaro)',
    description: 'Families originating from the fertile Sahiti agricultural pargana, known for education, land management, and public service.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sindh Gazetteer (1907), District Naushahro Feroze Records',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_6',
    name: 'Sindhi Brahmin / Maharaj',
    category: 'CASTE_COMMUNITY',
    aliases: ['Sindhi Maharaj', 'Pushkarna Brahmin', 'Saraswat Brahmin of Sindh'],
    historicalRegion: 'Thatta, Rohri, Sukkur, Sehwan',
    description: 'Priesthood, Vedic educators, and custodians of Sanatan Vedic rituals, temple ceremonies, and genealogical records.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Vedic Saraswat Samiti Records & Sindh Heritage Trust',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_7',
    name: 'Sindhi Bhatia',
    category: 'CASTE_COMMUNITY',
    aliases: ['Bhatti', 'Thattai Bhatia', 'Kutch-Sindh Bhatia'],
    historicalRegion: 'Thatta, Karachi, Kutch Maritime Corridor',
    description: 'Yaduvanshi lineage merchants with maritime trade connections spanning the Persian Gulf, Bombay, and Kutch.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Thattai Bhatia Mahajan Archives & Sindh Historical Quarterly',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_8',
    name: 'Sindhi Sikh / Nanakpanthi',
    category: 'RELIGIOUS_SOCIAL',
    aliases: ['Sahajdhari Sindhi', 'Nanakshahi Sindhi', 'Udasi Tradition'],
    historicalRegion: 'Kandhkot, Jacobabad, Sukkur, Shikarpur',
    description: 'Followers of Guru Nanak Dev Ji and Udasi saints. Maintain composite religious traditions with distinct matrimonial norms.',
    hasGotraSystem: false, // Community with no strict Vedic Gotra exogamy requirement
    verificationStatus: 'VERIFIED',
    sourceReference: 'World Sindhi Congress & Udasi Dera Archives',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_9',
    name: 'Sindhi Chhapru',
    category: 'REGIONAL_GROUP',
    aliases: ['Chhaproo', 'Kohistani Sindhi'],
    historicalRegion: 'Kohistan, Sehwan foothills, Dadu borderlands',
    description: 'Hill and pastoral communities living in the western border regions between Sindh and Balochistan.',
    hasGotraSystem: false,
    verificationStatus: 'NEEDS_REVIEW',
    sourceReference: 'Regional Folk Documentation & Ethnographic Surveys',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_10',
    name: 'Sindhi Shikarpuri',
    category: 'REGIONAL_GROUP',
    aliases: ['Shikarpuria', 'Central Asian Banking Guild'],
    historicalRegion: 'Shikarpur Northern Caravan Hub',
    description: 'Historical indigenous bankers (Hundi financiers) operating across Central Asia, Bukhara, Samarkand, and Bombay.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Scott Levi, "The Indian Merchant Diaspora in Central Asia and Russia"',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_11',
    name: 'Sindhi Larai',
    category: 'REGIONAL_GROUP',
    aliases: ['Lari', 'Lower Sindh Delta'],
    historicalRegion: 'Lar region (Badin, Sujawal, Thatta delta)',
    description: 'Inhabitants of Lower Sindh (Lar), known for distinct regional dialect, agrarian roots, and maritime trading.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Imperial Gazetteer of India, Provincial Series: Sind (1908)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'comm_12',
    name: 'Sindhi Uttaradi',
    category: 'REGIONAL_GROUP',
    aliases: ['Sirai', 'Upper Sindh'],
    historicalRegion: 'Siro / Upper Sindh (Jacobabad, Kashmore, Ghotki)',
    description: 'Northern Sindh community characterized by Siro linguistic dialect and cross-regional commercial connections.',
    hasGotraSystem: true,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Linguistic Survey of India (G.A. Grierson), Sindhi Dialect Series',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
];

export const INITIAL_SUBCASTES: SubcasteMaster[] = [
  {
    id: 'sub_1',
    communityId: 'comm_3',
    communityName: 'Sindhi Amil',
    name: 'Amil',
    aliases: ['Aamil', 'Amils of Hyderabad'],
    region: 'Hyderabad & Central Sindh',
    description: 'Executive officers, civil administrators, writers, jurists, and scholars of traditional Sindh.',
    surnames: ['Advani', 'Gidwani', 'Mansukhani', 'Mirchandani', 'Thadhani', 'Bhavnani', 'Shahani', 'Sipahimalani', 'Jhangiani', 'Kripalani', 'Malkani'],
    allowedGotraIds: ['got_1', 'got_2', 'got_3', 'got_4', 'got_5', 'got_6', 'got_7', 'got_8'],
    priorityWeight: 10,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Amilan Jo Ahwal (1919) by Bherumal Mahirchand',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_2',
    communityId: 'comm_4',
    communityName: 'Sindhi Bhaiband',
    name: 'Baibhand (Bhaiband)',
    aliases: ['Bhaibund', 'Bhaiband', 'Sindworki'],
    region: 'Karachi & Sindh International Hubs',
    description: 'Global entrepreneurs, wholesale traders, overseas merchants, and textile industrialists.',
    surnames: ['Chandnani', 'Chhabria', 'Melwani', 'Chellaram', 'Harilela', 'Lakhani', 'Mahtani', 'Ramani', 'Sippy', 'Vaswani'],
    allowedGotraIds: ['got_1', 'got_2', 'got_3', 'got_4', 'got_5', 'got_6', 'got_7', 'got_8', 'got_9', 'got_10'],
    priorityWeight: 10,
    verificationStatus: 'VERIFIED',
    sourceReference: 'The Sindworkies: Global Merchants by Claude Markovits',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_3',
    communityId: 'comm_5',
    communityName: 'Sindhi Sahiti',
    name: 'Sahiti',
    aliases: ['Saheti', 'Sahito'],
    region: 'Sahiti Pargana (Naushahro Feroze, Bhiria)',
    description: 'Agricultural estate owners, civil educators, and distinguished literary patrons.',
    surnames: ['Bhatia', 'Motwani', 'Hingorani', 'Jagtiani', 'Panjwani', 'Vasandani', 'Punshi'],
    allowedGotraIds: ['got_1', 'got_3', 'got_4', 'got_5', 'got_7'],
    priorityWeight: 9,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sindh Gazetteer (1907)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_4',
    communityId: 'comm_10',
    communityName: 'Sindhi Shikarpuri',
    name: 'Shikarpuri',
    aliases: ['Shikarpuria'],
    region: 'Shikarpur Historic Banking Hub',
    description: 'Historical international financiers, indigenous bankers, goldsmiths, and spice traders.',
    surnames: ['Bajaj', 'Nagpal', 'Lalwani', 'Soni', 'Sethia', 'Bhagchandani'],
    allowedGotraIds: ['got_1', 'got_2', 'got_4', 'got_6', 'got_8'],
    priorityWeight: 8,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Scott Levi, The Indian Merchant Diaspora',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_5',
    communityId: 'comm_3',
    communityName: 'Sindhi Amil',
    name: 'Hyderabadi',
    aliases: ['Hyderabadi Sindhi'],
    region: 'Hyderabad Cultural Capital',
    description: 'Centuries-old cultural hub families renowned for philanthropy, literature, and trade.',
    surnames: ['Vaswani', 'Hiranandani', 'Shivdasani', 'Dudani', 'Chainani'],
    allowedGotraIds: ['got_1', 'got_2', 'got_4', 'got_5', 'got_8'],
    priorityWeight: 9,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Hyderabad Historical Trust Records',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_6',
    communityId: 'comm_2',
    communityName: 'Sindhi Lohana',
    name: 'Larkana',
    aliases: ['Larkano', 'Larkana Heritage'],
    region: 'Larkana Heritage District',
    description: 'Upper Sindh commercial leaders, prominent jurists, and agricultural stewards.',
    surnames: ['Lahori', 'Khanchandani', 'Lund', 'Kalro', 'Paryani'],
    allowedGotraIds: ['got_1', 'got_4', 'got_5', 'got_8'],
    priorityWeight: 8,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Larkana District Gazetteers',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_7',
    communityId: 'comm_2',
    communityName: 'Sindhi Lohana',
    name: 'Dadu & Sehwan',
    aliases: ['Dadu', 'Sehwani'],
    region: 'Indus Valley Cultural Basin',
    description: 'Ancient Indus valley families with deep roots in cultural traditions, shrine stewardship, and crafts.',
    surnames: ['Rohra', 'Kalwani', 'Jumani', 'Talreja', 'Pahuja'],
    allowedGotraIds: ['got_1', 'got_2', 'got_3', 'got_7'],
    priorityWeight: 7,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Archaeological and Ethnographic Survey of Sehwan',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_8',
    communityId: 'comm_2',
    communityName: 'Sindhi Lohana',
    name: 'Sukkur (Sakhar)',
    aliases: ['Sakhar', 'Sakkari'],
    region: 'Sukkur Indus Gorge',
    description: 'Commerce and transit hub families along the majestic Indus river crossings and Lansdowne Bridge corridor.',
    surnames: ['Rijhwani', 'Kripalani', 'Wadhwani', 'Kukreja', 'Narwani'],
    allowedGotraIds: ['got_1', 'got_4', 'got_6', 'got_8'],
    priorityWeight: 8,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sukkur Municipality Historical Archive',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_9',
    communityId: 'comm_11',
    communityName: 'Sindhi Larai',
    name: 'Larai',
    aliases: ['Lari', 'Lower Sindh Delta'],
    region: 'Badin, Sujawal, Thatta Coastal Strip',
    description: 'Lower Sindh families renowned for distinct cultural traditions, folk music, and maritime trade.',
    surnames: ['Lulla', 'Nankani', 'Sukhani', 'Mulchandani'],
    allowedGotraIds: ['got_1', 'got_3', 'got_5', 'got_11'],
    priorityWeight: 7,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Provincial Series: Sind (1908)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_10',
    communityId: 'comm_12',
    communityName: 'Sindhi Uttaradi',
    name: 'Uttaradi',
    aliases: ['Sirai', 'Uttaradi Sindhi'],
    region: 'Jacobabad, Kashmore, Ghotki',
    description: 'Northern frontier communities bridging Sindh with Punjab and Balochistan trading routes.',
    surnames: ['Chandiramani', 'Keswani', 'Uttamchandani'],
    allowedGotraIds: ['got_1', 'got_4', 'got_7', 'got_12'],
    priorityWeight: 7,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Grierson Linguistic Survey of India',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_11',
    communityId: 'comm_7',
    communityName: 'Sindhi Bhatia',
    name: 'Thattai Bhatia',
    aliases: ['Bhatia Thatta', 'Maritime Bhatia'],
    region: 'Thatta, Kutch, Bombay',
    description: 'Ancient merchant guild originating in medieval Thatta with distinct temple trusts and strict exogamy rules.',
    surnames: ['Bhatia', 'Gajaria', 'Ashar', 'Ved'],
    allowedGotraIds: ['got_1', 'got_3', 'got_4', 'got_8', 'got_13'],
    priorityWeight: 9,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Thattai Bhatia Mahajan Centenary Volume',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_12',
    communityId: 'comm_6',
    communityName: 'Sindhi Brahmin / Maharaj',
    name: 'Maharaj / Brahmin',
    aliases: ['Pushkarna Sindhi', 'Saraswat Sindhi'],
    region: 'Throughout Sindh Sacred Centers',
    description: 'Spiritual preceptors, astrologers, and ritual masters adhering to classical Vedic Gotra and Pravara rules.',
    surnames: ['Sharma', 'Purohit', 'Maharaj', 'Acharya'],
    allowedGotraIds: ['got_1', 'got_2', 'got_3', 'got_4', 'got_5', 'got_6', 'got_7', 'got_8', 'got_9', 'got_10', 'got_11', 'got_12', 'got_13', 'got_14', 'got_15', 'got_16'],
    priorityWeight: 10,
    verificationStatus: 'VERIFIED',
    sourceReference: 'Saraswat Brahmin Sabha & Sindh Purohit Registry',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sub_13',
    communityId: 'comm_9',
    communityName: 'Sindhi Chhapru',
    name: 'Chhapru',
    aliases: ['Chhaproo'],
    region: 'Western Balochistan-Sindh Frontier',
    description: 'Highland pastoral and trade caravan families with distinct ancestral customs.',
    surnames: ['Chhapru', 'Balochani'],
    allowedGotraIds: [],
    priorityWeight: 6,
    verificationStatus: 'NEEDS_REVIEW',
    sourceReference: 'Regional Folkloric Documentation',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
];

export const INITIAL_GOTRAS: GotraMaster[] = [
  {
    id: 'got_1',
    name: 'Kashyap',
    lineage: 'Rishi Kashyapa (Solar / Aditya Clan & Marichi Lineage)',
    description: 'Foremost Vedic root Gotra. Revered widely across Sindhi Amil, Bhaiband, and Lohana families.',
    alternateSpellings: ['Kashyapa', 'Kashyapji', 'Kashyapu'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Hindu', 'Sindhi Amil', 'Sindhi Bhaiband', 'Sindhi Lohana', 'Sindhi Brahmin'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Rigveda Anukramani & Matsya Purana Gotra-Pravara Chapters',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_2',
    name: 'Shandilya',
    lineage: 'Rishi Shandilya (Asita-Devala & Bhakti Sutra Lineage)',
    description: 'Associated with deep devotion, Vedic astronomical observation, and Agnihotra traditions.',
    alternateSpellings: ['Shandil', 'Sandilya', 'Shandilyam'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Amil', 'Sindhi Bhaiband', 'Sindhi Brahmin'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Shandilya Bhakti Sutras & Baudhayan Shrautasutra Pravaradhyaya',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_3',
    name: 'Vatsa',
    lineage: 'Rishi Bhrigu / Vatsa (Bhargava Clan)',
    description: 'Distinguished Bhargava branch venerated for austerity, legal wisdom, and prosperity rituals.',
    alternateSpellings: ['Vats', 'Vatsya', 'Bachas'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Amil', 'Sindhi Sahiti', 'Sindhi Bhatia'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Baudhayan Shrauta Sutra Pravara Khanda',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_4',
    name: 'Bharadwaj',
    lineage: 'Rishi Bharadwaja (Brihaspati / Angirasa Seer Clan)',
    description: 'Vedic seer of Rigveda Mandala 6, master of healing sciences (Ayurveda), and statecraft.',
    alternateSpellings: ['Bhardwaj', 'Bharadwaja', 'Bharadwaji'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Amil', 'Sindhi Bhaiband', 'Sindhi Shikarpuri', 'Sindhi Brahmin'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Rigveda Mandala 6 & Charaka Samhita Invocations',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_5',
    name: 'Gautam',
    lineage: 'Rishi Gautama (Angirasa Clan & Nyaya Jurisprudence)',
    description: 'Pioneers of classical Nyaya logic and philosophy, widely documented in Sindhi families.',
    alternateSpellings: ['Gautama', 'Gotam', 'Goutam'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Amil', 'Sindhi Hyderabadi', 'Sindhi Sahiti'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Gautama Dharma Sutras & Baudhayana Shrauta Sutra',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_6',
    name: 'Parashar',
    lineage: 'Rishi Parashara (Vashistha Patriarch Lineage)',
    description: 'Lineage of classical Vedic astronomy, astrology (Hora Shastra), and agricultural treatises (Krishi Parashara).',
    alternateSpellings: ['Parashara', 'Prashar', 'Parasara'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Shikarpuri', 'Sindhi Sukkur', 'Sindhi Brahmin'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Brihat Parashara Hora Shastra & Vishnu Purana',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_7',
    name: 'Kaushik',
    lineage: 'Rishi Vishvamitra / Kaushika (Kshatriya-Brahmarshi)',
    description: 'Lineage of the sacred Gayatri Mantra, representing transformation, perseverance, and high ideals.',
    alternateSpellings: ['Vishvamitra', 'Kaushika', 'Koshik'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Amil', 'Sindhi Sahiti', 'Sindhi Lohana'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Rigveda Mandala 3 & Valmiki Ramayana Balakanda',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_8',
    name: 'Vashishta',
    lineage: 'Rishi Vashistha (Saptarishi Patriarch & Solar Preceptor)',
    description: 'Supreme spiritual preceptors, teachers of Yoga Vasistha, steadfast in righteousness and tranquility.',
    alternateSpellings: ['Vashisht', 'Vashistha', 'Vasishta', 'Basisth'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Amil', 'Sindhi Bhaiband', 'Sindhi Hyderabadi', 'Sindhi Brahmin'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Yoga Vasistha & Rigveda Mandala 7',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_9',
    name: 'Atri',
    lineage: 'Rishi Atri (Saptarishi & Soma Ancestry)',
    description: 'Venerated Vedic seer of Rigveda Mandala 5, noted for spiritual illumination and peace.',
    alternateSpellings: ['Atreya', 'Aattri'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Brahmin', 'Sindhi Bhaiband'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Rigveda Mandala 5 & Matsya Purana',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_10',
    name: 'Agastya',
    lineage: 'Rishi Agastya (Maitravaruna Lineage)',
    description: 'Celebrated seer who bridged northern and southern Indian cultures and established oceanic trade routes.',
    alternateSpellings: ['Agasti', 'Agasthya'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Bhaiband', 'Sindhi Thattai Bhatia'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Rigveda Agastya Suktas & Aditya Hridaya Stotra',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_11',
    name: 'Garg',
    lineage: 'Rishi Garga (Bharadwaja Branch)',
    description: 'Lineage of Garga Samhita, early geometry, and cosmic celestial mapping.',
    alternateSpellings: ['Garga', 'Gargya'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Larai', 'Sindhi Brahmin'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Garga Samhita & Shrauta Sutra',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_12',
    name: 'Jamadagni',
    lineage: 'Rishi Jamadagni (Bhargava Seer Lineage)',
    description: 'Dedicated to penance and protection, root ancestor in the five-pravara Bhargava clan.',
    alternateSpellings: ['Jamdagni', 'Jamadagnya'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Uttaradi', 'Sindhi Brahmin'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Mahabharata Anushasana Parva Gotra Lists',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_13',
    name: 'Harita',
    lineage: 'Rishi Harita (Angirasa-Ambarisha Lineage)',
    description: 'Seer of Harita Smriti, balancing administrative governance with scriptural mastery.',
    alternateSpellings: ['Harit', 'Haritasa', 'Harita Rishi'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Thattai Bhatia', 'Sindhi Lohana'],
    confidence: 'MEDIUM',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Harita Dharma Shastra',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_14',
    name: 'Mudgala',
    lineage: 'Rishi Mudgala (Angirasa Clan)',
    description: 'Associated with hospitality, patience, and victory through dharma.',
    alternateSpellings: ['Maudgalya', 'Mudgal'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Brahmin'],
    confidence: 'MEDIUM',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Mudgala Upanishad & Rigveda',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_15',
    name: 'Angirasa',
    lineage: 'Maharshi Angiras (Prathama Prajapati)',
    description: 'One of the primordial seers of the Atharvaveda, representing luminous fire rituals.',
    alternateSpellings: ['Angiras', 'Aangirasa'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Brahmin', 'Sindhi Lohana'],
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Mundaka Upanishad & Atharvaveda',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'got_16',
    name: 'Shaunaka',
    lineage: 'Rishi Shaunaka (Gritsamada / Bhrigu Clan)',
    description: 'Compiler of the Rigvedic index (Sarvanukramani) and teacher in the Naimisharanya tradition.',
    alternateSpellings: ['Shaunak', 'Saunaka'],
    prohibitedSameGotra: true,
    associatedCommunities: ['Sindhi Brahmin'],
    confidence: 'MEDIUM',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Brihaddevata & Rigveda Anukramani',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
];

export const INITIAL_SURNAMES: SurnameMaster[] = [
  {
    id: 'sur_1',
    canonicalSurname: 'Advani',
    alternateSpellings: ['Adwani', 'Aadwani'],
    mappedSubcasteIds: ['sub_1'],
    mappedSubcasteNames: ['Amil'],
    mappedGotraIds: ['got_1'],
    mappedGotraNames: ['Kashyap'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Amilan Jo Ahwal (1919)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_2',
    canonicalSurname: 'Mulchandani',
    alternateSpellings: ['Moolchandani'],
    mappedSubcasteIds: ['sub_1', 'sub_9'],
    mappedSubcasteNames: ['Amil', 'Larai'],
    mappedGotraIds: ['got_1', 'got_4'],
    mappedGotraNames: ['Kashyap', 'Bharadwaj'],
    isAmbiguous: true, // Occurs in both Amil and Larai families
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sindhi Genealogies by Popati Hiranandani',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_3',
    canonicalSurname: 'Chhabria',
    alternateSpellings: ['Chhabriya', 'Chabria'],
    mappedSubcasteIds: ['sub_2'],
    mappedSubcasteNames: ['Baibhand (Bhaiband)'],
    mappedGotraIds: ['got_3'],
    mappedGotraNames: ['Vatsa'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sindwork Merchants Registry',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_4',
    canonicalSurname: 'Rohra',
    alternateSpellings: ['Rohira', 'Rora'],
    mappedSubcasteIds: ['sub_7'],
    mappedSubcasteNames: ['Dadu & Sehwan'],
    mappedGotraIds: ['got_1'],
    mappedGotraNames: ['Kashyap'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Dadu-Sehwan Historical Registry',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_5',
    canonicalSurname: 'Panjwani',
    alternateSpellings: ['Punjwani', 'Panjwany'],
    mappedSubcasteIds: ['sub_3'],
    mappedSubcasteNames: ['Sahiti'],
    mappedGotraIds: ['got_4'],
    mappedGotraNames: ['Bharadwaj'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sahiti Pargana Family Records',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_6',
    canonicalSurname: 'Motwani',
    alternateSpellings: ['Mothwani'],
    mappedSubcasteIds: ['sub_3'],
    mappedSubcasteNames: ['Sahiti'],
    mappedGotraIds: ['got_5'],
    mappedGotraNames: ['Gautam'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sahiti Pargana Family Records',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_7',
    canonicalSurname: 'Gidwani',
    alternateSpellings: ['Giddwani'],
    mappedSubcasteIds: ['sub_1'],
    mappedSubcasteNames: ['Amil'],
    mappedGotraIds: ['got_8'],
    mappedGotraNames: ['Vashishta'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Amilan Jo Ahwal (1919)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_8',
    canonicalSurname: 'Wadhwani',
    alternateSpellings: ['Wadwani'],
    mappedSubcasteIds: ['sub_8'],
    mappedSubcasteNames: ['Sukkur (Sakhar)'],
    mappedGotraIds: ['got_6'],
    mappedGotraNames: ['Parashar'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sukkur Municipality Archive',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_9',
    canonicalSurname: 'Bhatia',
    alternateSpellings: ['Bhatiya', 'Bhatti'],
    mappedSubcasteIds: ['sub_3', 'sub_11'],
    mappedSubcasteNames: ['Sahiti', 'Thattai Bhatia'],
    mappedGotraIds: ['got_1', 'got_4'],
    mappedGotraNames: ['Kashyap', 'Bharadwaj'],
    isAmbiguous: true, // Bhatia is both a distinct community, subcaste, and surname
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Thattai Bhatia Mahajan Archives',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_10',
    canonicalSurname: 'Lalwani',
    alternateSpellings: ['Lallwani', 'Laalwani'],
    mappedSubcasteIds: ['sub_4'],
    mappedSubcasteNames: ['Shikarpuri'],
    mappedGotraIds: ['got_1', 'got_6'],
    mappedGotraNames: ['Kashyap', 'Parashar'],
    isAmbiguous: true,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Shikarpur Heritage Guild',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_11',
    canonicalSurname: 'Vaswani',
    alternateSpellings: ['Wasswani', 'Vaswani'],
    mappedSubcasteIds: ['sub_2', 'sub_5'],
    mappedSubcasteNames: ['Baibhand (Bhaiband)', 'Hyderabadi'],
    mappedGotraIds: ['got_1'],
    mappedGotraNames: ['Kashyap'],
    isAmbiguous: true,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sadhu Vaswani Mission & Hyderabad Historical Records',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_12',
    canonicalSurname: 'Hiranandani',
    alternateSpellings: ['Heeranandani'],
    mappedSubcasteIds: ['sub_5'],
    mappedSubcasteNames: ['Hyderabadi'],
    mappedGotraIds: ['got_8'],
    mappedGotraNames: ['Vashishta'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Hyderabad Family Lineage Archives',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_13',
    canonicalSurname: 'Sippy',
    alternateSpellings: ['Sipi', 'Sippee'],
    mappedSubcasteIds: ['sub_2'],
    mappedSubcasteNames: ['Baibhand (Bhaiband)'],
    mappedGotraIds: ['got_2'],
    mappedGotraNames: ['Shandilya'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Karachi Trade Directory (1940)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_14',
    canonicalSurname: 'Thadhani',
    alternateSpellings: ['Thadani'],
    mappedSubcasteIds: ['sub_1'],
    mappedSubcasteNames: ['Amil'],
    mappedGotraIds: ['got_1'],
    mappedGotraNames: ['Kashyap'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Amilan Jo Ahwal (1919)',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_15',
    canonicalSurname: 'Malkani',
    alternateSpellings: ['Malkaani'],
    mappedSubcasteIds: ['sub_1'],
    mappedSubcasteNames: ['Amil'],
    mappedGotraIds: ['got_5'],
    mappedGotraNames: ['Gautam'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'K.R. Malkani, The Sindh Story',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_16',
    canonicalSurname: 'Bhavnani',
    alternateSpellings: ['Bhavani'],
    mappedSubcasteIds: ['sub_1'],
    mappedSubcasteNames: ['Amil'],
    mappedGotraIds: ['got_4'],
    mappedGotraNames: ['Bharadwaj'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Amilan Jo Ahwal',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_17',
    canonicalSurname: 'Kripalani',
    alternateSpellings: ['Kriplani'],
    mappedSubcasteIds: ['sub_1', 'sub_8'],
    mappedSubcasteNames: ['Amil', 'Sukkur (Sakhar)'],
    mappedGotraIds: ['got_3'],
    mappedGotraNames: ['Vatsa'],
    isAmbiguous: true,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Acharya Kripalani Memorial Records',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_18',
    canonicalSurname: 'Hingorani',
    alternateSpellings: ['Hingoraani'],
    mappedSubcasteIds: ['sub_3'],
    mappedSubcasteNames: ['Sahiti'],
    mappedGotraIds: ['got_1'],
    mappedGotraNames: ['Kashyap'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sahiti Pargana Family Records',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_19',
    canonicalSurname: 'Lakhani',
    alternateSpellings: ['Lakhaani'],
    mappedSubcasteIds: ['sub_2'],
    mappedSubcasteNames: ['Baibhand (Bhaiband)'],
    mappedGotraIds: ['got_7'],
    mappedGotraNames: ['Kaushik'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Sindwork Merchant Directories',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
  {
    id: 'sur_20',
    canonicalSurname: 'Chandiramani',
    alternateSpellings: ['Chandramani'],
    mappedSubcasteIds: ['sub_10'],
    mappedSubcasteNames: ['Uttaradi'],
    mappedGotraIds: ['got_4'],
    mappedGotraNames: ['Bharadwaj'],
    isAmbiguous: false,
    confidence: 'HIGH',
    verificationStatus: 'VERIFIED',
    sourceReference: 'Upper Sindh Registry',
    active: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-10-12',
  },
];

export const INITIAL_RULES: GotraCompatibilityRule[] = [
  {
    id: 'rule_1',
    code: 'SAME_GOTRA_EXOGAMY',
    name: 'Vedic Same-Gotra (Sagotra) Restriction',
    description: 'Prohibits matrimonial alliances between candidates sharing the exact same Vedic root Gotra (Sagotra Exogamy), unless the community specifically permits an exemption.',
    enabled: true,
    severity: 'BLOCKING',
    affectedCommunities: ['ALL'],
    exemptCommunities: ['comm_8'], // Sindhi Sikh / Nanakpanthi exempt
    explanationMessage: 'Sagotra Exogamy Blocked: Both profiles belong to the same Vedic root Gotra lineage.',
  },
  {
    id: 'rule_2',
    code: 'MATERNAL_GOTRA_EXOGAMY',
    name: 'Maternal Gotra Exogamy Check',
    description: 'Flag alert if candidate share maternal grandmother or mother Gotra with client lineage.',
    enabled: false,
    severity: 'ADVISORY',
    affectedCommunities: ['comm_6', 'comm_7'], // Strict Brahmins and Bhatias
    explanationMessage: 'Advisory: Maternal Gotra match detected. Recommend elder astrological verification.',
  },
  {
    id: 'rule_3',
    code: 'SUBCASTE_PREFERENCE',
    name: 'Subcaste Match Score Priority Boost',
    description: 'Awards a +10% compatibility score boost when both client and candidate share the exact same subcaste or allied subcaste cluster.',
    enabled: true,
    severity: 'BOOST',
    affectedCommunities: ['ALL'],
    explanationMessage: 'Same subcaste cultural synergy (+10% compatibility score applied).',
  },
  {
    id: 'rule_4',
    code: 'INTER_COMMUNITY_ALLOWED',
    name: 'Inter-Community Matrimonial Alliance Policy',
    description: 'Allows recommendations between different Sindhi sub-groups (e.g., Amil with Bhaiband) with advisory cultural note.',
    enabled: true,
    severity: 'ADVISORY',
    affectedCommunities: ['ALL'],
    explanationMessage: 'Cross-subcaste Sindhi match approved under open community compatibility policy.',
  },
];

class SubcasteGotraService {
  private communities: CommunityMaster[] = [];
  private subcastes: SubcasteMaster[] = [];
  private gotras: GotraMaster[] = [];
  private surnames: SurnameMaster[] = [];
  private rules: GotraCompatibilityRule[] = [];
  private auditLogs: MasterDataAuditLog[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') {
      this.resetToDefaultsMemoryOnly();
      return;
    }

    try {
      const savedComm = localStorage.getItem(STORAGE_KEY_COMMUNITIES);
      this.communities = savedComm ? JSON.parse(savedComm) : [...INITIAL_COMMUNITIES];

      const savedSubs = localStorage.getItem(STORAGE_KEY_SUBCASTES);
      this.subcastes = savedSubs ? JSON.parse(savedSubs) : [...INITIAL_SUBCASTES];

      const savedGotras = localStorage.getItem(STORAGE_KEY_GOTRAS);
      this.gotras = savedGotras ? JSON.parse(savedGotras) : [...INITIAL_GOTRAS];

      const savedSurnames = localStorage.getItem(STORAGE_KEY_SURNAMES);
      this.surnames = savedSurnames ? JSON.parse(savedSurnames) : [...INITIAL_SURNAMES];

      const savedRules = localStorage.getItem(STORAGE_KEY_RULES);
      this.rules = savedRules ? JSON.parse(savedRules) : [...INITIAL_RULES];

      const savedAudit = localStorage.getItem(STORAGE_KEY_AUDIT);
      this.auditLogs = savedAudit ? JSON.parse(savedAudit) : [];
    } catch {
      this.resetToDefaultsMemoryOnly();
    }
  }

  private resetToDefaultsMemoryOnly() {
    this.communities = [...INITIAL_COMMUNITIES];
    this.subcastes = [...INITIAL_SUBCASTES];
    this.gotras = [...INITIAL_GOTRAS];
    this.surnames = [...INITIAL_SURNAMES];
    this.rules = [...INITIAL_RULES];
    this.auditLogs = [];
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_COMMUNITIES, JSON.stringify(this.communities));
      localStorage.setItem(STORAGE_KEY_SUBCASTES, JSON.stringify(this.subcastes));
      localStorage.setItem(STORAGE_KEY_GOTRAS, JSON.stringify(this.gotras));
      localStorage.setItem(STORAGE_KEY_SURNAMES, JSON.stringify(this.surnames));
      localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(this.rules));
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.auditLogs.slice(0, 100)));
    } catch (e) {
      console.warn('Failed to persist SubcasteGotraService data to localStorage', e);
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('SubcasteGotraService subscriber error:', err);
      }
    });
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private logAudit(
    entityType: MasterEntityType,
    entityId: string,
    action: MasterDataAuditLog['action'],
    details: string,
    performedBy = 'Super Admin'
  ) {
    const entry: MasterDataAuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      entityType,
      entityId,
      action,
      performedBy,
      timestamp: new Date().toISOString(),
      details,
    };
    this.auditLogs = [entry, ...this.auditLogs];
  }

  // -------------------------------------------------------------------------
  // BACKWARD COMPATIBILITY GETTERS
  // -------------------------------------------------------------------------
  public getSubcastes(): SubcasteItem[] {
    return [...this.subcastes];
  }

  public getGotras(): GotraItem[] {
    return [...this.gotras];
  }

  public getRules(): GotraRulesConfig {
    const strictRule = this.rules.find((r) => r.code === 'SAME_GOTRA_EXOGAMY');
    const priorityRule = this.rules.find((r) => r.code === 'SUBCASTE_PREFERENCE');
    const maternalRule = this.rules.find((r) => r.code === 'MATERNAL_GOTRA_EXOGAMY');

    return {
      strictSameGotraRule: strictRule ? strictRule.enabled : true,
      subcastePriorityMatching: priorityRule ? priorityRule.enabled : true,
      maternalGotraCheck: maternalRule ? maternalRule.enabled : false,
    };
  }

  // -------------------------------------------------------------------------
  // NEW HIERARCHICAL MASTERS GETTERS
  // -------------------------------------------------------------------------
  public getCommunities(): CommunityMaster[] {
    return [...this.communities];
  }

  public getSurnames(): SurnameMaster[] {
    return [...this.surnames];
  }

  public getCompatibilityRules(): GotraCompatibilityRule[] {
    return [...this.rules];
  }

  public getAuditLogs(): MasterDataAuditLog[] {
    return [...this.auditLogs];
  }

  public getMasterStats(): {
    totalCommunities: number;
    totalSubcastes: number;
    totalGotras: number;
    totalSurnames: number;
    activeRecords: number;
    pendingVerification: number;
    enabledRulesCount: number;
  } {
    const activeRecords =
      this.communities.filter((c) => c.active).length +
      this.subcastes.filter((s) => s.active).length +
      this.gotras.filter((g) => g.active).length +
      this.surnames.filter((s) => s.active).length;

    const pendingVerification =
      this.communities.filter((c) => c.verificationStatus === 'NEEDS_REVIEW').length +
      this.subcastes.filter((s) => s.verificationStatus === 'NEEDS_REVIEW').length +
      this.gotras.filter((g) => g.verificationStatus === 'NEEDS_REVIEW').length +
      this.surnames.filter((s) => s.verificationStatus === 'NEEDS_REVIEW').length;

    const enabledRulesCount = this.rules.filter((r) => r.enabled).length;

    return {
      totalCommunities: this.communities.length,
      totalSubcastes: this.subcastes.length,
      totalGotras: this.gotras.length,
      totalSurnames: this.surnames.length,
      activeRecords,
      pendingVerification,
      enabledRulesCount,
    };
  }

  // -------------------------------------------------------------------------
  // COMMUNITIES CRUD
  // -------------------------------------------------------------------------
  public addCommunity(data: Omit<CommunityMaster, 'id' | 'createdAt' | 'updatedAt'>): CommunityMaster {
    const normName = data.name.trim();
    const existing = this.communities.find(
      (c) => c.name.toLowerCase() === normName.toLowerCase()
    );
    if (existing) {
      throw new Error(`Community with name "${normName}" already exists!`);
    }

    const now = new Date().toISOString().split('T')[0];
    const newComm: CommunityMaster = {
      id: `comm_${Date.now()}`,
      ...data,
      name: normName,
      createdAt: now,
      updatedAt: now,
    };
    this.communities.push(newComm);
    this.logAudit('COMMUNITY', newComm.id, 'CREATE', `Added community "${normName}"`);
    this.saveToStorage();
    return newComm;
  }

  public updateCommunity(id: string, updates: Partial<CommunityMaster>): void {
    const idx = this.communities.findIndex((c) => c.id === id);
    if (idx === -1) return;

    if (updates.name) {
      const normName = updates.name.trim();
      const duplicate = this.communities.find(
        (c) => c.id !== id && c.name.toLowerCase() === normName.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Another community with name "${normName}" already exists!`);
      }
    }

    const now = new Date().toISOString().split('T')[0];
    this.communities[idx] = {
      ...this.communities[idx],
      ...updates,
      updatedAt: now,
    };
    this.logAudit('COMMUNITY', id, 'UPDATE', `Updated community "${this.communities[idx].name}"`);
    this.saveToStorage();
  }

  public deleteCommunity(id: string): { success: boolean; error?: string } {
    const comm = this.communities.find((c) => c.id === id);
    if (!comm) return { success: false, error: 'Community not found' };

    // Foreign-key reference check: prevent deleting if subcastes are mapped
    const referencingSubs = this.subcastes.filter((s) => s.communityId === id);
    if (referencingSubs.length > 0) {
      return {
        success: false,
        error: `Cannot delete community: Referenced by ${referencingSubs.length} active subcastes. Deactivate instead.`,
      };
    }

    this.communities = this.communities.filter((c) => c.id !== id);
    this.logAudit('COMMUNITY', id, 'DELETE', `Deleted community "${comm.name}"`);
    this.saveToStorage();
    return { success: true };
  }

  // -------------------------------------------------------------------------
  // SUBCASTES CRUD
  // -------------------------------------------------------------------------
  public addSubcaste(subcaste: Omit<SubcasteMaster, 'id' | 'createdAt' | 'updatedAt'>): SubcasteMaster {
    const normName = subcaste.name.trim();
    const existing = this.subcastes.find(
      (s) => s.name.toLowerCase() === normName.toLowerCase()
    );
    if (existing) {
      throw new Error(`Subcaste with name "${normName}" already exists!`);
    }

    const now = new Date().toISOString().split('T')[0];
    const newSub: SubcasteMaster = {
      id: `sub_${Date.now()}`,
      ...subcaste,
      name: normName,
      createdAt: now,
      updatedAt: now,
    };
    this.subcastes.push(newSub);
    this.logAudit('SUBCASTE', newSub.id, 'CREATE', `Added subcaste "${normName}"`);
    this.saveToStorage();
    return newSub;
  }

  public updateSubcaste(id: string, updates: Partial<SubcasteMaster>): void {
    const idx = this.subcastes.findIndex((s) => s.id === id);
    if (idx === -1) return;

    if (updates.name) {
      const normName = updates.name.trim();
      const duplicate = this.subcastes.find(
        (s) => s.id !== id && s.name.toLowerCase() === normName.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Another subcaste with name "${normName}" already exists!`);
      }
    }

    const now = new Date().toISOString().split('T')[0];
    this.subcastes[idx] = {
      ...this.subcastes[idx],
      ...updates,
      updatedAt: now,
    };
    this.logAudit('SUBCASTE', id, 'UPDATE', `Updated subcaste "${this.subcastes[idx].name}"`);
    this.saveToStorage();
  }

  public deleteSubcaste(id: string): { success: boolean; error?: string } {
    const sub = this.subcastes.find((s) => s.id === id);
    if (!sub) return { success: false, error: 'Subcaste not found' };

    // Reference check with surnames
    const referencingSurnames = this.surnames.filter((s) => s.mappedSubcasteIds.includes(id));
    if (referencingSurnames.length > 0) {
      return {
        success: false,
        error: `Cannot delete subcaste "${sub.name}": Linked to ${referencingSurnames.length} surnames in the surname master. Deactivate instead.`,
      };
    }

    this.subcastes = this.subcastes.filter((s) => s.id !== id);
    this.logAudit('SUBCASTE', id, 'DELETE', `Deleted subcaste "${sub.name}"`);
    this.saveToStorage();
    return { success: true };
  }

  // -------------------------------------------------------------------------
  // GOTRAS CRUD
  // -------------------------------------------------------------------------
  public addGotra(gotra: Omit<GotraMaster, 'id' | 'createdAt' | 'updatedAt'>): GotraMaster {
    const normName = gotra.name.trim();
    const existing = this.gotras.find(
      (g) => g.name.toLowerCase() === normName.toLowerCase()
    );
    if (existing) {
      throw new Error(`Gotra with name "${normName}" already exists!`);
    }

    const now = new Date().toISOString().split('T')[0];
    const newGotra: GotraMaster = {
      id: `got_${Date.now()}`,
      ...gotra,
      name: normName,
      createdAt: now,
      updatedAt: now,
    };
    this.gotras.push(newGotra);
    this.logAudit('GOTRA', newGotra.id, 'CREATE', `Added Vedic Gotra "${normName}"`);
    this.saveToStorage();
    return newGotra;
  }

  public updateGotra(id: string, updates: Partial<GotraMaster>): void {
    const idx = this.gotras.findIndex((g) => g.id === id);
    if (idx === -1) return;

    if (updates.name) {
      const normName = updates.name.trim();
      const duplicate = this.gotras.find(
        (g) => g.id !== id && g.name.toLowerCase() === normName.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Another Gotra with name "${normName}" already exists!`);
      }
    }

    const now = new Date().toISOString().split('T')[0];
    this.gotras[idx] = {
      ...this.gotras[idx],
      ...updates,
      updatedAt: now,
    };
    this.logAudit('GOTRA', id, 'UPDATE', `Updated Gotra "${this.gotras[idx].name}"`);
    this.saveToStorage();
  }

  public deleteGotra(id: string): { success: boolean; error?: string } {
    const got = this.gotras.find((g) => g.id === id);
    if (!got) return { success: false, error: 'Gotra not found' };

    // Reference check
    const referencingSurnames = this.surnames.filter((s) => s.mappedGotraIds?.includes(id));
    if (referencingSurnames.length > 0) {
      return {
        success: false,
        error: `Cannot delete Gotra "${got.name}": Linked to ${referencingSurnames.length} surnames. Deactivate instead.`,
      };
    }

    this.gotras = this.gotras.filter((g) => g.id !== id);
    this.logAudit('GOTRA', id, 'DELETE', `Deleted Gotra "${got.name}"`);
    this.saveToStorage();
    return { success: true };
  }

  // -------------------------------------------------------------------------
  // SURNAMES CRUD & LOOKUP
  // -------------------------------------------------------------------------
  public addSurname(surname: Omit<SurnameMaster, 'id' | 'createdAt' | 'updatedAt'>): SurnameMaster {
    const norm = surname.canonicalSurname.trim();
    const existing = this.surnames.find(
      (s) => s.canonicalSurname.toLowerCase() === norm.toLowerCase()
    );
    if (existing) {
      throw new Error(`Surname "${norm}" is already registered in the master list!`);
    }

    const now = new Date().toISOString().split('T')[0];
    const newSur: SurnameMaster = {
      id: `sur_${Date.now()}`,
      ...surname,
      canonicalSurname: norm,
      createdAt: now,
      updatedAt: now,
    };
    this.surnames.push(newSur);
    this.logAudit('SURNAME', newSur.id, 'CREATE', `Added surname "${norm}"`);
    this.saveToStorage();
    return newSur;
  }

  public updateSurname(id: string, updates: Partial<SurnameMaster>): void {
    const idx = this.surnames.findIndex((s) => s.id === id);
    if (idx === -1) return;

    if (updates.canonicalSurname) {
      const norm = updates.canonicalSurname.trim();
      const duplicate = this.surnames.find(
        (s) => s.id !== id && s.canonicalSurname.toLowerCase() === norm.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Another surname with name "${norm}" already exists!`);
      }
    }

    const now = new Date().toISOString().split('T')[0];
    this.surnames[idx] = {
      ...this.surnames[idx],
      ...updates,
      updatedAt: now,
    };
    this.logAudit('SURNAME', id, 'UPDATE', `Updated surname "${this.surnames[idx].canonicalSurname}"`);
    this.saveToStorage();
  }

  public deleteSurname(id: string): { success: boolean; error?: string } {
    const sur = this.surnames.find((s) => s.id === id);
    if (!sur) return { success: false, error: 'Surname not found' };

    this.surnames = this.surnames.filter((s) => s.id !== id);
    this.logAudit('SURNAME', id, 'DELETE', `Deleted surname "${sur.canonicalSurname}"`);
    this.saveToStorage();
    return { success: true };
  }

  /**
   * Looks up a surname across canonical names and alternate spelling aliases.
   * Auto-suggests subcastes and gotras without forcing a 100% rigid inference.
   */
  public lookupSurname(inputSurname: string): {
    match?: SurnameMaster;
    suggestedSubcastes: string[];
    suggestedGotras: string[];
    isAmbiguous: boolean;
  } {
    if (!inputSurname || !inputSurname.trim()) {
      return { suggestedSubcastes: [], suggestedGotras: [], isAmbiguous: false };
    }

    const clean = inputSurname.trim().toLowerCase();
    const match = this.surnames.find(
      (s) =>
        s.canonicalSurname.toLowerCase() === clean ||
        s.alternateSpellings.some((alt) => alt.toLowerCase() === clean)
    );

    if (!match) {
      // Fallback: check subcastes raw surname lists
      const matchingSub = this.subcastes.filter((sub) =>
        sub.surnames.some((sn) => sn.toLowerCase() === clean)
      );
      return {
        suggestedSubcastes: matchingSub.map((s) => s.name),
        suggestedGotras: [],
        isAmbiguous: matchingSub.length > 1,
      };
    }

    return {
      match,
      suggestedSubcastes: match.mappedSubcasteNames || [],
      suggestedGotras: match.mappedGotraNames || [],
      isAmbiguous: match.isAmbiguous,
    };
  }

  // -------------------------------------------------------------------------
  // COMPATIBILITY RULES MANAGEMENT & EVALUATION
  // -------------------------------------------------------------------------
  public updateRules(updates: Partial<GotraRulesConfig>): GotraRulesConfig {
    if (updates.strictSameGotraRule !== undefined) {
      const r = this.rules.find((x) => x.code === 'SAME_GOTRA_EXOGAMY');
      if (r) r.enabled = updates.strictSameGotraRule;
    }
    if (updates.subcastePriorityMatching !== undefined) {
      const r = this.rules.find((x) => x.code === 'SUBCASTE_PREFERENCE');
      if (r) r.enabled = updates.subcastePriorityMatching;
    }
    if (updates.maternalGotraCheck !== undefined) {
      const r = this.rules.find((x) => x.code === 'MATERNAL_GOTRA_EXOGAMY');
      if (r) r.enabled = updates.maternalGotraCheck;
    }

    this.logAudit('RULE', 'rules_config', 'UPDATE', 'Updated global gotra matching rules configuration');
    this.saveToStorage();
    return this.getRules();
  }

  public updateCompatibilityRule(id: string, updates: Partial<GotraCompatibilityRule>): void {
    const idx = this.rules.findIndex((r) => r.id === id);
    if (idx === -1) return;

    this.rules[idx] = { ...this.rules[idx], ...updates };
    this.logAudit('RULE', id, 'UPDATE', `Updated rule "${this.rules[idx].name}"`);
    this.saveToStorage();
  }

  public addCompatibilityRule(rule: Omit<GotraCompatibilityRule, 'id'>): GotraCompatibilityRule {
    const newRule: GotraCompatibilityRule = {
      id: `rule_${Date.now()}`,
      ...rule,
    };
    this.rules.push(newRule);
    this.logAudit('RULE', newRule.id, 'CREATE', `Added compatibility rule "${newRule.name}"`);
    this.saveToStorage();
    return newRule;
  }

  public deleteCompatibilityRule(id: string): void {
    const r = this.rules.find((x) => x.id === id);
    if (!r) return;
    this.rules = this.rules.filter((x) => x.id !== id);
    this.logAudit('RULE', id, 'DELETE', `Deleted rule "${r.name}"`);
    this.saveToStorage();
  }

  /**
   * Evaluates matrimonial compatibility between client and candidate using
   * the active database-driven rules and community-specific policies.
   */
  public checkMatchCompatibility(
    client: { subcaste?: string; gotra?: string; communityId?: string; community?: string },
    candidate: { subcaste?: string; gotra?: string; communityId?: string; community?: string }
  ): {
    isCompatible: boolean;
    scoreModifier: number;
    reasons: string[];
    blockedRule?: GotraCompatibilityRule;
  } {
    const reasons: string[] = [];
    let scoreModifier = 0;
    let isCompatible = true;
    let blockedRule: GotraCompatibilityRule | undefined;

    const clientGotra = (client.gotra || '').trim().toLowerCase();
    const candidateGotra = (candidate.gotra || '').trim().toLowerCase();

    // 1. Same-Gotra Exogamy Rule
    const sagotraRule = this.rules.find((r) => r.code === 'SAME_GOTRA_EXOGAMY');
    if (sagotraRule && sagotraRule.enabled) {
      if (clientGotra && candidateGotra && clientGotra !== 'not specified' && clientGotra !== 'n/a') {
        if (clientGotra === candidateGotra) {
          // Check if either community is exempt from Gotra exogamy
          const isExempt =
            (sagotraRule.exemptCommunities || []).includes(client.communityId || '') ||
            (sagotraRule.exemptCommunities || []).includes(candidate.communityId || '');

          if (!isExempt) {
            if (sagotraRule.severity === 'BLOCKING') {
              isCompatible = false;
              blockedRule = sagotraRule;
              reasons.push(sagotraRule.explanationMessage);
            } else {
              scoreModifier -= 25;
              reasons.push(`Caution: Both profiles share the ${client.gotra} Gotra.`);
            }
          } else {
            reasons.push(`Gotra overlap (${client.gotra}) permitted under community exemption.`);
          }
        } else {
          scoreModifier += 10;
          reasons.push(`Gotra non-conflict verified (${client.gotra} vs ${candidate.gotra}).`);
        }
      }
    }

    // 2. Subcaste Priority Rule
    const subcasteRule = this.rules.find((r) => r.code === 'SUBCASTE_PREFERENCE');
    if (subcasteRule && subcasteRule.enabled) {
      const clientSub = (client.subcaste || '').trim().toLowerCase();
      const candidateSub = (candidate.subcaste || '').trim().toLowerCase();
      if (clientSub && candidateSub && clientSub === candidateSub) {
        scoreModifier += 10;
        reasons.push(`Same Subcaste match (${client.subcaste}).`);
      } else if (clientSub && candidateSub) {
        scoreModifier += 5;
        reasons.push(`Inter-subcaste compatible (${client.subcaste} & ${candidate.subcaste}).`);
      }
    }

    return { isCompatible, scoreModifier, reasons, blockedRule };
  }

  // -------------------------------------------------------------------------
  // VERIFICATION WORKFLOW (VERIFY / DISPUTE / AUDIT)
  // -------------------------------------------------------------------------
  public verifyRecord(
    entityType: MasterEntityType,
    id: string,
    status: VerificationStatus,
    adminNotes?: string,
    performedBy = 'Super Admin'
  ): void {
    if (entityType === 'COMMUNITY') {
      const item = this.communities.find((c) => c.id === id);
      if (item) {
        item.verificationStatus = status;
        if (adminNotes) item.adminNotes = adminNotes;
        item.updatedAt = new Date().toISOString().split('T')[0];
      }
    } else if (entityType === 'SUBCASTE') {
      const item = this.subcastes.find((s) => s.id === id);
      if (item) {
        item.verificationStatus = status;
        if (adminNotes) item.adminNotes = adminNotes;
        item.updatedAt = new Date().toISOString().split('T')[0];
      }
    } else if (entityType === 'GOTRA') {
      const item = this.gotras.find((g) => g.id === id);
      if (item) {
        item.verificationStatus = status;
        if (adminNotes) item.adminNotes = adminNotes;
        item.updatedAt = new Date().toISOString().split('T')[0];
      }
    } else if (entityType === 'SURNAME') {
      const item = this.surnames.find((s) => s.id === id);
      if (item) {
        item.verificationStatus = status;
        if (adminNotes) item.notes = adminNotes;
        item.updatedAt = new Date().toISOString().split('T')[0];
      }
    }

    this.logAudit(entityType, id, 'VERIFY', `Marked ${entityType} record as ${status}. ${adminNotes || ''}`, performedBy);
    this.saveToStorage();
  }

  // -------------------------------------------------------------------------
  // CSV / EXCEL IMPORT & EXPORT
  // -------------------------------------------------------------------------
  public exportToCSV(entityType: MasterEntityType): string {
    if (entityType === 'SUBCASTE') {
      const headers = ['ID', 'Name', 'Community', 'Region', 'Surnames', 'PriorityWeight', 'VerificationStatus', 'Active'];
      const rows = this.subcastes.map((s) => [
        s.id,
        `"${s.name}"`,
        `"${s.communityName || ''}"`,
        `"${s.region}"`,
        `"${s.surnames.join('; ')}"`,
        s.priorityWeight,
        s.verificationStatus,
        s.active ? 'YES' : 'NO',
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (entityType === 'GOTRA') {
      const headers = ['ID', 'Name', 'Lineage', 'AlternateSpellings', 'ExogamyProhibited', 'Confidence', 'VerificationStatus', 'Active'];
      const rows = this.gotras.map((g) => [
        g.id,
        `"${g.name}"`,
        `"${g.lineage}"`,
        `"${g.alternateSpellings.join('; ')}"`,
        g.prohibitedSameGotra ? 'YES' : 'NO',
        g.confidence,
        g.verificationStatus,
        g.active ? 'YES' : 'NO',
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (entityType === 'SURNAME') {
      const headers = ['ID', 'Surname', 'AlternateSpellings', 'MappedSubcastes', 'MappedGotras', 'Ambiguous', 'Confidence', 'VerificationStatus', 'Active'];
      const rows = this.surnames.map((s) => [
        s.id,
        `"${s.canonicalSurname}"`,
        `"${s.alternateSpellings.join('; ')}"`,
        `"${s.mappedSubcasteNames.join('; ')}"`,
        `"${(s.mappedGotraNames || []).join('; ')}"`,
        s.isAmbiguous ? 'YES' : 'NO',
        s.confidence,
        s.verificationStatus,
        s.active ? 'YES' : 'NO',
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    // Default Communities
    const headers = ['ID', 'Name', 'Category', 'Aliases', 'Region', 'HasGotraSystem', 'VerificationStatus', 'Active'];
    const rows = this.communities.map((c) => [
      c.id,
      `"${c.name}"`,
      c.category,
      `"${c.aliases.join('; ')}"`,
      `"${c.historicalRegion}"`,
      c.hasGotraSystem ? 'YES' : 'NO',
      c.verificationStatus,
      c.active ? 'YES' : 'NO',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Imports records from CSV with validation, duplicate detection, and summary report.
   */
  public importFromCSV(
    csvText: string,
    entityType: MasterEntityType
  ): {
    totalRows: number;
    inserted: number;
    updated: number;
    skipped: number;
    errors: string[];
  } {
    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) {
      return { totalRows: 0, inserted: 0, updated: 0, skipped: 0, errors: ['CSV file is empty or missing data rows.'] };
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Simple CSV cell extractor that handles quotes
      const cells = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());

      try {
        if (entityType === 'SUBCASTE') {
          const name = cells[1] || cells[0];
          if (!name) {
            skipped++;
            continue;
          }
          const existing = this.subcastes.find((s) => s.name.toLowerCase() === name.toLowerCase());
          const region = cells[3] || cells[2] || 'Sindh';
          const surnames = (cells[4] || cells[3] || '').split(';').map((s) => s.trim()).filter(Boolean);

          if (existing) {
            existing.region = region;
            if (surnames.length > 0) {
              const combined = Array.from(new Set([...existing.surnames, ...surnames]));
              existing.surnames = combined;
            }
            updated++;
          } else {
            this.addSubcaste({
              name,
              aliases: [],
              region,
              description: `Imported via admin CSV upload`,
              surnames,
              priorityWeight: 10,
              verificationStatus: 'NEEDS_REVIEW',
              sourceReference: 'CSV Bulk Import',
              active: true,
            });
            inserted++;
          }
        } else if (entityType === 'GOTRA') {
          const name = cells[1] || cells[0];
          if (!name) {
            skipped++;
            continue;
          }
          const existing = this.gotras.find((g) => g.name.toLowerCase() === name.toLowerCase());
          const lineage = cells[2] || 'Rishi Lineage';
          const alts = (cells[3] || '').split(';').map((s) => s.trim()).filter(Boolean);

          if (existing) {
            existing.lineage = lineage;
            if (alts.length > 0) {
              existing.alternateSpellings = Array.from(new Set([...existing.alternateSpellings, ...alts]));
            }
            updated++;
          } else {
            this.addGotra({
              name,
              lineage,
              description: 'Imported Vedic Gotra record',
              alternateSpellings: alts,
              prohibitedSameGotra: true,
              confidence: 'MEDIUM',
              verificationStatus: 'NEEDS_REVIEW',
              sourceReference: 'CSV Bulk Import',
              active: true,
            });
            inserted++;
          }
        } else if (entityType === 'SURNAME') {
          const name = cells[1] || cells[0];
          if (!name) {
            skipped++;
            continue;
          }
          const existing = this.surnames.find((s) => s.canonicalSurname.toLowerCase() === name.toLowerCase());
          const alts = (cells[2] || '').split(';').map((s) => s.trim()).filter(Boolean);
          const subNames = (cells[3] || '').split(';').map((s) => s.trim()).filter(Boolean);

          if (existing) {
            if (alts.length > 0) {
              existing.alternateSpellings = Array.from(new Set([...existing.alternateSpellings, ...alts]));
            }
            updated++;
          } else {
            this.addSurname({
              canonicalSurname: name,
              alternateSpellings: alts,
              mappedSubcasteIds: [],
              mappedSubcasteNames: subNames,
              isAmbiguous: subNames.length > 1,
              confidence: 'MEDIUM',
              verificationStatus: 'NEEDS_REVIEW',
              sourceReference: 'CSV Bulk Import',
              active: true,
            });
            inserted++;
          }
        }
      } catch (err: any) {
        errors.push(`Row ${i + 1}: ${err?.message || 'Processing failed'}`);
        skipped++;
      }
    }

    this.logAudit(entityType, 'bulk_csv', 'IMPORT', `Imported CSV: ${inserted} added, ${updated} updated, ${skipped} skipped.`);
    this.saveToStorage();

    return {
      totalRows: lines.length - 1,
      inserted,
      updated,
      skipped,
      errors,
    };
  }

  // -------------------------------------------------------------------------
  // RESET TO DEFAULT MASTER DATA
  // -------------------------------------------------------------------------
  public resetToDefaults(): void {
    this.communities = [...INITIAL_COMMUNITIES];
    this.subcastes = [...INITIAL_SUBCASTES];
    this.gotras = [...INITIAL_GOTRAS];
    this.surnames = [...INITIAL_SURNAMES];
    this.rules = [...INITIAL_RULES];
    this.logAudit('COMMUNITY', 'all', 'RESET', 'Restored master databases to authentic verified Sindhi defaults');
    this.saveToStorage();
  }
}

export const subcasteGotraService = new SubcasteGotraService();
