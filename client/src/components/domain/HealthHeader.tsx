import { HealthBadge } from "@/components/ui/HealthBadge";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthHeaderProps {
  title: string;
  score: number;
  trend: number; // percentage, positive or negative
  trendLabel?: string;
  summary: string;
}

export function HealthHeader({ 
  title, 
  score, 
  trend, 
  trendLabel = "vs last month",
  summary 
}: HealthHeaderProps) {
  const isPositive = trend > 0;
  const isNeutral = trend === 0;

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-6 rounded-2xl card-gradient shadow-soft">
      <div className="space-y-2 max-w-2xl">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">{title}</h1>
          <HealthBadge score={score} size="md" showLabel />
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
        <div className="text-right">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">Health Score</div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-3xl font-display font-bold tracking-tight">{score}</span>
          </div>
        </div>
        
        <div className="h-10 w-px bg-border mx-2"></div>

        <div className="flex flex-col items-start">
           <div className={cn(
             "flex items-center text-xs font-bold px-2 py-1 rounded-full mb-1",
             isPositive ? "text-health-good bg-health-good-bg" : 
             isNeutral ? "text-muted-foreground bg-muted" :
             "text-health-critical bg-health-critical-bg"
           )}>
             {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : 
              isNeutral ? <Minus className="w-3 h-3 mr-1" /> : 
              <ArrowDownRight className="w-3 h-3 mr-1" />}
             {Math.abs(trend)}%
           </div>
           <span className="text-[10px] text-muted-foreground font-medium">{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}
