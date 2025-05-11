
// Legal analysis prompts
export const createSimplificationPrompt = (clause: string): string => `
  I need you to analyze and simplify the following legal clause in plain English. Provide a clear, concise explanation that a non-lawyer can understand:
  
  "${clause}"
  
  Respond with ONLY the simplified explanation, without any additional text.
`;

export const createRiskyTermsPrompt = (clause: string): string => `
  Analyze the following legal clause and identify only genuinely problematic terms that could create legal risks:
  
  "${clause}"
  
  IMPORTANT GUIDELINES:
  - Only identify terms that are truly problematic in a legal context
  - If the text is too short (less than 15 words) or doesn't contain actual legal language, return an empty array
  - Don't force finding risky terms if none genuinely exist
  - Focus on terms with actual legal implications like indemnification, liability, termination, etc.
  - Ignore common words unless they create specific legal issues in this context
  
  For each legitimate risky term, provide:
  1. The specific term/word/phrase (just the relevant text)
  2. A severity level (high, moderate, or low)
  3. A brief explanation of why this term creates legal risk
  
  Format your response strictly as JSON with this structure:
  [
    {
      "term": "specific legal term or phrase",
      "severity": "high/moderate/low",
      "explanation": "brief explanation of legal risk"
    },
    {...}
  ]
  
  If no risky terms are found or if the text is too short for meaningful analysis, return an empty array: []
`;

export const createFollowupPrompt = (originalClause: string, question: string): string => `
  I previously analyzed this legal clause: "${originalClause}"
  
  Now I have a follow-up question: "${question}"
  
  Please provide a clear, concise answer to my question about this legal clause. Give me an accurate legal perspective, but explain it in plain language that a non-lawyer can understand.
`;
