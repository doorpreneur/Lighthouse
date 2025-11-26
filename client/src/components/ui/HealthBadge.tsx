import { cn } from "@/lib/utils";
import { RiskLevel } from "@/lib/types";

interface HealthBadgeProps {
  score: number;
  riskLevel?: RiskLevel;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
}

export function HealthBadge({ 
  score, 
  riskLevel, 
  size = "md", 
  showLabel = false,
  className 
}: HealthBadgeProps) {
  // If riskLevel is not provided, calculate it from score
  const level = riskLevel || (score >= 80 ? "healthy" : score >= 50 ? "watch" : "critical");

  const colorClasses = {
    healthy: "text-health-good bg-health-good-bg border-health-good/20",
    watch: "text-health-watch bg-health-watch-bg border-health-watch/20",
    critical: "text-health-critical bg-health-critical-bg border-health-critical/20"
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5 font-semibold",
    xl: "text-xl px-4 py-2 font-bold"
  };

  return (
    <div className={cn(
      "inline-flex items-center justify-center rounded-full border font-mono tracking-tight",
      colorClasses[level],
      sizeClasses[size],
      className
    )}>
      {score}
      {showLabel && (
        <span className="ml-2 font-sans text-[0.8em] font-medium opacity-80 uppercase tracking-wider">
          {level}
        </span>
      )}
    </div>
  );
}
