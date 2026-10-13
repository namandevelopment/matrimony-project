/**
 * 🚀 Sindhi Matrimony Admin Portal — Master Test Suite Runner
 * Executes all automated scenario test suites across Auth, CRM, KYC, Finance, VoIP, and UI Navigation.
 */

console.log('================================================================');
console.log('🧪 SINDHI MATRIMONY ADMIN PORTAL — AUTOMATED TEST SUITE');
console.log('================================================================\n');

async function runAll() {
  const startTime = Date.now();

  try {
    // 1. Auth & RBAC
    await import('./auth-and-rbac.test');

    // 2. Leads & CRM Lifecycle
    await import('./leads-crm-flow.test');

    // 3. Members & KYC Moderation
    await import('./members-and-kyc.test');

    // 4. Finance & Refunds
    await import('./finance-and-refunds.test');

    // 5. Telephony VoIP & Floating Widget
    await import('./telephony-and-floating-widget.test');

    // 6. Navigation & Responsiveness
    await import('./responsive-navigation-contract.test');

    // 7. Performance Profiler & Fast Deep Equality
    const { runPerformanceProfilerTests } = await import('./performance-profiler.test');
    const perfResult = runPerformanceProfilerTests();
    if (perfResult.failed > 0) {
      throw new Error(`Performance profiler test failed: ${perfResult.errors.join(', ')}`);
    }

    // 8. Modals & Loaders Hooks Lifecycle
    const { runModalsAndLoadersTests } = await import('./modals-and-loaders.test');
    const modalResult = runModalsAndLoadersTests();
    if (modalResult.failed > 0) {
      throw new Error(`Modal & Loader hooks test failed: ${modalResult.errors.join(', ')}`);
    }

    // 9. Employee 360° Management & Assisted Matchmaking
    await import('./employee-360-and-matchmaking.test');

    // 10. Toast Message System
    await import('./toast-system.test');

    // 11. Input Validations & Sanitization Suite
    await import('./validations.test');

    // 12. Membership Plans Configuration & Management Suite
    await import('./membership-plans.test');

    // 13. useInputs Form Hook Performance & Referential Stability Suite
    const { runUseInputsTests } = await import('./use-inputs-hook.test');
    const inputResult = runUseInputsTests();
    if (inputResult.failed > 0) {
      throw new Error(`useInputs hook test failed: ${inputResult.errors.join(', ')}`);
    }

    // 14. Add Member Screen Form & useInputs Validation Suite
    await import('./add-member-form.test');

    // 15. Universal Multi-Field Form Integration & useInputs Validation Suite
    await import('./forms-use-inputs.test');

    // 16. Comprehensive Community, Caste, Subcaste, Gotra & Surname Master Suite
    await import('./community-caste-master.test');

    // 17. Hybrid Matchmaking, Admin Suggestions & Duplicate Prevention Suite
    await import('./hybrid-matchmaking-and-deduplication.test');

    // 18. 1-Click WhatsApp Biodata Maker & Formatter Suite
    await import('./whatsapp-biodata-maker.test');

    // 19. Marketing, Notifications & Dynamic Popup Management Suite
    await import('./marketing-and-campaigns.test');

    const duration = Date.now() - startTime;
    console.log('\n================================================================');
    console.log(`🎉 ALL 19 TEST SUITES PASSED SUCCESSFULLY IN ${duration}ms!`);
    console.log('================================================================');
  } catch (error) {
    console.error('\n❌ TEST RUNNER FAILED:', error);
    process.exit(1);
  }
}

runAll();
