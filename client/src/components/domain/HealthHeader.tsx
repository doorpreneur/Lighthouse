import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";

interface HealthHeaderProps {
  title: string;
  score: number;
  trend: number; // percentage, positive or negative
  trendLabel?: string;
  summary: string;
  targetScore?: number;
}

export function HealthHeader({ 
  title, 
  score, 
  trend, 
  trendLabel = "vs last month",
  summary,
  targetScore = 90
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
      
    // Create labels like "Jan", "Feb" based on current month backwards
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    const monthLabel = date.toLocaleString('default', { month: 'short' });

    return { month: monthLabel, value: Math.round(value) };
  });

  return (
    <Card className="border-0 shadow-soft card-gradient h-full min-h-[400px] overflow-hidden relative flex flex-col">
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
        <div className="flex items-baseline gap-4 mb-8">
           <span className="text-8xl font-display font-bold tracking-tighter text-foreground">
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

        <div className="h-[180px] w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                dy={10}
              />
              <YAxis 
                domain={[0, 100]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                ticks={[0, 25, 50, 75, 100]}
              />
              <ReferenceLine 
                y={targetScore} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="4 4" 
                strokeOpacity={0.5}
                label={{ 
                  value: `Target: ${targetScore}`, 
                  position: 'right', 
                  fill: 'hsl(var(--primary))', 
                  fontSize: 10,
                  opacity: 0.8
                }} 
              />
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
