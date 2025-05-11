
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

// Function to get the current user's Gemini API key
export async function getGeminiApiKey() {
  // First check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // Try to get API key from Supabase
    const { data, error } = await supabase
      .from('api_keys')
      .select('gemini_api_key')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data && !error) {
      return data.gemini_api_key;
    }
  }
  
  // Fallback to localStorage for backward compatibility
  return localStorage.getItem('gemini_api_key');
}

// Function to handle Gemini API requests
export async function callGeminiAPI(prompt: string, apiKey: string | null) {
  if (!apiKey) {
    throw new Error('No API key provided');
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from Gemini API');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
