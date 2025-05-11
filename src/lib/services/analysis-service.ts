
import { toast } from '@/components/ui/sonner';
import { getGeminiApiKey, callGeminiAPI } from '../gemini/api-client';
import { createSimplificationPrompt, createRiskyTermsPrompt } from '../prompts/legal-analysis';
import { saveAnalysisToDatabase } from '../db/analysis-repository';
import type { AnalysisResponse } from '../types';

export async function analyzeClause(clause: string): Promise<AnalysisResponse> {
  try {
    // Get API key
    const apiKey = await getGeminiApiKey();
    
    if (!apiKey) {
      toast.error('Please enter your Gemini API key in settings');
      throw new Error('Gemini API key not found');
    }

    // Prepare prompts
    const simplificationPrompt = createSimplificationPrompt(clause);
    const riskyTermsPrompt = createRiskyTermsPrompt(clause);

    // Make parallel API calls for efficiency
    toast.info('Analyzing your legal clause...');
    const [simplifiedExplanation, riskyTermsResponse] = await Promise.all([
      callGeminiAPI(simplificationPrompt, apiKey),
      callGeminiAPI(riskyTermsPrompt, apiKey)
    ]);

    // Parse the risky terms JSON
    let riskyTerms = [];
    try {
      // Find JSON content by looking for array brackets
      const jsonMatch = riskyTermsResponse.match(/\[\s*\{.*\}\s*\]/s);
      const jsonStr = jsonMatch ? jsonMatch[0] : '[]';
      riskyTerms = JSON.parse(jsonStr);
      
      // Ensure correct format for each term
      riskyTerms = riskyTerms.map(term => ({
        term: term.term || '',
        severity: ['high', 'moderate', 'low'].includes(term.severity?.toLowerCase()) 
          ? term.severity.toLowerCase() 
          : 'moderate',
        explanation: term.explanation || ''
      }));
    } catch (error) {
      console.error('Failed to parse risky terms:', error);
      riskyTerms = [];
    }

    const result: AnalysisResponse = {
      simplifiedExplanation: simplifiedExplanation.trim(),
      riskyTerms: riskyTerms
    };
    
    // Store analysis in Supabase
    await saveAnalysisToDatabase(clause, result);

    return result;
  } catch (error) {
    console.error('Analysis error:', error);
    toast.error('Failed to analyze the legal clause');
    throw error;
  }
}
