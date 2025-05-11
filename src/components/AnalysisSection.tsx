
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResponse } from "@/lib/api-services";
import { Check } from "lucide-react";

interface AnalysisSectionProps {
  analysis: AnalysisResponse | null;
}

const AnalysisSection = ({ analysis }: AnalysisSectionProps) => {
  if (!analysis) return null;
  
  return (
    <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-b border-border/20">
        <CardTitle className="text-lg flex items-center gap-2">
          <Check size={18} className="text-primary" />
          Simplified Explanation
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-foreground/90 leading-relaxed text-base">
          {analysis.simplifiedExplanation}
        </p>
      </CardContent>
    </Card>
  );
};

export default AnalysisSection;
