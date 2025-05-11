
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import type { AnalysisResponse } from '../types';

// Store analysis in Supabase if user is logged in
export async function saveAnalysisToDatabase(clause: string, analysis: AnalysisResponse): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;
  
  try {
    // Convert AnalysisResponse to a JSON object that's compatible with Supabase's Json type
    const analysisJson = {
      simplifiedExplanation: analysis.simplifiedExplanation,
      riskyTerms: analysis.riskyTerms
    } as Json;
    
    await supabase.from('chat_history').insert({
      user_id: user.id,
      legal_clause: clause,
      analysis: analysisJson
    });
  } catch (error) {
    console.error('Failed to save analysis to database:', error);
    // Continue even if saving fails
  }
}
