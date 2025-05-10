
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResponse } from "@/lib/api-services";

interface AnalysisSectionProps {
  analysis: AnalysisResponse | null;
}

const AnalysisSection = ({ analysis }: AnalysisSectionProps) => {
  if (!analysis) return null;
  
  return (
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
  );
};

export default AnalysisSection;
