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
  
  const statusColors = {
    healthy: "text-health-good bg-health-good-bg",
    watch: "text-health-watch bg-health-watch-bg",
    critical: "text-health-critical bg-health-critical-bg",
    neutral: "text-muted-foreground bg-muted"
  };

  return (
    <Card className={cn("overflow-hidden border-0 shadow-soft rounded-2xl hover:shadow-md transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-sidebar-accent/50 text-primary">
              {icon}
            </div>
          )}
          <CardTitle className="text-sm font-semibold text-muted-foreground/80">
            {title}
          </CardTitle>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="mt-3">
          <div className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </div>
          
          {(trendValue || subValue) && (
            <div className="flex items-center mt-3 gap-2">
              {trend && trendValue && (
                <div className={cn("text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1", 
                  trend === "up" ? "text-health-good bg-health-good-bg" : 
                  trend === "down" ? "text-health-critical bg-health-critical-bg" : "text-muted-foreground bg-muted"
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
