
// Define common types for the application
export interface AnalysisResponse {
  simplifiedExplanation: string;
  riskyTerms: {
    term: string;
    severity: 'high' | 'moderate' | 'low';
    explanation: string;
  }[];
}

export interface FollowupResponse {
  answer: string;
}
