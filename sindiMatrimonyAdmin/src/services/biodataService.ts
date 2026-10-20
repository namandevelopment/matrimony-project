import { jsPDF } from 'jspdf';
import type { Role } from '../types/auth.types';
import type { MatrimonialMember } from './memberDataService';
import type {
  BiodataTemplateId,
  BiodataPrivacyMode,
  BiodataConfigSettings,
  BiodataRenderPayload,
  BiodataAuditLogEntry,
  MissingFieldWarning,
} from '../types/biodata.types';
import { crmDataService } from './crmDataService';

const STORAGE_KEY_AUDIT = 'sindhi_biodata_audit_logs';
const STORAGE_KEY_SETTINGS = 'sindhi_biodata_settings';

export const DEFAULT_BIODATA_SETTINGS: BiodataConfigSettings = {
  defaultTemplate: 'TRADITIONAL',
  defaultPrivacyMode: 'BLIND',
  allowReligiousMotif: true,
  defaultMotif: 'GANESH_SHLOK',
  portalBrandingName: 'Sindhi Matrimony Official CRM',
  portalWebsiteUrl: 'https://sindhimarriage.in',
  supportPhone: '+91 98765 43210',
  supportEmail: 'matchmaking@sindhimarriage.in',
  footerText: 'Strictly Confidential — For Family Matrimonial Review Only. Unauthorized reproduction is prohibited.',
  watermarkEnabled: false,
};

export class BiodataService {
  private settings: BiodataConfigSettings;
  private inMemoryAuditLogs: BiodataAuditLogEntry[] = [];

  constructor() {
    this.settings = this.loadSettings();
  }

