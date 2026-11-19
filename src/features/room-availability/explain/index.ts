export { getReasonCode } from './reason';
export type { ReasonCode } from './reason';
export { validateExplainInput, validateExplanation } from './contract';
export type { ExplainInput, Explanation } from './contract';
export { PROMPT_V1, PROMPT_V2, PROMPT_V3, buildMessages } from './prompts';
export { mockAdapter, mockExplanationFor } from './mockAdapter';
export type { SimulateMode } from './mockAdapter';
export { explainAvailability } from './explain';
export type { ExplainResult, ExplainSource } from './explain';
