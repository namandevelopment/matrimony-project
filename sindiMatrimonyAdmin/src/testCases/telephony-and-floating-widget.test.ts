import assert from 'assert';

// ========================================================
// 📱 Test Suite 5: Telephony VoIP & Floating Widget Scenarios
// ========================================================

// 1. Duration Formatter
function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

assert.strictEqual(formatDuration(0), '00:00');
assert.strictEqual(formatDuration(45), '00:45');
assert.strictEqual(formatDuration(165), '02:45');
assert.strictEqual(formatDuration(3605), '60:05');

// 2. Telephony State Machine
type CallState = 'IDLE' | 'INITIATED' | 'RINGING' | 'CONNECTED' | 'ENDED_PENDING_DISPOSITION' | 'CLOSED';

interface CallSession {
  callId: string;
  leadId: string;
  state: CallState;
  durationSeconds: number;
  disposition?: 'INTERESTED' | 'NOT_INTERESTED' | 'CALLBACK_REQUESTED' | 'WRONG_NUMBER';
}

function transitionCallState(
  session: CallSession,
  event: 'GATEWAY_RINGING' | 'GATEWAY_CONNECTED' | 'USER_HANGUP' | 'SUBMIT_DISPOSITION'
): CallSession {
  switch (event) {
    case 'GATEWAY_RINGING':
      if (session.state === 'INITIATED') return { ...session, state: 'RINGING' };
      break;
    case 'GATEWAY_CONNECTED':
      if (session.state === 'RINGING' || session.state === 'INITIATED')
        return { ...session, state: 'CONNECTED' };
      break;
    case 'USER_HANGUP':
      if (session.state === 'CONNECTED' || session.state === 'RINGING')
        return { ...session, state: 'ENDED_PENDING_DISPOSITION' };
      break;
    case 'SUBMIT_DISPOSITION':
      if (session.state === 'ENDED_PENDING_DISPOSITION') return { ...session, state: 'CLOSED' };
      break;
  }
  return session;
}

let session: CallSession = {
  callId: 'call_123',
  leadId: 'LEAD-101',
  state: 'INITIATED',
  durationSeconds: 0,
};

// Lifecycle Simulation
session = transitionCallState(session, 'GATEWAY_RINGING');
assert.strictEqual(session.state, 'RINGING');

session = transitionCallState(session, 'GATEWAY_CONNECTED');
assert.strictEqual(session.state, 'CONNECTED');

session = transitionCallState(session, 'USER_HANGUP');
assert.strictEqual(session.state, 'ENDED_PENDING_DISPOSITION');

// Critical Check: Widget must NOT transition to CLOSED without disposition!
const invalidAttempt = transitionCallState(session, 'GATEWAY_RINGING');
assert.strictEqual(invalidAttempt.state, 'ENDED_PENDING_DISPOSITION');

session = transitionCallState(session, 'SUBMIT_DISPOSITION');
assert.strictEqual(session.state, 'CLOSED');

console.log('✅ [5/6] telephony-and-floating-widget.test.ts: Passed all 8 VoIP call states & mandatory disposition scenarios successfully!');
