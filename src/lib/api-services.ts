
// Re-export services from their individual modules
// This maintains backward compatibility with existing imports

export type { AnalysisResponse, FollowupResponse } from './types';
export { analyzeClause } from './services/analysis-service';
export { submitFollowupQuestion } from './services/followup-service';
