
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, Loader, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { submitFollowupQuestion, type FollowupResponse } from "@/lib/api-services";
import { toast } from "@/components/ui/sonner";

interface FollowupQuestionsSectionProps {
  legalClause: string;
  hasApiKey: boolean;
  setSettingsOpen: (open: boolean) => void;
}

const FollowupQuestionsSection = ({ 
  legalClause, 
  hasApiKey,
  setSettingsOpen 
}: FollowupQuestionsSectionProps) => {
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [followupAnswers, setFollowupAnswers] = useState<{question: string; answer: string}[]>([]);

  const handleSubmitQuestion = async () => {
    if (!followupQuestion.trim() || !legalClause.trim()) {
      toast.warning('Please enter a question');
      return;
    }
    
    if (!hasApiKey) {
      toast.error('Please enter your Gemini API key in settings first');
      setSettingsOpen(true);
      return;
    }
    
    setIsSubmittingQuestion(true);
    
    try {
      const result = await submitFollowupQuestion(followupQuestion, legalClause);
      setFollowupAnswers(prev => [...prev, {
        question: followupQuestion,
        answer: result.answer
      }]);
      setFollowupQuestion('');
    } catch (error) {
      console.error(error);
      // Toast is already shown in the API service
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  return (
    <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle size={18} className="text-legal-action" />
          Follow-up Questions
        </CardTitle>
        <CardDescription>
          Ask specific questions about this legal text
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {followupAnswers.length > 0 && (
          <div className="space-y-5">
            {followupAnswers.map((qa, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-end">
                  <div className="bg-legal-action/20 py-2 px-4 rounded-2xl rounded-tr-none max-w-[85%]">
                    <p className="text-sm text-foreground/90">{qa.question}</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-secondary/30 py-3 px-4 rounded-2xl rounded-tl-none max-w-[85%]">
                    <p className="text-sm text-foreground/90">{qa.answer}</p>
                  </div>
                </div>
              </div>
            ))}
            <Separator />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Input
            value={followupQuestion}
            onChange={(e) => setFollowupQuestion(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 bg-background/50"
            disabled={isSubmittingQuestion}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitQuestion();
              }
            }}
          />
          <Button
            onClick={handleSubmitQuestion}
            disabled={isSubmittingQuestion || !followupQuestion.trim()}
            size="sm"
            className="bg-legal-action hover:bg-legal-action/80"
          >
            {isSubmittingQuestion ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FollowupQuestionsSection;
