// mockAdapter.ts — MOCK LLM ADAPTER (no network, no API key, deterministic).
// This is NOT a real AI service. It simulates one, including failure modes,
// for classroom testing.

import type { ExplainInput } from './contract';

export type SimulateMode = 'ok' | 'timeout' | 'error' | 'contradict' | 'too_long';

const FALLBACK_TEXTS: Record<ExplainInput['reasonCode'], string> = {
  FREE: 'Room A-101 is free for the requested time slot, so you can book it.',
  OVERLAP:
    'The requested time slot overlaps an existing booking, so the room is not available.',
  BLOCKED: 'The room is currently blocked, so it is not available for booking.',
  INVALID_TIME: 'The start and end times are not a valid interval, so the request was rejected.',
  PAST_TIME: 'The requested start time is in the past, so the request was rejected.',
  TOO_LONG: 'The requested slot is longer than the maximum of 120 minutes, so it was rejected.',
};

export function mockExplanationFor(reasonCode: ExplainInput['reasonCode']): string {
  return FALLBACK_TEXTS[reasonCode];
}

export interface MockAdapter {
  (input: ExplainInput, simulate: SimulateMode): Promise<{ explanation: string }>;
}

export const mockAdapter: MockAdapter = async (input, simulate) => {
  switch (simulate) {
    case 'timeout':
      return new Promise((_resolve, reject) => {
        setTimeout(() => reject(new Error('MOCK_TIMEOUT')), 50);
      });
    case 'error':
      return Promise.reject(new Error('MOCK_ADAPTER_ERROR'));
    case 'contradict':
      return Promise.resolve({
        explanation: input.isAvailable
          ? 'This slot is unavailable and cannot be booked.'
          : 'This slot is available, please proceed with booking.',
      });
    case 'too_long':
      return Promise.resolve({
        explanation:
          'The room is not available because the requested time slot overlaps an existing booking ' +
          'that has already been confirmed for that period, and therefore the system cannot accept ' +
          'the request. Additionally, the policy limits bookings to a maximum duration of 120 minutes ' +
          'per reservation, and any request exceeding this limit must be rejected by the checker ' +
          'regardless of the rest of the schedule on that particular day.',
      });
    case 'ok':
    default: {
      const text = mockExplanationFor(input.reasonCode);
      return Promise.resolve({ explanation: text });
    }
  }
};
