import { storage } from '../storage';

export type MemberPlan = 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'TILL_MARRIAGE';
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'EXPIRED';

export interface MatrimonialMember {
  id: string; // e.g. "101408"
  uniqueId: string; // e.g. "E10265P1598"
  fullName: string;
  mobile: string;
  email?: string;
  password?: string;
  gender: 'Male' | 'Female';
  age: number;
  dateOfBirth?: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce' | 'Annulled';
  profileCreatedBy?: string;
  motherTongue?: string;
  religion?: string;
  community?: string;
  subcaste: string; // e.g. "Amil", "Baibhand", "Sahiti", etc.
  city: string;
  state?: string;
  country?: string;
  address?: string;

  // Family Info
  fatherName?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherOccupation?: string;
  familyType?: 'Nuclear' | 'Joint';
  membersLiveWith?: string;
  aboutBrother?: string;
  aboutSister?: string;
  aboutFamily?: string;

  // Lifestyle
  height?: string;
  weight?: string;
  bodyType?: string;
  complexion?: string;
  bloodGroup?: string;
  diet?: 'Vegetarian' | 'Non-Vegetarian' | 'Eggetarian' | 'Jain' | 'Vegan';
  smokingHabit?: string;
  alcoholConsumption?: string;

  // Education & Work
  educationArea?: string;
  education?: string;
  workingWith?: string;
  workingAs?: string;
  profession?: string;
  employedIn?: string;
  annualIncome?: string;

  // Astrological Info
  birthPlace?: string;
  birthTime?: string;
  gotra?: string;
  manglik?: 'Non-Manglik' | 'Manglik' | 'Anshik Manglik' | "Don't Know";
  sunSign?: string;
  rashi?: string;
  nakshatram?: string;
  nakshatra?: string;

  // Extended Profile & Address Details
  disabilities?: string;
  alternateMobile?: string;
  landline?: string;
  pincode?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentCountry?: string;
  permanentPincode?: string;
  extraEducation?: string;
  familyValue?: string;
  house?: string;

  // Images & Bio
  profilePhoto?: string;
  galleryPhotos?: string[];
  photoPrivacy?: string;
  aboutCandidate?: string;
  aboutMe?: string;
  desiredProfile?: string;
  hobbies?: string;

  // Verifications & CRM Admin Notes
  verifyEmail?: string;
  verifyMobile?: string;
  verifyAadhaar?: string;
  adminComment?: string;

  // Plan & Admin
  plan: MemberPlan;
  status: MemberStatus;
  isVerified: boolean;
  assignedMatchmaker?: string;
  created: string; // e.g. "07 Oct 2026"
  createdAtTimestamp: number;
  allottedMembersCount?: number;
  notes?: string;
}

export interface AllottedMemberRecord {
  allottedId: string;
  candidateName: string;
  candidateId: string;
  gender: 'Male' | 'Female';
  age: number;
  city: string;
  subcaste: string;
  matchScore: number;
  status: 'PENDING_REVIEW' | 'SHARED_WITH_CLIENT' | 'ACCEPTED' | 'DECLINED' | 'MEETING_FIXED';
  allottedDate: string;
}

const STORAGE_MEMBERS_KEY = 'sindhi_admin_matrimonial_members_v2';

