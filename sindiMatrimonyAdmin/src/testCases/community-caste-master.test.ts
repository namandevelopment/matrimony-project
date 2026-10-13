import assert from 'assert';
import {
  subcasteGotraService,
  type CommunityMaster,
  type SubcasteMaster,
  type GotraMaster,
  type SurnameMaster,
} from '../services/subcasteGotraService';

console.log('----------------------------------------------------');
console.log('🏛️ Test Suite 16: Complete Community, Caste, Subcaste, Gotra & Surname Master');
console.log('----------------------------------------------------');

// Ensure starting with fresh authentic defaults
subcasteGotraService.resetToDefaults();

// 1. Overview counts come from live database records, not hardcoded numbers
const initialStats = subcasteGotraService.getMasterStats();
assert(initialStats.totalCommunities >= 12, 'Must have at least 12 authentic verified Sindhi communities');
assert(initialStats.totalSubcastes >= 13, 'Must have at least 13 detailed Sindhi subcastes');
assert(initialStats.totalGotras >= 16, 'Must have at least 16 documented Vedic Gotras (exceeding legacy 8)');
assert(initialStats.totalSurnames >= 20, 'Must have at least 20 documented Sindhi surnames');
assert(initialStats.activeRecords > 0, 'Active records count must be dynamically calculated');
assert(initialStats.enabledRulesCount >= 3, 'Must have enabled compatibility rules');

// 2. Adding and editing each master record type
// A. Community
const newComm = subcasteGotraService.addCommunity({
  name: 'Test Sindhi Kutchi',
  category: 'REGIONAL_GROUP',
  aliases: ['Kutchi Sindhi', 'Sindh-Kutch Border Community'],
  historicalRegion: 'Kutch Border',
  description: 'Regional community with blended matrimonial traditions',
  hasGotraSystem: true,
  verificationStatus: 'VERIFIED',
  sourceReference: 'Test Reference 2026',
  active: true,
});
assert.strictEqual(newComm.name, 'Test Sindhi Kutchi');
assert.strictEqual(subcasteGotraService.getCommunities().some((c) => c.id === newComm.id), true);

subcasteGotraService.updateCommunity(newComm.id, { description: 'Updated ethnographical note' });
const updatedComm = subcasteGotraService.getCommunities().find((c) => c.id === newComm.id)!;
assert.strictEqual(updatedComm.description, 'Updated ethnographical note');

// B. Subcaste
const newSub = subcasteGotraService.addSubcaste({
  name: 'Test Khalsa Sindhi',
  communityId: newComm.id,
  communityName: newComm.name,
  region: 'Upper Sindh',
  description: 'Test subcaste',
  aliases: ['Khalsa'],
  surnames: ['Testani'],
  priorityWeight: 12,
  verificationStatus: 'VERIFIED',
  sourceReference: 'Test Seeder',
  active: true,
});
assert.strictEqual(newSub.name, 'Test Khalsa Sindhi');

// C. Gotra
const newGotra = subcasteGotraService.addGotra({
  name: 'Test Vatsa Rishi',
  lineage: 'Bhrigu Lineage',
  description: 'Test gotra entry',
  alternateSpellings: ['Vats', 'Vatsya'],
  prohibitedSameGotra: true,
  confidence: 'HIGH',
  verificationStatus: 'VERIFIED',
  sourceReference: 'Vedic Samhita Test',
  active: true,
});
assert.strictEqual(newGotra.name, 'Test Vatsa Rishi');

// D. Surname
const newSurname = subcasteGotraService.addSurname({
  canonicalSurname: 'Testwadhwani',
  alternateSpellings: ['Testwadhwawnee'],
  mappedSubcasteIds: [newSub.id],
  mappedSubcasteNames: [newSub.name],
  mappedGotraIds: [newGotra.id],
  mappedGotraNames: [newGotra.name],
  isAmbiguous: false,
  confidence: 'HIGH',
  verificationStatus: 'VERIFIED',
  sourceReference: 'Directory Test',
  active: true,
});
assert.strictEqual(newSurname.canonicalSurname, 'Testwadhwani');

