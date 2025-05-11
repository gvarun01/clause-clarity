
import { toast } from '@/components/ui/sonner';
import { getGeminiApiKey, callGeminiAPI } from '../gemini/api-client';
import { createFollowupPrompt } from '../prompts/legal-analysis';
import type { FollowupResponse } from '../types';

export async function submitFollowupQuestion(question: string, originalClause: string): Promise<FollowupResponse> {
  try {
    // Get API key
    const apiKey = await getGeminiApiKey();
    
    if (!apiKey) {
      toast.error('Please enter your Gemini API key in settings');
      throw new Error('Gemini API key not found');
    }
    
    // Create prompt for followup question
    const prompt = createFollowupPrompt(originalClause, question);
    
    toast.info('Getting answer to your question...');
    const answer = await callGeminiAPI(prompt, apiKey);
    
    return { answer: answer.trim() };
  } catch (error) {
    console.error('Follow-up question error:', error);
    toast.error('Failed to submit follow-up question');
    throw error;
  }
}
