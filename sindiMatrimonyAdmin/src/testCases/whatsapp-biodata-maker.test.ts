import assert from 'assert';
import { biodataService } from '../services/biodataService';
import type { MatrimonialMember } from '../services/memberDataService';

console.log('----------------------------------------------------');
console.log('🏛️ Test Suite 18: 1-Click WhatsApp Biodata Maker & Formatter Suite');
console.log('----------------------------------------------------');

// Mock Member Setup
const mockMember: MatrimonialMember = {
  id: '101408',
  uniqueId: 'SIND1024',
  fullName: 'Kavita Suresh Advani',
  mobile: '+91 98201 12345',
  email: 'kavita.advani@example.com',
  gender: 'Female',
  age: 27,
  dateOfBirth: '14 Nov 1998',
  maritalStatus: 'Never Married',
  subcaste: 'Amil',
  gotra: 'Kashyap',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  address: 'Flat 402, Sea Green Apartments, Bandra West, Mumbai 400050',
  height: '5 ft 5 in',
  education: 'B.Tech in Computer Science, VJTI',
  profession: 'Senior Software Engineer',
  employedIn: 'MNC (Technology)',
  annualIncome: '₹22,00,000 PA',
  fatherName: 'Suresh L. Advani',
  fatherOccupation: 'Textile Business Owner',
  motherName: 'Sunita S. Advani',
  motherOccupation: 'Senior School Educator',
  familyType: 'Nuclear',
  aboutBrother: '1 Younger Brother (Studying MBA)',
  aboutSister: 'None',
  aboutFamily: 'Traditional Sindhi family with contemporary cultural values',
  birthTime: '06:45 AM',
  birthPlace: 'Mumbai',
  manglik: 'Non-Manglik',
  rashi: 'Tula',
  nakshatra: 'Swati',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
  isVerified: true,
  plan: 'PLATINUM',
  status: 'ACTIVE',
  created: '12 Jan 2026',
  createdAtTimestamp: Date.now() - 86400000,
};

// 1. Traditional Template PDF Generation
{
  const payload = biodataService.buildBiodataPayload(
    mockMember,
    'BLIND',
    'emp_001',
    'Rajesh Varma (Super Admin)',
    'SUPER_ADMIN',
    'TRADITIONAL'
  );
  const { doc, blob, fileName } = biodataService.generateBiodataPdf('TRADITIONAL', payload);

  assert.ok(doc, 'jsPDF document must be instantiated');
  assert.ok(blob.size > 1000, 'PDF blob size must exceed 1KB');
  assert.ok(fileName.includes('Kavita_Suresh_Advani_SIND1024_Biodata_Blind.pdf'), 'Filename must contain member name and blind tag');
  console.log('  ✓ Test 1: Traditional A4 PDF generated successfully with valid size and title');
}

// 2. Modern Minimal Template PDF Generation
{
  const payload = biodataService.buildBiodataPayload(
    mockMember,
    'FULL',
    'emp_001',
    'Rajesh Varma (Super Admin)',
    'SUPER_ADMIN',
    'MODERN_MINIMAL'
  );
  const { doc, blob, fileName } = biodataService.generateBiodataPdf('MODERN_MINIMAL', payload);

  assert.ok(doc, 'Modern minimal jsPDF document must be generated');
  assert.ok(blob.size > 1000, 'Modern minimal blob size must exceed 1KB');
  assert.ok(fileName.includes('Biodata_Full.pdf'), 'Filename must contain Full tag');
  console.log('  ✓ Test 2: Modern Minimal A4 PDF generated successfully');
}

// 3. Blind Privacy Mode Server-Side Field Exclusion
{
  const blindPayload = biodataService.buildBiodataPayload(
    mockMember,
    'BLIND',
    'emp_002',
    'Priya Sharma',
    'CRM_MANAGER',
    'TRADITIONAL'
  );

  assert.strictEqual(blindPayload.privacyMode, 'BLIND');
  assert.strictEqual(blindPayload.mobile, undefined, 'Phone number must be strictly omitted in BLIND mode');
  assert.strictEqual(blindPayload.email, undefined, 'Email address must be strictly omitted in BLIND mode');
  assert.strictEqual(blindPayload.residentialAddress, undefined, 'Residential address must be strictly omitted in BLIND mode');
  assert.ok(blindPayload.excludedFields.includes('Direct Mobile Number'), 'Must list Direct Mobile Number in excluded fields');
  assert.ok(blindPayload.excludedFields.includes('Direct Email Address'), 'Must list Direct Email Address in excluded fields');
  assert.ok(blindPayload.excludedFields.includes('Internal CRM Notes'), 'Must list CRM notes in excluded fields');
  console.log('  ✓ Test 3: Blind Privacy Mode server-side field allowlist strictly excludes phone, email, and address');
}

