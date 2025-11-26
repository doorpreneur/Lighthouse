import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    healthy: "text-health-good",
    watch: "text-health-watch",
    critical: "text-health-critical",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground opacity-50">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn("text-2xl font-bold font-mono", statusColors[status])}>
            {value}
          </div>
          {subValue && (
            <p className="text-xs text-muted-foreground">
              {subValue}
            </p>
          )}
        </div>
        
        {trend && trendValue && (
          <div className={cn("mt-1 text-xs flex items-center", 
            trend === "up" ? "text-health-good" : 
            trend === "down" ? "text-health-critical" : "text-muted-foreground"
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} 
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
