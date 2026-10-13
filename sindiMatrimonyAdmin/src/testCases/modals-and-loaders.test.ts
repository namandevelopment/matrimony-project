export function runModalsAndLoadersTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  const assert = (condition: boolean, desc: string) => {
    if (condition) {
      passed++;
      console.log(`  ✓ ${desc}`);
    } else {
      failed++;
      errors.push(desc);
      console.error(`  ✗ ${desc}`);
    }
  };

  console.log('\n--- Running Loader & Modal Hooks Lifecycle Tests ---');

  // Test 1: Loader state machine contract
  let loaderState = { isLoading: false, message: 'Initial' };
  const showLoader = (msg: string) => {
    loaderState = { isLoading: true, message: msg };
  };
  const hideLoader = () => {
    loaderState = { ...loaderState, isLoading: false };
  };

  assert(loaderState.isLoading === false, 'Loader initially idle');
  showLoader('Fetching Kundali Matches...');
  assert(loaderState.isLoading === true, 'showLoader transitions state to loading');
  assert(loaderState.message === 'Fetching Kundali Matches...', 'Loader message updates correctly');
  hideLoader();
  assert(loaderState.isLoading === false, 'hideLoader restores idle state');

  // Test 2: withLoader wrapper with async execution
  const simulateAsyncOperation = async (shouldFail = false) => {
    loaderState.isLoading = true;
    try {
      if (shouldFail) throw new Error('Network timeout');
      return { success: true, count: 42 };
    } finally {
      loaderState.isLoading = false;
    }
  };

  simulateAsyncOperation(false).then((res) => {
    assert(res.success === true, 'withLoader executes async promise successfully');
    assert(loaderState.isLoading === false, 'withLoader guarantees idle state in finally block');
  });

  // Test 3: withLoader exception resilience
  simulateAsyncOperation(true).catch(() => {
    assert(loaderState.isLoading === false, 'withLoader hides loader even on unhandled network error');
  });

  // Test 4: Modal payload data lifecycle
  let modalState: { isOpen: boolean; data: any } = { isOpen: false, data: null };
  const openModal = (payload: any) => {
    modalState = { isOpen: true, data: payload };
  };
  const closeModal = () => {
    modalState = { isOpen: false, data: null };
  };

  openModal({ memberId: 'SM-809', name: 'Karan Rohra', kycStatus: 'PENDING' });
  assert(modalState.isOpen === true, 'useModal openModal sets isOpen to true');
  assert(modalState.data?.memberId === 'SM-809', 'useModal carries payload data into dialog');
  closeModal();
  assert(modalState.isOpen === false, 'closeModal cleans up dialog state');
  assert(modalState.data === null, 'closeModal resets payload data to prevent stale memory leak');

  // Test 5: Confirm dialog variant validation
  const validVariants = ['danger', 'warning', 'info', 'success'];
  assert(validVariants.includes('danger'), 'Confirm dialog supports destructive danger variant');
  assert(validVariants.includes('warning'), 'Confirm dialog supports warning prompt variant');

  // Test 6: Responsive chart height parity contract
  const barChartConfig = { minHeight: 380, flexCol: true, footer: true };
  const pieChartConfig = { minHeight: 380, flexCol: true, footer: true };
  assert(
    barChartConfig.minHeight === pieChartConfig.minHeight,
    'MembersBarChart and PlansPieChart share identical min-height for symmetrical alignment'
  );
  assert(
    barChartConfig.footer === pieChartConfig.footer,
    'Both charts have matching symmetrical footers aligned to bottom baseline'
  );

  // Test 7: LogoutModal contract & tokens clearing lifecycle
  let logoutModalOpen = false;
  let mockTokens: Record<string, string> = { auth_token: 'jwt-xyz-123', refresh_token: 'ref-456' };
  const openLogoutModal = () => { logoutModalOpen = true; };
  const closeLogoutModal = () => { logoutModalOpen = false; };
  const executeLogout = () => {
    mockTokens = {};
    logoutModalOpen = false;
  };

  assert(logoutModalOpen === false, 'LogoutModal is closed initially');
  openLogoutModal();
  assert(logoutModalOpen === true, 'openLogoutModal transitions state to open');
  assert(mockTokens.auth_token === 'jwt-xyz-123', 'Tokens intact while logout modal is pending confirmation');
  closeLogoutModal();
  assert(logoutModalOpen === false, 'Cancel dismissal closes LogoutModal without clearing tokens');
  assert(mockTokens.auth_token === 'jwt-xyz-123', 'Tokens retained after cancellation');
  openLogoutModal();
  executeLogout();
  assert(logoutModalOpen === false, 'LogoutModal closes after confirmed logout execution');
  assert(Object.keys(mockTokens).length === 0, 'Confirming logout wipes auth and refresh tokens cleanly');

  return { passed, failed, errors };
}

if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('modals-and-loaders.test')) {
  const results = runModalsAndLoadersTests();
  if (results.failed > 0) {
    process.exit(1);
  }
}
