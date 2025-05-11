import React from 'react';
import { cn } from '@/lib/utils';
import type { AnalysisResponse } from '@/lib/api-services';

interface HighlightedLegalTextProps {
  legalText: string;
  analysis: AnalysisResponse | null;
  className?: string;
}

const HighlightedLegalText = ({ legalText, analysis, className }: HighlightedLegalTextProps) => {
  if (!analysis || !analysis.riskyTerms.length) {
    return <div className={cn('whitespace-pre-wrap', className)}>{legalText}</div>;
  }

  // Sort terms by length (longest first) to avoid highlighting issues with overlapping terms
  const sortedTerms = [...analysis.riskyTerms].sort((a, b) => b.term.length - a.term.length);
  
  // Prepare the text for highlighting by creating segments
  let segments: {text: string; isRisky: boolean; severity?: 'high' | 'moderate' | 'low'; term?: string}[] = [{
    text: legalText,
    isRisky: false
  }];
  
  // For each risky term, split the segments further
  sortedTerms.forEach(({ term, severity }) => {
    const newSegments: typeof segments = [];
    
    segments.forEach(segment => {
      if (segment.isRisky) {
        // If segment is already highlighted, keep it as is
        newSegments.push(segment);
        return;
      }
      
      const parts = segment.text.split(new RegExp(`(${term})`, 'gi'));
      
      parts.forEach((part, index) => {
        if (part === '') return;
        
        const isMatch = part.toLowerCase() === term.toLowerCase();
        
        newSegments.push({
          text: part,
          isRisky: isMatch,
          severity: isMatch ? severity : undefined,
          term: isMatch ? term : undefined
        });
      });
    });
    
    segments = newSegments;
  });
  
  const severityColors = {
    high: 'bg-legal-high/20 border-b-2 border-legal-high',
    moderate: 'bg-legal-moderate/20 border-b-2 border-legal-moderate',
    low: 'bg-legal-low/20 border-b-2 border-legal-low'
  };

  return (
    <div className={cn('whitespace-pre-wrap', className)}>
      {segments.map((segment, i) => (
        <span 
          key={i}
          className={cn(
            segment.isRisky && 'rounded px-0.5 py-0.5',
            segment.severity && severityColors[segment.severity],
            segment.isRisky && 'cursor-help'
          )}
          title={segment.isRisky ? `${segment.term}: ${analysis.riskyTerms.find(t => t.term.toLowerCase() === segment.term?.toLowerCase())?.explanation}` : undefined}
        >
          {segment.text}
        </span>
      ))}
    </div>
  );
};

export default HighlightedLegalText;