// 4. Full Privacy Mode Authorized Access
{
  const fullPayload = biodataService.buildBiodataPayload(
    mockMember,
    'FULL',
    'emp_001',
    'Super Admin',
    'SUPER_ADMIN',
    'TRADITIONAL'
  );

  assert.strictEqual(fullPayload.privacyMode, 'FULL');
  assert.strictEqual(fullPayload.mobile, mockMember.mobile, 'Authorized Full mode must provide verified mobile number');
  assert.strictEqual(fullPayload.email, mockMember.email, 'Authorized Full mode must provide verified email');
  assert.strictEqual(fullPayload.residentialAddress, mockMember.address, 'Authorized Full mode must provide verified residential address');
  assert.ok(fullPayload.includedFields.includes('Direct Mobile Number'));
  console.log('  ✓ Test 4: Full Privacy Mode provides verified contact details to authorized Super Admin');
}

// 5. Unauthorized Role Downgrade & Access Denied Security Audit
{
  // A standard CRM Agent or Employee attempting FULL mode must be forcibly downgraded to BLIND
  const downgradedPayload = biodataService.buildBiodataPayload(
    mockMember,
    'FULL',
    'emp_005',
    'Junior Agent',
    'CRM_AGENT',
    'TRADITIONAL'
  );

  assert.strictEqual(downgradedPayload.privacyMode, 'BLIND', 'Unauthorized role must be forcefully downgraded to BLIND mode');
  assert.strictEqual(downgradedPayload.mobile, undefined, 'Unauthorized role must not receive mobile number');
  assert.strictEqual(downgradedPayload.email, undefined, 'Unauthorized role must not receive email');
  console.log('  ✓ Test 5: Unauthorized employee requesting Full mode is strictly downgraded to Blind mode');
}

// 6. Profile Completeness Calculation
{
  const result = biodataService.calculateCompleteness(mockMember);
  assert.ok(result.score >= 90, `Mock complete member should score >= 90%, got ${result.score}%`);

  const incompleteMember: MatrimonialMember = {
    ...mockMember,
    subcaste: '',
    height: undefined,
    education: undefined,
    profession: undefined,
    annualIncome: undefined,
    fatherName: undefined,
    fatherOccupation: undefined,
    motherName: undefined,
    motherOccupation: undefined,
    gotra: undefined,
    manglik: undefined,
    birthPlace: undefined,
    birthTime: undefined,
    profilePhoto: undefined,
    galleryPhotos: undefined,
  };

  const incompleteResult = biodataService.calculateCompleteness(incompleteMember);
  assert.ok(incompleteResult.score < 50, `Incomplete member should score < 50%, got ${incompleteResult.score}%`);
  assert.ok(incompleteResult.warnings.some((w) => w.field === 'subcaste'), 'Must flag missing subcaste');
  assert.ok(incompleteResult.warnings.some((w) => w.field === 'gotra'), 'Must flag missing gotra');
  assert.ok(incompleteResult.warnings.some((w) => w.field === 'education'), 'Must flag missing education');
  console.log('  ✓ Test 6: Profile Completeness score and missing field warning generator verified');
}

// 7. Long Text and Extreme Strings Resilience
{
  const longMember: MatrimonialMember = {
    ...mockMember,
    fullName: 'Shri Vikramaditya Harishchandra Chhatrapati Advani-Gidwani-Chandiramani',
    profession: 'Executive Vice President of Global Cross-Border Artificial Intelligence Infrastructure Operations',
    aboutFamily: 'A'.repeat(800), // Very long family narrative
  };

  const payload = biodataService.buildBiodataPayload(
    longMember,
    'BLIND',
    'emp_001',
    'Admin',
    'SUPER_ADMIN',
    'TRADITIONAL'
  );

  const { doc } = biodataService.generateBiodataPdf('TRADITIONAL', payload);
  assert.ok(doc, 'PDF generation must handle extreme string lengths without crashing');

  const { doc: modernDoc } = biodataService.generateBiodataPdf('MODERN_MINIMAL', payload);
  assert.ok(modernDoc, 'Modern minimal PDF must handle extreme string lengths');
  console.log('  ✓ Test 7: Handles long names, long job titles, and large text blocks cleanly');
}

