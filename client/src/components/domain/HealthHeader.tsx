import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

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

  // Generate mock trend data based on current score and trend
  // This ensures the graph looks related to the data
  const data = Array.from({ length: 12 }).map((_, i) => {
    const isLast = i === 11;
    // Reverse engineer previous months based on a noisy trend
    // This is purely for visual flair in the mockup
    const noise = Math.random() * 8 - 4;
    const trendFactor = (11 - i) * (trend / 2); 
    const value = isLast 
      ? score 
      : Math.max(40, Math.min(100, score - trendFactor + noise));
      
    return { month: i, value };
  });

  return (
    <Card className="border-0 shadow-soft card-gradient h-full min-h-[320px] overflow-hidden relative flex flex-col">
      <CardHeader className="pb-4 border-b border-border/50 bg-white/50 backdrop-blur-sm z-10 relative shrink-0">
        <div className="flex items-start justify-between gap-4">
           <div className="space-y-1">
             <CardTitle className="text-xl font-display font-bold tracking-tight text-foreground">
                {title}
             </CardTitle>
             <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
               {summary}
             </p>
           </div>
           <HealthBadge score={score} size="sm" showLabel={false} />
        </div>
      </CardHeader>
      
      <CardContent className="p-6 relative z-10 flex-1 flex flex-col justify-between">
        <div className="flex items-baseline gap-4 mb-6">
           <span className="text-7xl font-display font-bold tracking-tighter text-foreground">
             {score}
           </span>
           <div className="flex flex-col pb-2">
             <div className={cn(
               "flex items-center text-sm font-bold px-2 py-0.5 rounded-full w-fit",
               isPositive ? "text-health-good bg-health-good-bg" : 
               isNeutral ? "text-muted-foreground bg-muted" :
               "text-health-critical bg-health-critical-bg"
             )}>
               {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : 
                isNeutral ? <Minus className="w-4 h-4 mr-1" /> : 
                <ArrowDownRight className="w-4 h-4 mr-1" />}
               {Math.abs(trend)}%
             </div>
             <span className="text-xs text-muted-foreground mt-1.5 font-medium uppercase tracking-wide pl-1">
               {trendLabel}
             </span>
           </div>
        </div>

        <div className="h-[120px] w-full mt-auto -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(221, 83%, 53%)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#scoreGradient)" 
                isAnimationActive={true}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      
      {/* Decorative background elements */}
      <div className="absolute right-0 top-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
    </Card>
  );
}
