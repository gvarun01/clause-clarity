
import { toast } from '@/components/ui/sonner';

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

// Function to handle Gemini API requests
async function callGeminiAPI(prompt: string, apiKey: string) {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
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

export async function analyzeClause(clause: string): Promise<AnalysisResponse> {
  try {
    // Get API key from localStorage (this would be set by user)
    const apiKey = localStorage.getItem('gemini_api_key');
    
    if (!apiKey) {
      toast.error('Please enter your Gemini API key in settings');
      throw new Error('Gemini API key not found');
    }

    // Create prompts for the different analysis parts
    const simplificationPrompt = `
      I need you to analyze and simplify the following legal clause in plain English. Provide a clear, concise explanation that a non-lawyer can understand:
      
      "${clause}"
      
      Respond with ONLY the simplified explanation, without any additional text.
    `;
    
    const riskyTermsPrompt = `
      Analyze the following legal clause and identify potentially risky terms that could be unfavorable to one party:
      
      "${clause}"
      
      For each risky term you identify, provide:
      1. The specific term/word (just the word or short phrase)
      2. A severity level (high, moderate, or low)
      3. A brief explanation of why this term is risky
      
      Format your response strictly as JSON with this structure:
      [
        {
          "term": "word or short phrase",
          "severity": "high/moderate/low",
          "explanation": "brief explanation"
        },
        {...}
      ]
      
      If no risky terms are found, return an empty array: []
    `;

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

    return result;
  } catch (error) {
    console.error('Analysis error:', error);
    toast.error('Failed to analyze the legal clause');
    throw error;
  }
}

export async function submitFollowupQuestion(question: string, originalClause: string): Promise<FollowupResponse> {
  try {
    // Get API key from localStorage
    const apiKey = localStorage.getItem('gemini_api_key');
    
    if (!apiKey) {
      toast.error('Please enter your Gemini API key in settings');
      throw new Error('Gemini API key not found');
    }
    
    const prompt = `
      I previously analyzed this legal clause: "${originalClause}"
      
      Now I have a follow-up question: "${question}"
      
      Please provide a clear, concise answer to my question about this legal clause. Give me an accurate legal perspective, but explain it in plain language that a non-lawyer can understand.
    `;
    
    toast.info('Getting answer to your question...');
    const answer = await callGeminiAPI(prompt, apiKey);
    
    return { answer: answer.trim() };
  } catch (error) {
    console.error('Follow-up question error:', error);
    toast.error('Failed to submit follow-up question');
    throw error;
  }
}
