import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  status?: "healthy" | "watch" | "critical" | "neutral";
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subValue,
  trend,
  trendValue,
  status = "neutral",
  icon,
  className 
}: MetricCardProps) {
  
  return (
    <Card className={cn("overflow-hidden border-0 shadow-soft rounded-2xl cursor-pointer group card-gradient", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 border border-primary/10">
              {icon}
            </div>
          )}
          <CardTitle className="text-xs font-mono font-semibold text-muted-foreground/80 uppercase tracking-wider">
            {title}
          </CardTitle>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="mt-3">
          <div className="text-3xl font-display font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {value}
          </div>
          
          {(trendValue || subValue) && (
            <div className="flex items-center mt-3 gap-2">
              {trend && trendValue && (
                <div className={cn("text-[10px] font-mono font-medium px-2 py-1 rounded-full flex items-center gap-1 border", 
                  trend === "up" ? "text-health-good bg-health-good-bg border-health-good/20" : 
                  trend === "down" ? "text-health-critical bg-health-critical-bg border-health-critical/20" : "text-muted-foreground bg-muted border-transparent"
                )}>
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} 
                  {trendValue}
                </div>
              )}
              {subValue && (
                <p className="text-xs text-muted-foreground font-medium">
                  {subValue}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