// Initial seed members containing exact records from the user's screenshot
export const SEED_MATRIMONIAL_MEMBERS: MatrimonialMember[] = [
  {
    id: '101037',
    uniqueId: 'S1133',
    fullName: 'RADHIKA CHOPRA',
    mobile: '8076768013',
    alternateMobile: '—',
    landline: '—',
    email: 'radhika.chopra96@gmail.com',
    password: 'RADHIKA07566',
    gender: 'Female',
    age: 30,
    dateOfBirth: '23/07/1996',
    birthTime: '02:20 PM',
    birthPlace: 'NEW DELHI',
    maritalStatus: 'Never Married',
    motherTongue: 'Hindi',
    religion: 'Hindu',
    community: 'Punjabi',
    subcaste: 'Chopra',
    gotra: 'NOT MENTION',
    manglik: 'Non-Manglik',
    sunSign: 'Not Available',
    nakshatram: 'Select nakshatram',
    diet: 'Vegetarian',
    bloodGroup: 'B+',
    height: '5-5',
    weight: '54 kg',
    bodyType: 'Slim',
    complexion: 'Fair',
    smokingHabit: 'No',
    alcoholConsumption: 'No',
    education: 'GRADUATE, NTT & NPTT',
    educationArea: 'GRADUATE',
    extraEducation: '—',
    workingWith: 'WORKING - SALARY - 25,000/- PM',
    workingAs: 'Others',
    employedIn: 'Corporate',
    annualIncome: '₹3 - 4 Lakh',
    disabilities: 'No',
    fatherName: 'RAKESH CHOPRA',
    fatherOccupation: 'BUSINESSMAN',
    motherName: 'NEETU CHOPRA',
    motherOccupation: 'HOME MAKER',
    familyType: 'Nuclear',
    familyValue: 'MIDDLE CLASS',
    house: 'Owned',
    membersLiveWith: '3',
    aboutBrother: '1 YOUNGER BROTHER',
    aboutSister: '—',
    aboutFamily: 'MODERATE',
    aboutCandidate: 'Dedicated, cultured, and family-oriented person with positive outlook towards life. Values honest communication, progressive thoughts, and mutual respect.',
    desiredProfile: 'PREFERENCE - 1. AGE - 29 2. CASTE - HINDU 3. LOCATION - SOUTH DELHI 4. MARRIED/UNMARRIED - UNMARRIED',
    address: 'LAJPAT NAGAR, DELHI',
    city: 'DELHI',
    state: 'Delhi',
    country: 'INDIA',
    pincode: '110024',
    permanentAddress: 'LAJPAT NAGAR, DELHI',
    permanentCity: 'DELHI',
    permanentState: 'Delhi',
    permanentCountry: 'INDIA',
    permanentPincode: '110024',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    galleryPhotos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80'
    ],
    plan: 'FREE',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '11 Oct 2026',
    createdAtTimestamp: 1791717858602,
    allottedMembersCount: 4,
  },
  {
    id: '101408',
    uniqueId: 'E10265P1598',
    fullName: 'MANISH KUMAR',
    mobile: '9818022636',
    email: 'manish.kumar@gmail.com',
    gender: 'Male',
    age: 44,
    dateOfBirth: '1982-03-15',
    maritalStatus: 'Divorced',
    city: 'DELHI',
    state: 'Delhi',
    country: 'India',
    subcaste: 'Amil',
    gotra: 'Kashyap',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'MBA in Marketing',
    employedIn: 'Business / Entrepreneur',
    profession: 'Senior Business Director',
    annualIncome: '₹35 - 40 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '07 Oct 2026',
    createdAtTimestamp: 1791331200000,
    allottedMembersCount: 6,
  },
  {
    id: '101385',
    uniqueId: 'A8051P1596',
    fullName: 'RASHMI TEKCHANDANI',
    mobile: '7043003073',
    email: 'rashmi.tekchandani@yahoo.com',
    gender: 'Female',
    age: 28,
    dateOfBirth: '1998-07-22',
    maritalStatus: 'Never Married',
    city: 'Ahmadabad City',
    state: 'Gujarat',
    country: 'India',
    subcaste: 'Baibhand',
    gotra: 'Shandilya',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'CA (Chartered Accountant)',
    employedIn: 'Private Company',
    profession: 'Senior Tax Consultant at EY',
    annualIncome: '₹22 - 25 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '02 Oct 2026',
    createdAtTimestamp: 1790900000000,
    allottedMembersCount: 5,
  },
  {
    id: '101372',
    uniqueId: 'A8041P1599',
    fullName: 'JITENDRA SINGH SOLANKI',
    mobile: '8432817571',
    email: 'jitendra.solanki@gmail.com',
    gender: 'Male',
    age: 29,
    dateOfBirth: '1997-04-18',
    maritalStatus: 'Never Married',
    city: 'Tonk',
    state: 'Rajasthan',
    country: 'India',
    subcaste: 'Sahiti',
    gotra: 'Vatsa',
    religion: 'Sindhi Hindu',
    manglik: 'Anshik Manglik',
    education: 'B.Tech in Civil Engineering',
    employedIn: 'Government / PSU',
    profession: 'Assistant Engineer',
    annualIncome: '₹14 - 16 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Amit Bajaj',
    created: '28 Sep 2026',
    createdAtTimestamp: 1790550000000,
    allottedMembersCount: 4,
  },
  {
    id: '101356',
    uniqueId: 'A8028P1593',
    fullName: 'SHUBHAM KUMAWAT',
    mobile: '8770046370',
    email: 'shubham.kumawat@outlook.com',
    gender: 'Male',
    age: 28,
    dateOfBirth: '1998-11-09',
    maritalStatus: 'Never Married',
    city: 'Indore',
    state: 'Madhya Pradesh',
    country: 'India',
    subcaste: 'Larkana',
    gotra: 'Bharadwaj',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'B.Tech + MBA',
    employedIn: 'Private Company',
    profession: 'Product Operations Manager',
    annualIncome: '₹20 - 24 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '24 Sep 2026',
    createdAtTimestamp: 1790200000000,
    allottedMembersCount: 7,
  },
  {
    id: '101355',
    uniqueId: 'A8026A',
    fullName: 'CHETAN SANGTANI',
    mobile: '7828018785',
    email: 'chetan.sangtani@gmail.com',
    gender: 'Male',
    age: 40,
    dateOfBirth: '1986-06-11',
    maritalStatus: 'Never Married',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    country: 'India',
    subcaste: 'Amil',
    gotra: 'Kashyap',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'M.Com + Business Management',
    employedIn: 'Business / Entrepreneur',
    profession: 'Textile Wholesale Owner',
    annualIncome: '₹30 - 35 Lakhs',
    plan: 'SILVER',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Rajesh Khatri',
    created: '24 Sep 2026',
    createdAtTimestamp: 1790200000000,
    allottedMembersCount: 3,
  },
  {
    id: '101350',
    uniqueId: 'A8023BP1594',
    fullName: 'MANSHA MORDHANI',
    mobile: '7891463816',
    email: 'mansha.mordhani@hotmail.com',
    gender: 'Female',
    age: 26,
    dateOfBirth: '2000-01-19',
    maritalStatus: 'Never Married',
    city: 'Ajmer',
    state: 'Rajasthan',
    country: 'India',
    subcaste: 'Shikarpuri',
    gotra: 'Shandilya',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'M.Sc in Interior Design',
    employedIn: 'Self Employed',
    profession: 'Lead Architecture Consultant',
    annualIncome: '₹15 - 18 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '23 Sep 2026',
    createdAtTimestamp: 1790110000000,
    allottedMembersCount: 5,
  },
  {
    id: '101347',
    uniqueId: 'A8021P1597',
    fullName: 'ANKUSH',
    mobile: '7067494479',
    email: 'ankush.matrimony@gmail.com',
    gender: 'Male',
    age: 45,
    dateOfBirth: '1981-08-30',
    maritalStatus: 'Divorced',
    city: 'Raipur',
    state: 'Chhattisgarh',
    country: 'India',
    subcaste: 'Dadu',
    gotra: 'Kashyap',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'B.Com',
    employedIn: 'Business / Entrepreneur',
    profession: 'Automobile Dealership Owner',
    annualIncome: '₹40 - 50 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Amit Bajaj',
    created: '23 Sep 2026',
    createdAtTimestamp: 1790110000000,
    allottedMembersCount: 4,
  },
  {
    id: '101341',
    uniqueId: 'A8015P1592',
    fullName: 'MOHAMMAD SAIFULLAH',
    mobile: '8718807000',
    email: 'saifullah.mohd@gmail.com',
    gender: 'Male',
    age: 29,
    dateOfBirth: '1997-02-14',
    maritalStatus: 'Never Married',
    city: 'Raipur',
    state: 'Chhattisgarh',
    country: 'India',
    subcaste: 'Amil',
    gotra: 'General',
    religion: 'Sindhi',
    manglik: 'Non-Manglik',
    education: 'B.Tech in Computer Science',
    employedIn: 'Private Company',
    profession: 'Full Stack Tech Lead',
    annualIncome: '₹26 - 30 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '22 Sep 2026',
    createdAtTimestamp: 1790020000000,
    allottedMembersCount: 6,
  },
  {
    id: '101315',
    uniqueId: 'A7989P1588',
    fullName: 'KHUSHBOO SHARMA',
    mobile: '8560840868',
    email: 'khushboo.sharma@yahoo.com',
    gender: 'Female',
    age: 29,
    dateOfBirth: '1997-05-10',
    maritalStatus: 'Never Married',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    subcaste: 'Baibhand',
    gotra: 'Gautam',
    religion: 'Sindhi Hindu',
    manglik: 'Manglik',
    education: 'MBBS Doctor',
    employedIn: 'Private Company',
    profession: 'Resident Medical Officer',
    annualIncome: '₹24 - 28 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '17 Sep 2026',
    createdAtTimestamp: 1789590000000,
    allottedMembersCount: 8,
  },
  {
    id: '101311',
    uniqueId: 'A7990P1589',
    fullName: 'MANNY KAMRA',
    mobile: '7230839244',
    email: 'manny.kamra@gmail.com',
    gender: 'Female',
    age: 26,
    dateOfBirth: '2000-09-03',
    maritalStatus: 'Never Married',
    city: 'SRI GANGANAGAR',
    state: 'Rajasthan',
    country: 'India',
    subcaste: 'Sahiti',
    gotra: 'Vatsa',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'B.Des in Fashion Communication',
    employedIn: 'Self Employed',
    profession: 'Brand Creative Lead',
    annualIncome: '₹16 - 19 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Rajesh Khatri',
    created: '17 Sep 2026',
    createdAtTimestamp: 1789590000000,
    allottedMembersCount: 4,
  },
  {
    id: '101300',
    uniqueId: 'E10251P1587',
    fullName: 'ABHISHEK JAIMAN',
    mobile: '7014525054',
    email: 'abhishek.jaiman@gmail.com',
    gender: 'Male',
    age: 30,
    dateOfBirth: '1996-12-01',
    maritalStatus: 'Never Married',
    city: 'Jhunjhunun',
    state: 'Rajasthan',
    country: 'India',
    subcaste: 'Amil',
    gotra: 'Bharadwaj',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'B.Tech (NIT Jaipur)',
    employedIn: 'Private Company',
    profession: 'DevOps Cloud Architect',
    annualIncome: '₹28 - 32 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Amit Bajaj',
    created: '13 Sep 2026',
    createdAtTimestamp: 1789240000000,
    allottedMembersCount: 5,
  },
  {
    id: '101298',
    uniqueId: 'E10250P1585',
    fullName: 'YOGESH JANGID',
    mobile: '9468841071',
    email: 'yogesh.jangid@outlook.com',
    gender: 'Male',
    age: 26,
    dateOfBirth: '2000-04-14',
    maritalStatus: 'Never Married',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    subcaste: 'Baibhand',
    gotra: 'Kashyap',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'BCA + MCA',
    employedIn: 'Private Company',
    profession: 'Data Analyst at Genpact',
    annualIncome: '₹12 - 15 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '13 Sep 2026',
    createdAtTimestamp: 1789240000000,
    allottedMembersCount: 4,
  },
  {
    id: '101294',
    uniqueId: 'A7977P1584',
    fullName: 'MAYUR JASUJA',
    mobile: '8668761657',
    email: 'mayur.jasuja@gmail.com',
    gender: 'Male',
    age: 25,
    dateOfBirth: '2001-08-25',
    maritalStatus: 'Never Married',
    city: 'Akola',
    state: 'Maharashtra',
    country: 'India',
    subcaste: 'Sehwani',
    gotra: 'Shandilya',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'B.Pharm + MBA Pharma',
    employedIn: 'Business / Entrepreneur',
    profession: 'Pharmaceutical Distributor',
    annualIncome: '₹25 - 30 Lakhs',
    plan: 'PLATINUM',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '11 Sep 2026',
    createdAtTimestamp: 1789070000000,
    allottedMembersCount: 6,
  },

  // Free Tier Active Profiles
  {
    id: '101280',
    uniqueId: 'SIND001',
    fullName: 'ROSHNI MOTWANI',
    mobile: '9820112233',
    email: 'roshni.motwani@gmail.com',
    gender: 'Female',
    age: 26,
    dateOfBirth: '2000-05-14',
    maritalStatus: 'Never Married',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    subcaste: 'Amil',
    gotra: 'Shandilya',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'MBA in Finance (NMIMS)',
    employedIn: 'Private Company',
    profession: 'Investment Banker',
    annualIncome: '₹22 - 25 Lakhs',
    plan: 'GOLD',
    status: 'ACTIVE',
    isVerified: true,
    assignedMatchmaker: 'Priya Sharma',
    created: '12 Jan 2026',
    createdAtTimestamp: 1768262400000,
    allottedMembersCount: 5,
  },
  {
    id: '101275',
    uniqueId: 'SIND004',
    fullName: 'VARUN HATHIRAMANI',
    mobile: '9715012345',
    email: 'varun.hathi@gmail.com',
    gender: 'Male',
    age: 31,
    dateOfBirth: '1995-10-10',
    maritalStatus: 'Never Married',
    city: 'Dubai (UAE)',
    country: 'United Arab Emirates',
    subcaste: 'Larkana',
    gotra: 'Kashyap',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'Master in Supply Chain',
    employedIn: 'Private Company',
    profession: 'Logistics Manager',
    annualIncome: '₹45 - 50 Lakhs',
    plan: 'FREE',
    status: 'ACTIVE',
    isVerified: true,
    created: '20 Jan 2026',
    createdAtTimestamp: 1768953600000,
    allottedMembersCount: 0,
  },

  // Inactive / Suspended / Expired Members
  {
    id: '101250',
    uniqueId: 'INA1001',
    fullName: 'SUNIL VAZIRANI',
    mobile: '9820543210',
    email: 'sunil.vazirani@yahoo.com',
    gender: 'Male',
    age: 35,
    dateOfBirth: '1991-03-12',
    maritalStatus: 'Never Married',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    subcaste: 'Baibhand',
    gotra: 'Bharadwaj',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'B.Com',
    employedIn: 'Business / Entrepreneur',
    profession: 'Retail Store Owner',
    annualIncome: '₹12 - 15 Lakhs',
    plan: 'SILVER',
    status: 'INACTIVE',
    isVerified: false,
    created: '15 Aug 2026',
    createdAtTimestamp: 1786838400000,
    notes: 'Member requested temporary pause during family travel',
  },
  {
    id: '101248',
    uniqueId: 'INA1002',
    fullName: 'PRIYA RIJHWANI',
    mobile: '9890123456',
    email: 'priya.rijhwani@gmail.com',
    gender: 'Female',
    age: 27,
    dateOfBirth: '1999-07-04',
    maritalStatus: 'Never Married',
    city: 'Nagpur',
    state: 'Maharashtra',
    country: 'India',
    subcaste: 'Sahiti',
    gotra: 'Vatsa',
    religion: 'Sindhi Hindu',
    manglik: 'Manglik',
    education: 'B.Arch',
    employedIn: 'Self Employed',
    profession: 'Architect',
    annualIncome: '₹15 - 18 Lakhs',
    plan: 'GOLD',
    status: 'EXPIRED',
    isVerified: true,
    created: '10 Jun 2026',
    createdAtTimestamp: 1781136000000,
    notes: 'Subscription period finished. Renewal follow-up scheduled.',
  },
  {
    id: '101242',
    uniqueId: 'INA1003',
    fullName: 'DEEPAK CHAWLA',
    mobile: '9811447788',
    email: 'deepak.chawla@hotmail.com',
    gender: 'Male',
    age: 32,
    dateOfBirth: '1994-11-20',
    maritalStatus: 'Never Married',
    city: 'Delhi',
    state: 'Delhi',
    country: 'India',
    subcaste: 'Amil',
    gotra: 'Kashyap',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'B.Tech',
    employedIn: 'Private Company',
    profession: 'QA Automation Engineer',
    annualIncome: '₹18 - 22 Lakhs',
    plan: 'FREE',
    status: 'SUSPENDED',
    isVerified: false,
    created: '05 May 2026',
    createdAtTimestamp: 1777939200000,
    notes: 'Pending identity document verification. Flagged for review.',
  },
  {
    id: '101239',
    uniqueId: 'INA1004',
    fullName: 'ANJALI TOLANI',
    mobile: '9845012345',
    email: 'anjali.tolani@gmail.com',
    gender: 'Female',
    age: 29,
    dateOfBirth: '1997-02-18',
    maritalStatus: 'Never Married',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    subcaste: 'Shikarpuri',
    gotra: 'Shandilya',
    religion: 'Sindhi Hindu',
    manglik: 'Non-Manglik',
    education: 'MBA in HR',
    employedIn: 'Private Company',
    profession: 'Senior HR Specialist',
    annualIncome: '₹16 - 20 Lakhs',
    plan: 'PLATINUM',
    status: 'INACTIVE',
    isVerified: true,
    created: '18 Apr 2026',
    createdAtTimestamp: 1776470400000,
    notes: 'Match finalized outside portal. Account deactivated upon request.',
  },
  {
    id: '101235',
    uniqueId: 'INA1005',
    fullName: 'VIKAS BATRA',
    mobile: '9723001122',
    email: 'vikas.batra@yahoo.com',
    gender: 'Male',
    age: 34,
    dateOfBirth: '1992-09-08',
    maritalStatus: 'Never Married',
    city: 'Surat',
    state: 'Gujarat',
    country: 'India',
    subcaste: 'Larkana',
    gotra: 'Bharadwaj',
    religion: 'Sindhi Hindu',
    manglik: 'Anshik Manglik',
    education: 'B.Com + LLB',
    employedIn: 'Self Employed',
    profession: 'Corporate Legal Advisor',
    annualIncome: '₹25 - 28 Lakhs',
    plan: 'SILVER',
    status: 'EXPIRED',
    isVerified: true,
    created: '02 Feb 2026',
    createdAtTimestamp: 1770076800000,
    notes: 'Silver 3-month membership expired on 02 May 2026.',
  },
];

