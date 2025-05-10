
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import type { AnalysisResponse } from "@/lib/api-services";

interface RiskyTermsSectionProps {
  analysis: AnalysisResponse | null;
}

const RiskyTermsSection = ({ analysis }: RiskyTermsSectionProps) => {
  if (!analysis) return null;
  
  return (
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
  );
};

export default RiskyTermsSection;