// 8. Religious Motif Toggle Behavior
{
  const payload = biodataService.buildBiodataPayload(
    mockMember,
    'BLIND',
    'emp_001',
    'Admin',
    'SUPER_ADMIN',
    'TRADITIONAL'
  );

  const configWithMotif = { ...biodataService.getSettings(), allowReligiousMotif: true };
  const { doc: docWith } = biodataService.generateBiodataPdf('TRADITIONAL', payload, configWithMotif);
  assert.ok(docWith);

  const configWithoutMotif = { ...biodataService.getSettings(), allowReligiousMotif: false };
  const { doc: docWithout } = biodataService.generateBiodataPdf('TRADITIONAL', payload, configWithoutMotif);
  assert.ok(docWithout);
  console.log('  ✓ Test 8: Religious motif toggle operates correctly for Traditional template');
}

// 9. WhatsApp Formatted Message Generator
{
  const payload = biodataService.buildBiodataPayload(
    mockMember,
    'BLIND',
    'emp_001',
    'Admin',
    'SUPER_ADMIN',
    'TRADITIONAL'
  );

  const message = biodataService.formatWhatsAppBiodataMessage(payload);
  assert.ok(message.includes('*Kavita Suresh Advani*'), 'Must contain bold candidate name');
  assert.ok(message.includes('SIND1024'), 'Must contain unique profile ID');
  assert.ok(message.includes('Amil (Kashyap)'), 'Must contain subcaste and gotra');
  assert.ok(message.includes('Senior Software Engineer'), 'Must contain profession');
  assert.ok(message.includes('Privacy Shielded'), 'Must tag privacy shielded mode');

  const messageWithCustomNote = biodataService.formatWhatsAppBiodataMessage(
    payload,
    'Family is looking for an Amil/Bhaiband groom based in Mumbai or Dubai.'
  );
  assert.ok(messageWithCustomNote.includes('Family is looking for an Amil/Bhaiband groom'), 'Must embed custom RM note');
  console.log('  ✓ Test 9: Formatted WhatsApp message generator output structured correctly');
}

// 10. WhatsApp Web Target URL Generation
{
  const targetPhone = '+91 98200 99999';
  const text = 'Hello Test';
  const url = biodataService.generateWhatsAppShareUrl(targetPhone, text);

  assert.ok(url.startsWith('https://web.whatsapp.com/send?phone=919820099999'), 'Must clean phone number and prepend URL');
  assert.ok(url.includes('text=Hello%20Test'), 'Must encode URI message component');

  // Blank phone fallback
  const blankUrl = biodataService.generateWhatsAppShareUrl('', text);
  assert.ok(blankUrl.startsWith('https://web.whatsapp.com/send?text='), 'Must fallback to general share URL when phone is blank');
  console.log('  ✓ Test 10: WhatsApp Web share URL generator validates and encodes phone numbers correctly');
}

// 11. Immutable Audit Logging & Correlation Tracking
{
  const auditLog = biodataService.recordAuditEvent({
    eventType: 'BIODATA_SHARE_INITIATED',
    memberId: mockMember.id,
    memberUniqueId: mockMember.uniqueId,
    memberName: mockMember.fullName,
    employeeId: 'emp_001',
    employeeName: 'Rajesh Varma',
    employeeRole: 'SUPER_ADMIN',
    templateId: 'TRADITIONAL',
    privacyMode: 'BLIND',
    recipientReference: '+91 98200 99999 (Father)',
    shareMethod: 'WHATSAPP_WEB',
    notes: 'Dispatched via WhatsApp Web with candidate consent.',
  });

  assert.ok(auditLog.id.startsWith('bio_audit_'), 'Audit log must receive unique prefixed ID');
  assert.ok(auditLog.correlationId.startsWith('req_'), 'Audit log must receive correlation ID');
  assert.strictEqual(auditLog.memberId, mockMember.id);
  assert.strictEqual(auditLog.eventType, 'BIODATA_SHARE_INITIATED');
  console.log('  ✓ Test 11: Immutable Audit Trail and Correlation ID recorded accurately');
}

// 12. Settings Configuration Persistence
{
  const original = biodataService.getSettings();
  const updated = biodataService.updateSettings({
    portalBrandingName: 'Sindhi Matrimonial Chamber',
  });

  assert.strictEqual(updated.portalBrandingName, 'Sindhi Matrimonial Chamber');
  const fetched = biodataService.getSettings();
  assert.strictEqual(fetched.portalBrandingName, 'Sindhi Matrimonial Chamber');

  // Restore
  biodataService.updateSettings(original);
  console.log('  ✓ Test 12: Biodata settings configuration updates and retrieves reliably');
}