class MemberDataService {
  private members: MatrimonialMember[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = storage.getString(STORAGE_MEMBERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const missingSeeds = SEED_MATRIMONIAL_MEMBERS.filter((s) => !existingIds.has(s.id));
          this.members = [...missingSeeds, ...parsed];
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse matrimonial members from storage:', e);
    }
    // Fallback to seed members
    this.members = [...SEED_MATRIMONIAL_MEMBERS];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      storage.set(STORAGE_MEMBERS_KEY, JSON.stringify(this.members));
    } catch (e) {
      console.error('Failed to save members to storage:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error('MemberDataService listener error:', err);
      }
    });
  }

  // --- Read Queries ---
  public getMembers(): MatrimonialMember[] {
    return [...this.members];
  }

  /**
   * Only paid members (membershipPlan !== 'FREE' or plan is SILVER, GOLD, PLATINUM, TILL_MARRIAGE)
   */
  public getPaidMembers(): MatrimonialMember[] {
    return this.members.filter(
      (m) => m.plan !== 'FREE' && m.status === 'ACTIVE'
    );
  }

  /**
   * Inactive / Suspended / Expired members
   */
  public getInactiveMembers(): MatrimonialMember[] {
    return this.members.filter(
      (m) => m.status === 'INACTIVE' || m.status === 'SUSPENDED' || m.status === 'EXPIRED'
    );
  }

  public getMemberById(idOrUniqueId: string): MatrimonialMember | undefined {
    return this.members.find(
      (m) =>
        m.id === idOrUniqueId ||
        m.uniqueId.toLowerCase() === idOrUniqueId.toLowerCase()
    );
  }

  // --- Create / Update / Delete Mutations ---
  public addMember(
    data: Omit<MatrimonialMember, 'id' | 'uniqueId' | 'created' | 'createdAtTimestamp'> & {
      id?: string;
      uniqueId?: string;
    }
  ): MatrimonialMember {
    // Generate next numeric ID
    const maxId = this.members.reduce((max, m) => {
      const num = parseInt(m.id, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 101408);
    const newId = String(maxId + 1);

    // Generate unique alphanumeric ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = data.gender === 'Female' ? 'A8' : 'E10';
    const newUniqueId = data.uniqueId || `${prefix}${randomSuffix}P${newId.slice(-4)}`;

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const createdDateStr = `${day} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    const newMember: MatrimonialMember = {
      ...data,
      id: data.id || newId,
      uniqueId: newUniqueId,
      created: createdDateStr,
      createdAtTimestamp: Date.now(),
      allottedMembersCount: data.allottedMembersCount ?? 0,
      status: data.status || 'ACTIVE',
      plan: data.plan || 'FREE',
      isVerified: data.isVerified ?? false,
    };

    this.members.unshift(newMember);
    this.saveToStorage();
    return newMember;
  }

  public updateMember(id: string, updates: Partial<MatrimonialMember>): MatrimonialMember | null {
    const idx = this.members.findIndex((m) => m.id === id || m.uniqueId === id);
    if (idx === -1) return null;

    this.members[idx] = { ...this.members[idx], ...updates };
    this.saveToStorage();
    return this.members[idx];
  }

  public toggleMemberStatus(id: string): MatrimonialMember | null {
    const member = this.getMemberById(id);
    if (!member) return null;

    const newStatus: MemberStatus = member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return this.updateMember(member.id, { status: newStatus });
  }

  public deleteMember(id: string): boolean {
    const initialLength = this.members.length;
    this.members = this.members.filter((m) => m.id !== id && m.uniqueId !== id);
    if (this.members.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public resetToDefaults(): void {
    this.members = [...SEED_MATRIMONIAL_MEMBERS];
    this.saveToStorage();
  }

  // --- Allotted Members Simulation for a Client ---
  public getAllottedMembers(memberId: string): AllottedMemberRecord[] {
    const client = this.getMemberById(memberId);
    if (!client) return [];

    const targetGender = client.gender === 'Male' ? 'Female' : 'Male';
    const potentialMatches = this.members.filter(
      (m) => m.gender === targetGender && m.id !== client.id
    );

    return potentialMatches.slice(0, 5).map((m, idx) => ({
      allottedId: `ALLOT-${client.id}-${m.id}`,
      candidateName: m.fullName,
      candidateId: m.uniqueId,
      gender: m.gender,
      age: m.age,
      city: m.city,
      subcaste: m.subcaste,
      matchScore: 95 - idx * 4,
      status:
        idx === 0
          ? 'ACCEPTED'
          : idx === 1
          ? 'SHARED_WITH_CLIENT'
          : idx === 2
          ? 'MEETING_FIXED'
          : 'PENDING_REVIEW',
      allottedDate: client.created,
    }));
  }

  // --- CSV / Excel Export Utilities ---
  public exportMembersCSV(membersToExport: MatrimonialMember[], filenamePrefix: string = 'members_export'): void {
    if (typeof window === 'undefined') return;

    const headers = [
      'ID',
      'Unique ID',
      'Name',
      'Mobile',
      'Gender',
      'Age',
      'City',
      'Subcaste',
      'Plan',
      'Status',
      'Created Date',
      'Verified',
      'Annual Income',
    ];

    const rows = membersToExport.map((m) => [
      `"${m.id}"`,
      `"${m.uniqueId}"`,
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"${m.mobile}"`,
      `"${m.gender}"`,
      m.age,
      `"${m.city.replace(/"/g, '""')}"`,
      `"${m.subcaste}"`,
      `"${m.plan}"`,
      `"${m.status}"`,
      `"${m.created}"`,
      m.isVerified ? 'Yes' : 'No',
      `"${(m.annualIncome || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public exportSingleMemberSlip(member: MatrimonialMember): void {
    if (typeof window === 'undefined') return;

    const lines = [
      'SINDHI MATRIMONY — CONFIDENTIAL MEMBER PROFILE DOSSIER',
      `Downloaded: ${new Date().toLocaleString('en-IN')}`,
      '--------------------------------------------------',
      `ID: ${member.id}`,
      `Unique Code: ${member.uniqueId}`,
      `Full Name: ${member.fullName}`,
      `Mobile: ${member.mobile}`,
      `Gender: ${member.gender}`,
      `Age: ${member.age} yrs`,
      `Date of Birth: ${member.dateOfBirth || 'N/A'}`,
      `Marital Status: ${member.maritalStatus || 'Never Married'}`,
      `Location: ${member.city}, ${member.state || ''} ${member.country || 'India'}`,
      `Sindhi Subcaste: ${member.subcaste}`,
      `Gotra: ${member.gotra || 'N/A'}`,
      `Religion: ${member.religion || 'Sindhi Hindu'}`,
      `Manglik: ${member.manglik || 'Non-Manglik'}`,
      `Education: ${member.education || 'N/A'}`,
      `Profession: ${member.profession || 'N/A'} (${member.employedIn || 'N/A'})`,
      `Annual Income: ${member.annualIncome || 'N/A'}`,
      `Membership Plan: ${member.plan}`,
      `Account Status: ${member.status}`,
      `KYC Verified: ${member.isVerified ? 'Verified (Blue Tick)' : 'Pending'}`,
      `Created Date: ${member.created}`,
      `Relationship Manager: ${member.assignedMatchmaker || 'Priya Sharma'}`,
    ];

    const content = '\uFEFF' + lines.join('\r\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Member_${member.uniqueId}_Slip.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const memberDataService = new MemberDataService();