// 3. Duplicate names with different capitalization must be rejected
assert.throws(
  () => {
    subcasteGotraService.addCommunity({
      name: 'test sindhi kutchi', // lower case duplicate
      category: 'REGIONAL_GROUP',
      aliases: [],
      historicalRegion: '',
      description: '',
      hasGotraSystem: true,
      verificationStatus: 'VERIFIED',
      sourceReference: '',
      active: true,
    });
  },
  /already exists/i,
  'Case-insensitive duplicate community must be rejected'
);

assert.throws(
  () => {
    subcasteGotraService.addSubcaste({
      name: 'TEST KHALSA SINDHI', // uppercase duplicate
      region: '',
      description: '',
      aliases: [],
      surnames: [],
      priorityWeight: 10,
      verificationStatus: 'VERIFIED',
      sourceReference: '',
      active: true,
    });
  },
  /already exists/i,
  'Case-insensitive duplicate subcaste must be rejected'
);

// 4. Multiple aliases for one record
const lohana = subcasteGotraService.getCommunities().find((c) => c.name === 'Sindhi Lohana')!;
assert(lohana.aliases.includes('Luwana') && lohana.aliases.includes('Luv Vanshi'));

// 5. Surnames shared by multiple communities (Ambiguous Flag)
const mulchandani = subcasteGotraService.lookupSurname('Mulchandani');
assert.strictEqual(mulchandani.isAmbiguous, true, 'Mulchandani is shared across Bhaiband and Sahiti');
assert(mulchandani.suggestedSubcastes.length > 1, 'Should suggest both subcastes');

// Lookup by alternate spelling alias
const advaniAltLookup = subcasteGotraService.lookupSurname('Aadwani');
assert(advaniAltLookup.suggestedSubcastes.includes('Amil'), 'Should resolve Aadwani alias to Amil');

// 6. Communities that do not use Gotras (e.g. Sindhi Sikh / Nanakpanthi, Chhapru)
const nanakpanthi = subcasteGotraService.getCommunities().find((c) => c.name.includes('Nanakpanthi'))!;
assert.strictEqual(nanakpanthi.hasGotraSystem, false, 'Sindhi Sikh must have hasGotraSystem: false');

// 7. Matrimonial Compatibility Rules: Same-Gotra Exogamy & Exemptions
// Case A: Strict Same-Gotra Exogamy between standard Hindu profiles -> BLOCKED
const sameGotraEval = subcasteGotraService.checkMatchCompatibility(
  { subcaste: 'Amil', gotra: 'Kashyap', communityId: 'comm_2' },
  { subcaste: 'Amil', gotra: 'Kashyap', communityId: 'comm_2' }
);
assert.strictEqual(sameGotraEval.isCompatible, false, 'Same-Gotra match must be blocked under default rule');
assert(sameGotraEval.reasons.some((r) => r.includes('Sagotra Exogamy Blocked')));

// Case B: Different Gotras -> PERMITTED with bonus points
const diffGotraEval = subcasteGotraService.checkMatchCompatibility(
  { subcaste: 'Amil', gotra: 'Kashyap', communityId: 'comm_2' },
  { subcaste: 'Amil', gotra: 'Shandilya', communityId: 'comm_2' }
);
assert.strictEqual(diffGotraEval.isCompatible, true, 'Different gotras must be compatible');
assert(diffGotraEval.scoreModifier > 0, 'Should gain compatibility bonus points');

// Case C: Exemption: Nanakpanthi community profile sharing a Gotra -> PERMITTED
const exemptEval = subcasteGotraService.checkMatchCompatibility(
  { subcaste: 'Sindhi Sikh', gotra: 'Kashyap', communityId: 'comm_8' },
  { subcaste: 'Sindhi Sikh', gotra: 'Kashyap', communityId: 'comm_8' }
);
assert.strictEqual(exemptEval.isCompatible, true, 'Exempt communities must allow same gotra pairing');
assert(exemptEval.reasons.some((r) => r.includes('permitted under community exemption')));

// Case D: Same-Gotra Rule Disabled globally
subcasteGotraService.updateRules({ strictSameGotraRule: false });
const ruleDisabledEval = subcasteGotraService.checkMatchCompatibility(
  { subcaste: 'Amil', gotra: 'Kashyap' },
  { subcaste: 'Amil', gotra: 'Kashyap' }
);
assert.strictEqual(ruleDisabledEval.isCompatible, true, 'When rule is disabled, match must be permitted');

// Re-enable rule
subcasteGotraService.updateRules({ strictSameGotraRule: true });

