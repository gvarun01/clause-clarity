
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import type { AnalysisResponse } from "@/lib/api-services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RiskyTermsSectionProps {
  analysis: AnalysisResponse | null;
}

const RiskyTermsSection = ({ analysis }: RiskyTermsSectionProps) => {
  if (!analysis) return null;
  
  return (
    <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="border-b border-border/20">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle size={18} className="text-legal-moderate" />
          Risky Terms Detected
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {analysis.riskyTerms.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Term</TableHead>
                <TableHead className="w-[120px]">Risk Level</TableHead>
                <TableHead>Explanation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.riskyTerms.map((term, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-legal-action">{term.term}</TableCell>
                  <TableCell>
                    <RiskBadge level={term.severity} />
                  </TableCell>
                  <TableCell className="text-foreground/90">{term.explanation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground italic">No risky terms detected in this text.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskyTermsSection;