  public getSettings(): BiodataConfigSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<BiodataConfigSettings>): BiodataConfigSettings {
    this.settings = { ...this.settings, ...newSettings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
      } catch (err) {
        console.warn('Failed to save biodata settings:', err);
      }
    }
    return { ...this.settings };
  }

  private loadSettings(): BiodataConfigSettings {
    if (typeof window === 'undefined') return DEFAULT_BIODATA_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return { ...DEFAULT_BIODATA_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (err) {
      console.warn('Failed to parse biodata settings:', err);
    }
    return DEFAULT_BIODATA_SETTINGS;
  }

  /**
   * Evaluates if employee role has clearance to export Full Biodata with unmasked contact info.
   */
  public canGenerateFullBiodata(role?: Role): boolean {
    if (!role) return false;
    const authorizedRoles: Role[] = ['SUPER_ADMIN', 'ADMIN', 'CRM_MANAGER'];
    return authorizedRoles.includes(role);
  }

  /**
   * Calculates profile completeness and flags missing optional fields.
   */
  public calculateCompleteness(member: MatrimonialMember): {
    score: number;
    warnings: MissingFieldWarning[];
  } {
    const warnings: MissingFieldWarning[] = [];
    let points = 0;
    const totalPoints = 100;

    // 1. Personal (30 pts)
    if (member.fullName) points += 5;
    if (member.gender) points += 5;
    if (member.dateOfBirth || member.age) points += 5;
    if (member.subcaste) points += 5;
    else warnings.push({ field: 'subcaste', label: 'Sindhi Subcaste', category: 'PERSONAL', isCritical: true });

    if (member.height) points += 5;
    else warnings.push({ field: 'height', label: 'Height', category: 'PERSONAL', isCritical: false });

    if (member.maritalStatus) points += 5;

    // 2. Career & Education (25 pts)
    if (member.education || member.educationArea) points += 10;
    else warnings.push({ field: 'education', label: 'Education Qualification', category: 'CAREER', isCritical: false });

    if (member.profession || member.workingAs) points += 10;
    else warnings.push({ field: 'profession', label: 'Profession / Designation', category: 'CAREER', isCritical: false });

    if (member.annualIncome) points += 5;
    else warnings.push({ field: 'annualIncome', label: 'Annual Income', category: 'CAREER', isCritical: false });

    // 3. Family Info (20 pts)
    if (member.fatherName || member.fatherOccupation) points += 10;
    else warnings.push({ field: 'fatherName', label: "Father's Details", category: 'FAMILY', isCritical: false });

    if (member.motherName || member.motherOccupation) points += 5;
    else warnings.push({ field: 'motherName', label: "Mother's Details", category: 'FAMILY', isCritical: false });

    if (member.familyType || member.aboutFamily) points += 5;

    // 4. Horoscope & Gotra (15 pts)
    if (member.gotra) points += 5;
    else warnings.push({ field: 'gotra', label: 'Gotra', category: 'HOROSCOPE', isCritical: false });

    if (member.manglik) points += 5;
    else warnings.push({ field: 'manglik', label: 'Manglik Status', category: 'HOROSCOPE', isCritical: false });

    if (member.birthPlace || member.birthTime) points += 5;
    else warnings.push({ field: 'birthTime', label: 'Birth Time & Place', category: 'HOROSCOPE', isCritical: false });

    // 5. Photo (10 pts)
    const hasPhoto = Boolean(member.profilePhoto || (member.galleryPhotos && member.galleryPhotos.length > 0));
    if (hasPhoto) points += 10;
    else warnings.push({ field: 'profilePhoto', label: 'Profile Photograph', category: 'PERSONAL', isCritical: false });

    return {
      score: Math.min(totalPoints, points),
      warnings,
    };
  }

  /**
   * Builds a server-enforced, sanitized payload adhering strictly to privacy allowlists.
   * In BLIND mode: phone, email, street address, and internal comments are physically excluded.
   */
  public buildBiodataPayload(
    member: MatrimonialMember,
    privacyMode: BiodataPrivacyMode,
    employeeId: string,
    employeeName: string,
    employeeRole: Role,
    templateId: BiodataTemplateId = 'TRADITIONAL',
    options?: {
      hasPhotoConsent?: boolean;
      isConsentWithdrawn?: boolean;
    }
  ): BiodataRenderPayload {
    const isConsentWithdrawn = Boolean(options?.isConsentWithdrawn);
    const isFullRequested = privacyMode === 'FULL';
    const hasClearance = this.canGenerateFullBiodata(employeeRole) && !isConsentWithdrawn;

    // Enforce server-side security: if unauthorized staff or withdrawn consent tries to request FULL mode, downgrade to BLIND
    const effectivePrivacyMode: BiodataPrivacyMode = isFullRequested && hasClearance ? 'FULL' : 'BLIND';

    if (isFullRequested && (!hasClearance || isConsentWithdrawn)) {
      this.recordAuditEvent({
        eventType: 'BIODATA_ACCESS_DENIED',
        memberId: member.id,
        memberUniqueId: member.uniqueId,
        memberName: member.fullName,
        employeeId,
        employeeName,
        employeeRole,
        templateId,
        privacyMode: 'FULL',
        notes: isConsentWithdrawn
          ? 'Full Biodata denied: Member consent is withdrawn.'
          : `Attempted unauthorized Full Biodata generation with role ${employeeRole}. Enforced fallback to BLIND mode.`,
      });
    }

    const { score } = this.calculateCompleteness(member);

    const includedFields: string[] = [
      'Full Name',
      'Gender',
      'Age',
      'Marital Status',
      'Height',
      'Sindhi Subcaste',
      'Gotra',
      'Education',
      'Profession',
      'Annual Income',
      'City / State',
      'Family Background',
      'Horoscope / Kundli',
      'RM Support Contact',
    ];

    const excludedFields: string[] = [
      'Internal CRM Notes',
      'Employee Follow-up Logs',
      'Account Passwords / Auth Tokens',
      'System Database IDs',
    ];

    if (effectivePrivacyMode === 'FULL') {
      includedFields.push('Direct Mobile Number', 'Direct Email Address', 'Detailed Residential Address');
    } else {
      excludedFields.push('Direct Mobile Number', 'Direct Email Address', 'Exact Street Address');
    }

    const payload: BiodataRenderPayload = {
      memberId: member.id,
      uniqueId: member.uniqueId,
      privacyMode: effectivePrivacyMode,
      templateId,
      generatedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      generatedByEmployeeId: employeeId,
      generatedByEmployeeName: employeeName,
      isVerified: Boolean(member.isVerified),
      completenessScore: score,
      lastUpdated: member.created || 'Recently',

      // Personal
      fullName: member.fullName,
      gender: member.gender,
      age: member.age,
      dateOfBirth: member.dateOfBirth,
      height: member.height,
      weight: member.weight,
      maritalStatus: member.maritalStatus || 'Never Married',
      motherTongue: member.motherTongue || 'Sindhi',
      religion: member.religion || 'Sindhi Hindu',
      community: member.community || 'Sindhi',
      subcaste: member.subcaste || 'Sindhi',
      gotra: member.gotra,
      diet: member.diet,

      // Location
      city: member.city,
      state: member.state,
      country: member.country || 'India',

      // Horoscope
      birthTime: member.birthTime,
      birthPlace: member.birthPlace,
      manglik: member.manglik || 'Non-Manglik',
      rashi: member.rashi,
      nakshatra: member.nakshatra || member.nakshatram,
      sunSign: member.sunSign,

      // Education & Career
      educationArea: member.educationArea,
      education: member.education,
      employedIn: member.employedIn,
      profession: member.profession || member.workingAs,
      workingWith: member.workingWith,
      annualIncome: member.annualIncome,

      // Family
      fatherName: member.fatherName,
      fatherOccupation: member.fatherOccupation,
      motherName: member.motherName,
      motherOccupation: member.motherOccupation,
      familyType: member.familyType || 'Nuclear',
      membersLiveWith: member.membersLiveWith,
      aboutBrother: member.aboutBrother,
      aboutSister: member.aboutSister,
      aboutFamily: member.aboutFamily,

      // Photograph (Adhering to photo sharing consent)
      photoUrl: options?.hasPhotoConsent === false ? undefined : (member.profilePhoto || (member.galleryPhotos && member.galleryPhotos[0]) || undefined),
      hasPhotoConsent: options?.hasPhotoConsent !== false,

      // RM Info
      assignedRmName: member.assignedMatchmaker || 'Priya Sharma (RM)',
      assignedRmContact: this.settings.supportPhone,

      // Metadata
      includedFields,
      excludedFields,
    };

    // STRICT SERVER ALLOWLIST: Only populated in FULL mode
    if (effectivePrivacyMode === 'FULL') {
      payload.mobile = member.mobile;
      payload.email = member.email;
      payload.residentialAddress = member.address;
    }

    return payload;
  }

  /**
   * Generates a high-resolution, print-ready A4 PDF document using jsPDF.
   */
  public generateBiodataPdf(
    templateId: BiodataTemplateId,
    payload: BiodataRenderPayload,
    config: BiodataConfigSettings = this.settings
  ): { doc: jsPDF; blob: Blob; blobUrl: string; fileName: string } {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    if (templateId === 'TRADITIONAL') {
      this.renderTraditionalTemplate(doc, payload, config);
    } else {
      this.renderModernMinimalTemplate(doc, payload, config);
    }

    const cleanName = (payload.fullName || 'Member').replace(/[^a-zA-Z0-9]/g, '_');
    const modeTag = payload.privacyMode === 'BLIND' ? 'Blind' : 'Full';
    const fileName = `${cleanName}_${payload.uniqueId}_Biodata_${modeTag}.pdf`;

    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);

    return { doc, blob, blobUrl, fileName };
  }

  /**
   * Traditional Matrimonial Biodata Template (Maroon `#88131B`, Gold `#C59B27`, Cream `#FDFBF7`)
   */
  private renderTraditionalTemplate(doc: jsPDF, p: BiodataRenderPayload, cfg: BiodataConfigSettings): void {
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    // 1. Background Fill: Warm Cream
    doc.setFillColor(253, 251, 247); // #FDFBF7
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // 2. Outer Ornamental Double Border
    doc.setDrawColor(136, 19, 27); // Maroon #88131B
    doc.setLineWidth(1.2);
    doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2 - 8));

    doc.setDrawColor(197, 155, 39); // Gold #C59B27
    doc.setLineWidth(0.4);
    doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin * 2 - 4));

    let y = margin + 4;

    // 3. Religious Auspicious Motif
    if (cfg.allowReligiousMotif) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(136, 19, 27);
      doc.text('||  ||', pageWidth / 2, y, { align: 'center' });
      doc.setFontSize(9);
      doc.setTextColor(180, 130, 20);
      doc.text('OM SHREE GANESHAYA NAMAHA', pageWidth / 2, y + 4.5, { align: 'center' });
      y += 9;
    }

    // 4. Title Ribbon Header
    doc.setFillColor(136, 19, 27); // Maroon
    doc.roundedRect(margin + 15, y, contentWidth - 30, 11, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('MATRIMONIAL BIODATA', pageWidth / 2, y + 7.5, { align: 'center' });

    y += 15;

    // 5. Candidate Headline & Identification
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(136, 19, 27);
    doc.text(p.fullName.toUpperCase(), pageWidth / 2, y, { align: 'center' });

    y += 5.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    const subtitle = `${p.subcaste || 'Sindhi'} • ID: ${p.uniqueId} • ${p.age} Yrs • ${p.city || 'India'}`;
    doc.text(subtitle, pageWidth / 2, y, { align: 'center' });

    y += 3;
    // Gold ornamental separator line
    doc.setDrawColor(197, 155, 39);
    doc.setLineWidth(0.6);
    doc.line(margin + 20, y, pageWidth - margin - 20, y);

    y += 5;

    // 6. Section Renderer Helper
    const drawSectionHeader = (title: string) => {
      doc.setFillColor(245, 237, 220); // Warm Gold cream
      doc.roundedRect(margin, y, contentWidth, 6.5, 1, 1, 'F');
      doc.setDrawColor(136, 19, 27);
      doc.setLineWidth(0.3);
      doc.line(margin, y, margin, y + 6.5); // left accent border

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(136, 19, 27);
      doc.text(title.toUpperCase(), margin + 4, y + 4.6);
      y += 8.5;
    };

    const drawGridRow = (label: string, value?: string, label2?: string, value2?: string) => {
      const col1Width = 32;
      const col2Width = 55;
      const col3Width = 32;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(label + ' :', margin + 4, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const val1 = value && value.trim() ? value : '—';
      doc.text(val1, margin + col1Width + 4, y);

      if (label2) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(label2 + ' :', margin + col1Width + col2Width + 4, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        const val2 = value2 && value2.trim() ? value2 : '—';
        doc.text(val2, margin + col1Width + col2Width + col3Width + 4, y);
      }

      y += 5.2;
    };

    // SECTION 1: PERSONAL DETAILS
    drawSectionHeader('1. Personal Profile');
    drawGridRow('Full Name', p.fullName, 'Gender', p.gender);
    drawGridRow('Age / DOB', `${p.age} Yrs ${p.dateOfBirth ? `(${p.dateOfBirth})` : ''}`, 'Height', p.height || '—');
    drawGridRow('Marital Status', p.maritalStatus, 'Diet / Habits', p.diet || 'Vegetarian');
    drawGridRow('Subcaste', p.subcaste, 'Gotra', p.gotra || 'Not Specified');
    drawGridRow('Mother Tongue', p.motherTongue, 'Religion', p.religion);
    drawGridRow('Native / City', `${p.city || ''}, ${p.state || ''} ${p.country || 'India'}`);

    y += 2;

    // SECTION 2: EDUCATION & OCCUPATION
    drawSectionHeader('2. Education & Profession');
    drawGridRow('Highest Degree', p.education || p.educationArea || 'Graduate', 'Employed In', p.employedIn || 'Private Sector');
    drawGridRow('Designation', p.profession || 'Professional', 'Annual Income', p.annualIncome || 'Confidential');
    if (p.workingWith) {
      drawGridRow('Organization', p.workingWith);
    }

    y += 2;

    // SECTION 3: ASTROLOGICAL / KUNDLI DETAILS
    drawSectionHeader('3. Horoscope & Astro Coordinates');
    drawGridRow('Manglik Status', p.manglik || 'Non-Manglik', 'Birth Time', p.birthTime || 'Available on Request');
    drawGridRow('Birth Place', p.birthPlace || p.city || 'Available on Request', 'Rashi / Sign', p.rashi || p.sunSign || '—');
    drawGridRow('Nakshatra', p.nakshatra || '—', 'Gotra Exogamy', 'Strict 4-Gotra Verified');

    y += 2;

    // SECTION 4: FAMILY DETAILS
    drawSectionHeader('4. Family Background');
    drawGridRow("Father's Name", p.fatherName || 'Shri ' + (p.fullName.split(' ').slice(1).join(' ') || 'Family'), 'Occupation', p.fatherOccupation || 'Business');
    drawGridRow("Mother's Name", p.motherName || 'Smt. Family Head', 'Occupation', p.motherOccupation || 'Homemaker');
    drawGridRow('Family Structure', p.familyType || 'Nuclear Family', 'Living Setup', p.membersLiveWith || 'With Parents');
    if (p.aboutBrother || p.aboutSister) {
      drawGridRow('Brothers / Sisters', `${p.aboutBrother || 'None'} / ${p.aboutSister || 'None'}`);
    }
    if (p.aboutFamily) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Family Values :', margin + 4, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const familyLines = doc.splitTextToSize(p.aboutFamily, contentWidth - 40);
      doc.text(familyLines, margin + 36, y);
      y += familyLines.length * 4.5;
    }

    y += 2;

    // SECTION 5: CONTACT & ACCESS
    drawSectionHeader('5. Contact & Relationship Desk');
    if (p.privacyMode === 'FULL') {
      drawGridRow('Direct Phone', p.mobile || '—', 'Email Address', p.email || '—');
      if (p.residentialAddress) {
        drawGridRow('Residence', p.residentialAddress);
      }
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(180, 83, 9);
      doc.text('★ Full Authorized Disclosure: Verified contact details provided under explicit member consent.', margin + 4, y);
      y += 5;
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(136, 19, 27);
      doc.text('🛡️ BLIND PRIVACY MODE ACTIVE', margin + 4, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(
        'Direct phone and residential coordinates are masked for family privacy. To initiate dialogue, please connect with:',
        margin + 4,
        y
      );
      y += 4.5;
      drawGridRow('Assigned RM', p.assignedRmName, 'Contact RM', p.assignedRmContact);
    }

    // 7. Footer Seal & Verification Stamp
    const footerY = pageHeight - margin - 5;
    doc.setDrawColor(197, 155, 39);
    doc.setLineWidth(0.4);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(136, 19, 27);
    doc.text(`✓ ${cfg.portalBrandingName} — Verified Dossier (ID: ${p.uniqueId})`, margin, footerY - 1);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(cfg.footerText, margin, footerY + 2.5);
    doc.text(`Generated: ${p.generatedAt} | By: ${p.generatedByEmployeeName}`, pageWidth - margin, footerY + 2.5, { align: 'right' });
  }

  /**
   * Modern Minimalist Matrimonial Biodata Template (Clean White `#FFFFFF`, Slate `#0F172A`, Ruby `#991B1B`)
   */
  private renderModernMinimalTemplate(doc: jsPDF, p: BiodataRenderPayload, cfg: BiodataConfigSettings): void {
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    // 1. Clean White Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // 2. Top Modern Header Accent Bar
    doc.setFillColor(153, 27, 27); // Ruby Red #991B1B
    doc.rect(0, 0, pageWidth, 5, 'F');

    let y = margin + 4;

    // 3. Modern Typography Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(p.fullName, margin, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`${p.subcaste || 'Sindhi'} Community  |  Profile ID: ${p.uniqueId}  |  ${p.city || 'India'}`, margin, y);

    // Pill badge for verification
    const badgeText = p.isVerified ? 'KYC VERIFIED' : 'COMMUNITY VERIFIED';
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(pageWidth - margin - 35, y - 9, 35, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(153, 27, 27);
    doc.text(badgeText, pageWidth - margin - 17.5, y - 4.5, { align: 'center' });

    y += 6;
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);

    y += 8;

    // Key Stats Quick Summary Cards (3 Columns)
    const cardWidth = (contentWidth - 8) / 3;
    const drawMiniCard = (x: number, title: string, subtitle: string) => {
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, cardWidth, 14, 2, 2, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, y, cardWidth, 14, 2, 2, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(title.toUpperCase(), x + 4, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(subtitle, x + 4, y + 10.5);
    };

    drawMiniCard(margin, 'Age & Height', `${p.age} Yrs • ${p.height || '5 ft 6 in'}`);
    drawMiniCard(margin + cardWidth + 4, 'Profession', `${p.profession || 'Professional'}`);
    drawMiniCard(margin + (cardWidth + 4) * 2, 'Subcaste & Gotra', `${p.subcaste || 'Sindhi'} (${p.gotra || '—'})`);

    y += 20;

    // Modern Section Divider
    const drawModernSection = (title: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(153, 27, 27); // Ruby accent
      doc.text(title, margin, y);

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(margin + 45, y - 1, pageWidth - margin, y - 1);
      y += 6;
    };

    const drawDataRow = (label: string, value?: string, label2?: string, value2?: string) => {
      const col1 = 34;
      const col2 = 54;
      const col3 = 34;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(label, margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(value && value.trim() ? value : '—', margin + col1, y);

      if (label2) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(label2, margin + col1 + col2, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(value2 && value2.trim() ? value2 : '—', margin + col1 + col2 + col3, y);
      }
      y += 5.5;
    };

    // 1. Personal Overview
    drawModernSection('PERSONAL OVERVIEW');
    drawDataRow('Date of Birth', p.dateOfBirth || `${p.age} Years`, 'Gender', p.gender);
    drawDataRow('Marital Status', p.maritalStatus, 'Dietary Preference', p.diet || 'Vegetarian');
    drawDataRow('Sindhi Subcaste', p.subcaste, 'Family Gotra', p.gotra || 'Not Specified');
    drawDataRow('Mother Tongue', p.motherTongue, 'Religion', p.religion);
    drawDataRow('Current City', `${p.city || ''}, ${p.state || ''} ${p.country || 'India'}`);

    y += 3;

    // 2. Career & Education
    drawModernSection('CAREER & ACADEMICS');
    drawDataRow('Education', p.education || p.educationArea || 'Graduate', 'Employment', p.employedIn || 'Private Sector');
    drawDataRow('Designation', p.profession || 'Professional', 'Annual Compensation', p.annualIncome || 'Confidential');
    if (p.workingWith) {
      drawDataRow('Organization', p.workingWith);
    }

    y += 3;

    // 3. Astro & Kundli
    drawModernSection('ASTRO & KUNDLI');
    drawDataRow('Manglik Status', p.manglik || 'Non-Manglik', 'Birth Time', p.birthTime || 'Available upon request');
    drawDataRow('Birth City', p.birthPlace || p.city || 'Available upon request', 'Rashi / Nakshatra', `${p.rashi || '—'} / ${p.nakshatra || '—'}`);

    y += 3;

    // 4. Family Structure
    drawModernSection('FAMILY BACKGROUND');
    drawDataRow("Father's Details", `${p.fatherName || 'Family Head'} (${p.fatherOccupation || 'Business'})`);
    drawDataRow("Mother's Details", `${p.motherName || 'Homemaker'} (${p.motherOccupation || 'Homemaker'})`);
    drawDataRow('Family Type', p.familyType || 'Nuclear', 'Siblings', `${p.aboutBrother || '—'} (Bro) / ${p.aboutSister || '—'} (Sis)`);
    if (p.aboutFamily) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Family Background', margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const desc = doc.splitTextToSize(p.aboutFamily, contentWidth - 40);
      doc.text(desc, margin + 34, y);
      y += desc.length * 4.5;
    }

    y += 3;

    // 5. Contact & Privacy
    drawModernSection('COMMUNICATION & PRIVACY');
    if (p.privacyMode === 'FULL') {
      drawDataRow('Direct Mobile', p.mobile || '—', 'Direct Email', p.email || '—');
      if (p.residentialAddress) {
        drawDataRow('Residence Address', p.residentialAddress);
      }
      y += 2;
    } else {
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(153, 27, 27);
      doc.text('SHIELDED BLIND BIODATA — Direct Contact Masked', margin + 4, y + 4.5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Contact Relationship Manager: ${p.assignedRmName} (${p.assignedRmContact}) to express formal interest.`, margin + 4, y + 9);
      y += 16;
    }

    // Modern Minimal Footer
    const footerY = pageHeight - margin - 3;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`${cfg.portalBrandingName} • Matrimonial Dossier`, margin, footerY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on ${p.generatedAt} for Authorized Matrimonial Review.`, margin, footerY + 3.5);
    doc.text(`Document Reference: ${p.uniqueId}`, pageWidth - margin, footerY, { align: 'right' });
  }

  /**
   * Generates formatted WhatsApp message text with candidate essentials.
   */
  public formatWhatsAppBiodataMessage(
    payload: BiodataRenderPayload,
    customNote?: string,
    rmName: string = payload.assignedRmName,
    rmPhone: string = payload.assignedRmContact
  ): string {
    const lines = [
      `🙏 *Namaste from ${this.settings.portalBrandingName}*`,
      '',
      `Kindly find the confidential matrimonial profile details for *${payload.fullName}* (Profile ID: *${payload.uniqueId}*):`,
      '',
      `• *Age & Height:* ${payload.age} Yrs, ${payload.height || 'Average'}`,
      `• *Subcaste & Gotra:* ${payload.subcaste} (${payload.gotra || 'Not Specified'})`,
      `• *Education:* ${payload.education || payload.educationArea || 'Graduate'}`,
      `• *Profession:* ${payload.profession || 'Professional'} ${payload.annualIncome ? `(${payload.annualIncome})` : ''}`,
      `• *Location:* ${payload.city || 'India'}`,
      `• *Horoscope:* ${payload.manglik || 'Non-Manglik'}`,
      '',
      `📄 *Attached Document:* Matrimonial Biodata (${payload.privacyMode === 'BLIND' ? 'Privacy Shielded' : 'Full Verified'})`,
    ];

    if (customNote && customNote.trim()) {
      lines.push('', `💬 *Note from Relationship Manager:*`, `"${customNote.trim()}"`);
    }

    lines.push(
      '',
      `If you would like to initiate conversation or request family horoscopes, please connect with our authorized Relationship Manager:`,
      `👤 *RM:* ${rmName} (${rmPhone})`,
      `🌐 *Portal:* ${this.settings.portalWebsiteUrl}`
    );

    return lines.join('\n');
  }

  /**
   * Generates a direct WhatsApp Web URL.
   */
  public generateWhatsAppShareUrl(recipientPhone: string, messageText: string): string {
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(messageText);
    if (cleanPhone) {
      return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    }
    return `https://web.whatsapp.com/send?text=${encoded}`;
  }

  /**
   * Records an immutable audit log entry and posts to Member 360° CRM timeline.
   */
  public recordAuditEvent(entry: Omit<BiodataAuditLogEntry, 'id' | 'timestamp' | 'correlationId'>): BiodataAuditLogEntry {
    const record: BiodataAuditLogEntry = {
      ...entry,
      id: `bio_audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      correlationId: `req_${Math.random().toString(36).slice(2, 9)}`,
    };

    this.inMemoryAuditLogs = [record, ...this.inMemoryAuditLogs].slice(0, 200);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(this.inMemoryAuditLogs));
      } catch (err) {
        console.warn('Failed to store biodata audit log:', err);
      }
    }

    // Also link into activity timeline in crmDataService so it appears in 360° Member dossier!
    try {
      crmDataService.addActivity({
        employeeId: entry.employeeId,
        timestamp: new Date().toISOString(),
        type: 'PROFILE_SHARED',
        entityType: 'CLIENT',
        entityId: entry.memberId,
        title: `Biodata PDF Generated (${entry.templateId} - ${entry.privacyMode})`,
        description: `Biodata generated by ${entry.employeeName} (${entry.employeeRole}). Mode: ${entry.privacyMode}. Target: ${entry.recipientReference || 'Local Download'}.`,
      });
    } catch (err) {
      console.warn('Failed to append timeline event for biodata:', err);
    }

    return record;
  }

  /**
   * Retrieves stored audit logs.
   */
  public getAuditLogs(): BiodataAuditLogEntry[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Failed to parse biodata audit logs:', err);
      }
    }
    return [...this.inMemoryAuditLogs];
  }

  /**
   * Retrieves audit log history filtered for a specific member.
   */
  public getAuditLogsForMember(memberId: string): BiodataAuditLogEntry[] {
    return this.getAuditLogs().filter((l) => l.memberId === memberId || l.memberUniqueId === memberId);
  }

  /**
   * Updates an existing audit log entry (e.g. when a share is cancelled).
   */
  public updateAuditLog(
    logId: string,
    updates: Partial<BiodataAuditLogEntry>
  ): BiodataAuditLogEntry | null {
    const logs = this.getAuditLogs();
    const idx = logs.findIndex((l) => l.id === logId);
    if (idx !== -1) {
      logs[idx] = { ...logs[idx], ...updates };
      this.inMemoryAuditLogs = logs;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs));
        } catch (err) {
          console.warn('Failed to save updated audit log:', err);
        }
      }
      return logs[idx];
    }
    return null;
  }
}

export const biodataService = new BiodataService();
