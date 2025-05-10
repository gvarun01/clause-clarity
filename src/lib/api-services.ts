
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

export async function analyzeClause(clause: string): Promise<AnalysisResponse> {
  try {
    // This would be a real API call in production
    // const response = await fetch('/api/analyze', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ clause }),
    // });
    
    // if (!response.ok) throw new Error('Failed to analyze clause');
    // return await response.json();
    
    // For now, let's simulate an API response
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    
    // Create a realistic mock response based on the input
    const hasIndemnify = clause.toLowerCase().includes('indemnify');
    const hasLiability = clause.toLowerCase().includes('liability');
    const hasWarranty = clause.toLowerCase().includes('warranty');
    const hasArbitration = clause.toLowerCase().includes('arbitration');
    
    return {
      simplifiedExplanation: `This legal clause ${hasIndemnify ? 'requires you to cover financial losses' : ''} ${hasLiability ? 'limits what the other party is responsible for' : ''} ${hasWarranty ? 'describes what guarantees are or aren\'t being made' : ''} ${hasArbitration ? 'requires disputes to be settled outside of court' : ''}.${!hasIndemnify && !hasLiability && !hasWarranty && !hasArbitration ? 'appears to be discussing contractual terms related to the agreement between parties. It establishes certain responsibilities and limitations, though without more specific legal terminology it\'s difficult to identify particular risks.' : ''}`,
      riskyTerms: [
        ...(hasIndemnify ? [{
          term: "indemnify",
          severity: "high" as const,
          explanation: "This means you agree to pay for any financial losses or legal costs the other party might face."
        }] : []),
        ...(hasLiability ? [{
          term: "liability",
          severity: "high" as const,
          explanation: "The other party is limiting or removing their responsibility for potential problems or damages."
        }] : []),
        ...(hasWarranty ? [{
          term: "warranty",
          severity: "moderate" as const,
          explanation: "This defines what guarantees are (or more likely aren't) being made about products or services."
        }] : []),
        ...(hasArbitration ? [{
          term: "arbitration",
          severity: "moderate" as const,
          explanation: "Disputes must be resolved through arbitration rather than court, which may limit your legal options."
        }] : []),
      ]
    };
  } catch (error) {
    console.error('Analysis error:', error);
    toast.error('Failed to analyze the legal clause');
    throw error;
  }
}

export async function submitFollowupQuestion(question: string, originalClause: string): Promise<FollowupResponse> {
  try {
    // This would be a real API call in production
    // const response = await fetch('/api/followup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ question, originalClause }),
    // });
    
    // if (!response.ok) throw new Error('Failed to submit follow-up question');
    // return await response.json();
    
    // For now, let's simulate an API response
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    // Generate a response based on common legal questions
    if (question.toLowerCase().includes('indemnify')) {
      return {
        answer: "To 'indemnify' means you agree to compensate the other party for any losses, damages, or legal expenses they might incur. This is a high-risk term because it can create significant financial obligations for you, potentially without limits."
      };
    } else if (question.toLowerCase().includes('enforceable')) {
      return {
        answer: "Enforceability depends on jurisdiction and specific circumstances. Generally, clauses are enforceable if both parties knowingly agreed to them, they don't violate public policy, and they're not unconscionable. However, some jurisdictions may have specific protections that override certain contract provisions."
      };
    } else if (question.toLowerCase().includes('void') || question.toLowerCase().includes('cancel')) {
      return {
        answer: "To void or cancel an agreement typically requires either: 1) mutual agreement by all parties, 2) a material breach by one party that allows the other to terminate, 3) proving the contract was entered under duress, fraud, or mistake, or 4) showing the agreement violates public policy or law."
      };
    } else {
      return {
        answer: `Regarding your question about "${question}": This would typically require legal analysis specific to the clause and jurisdiction. While I can provide general information, for specific legal advice about your situation, you should consult with a qualified attorney.`
      };
    }
  } catch (error) {
    console.error('Follow-up question error:', error);
    toast.error('Failed to submit follow-up question');
    throw error;
  }
}
