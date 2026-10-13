import { deepEqual } from '../utils/memoUtils';
import { perfMonitor } from '../utils/perfMonitor';

export function runPerformanceProfilerTests(): { passed: number; failed: number; errors: string[] } {
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

  console.log('\n--- Running Performance Profiler & Deep Equality Tests ---');

  // Test 1: Fast Deep Equality Object Comparison
  const objA = { user: 'Rajesh', caste: 'Sindhi', filters: { verified: true, age: [24, 30] } };
  const objB = { user: 'Rajesh', caste: 'Sindhi', filters: { verified: true, age: [24, 30] } };
  assert(deepEqual(objA, objB) === true, 'deepEqual detects structurally identical objects with new memory references');

  // Test 2: Deep Equality Detects Differences
  const objC = { user: 'Rajesh', caste: 'Sindhi', filters: { verified: false, age: [24, 30] } };
  assert(deepEqual(objA, objC) === false, 'deepEqual detects nested value mutations correctly');

  // Test 3: Array Deep Equality
  const arr1 = [1, 2, { id: 'SM101', status: 'VERIFIED' }];
  const arr2 = [1, 2, { id: 'SM101', status: 'VERIFIED' }];
  assert(deepEqual(arr1, arr2) === true, 'deepEqual matches arrays containing complex objects');

  // Test 4: Performance Monitor Records Optimal Render
  perfMonitor.clear();
  const metric1 = perfMonitor.recordRender('DataTable', 4.5, { page: 1 }, { page: 1 });
  assert(metric1.componentName === 'DataTable', 'PerformanceMonitor tracks component name');
  assert(metric1.renderCount === 1, 'Initial render count is 1');
  assert(metric1.status === 'optimal', 'Render under 8ms is classified as optimal');

  // Test 5: Warning Threshold (8ms - 16.6ms)
  const metric2 = perfMonitor.recordRender('FilterBar', 12.0);
  assert(metric2.status === 'warning', 'Render between 8ms and 16.6ms is classified as warning');

  // Test 6: Critical Threshold (>16.6ms frame budget drop)
  const metric3 = perfMonitor.recordRender('HeavyMemberGrid', 24.8);
  assert(metric3.status === 'critical', 'Render exceeding 16.6ms is classified as critical frame drop');

  // Test 7: Running Averages and Max Calculations
  perfMonitor.recordRender('DataTable', 10.5);
  const dataTableMetrics = perfMonitor.getMetrics().find(m => m.componentName === 'DataTable');
  assert(dataTableMetrics?.renderCount === 2, 'Render count increments correctly');
  assert(dataTableMetrics?.maxDurationMs === 10.5, 'Max render duration tracks peak render time');
  assert(dataTableMetrics?.avgDurationMs === 7.5, 'Average render duration calculated accurately');

  // Test 8: Thrashing Detection (Rapid re-renders within 2s)
  for (let i = 0; i < 6; i++) {
    perfMonitor.recordRender('ThrashedComponent', 2.0);
  }
  const thrashedMetric = perfMonitor.getMetrics().find(m => m.componentName === 'ThrashedComponent');
  assert(thrashedMetric?.isThrashing === true, 'Rapid re-renders flagged as isThrashing');
  assert(thrashedMetric?.status === 'critical', 'Thrashing automatically escalates status to critical');

  // Test 9: Changed Props Diff Isolation
  const prevProps = { search: 'Chawla', subcaste: 'Lohana', page: 1 };
  const nextProps = { search: 'Chawla', subcaste: 'Bhaiband', page: 1 };
  const diffMetric = perfMonitor.recordRender('MembersFilter', 3.0, prevProps, nextProps);
  assert(diffMetric.lastChangedProps.length === 1, 'Isolates exact count of changed props');
  assert(diffMetric.lastChangedProps[0] === 'subcaste', 'Accurately identifies culprit prop that caused re-render');

  // Test 10: API Latency Recording
  perfMonitor.recordApi('/api/v1/admin/leads?page=1', 'GET', 142.5, 200);
  perfMonitor.recordApi('/api/v1/admin/members/verify', 'POST', 210.0, 200);
  const apis = perfMonitor.getApiMetrics();
  assert(apis.length === 2, 'API latency logs recorded');
  assert(apis[0].durationMs === 210.0, 'Most recent API logged at index 0');
  assert(apis[0].method === 'POST', 'API method normalized to uppercase');

  // Test 11: System Snapshot
  const snapshot = perfMonitor.getSystemSnapshot();
  assert(snapshot.totalComponentsTracked > 0, 'Snapshot aggregates tracked components');
  assert(snapshot.criticalComponentsCount >= 2, 'Critical count includes slow and thrashed components');
  assert(snapshot.avgApiLatencyMs > 0, 'Average API latency calculated across network requests');

  return { passed, failed, errors };
}

// Direct CLI execution support
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('performance-profiler.test')) {
  const results = runPerformanceProfilerTests();
  if (results.failed > 0) {
    process.exit(1);
  }
}
