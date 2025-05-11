
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import type { AnalysisResponse } from "@/lib/api-services";
import HighlightedLegalText from './HighlightedLegalText';

interface AnalysisResultDisplayProps {
  legalClause: string;
  analysis: AnalysisResponse;
}

const AnalysisResultDisplay = ({ legalClause, analysis }: AnalysisResultDisplayProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6">
          <h3 className="text-md font-semibold mb-3">Original Text</h3>
          <HighlightedLegalText 
            legalText={legalClause} 
            analysis={analysis} 
            className="text-sm p-4 bg-background/80 rounded-md border border-border/30" 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisResultDisplay;
