
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, FileText, Loader, Send, RefreshCw, HelpCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import FileUploader from "@/components/FileUploader";
import RiskBadge from "@/components/RiskBadge";
import { analyzeClause, submitFollowupQuestion, type AnalysisResponse, type FollowupResponse } from "@/lib/api-services";

const Index = () => {
  const [legalClause, setLegalClause] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [followupQuestion, setFollowupQuestion] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [followupAnswers, setFollowupAnswers] = useState<{question: string; answer: string}[]>([]);
  
  const handleAnalyze = async () => {
    if (!legalClause.trim()) {
      toast.warning('Please enter a legal clause or upload a document');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysis(null);
    setFollowupQuestion('');
    setFollowupAnswers([]);
    
    try {
      const result = await analyzeClause(legalClause);
      setAnalysis(result);
      
      if (result.riskyTerms.length > 0) {
        const highRisks = result.riskyTerms.filter(term => term.severity === 'high').length;
        if (highRisks > 0) {
          toast.warning(`Found ${highRisks} high-risk term${highRisks > 1 ? 's' : ''}!`);
        } else {
          toast.info('Analysis complete');
        }
      } else {
        toast.success('No risky terms detected!');
      }
    } catch (error) {
      console.error(error);
      // Toast is already shown in the API service
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleSubmitQuestion = async () => {
    if (!followupQuestion.trim() || !legalClause.trim()) {
      toast.warning('Please enter a question');
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
  
  const handleStartNew = () => {
    setLegalClause('');
    setAnalysis(null);
    setFollowupQuestion('');
    setFollowupAnswers([]);
  };
  
  const handleContentExtracted = (content: string) => {
    setLegalClause(content);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8 bg-background">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-legal-action via-teal-300 to-legal-action bg-clip-text text-transparent">
            ClearClause: AI Legal Simplifier
          </h1>
          <p className="text-md md:text-lg text-muted-foreground mt-2 max-w-2xl">
            Understand legal clauses in plain English. No lawyer needed.
          </p>
        </div>
        
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText size={20} className="text-legal-action" />
              Input Legal Text
            </CardTitle>
            <CardDescription>
              Paste a legal clause or upload a document (.txt, .pdf, .docx)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader onContentExtracted={handleContentExtracted} />
            <Textarea 
              value={legalClause}
              onChange={(e) => setLegalClause(e.target.value)}
              placeholder="Paste your legal clause or contract section here..."
              className="min-h-[200px] resize-y bg-background/50"
              rows={10}
              disabled={isAnalyzing}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleStartNew}
              disabled={isAnalyzing || (!analysis && legalClause === '')}
              className="gap-2"
            >
              <RefreshCw size={16} />
              Clear All
            </Button>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || legalClause.trim() === ''}
              className="bg-legal-action hover:bg-legal-action/80 text-white gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Simplify & Analyze
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {analysis && (
          <>
            <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Simplified Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">
                  {analysis.simplifiedExplanation}
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle size={18} className="text-legal-moderate" />
                  Risky Terms Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.riskyTerms.length > 0 ? (
                  <div className="space-y-4">
                    {analysis.riskyTerms.map((term, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-2 md:items-start p-3 bg-secondary/30 rounded-md">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 min-w-[150px]">
                          <span className="font-semibold text-legal-action">"{term.term}"</span>
                          <RiskBadge level={term.severity} />
                        </div>
                        <p className="text-sm text-foreground/90">{term.explanation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No risky terms detected in this text.</p>
                )}
              </CardContent>
            </Card>
            
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
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