// 8. Missing or unverified Gotra information
const missingGotraEval = subcasteGotraService.checkMatchCompatibility(
  { subcaste: 'Amil', gotra: '' },
  { subcaste: 'Amil', gotra: 'Kashyap' }
);
assert.strictEqual(missingGotraEval.isCompatible, true, 'Missing gotra must not block match abnormally');

// 9. Foreign Key & Reference Deletion Protection
// Cannot delete community while referenced by subcastes
const deleteCommAttempt = subcasteGotraService.deleteCommunity('comm_2');
assert.strictEqual(deleteCommAttempt.success, false, 'Must prevent deleting referenced community');
assert(deleteCommAttempt.error?.includes('Referenced by'), 'Must report foreign key constraint');

// Deactivation must be permitted instead
subcasteGotraService.updateCommunity('comm_2', { active: false });
assert.strictEqual(subcasteGotraService.getCommunities().find((c) => c.id === 'comm_2')?.active, false);
subcasteGotraService.updateCommunity('comm_2', { active: true }); // revert

// 10. Bulk CSV Export & Import with Duplicate Prevention
const exportedSubcastesCSV = subcasteGotraService.exportToCSV('SUBCASTE');
assert(exportedSubcastesCSV.includes('Amil') && exportedSubcastesCSV.includes('Bhaiband'));

// CSV Import of an existing record should UPDATE without duplicating
const subCountBefore = subcasteGotraService.getSubcastes().length;
const sampleCsv = `ID,Name,Region,Surnames\n1,Amil,Hyderabad,"Advani; Gidwani; TestImport"`;
const importResult = subcasteGotraService.importFromCSV(sampleCsv, 'SUBCASTE');
assert.strictEqual(importResult.updated, 1, 'Existing subcaste must be updated');
assert.strictEqual(importResult.inserted, 0, 'No duplicate record should be inserted');
assert.strictEqual(subcasteGotraService.getSubcastes().length, subCountBefore, 'Count must remain stable');

// Verify updated surnames
const updatedAmil = subcasteGotraService.getSubcastes().find((s) => s.name === 'Amil')!;
assert(updatedAmil.surnames.includes('TestImport'));

// 11. Verification Workflow & Status Transitions
subcasteGotraService.verifyRecord('COMMUNITY', newComm.id, 'NEEDS_REVIEW', 'Needs historical gazetteer confirmation');
assert.strictEqual(
  subcasteGotraService.getCommunities().find((c) => c.id === newComm.id)?.verificationStatus,
  'NEEDS_REVIEW'
);

subcasteGotraService.verifyRecord('COMMUNITY', newComm.id, 'DISPUTED', 'Disputed by council');
assert.strictEqual(
  subcasteGotraService.getCommunities().find((c) => c.id === newComm.id)?.verificationStatus,
  'DISPUTED'
);

subcasteGotraService.verifyRecord('COMMUNITY', newComm.id, 'VERIFIED');
assert.strictEqual(
  subcasteGotraService.getCommunities().find((c) => c.id === newComm.id)?.verificationStatus,
  'VERIFIED'
);

// 12. Audit Trail Logging
const auditLogs = subcasteGotraService.getAuditLogs();
assert(auditLogs.length > 5, 'Every administrative action must be recorded in the audit trail');
assert(auditLogs.some((l) => l.action === 'CREATE'));
assert(auditLogs.some((l) => l.action === 'UPDATE'));
assert(auditLogs.some((l) => l.action === 'VERIFY'));

// 13. Clean up test records
subcasteGotraService.deleteSurname(newSurname.id);
subcasteGotraService.deleteGotra(newGotra.id);
subcasteGotraService.deleteSubcaste(newSub.id);
subcasteGotraService.deleteCommunity(newComm.id);

// 14. Backward Compatibility API Verification
assert.strictEqual(typeof subcasteGotraService.getSubcastes, 'function');
assert.strictEqual(typeof subcasteGotraService.getGotras, 'function');
assert.strictEqual(typeof subcasteGotraService.getRules, 'function');
assert.strictEqual(typeof subcasteGotraService.updateRules, 'function');
assert.strictEqual(typeof subcasteGotraService.resetToDefaults, 'function');

console.log('✅ ALL 18 COMMUNITY & GOTRA MASTER TESTS PASSED CLEANLY!\n');
