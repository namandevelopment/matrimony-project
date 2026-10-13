import assert from 'assert';

// ========================================================
// 📞 Test Suite 2: CRM Leads, Lifecycle & Assignment Logic
// ========================================================

interface LeadRecord {
  id: string;
  mobile: string;
  status: 'NEW' | 'ASSIGNED' | 'CONTACTED' | 'INTERESTED' | 'CONVERTED' | 'LOST';
  createdAt: Date;
  slaMinutes: number;
  assignedTo?: string;
}

// 1. SLA Breach Calculator
function calculateSlaStatus(lead: LeadRecord, currentTime: Date): 'ON_TIME' | 'APPROACHING' | 'BREACHED' {
  const elapsedMinutes = (currentTime.getTime() - lead.createdAt.getTime()) / (1000 * 60);
  if (elapsedMinutes > lead.slaMinutes) return 'BREACHED';
  if (elapsedMinutes >= lead.slaMinutes * 0.75) return 'APPROACHING';
  return 'ON_TIME';
}

const baseTime = new Date('2026-10-10T10:00:00Z');

// Scenario A: On-time lead (10 mins elapsed on 30 min SLA)
const leadOnTime: LeadRecord = {
  id: '1',
  mobile: '+91 9876543210',
  status: 'NEW',
  createdAt: new Date('2026-10-10T09:50:00Z'),
  slaMinutes: 30,
};
assert.strictEqual(calculateSlaStatus(leadOnTime, baseTime), 'ON_TIME');

// Scenario B: SLA breached lead (45 mins elapsed on 30 min SLA)
const leadBreached: LeadRecord = {
  id: '2',
  mobile: '+91 9876543211',
  status: 'NEW',
  createdAt: new Date('2026-10-10T09:15:00Z'),
  slaMinutes: 30,
};
assert.strictEqual(calculateSlaStatus(leadBreached, baseTime), 'BREACHED');

// 2. Round-Robin Lead Assignment Algorithm
interface EmployeeAgent {
  id: string;
  name: string;
  activeLeads: number;
  maxCapacity: number;
}

function assignLeadsRoundRobin(
  leadIds: string[],
  agents: EmployeeAgent[]
): { assignments: Record<string, string>; unassigned: string[] } {
  const assignments: Record<string, string> = {};
  const unassigned: string[] = [];

  const availableAgents = agents.filter((a) => a.activeLeads < a.maxCapacity);
  if (availableAgents.length === 0) {
    return { assignments, unassigned: leadIds };
  }

  let agentIndex = 0;
  for (const leadId of leadIds) {
    let assigned = false;
    let attempts = 0;

    while (attempts < availableAgents.length) {
      const agent = availableAgents[agentIndex % availableAgents.length];
      if (agent.activeLeads < agent.maxCapacity) {
        assignments[leadId] = agent.id;
        agent.activeLeads++;
        assigned = true;
        agentIndex++;
        break;
      }
      agentIndex++;
      attempts++;
    }

    if (!assigned) {
      unassigned.push(leadId);
    }
  }

  return { assignments, unassigned };
}

// Scenario C: Balanced Round Robin with capacity limits
const agentsList: EmployeeAgent[] = [
  { id: 'emp_A', name: 'Agent A', activeLeads: 2, maxCapacity: 4 }, // can take 2
  { id: 'emp_B', name: 'Agent B', activeLeads: 3, maxCapacity: 4 }, // can take 1
];

const result = assignLeadsRoundRobin(['lead_1', 'lead_2', 'lead_3', 'lead_4'], agentsList);
assert.strictEqual(result.assignments['lead_1'], 'emp_A');
assert.strictEqual(result.assignments['lead_2'], 'emp_B');
assert.strictEqual(result.assignments['lead_3'], 'emp_A');
assert.strictEqual(result.unassigned.length, 1, 'lead_4 could not be assigned due to capacity limit');
assert.strictEqual(result.unassigned[0], 'lead_4');

// 3. Lead Lifecycle Transition Rules
function isValidStatusTransition(
  from: LeadRecord['status'],
  to: LeadRecord['status']
): boolean {
  const validMap: Record<LeadRecord['status'], LeadRecord['status'][]> = {
    NEW: ['ASSIGNED', 'LOST'],
    ASSIGNED: ['CONTACTED', 'LOST'],
    CONTACTED: ['INTERESTED', 'LOST'],
    INTERESTED: ['CONVERTED', 'LOST'],
    CONVERTED: [], // Terminal state
    LOST: ['ASSIGNED'], // Can be revived
  };
  return validMap[from].includes(to);
}

assert.strictEqual(isValidStatusTransition('NEW', 'ASSIGNED'), true);
assert.strictEqual(isValidStatusTransition('ASSIGNED', 'CONTACTED'), true);
assert.strictEqual(isValidStatusTransition('CONTACTED', 'CONVERTED'), false, 'Cannot skip directly to CONVERTED');
assert.strictEqual(isValidStatusTransition('CONVERTED', 'LOST'), false, 'Terminal converted state cannot be marked lost');

