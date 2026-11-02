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
export const SEED_MATRIMONIAL_MEMBERS: MatrimonialMember[] = [];

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
