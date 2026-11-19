// explain.ts — orchestrates the explain feature. NEVER throws, NEVER changes
// the availability status. The deterministic checker in src/availability.js
// remains the only source of truth for Available/Unavailable.

import { validateExplainInput, validateExplanation } from './contract';
import type { ExplainInput, Explanation } from './contract';
import { mockExplanationFor } from './mockAdapter';
import type { SimulateMode } from './mockAdapter';

export type ExplainSource = 'ai-mock' | 'fallback' | 'rejected';

export interface ExplainResult {
  explanation: string;
  source: ExplainSource;
}

export interface ExplainAdapter {
  (input: ExplainInput, simulate: SimulateMode): Promise<Explanation>;
}

function fallbackText(input: ExplainInput): string {
  return mockExplanationFor(input.reasonCode);
}

export async function explainAvailability(
  rawInput: unknown,
  adapter: ExplainAdapter,
  simulate: SimulateMode = 'ok',
  timeoutMs: number = 3000
): Promise<ExplainResult> {
  const validated = validateExplainInput(rawInput);
  if (!validated.ok) {
    return { explanation: 'The explanation request was invalid.', source: 'rejected' };
  }
  const input = validated.value;

  try {
    const raced = await Promise.race([
      adapter(input, simulate),
      new Promise<never>((_resolve, reject) =>
        setTimeout(() => reject(new Error('EXPLAIN_TIMEOUT')), timeoutMs)
      ),
    ]);

    const checked = validateExplanation(raced, input.isAvailable, {
      start: input.start,
      end: input.end,
    });
    if (!checked.ok) {
      return { explanation: fallbackText(input), source: 'fallback' };
    }
    return { explanation: checked.value.explanation, source: 'ai-mock' };
  } catch {
    return { explanation: fallbackText(input), source: 'fallback' };
  }
}