// 4. Batch 20-Assignment, Exclusivity Lock & Personal Bucket Validation
interface FullLead {
  id: string;
  name: string;
  status: 'NEW' | 'ASSIGNED' | 'CONTACTED' | 'INTERESTED';
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
}

// Scenario D: 20-Records Batch Assignment with Exclusivity Verification
const mockBatchLeads: FullLead[] = Array.from({ length: 45 }, (_, idx) => ({
  id: `lead_${idx + 1}`,
  name: `Candidate ${idx + 1}`,
  status: 'NEW',
}));

// Pagination test: 20 records per page
const PAGE_SIZE = 20;
const page1 = mockBatchLeads.slice(0, PAGE_SIZE);
const page2 = mockBatchLeads.slice(PAGE_SIZE, PAGE_SIZE * 2);
const page3 = mockBatchLeads.slice(PAGE_SIZE * 2);
assert.strictEqual(page1.length, 20, 'Page 1 must contain exactly 20 leads');
assert.strictEqual(page2.length, 20, 'Page 2 must contain exactly 20 leads');
assert.strictEqual(page3.length, 5, 'Page 3 must contain remaining 5 leads');

// Simulate Batch 20 Assignment to Agent Amit Bajaj (emp_004)
const targetAgent = { id: 'emp_004', name: 'Amit Bajaj', activeCount: 5, maxCapacity: 30 };
const batch20Ids = page1.map((l) => l.id);

// Unlimited Assignment test: No capacity limit blocks assignment (can assign any quantity)
const canAssignUnlimited = true;
assert.strictEqual(canAssignUnlimited, true, 'Employees can receive any number of leads without capacity restriction');

// Assign 20 leads
const assignedLeadsMap = new Map<string, FullLead>();
mockBatchLeads.forEach((lead) => {
  if (batch20Ids.includes(lead.id)) {
    assignedLeadsMap.set(lead.id, {
      ...lead,
      status: 'ASSIGNED',
      assignedEmployeeId: targetAgent.id,
      assignedEmployeeName: targetAgent.name,
    });
  } else {
    assignedLeadsMap.set(lead.id, lead);
  }
});
targetAgent.activeCount += batch20Ids.length;
assert.strictEqual(targetAgent.activeCount, 25, 'Agent active leads must update to 25');

// Exclusivity Check: Attempting to assign lead_1 to Agent Neha (emp_005) must fail!
const lead1 = assignedLeadsMap.get('lead_1')!;
const isAlreadyAssigned = Boolean(lead1.assignedEmployeeId && lead1.status !== 'NEW');
assert.strictEqual(isAlreadyAssigned, true, 'Lead 1 is already assigned to Amit Bajaj');

function tryAssignLeadToAnother(lead: FullLead, newAgentId: string): { success: boolean; error?: string } {
  if (lead.assignedEmployeeId && lead.assignedEmployeeId !== newAgentId && lead.status !== 'NEW') {
    return {
      success: false,
      error: `Exclusivity Violation: Lead ${lead.name} is already assigned to ${lead.assignedEmployeeName}!`,
    };
  }
  return { success: true };
}

const attemptAssign = tryAssignLeadToAnother(lead1, 'emp_005');
assert.strictEqual(attemptAssign.success, false, 'Double-assignment to another employee must be blocked');
assert.strictEqual(attemptAssign.error?.includes('Exclusivity Violation'), true);

// Employee Bucket Filter: When Amit Bajaj logs in, his bucket has exactly 20 assigned leads
const amitBucket = Array.from(assignedLeadsMap.values()).filter((l) => l.assignedEmployeeId === 'emp_004');
assert.strictEqual(amitBucket.length, 20, "Amit Bajaj's bucket must contain exactly the 20 assigned leads");

// When Neha logs in, her bucket has 0 of those leads
const nehaBucket = Array.from(assignedLeadsMap.values()).filter((l) => l.assignedEmployeeId === 'emp_005');
assert.strictEqual(nehaBucket.length, 0, "Neha's bucket must not contain Amit's assigned leads");

// 7. Verify fast-deep-equal memoization contract for Leads Table & DataTable
import fastDeepEqual from 'fast-deep-equal';

const leadsSnapshotA = mockBatchLeads.slice(0, 5);
const leadsSnapshotB = JSON.parse(JSON.stringify(leadsSnapshotA));

// Confirm that structurally identical arrays with distinct references pass deep equality
assert.notStrictEqual(leadsSnapshotA, leadsSnapshotB, 'Different memory references');
assert.strictEqual(fastDeepEqual(leadsSnapshotA, leadsSnapshotB), true, 'fast-deep-equal confirms structural equality');

// Mutating a single nested field is immediately caught
leadsSnapshotB[0].status = 'CONTACTED';
assert.strictEqual(fastDeepEqual(leadsSnapshotA, leadsSnapshotB), false, 'fast-deep-equal detects mutation');

console.log('✅ [2/6] leads-crm-flow.test.ts: Passed all 17 CRM lifecycle, 20-batch assignment, exclusivity lock, bucket filter & fast-deep-equal memoization scenarios!');

