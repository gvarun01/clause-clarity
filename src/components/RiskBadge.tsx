
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: 'high' | 'moderate' | 'low';
  className?: string;
}

const RiskBadge = ({ level, className }: RiskBadgeProps) => {
  const baseClasses = "px-2 py-0.5 text-xs font-medium rounded-full";
  
  const levelClasses = {
    high: "bg-legal-high/20 text-legal-high border border-legal-high/30",
    moderate: "bg-legal-moderate/20 text-legal-moderate border border-legal-moderate/30",
    low: "bg-legal-low/20 text-legal-low border border-legal-low/30",
  };
  
  const levelLabels = {
    high: "High Risk",
    moderate: "Moderate Risk",
    low: "Low Risk",
  };
  
  return (
    <span className={cn(baseClasses, levelClasses[level], className)}>
      {levelLabels[level]}
    </span>
  );
};

export default RiskBadge;