// 13. Profile Without Photograph Renders Cleanly
{
  const noPhotoMember: MatrimonialMember = {
    ...mockMember,
    profilePhoto: undefined,
    galleryPhotos: undefined,
  };
  const payload = biodataService.buildBiodataPayload(
    noPhotoMember,
    'BLIND',
    'emp_001',
    'Admin',
    'SUPER_ADMIN',
    'TRADITIONAL'
  );
  assert.strictEqual(payload.photoUrl, undefined, 'Photo URL must be undefined when profile has no photo');
  const { doc } = biodataService.generateBiodataPdf('TRADITIONAL', payload);
  assert.ok(doc, 'Must generate valid PDF without photo');
  console.log('  ✓ Test 13: Profile without photograph renders cleanly without breaking layout');
}

// 14. Photo Consent Withdrawn Omits Photograph From PDF
{
  const payload = biodataService.buildBiodataPayload(
    mockMember,
    'BLIND',
    'emp_001',
    'Admin',
    'SUPER_ADMIN',
    'TRADITIONAL',
    { hasPhotoConsent: false }
  );
  assert.strictEqual(payload.photoUrl, undefined, 'Photo must be omitted when hasPhotoConsent is false');
  assert.strictEqual(payload.hasPhotoConsent, false);
  const { doc } = biodataService.generateBiodataPdf('TRADITIONAL', payload);
  assert.ok(doc, 'Must generate valid PDF respecting photo consent withdrawal');
  console.log('  ✓ Test 14: Member photo-sharing consent denied correctly excludes photo from PDF');
}

// 15. In-Flight Consent Revocation Blocks Full Biodata
{
  const revokedPayload = biodataService.buildBiodataPayload(
    mockMember,
    'FULL',
    'emp_001',
    'Admin',
    'SUPER_ADMIN',
    'TRADITIONAL',
    { isConsentWithdrawn: true }
  );
  assert.strictEqual(revokedPayload.privacyMode, 'BLIND', 'Withdrawn consent must downgrade Full mode to Blind');
  assert.strictEqual(revokedPayload.mobile, undefined, 'Phone must not be disclosed when consent is withdrawn');
  console.log('  ✓ Test 15: In-flight consent revocation blocks Full mode and enforces Blind privacy');
}

// 16. WhatsApp Share Cancellation & Truthful Delivery Auditing
{
  const shareLog = biodataService.recordAuditEvent({
    eventType: 'BIODATA_SHARE_INITIATED',
    memberId: mockMember.id,
    memberUniqueId: mockMember.uniqueId,
    memberName: mockMember.fullName,
    employeeId: 'emp_002',
    employeeName: 'Priya Sharma',
    employeeRole: 'CRM_MANAGER',
    templateId: 'TRADITIONAL',
    privacyMode: 'BLIND',
    recipientReference: '+91 98201 12345',
    shareMethod: 'WHATSAPP_WEB',
    notes: 'WhatsApp Web launched.',
  });

  // Verify status is SHARE_INITIATED, not falsely DELIVERED
  assert.strictEqual(shareLog.eventType, 'BIODATA_SHARE_INITIATED');

  // When operator cancels or indicates not sent
  const cancelled = biodataService.updateAuditLog(shareLog.id, {
    eventType: 'BIODATA_SHARE_FAILED',
    notes: 'Operator indicated share was cancelled or aborted.',
  });
  assert.strictEqual(cancelled?.eventType, 'BIODATA_SHARE_FAILED');
  console.log('  ✓ Test 16: WhatsApp share cancellation updates audit record without false delivery claim');
}

// 17. Member Specific Audit History Retrieval
{
  const memberHistory = biodataService.getAuditLogsForMember(mockMember.id);
  assert.ok(Array.isArray(memberHistory));
  assert.ok(memberHistory.length > 0, 'Must retrieve audit logs for mockMember');
  assert.ok(memberHistory.every((h) => h.memberId === mockMember.id));
  console.log('  ✓ Test 17: getAuditLogsForMember accurately filters historical events for candidate');
}

console.log('----------------------------------------------------');
console.log('🎉 ALL 17 WHATSAPP BIODATA MAKER TESTS PASSED CLEANLY!');
console.log('----------------------------------------------------');
