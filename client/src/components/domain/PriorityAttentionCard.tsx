import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "warning";
  href: string;
}

interface PriorityAttentionCardProps {
  criticalCount: number;
  alerts: AlertItem[];
}

export function PriorityAttentionCard({ criticalCount, alerts }: PriorityAttentionCardProps) {
  const severityConfig = {
    critical: {
      color: "bg-red-500",
      badge: "destructive" as const,
      badgeClass: "",
      badgeText: "Critical"
    },
    high: {
      color: "bg-orange-500",
      badge: "outline" as const,
      badgeClass: "text-orange-600 border-orange-200 bg-orange-50",
      badgeText: "High Risk"
    },
    warning: {
      color: "bg-yellow-500",
      badge: "outline" as const,
      badgeClass: "text-yellow-600 border-yellow-200 bg-yellow-50",
      badgeText: "Warning"
    }
  };

  return (
    <Card className="border-0 shadow-soft card-gradient flex flex-col h-full min-h-[200px]">
      <CardHeader className="pb-3 border-b border-border/50 bg-white/50 backdrop-blur-sm">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
          <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          Priority Attention
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {criticalCount} critical issues require action
        </p>
      </CardHeader>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-2 max-h-[300px] lg:max-h-none">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <Link key={alert.id} href={alert.href}>
              <div className="p-3 rounded-xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                <div className={`absolute left-0 top-0 w-1 h-full ${config.color}`}></div>
                <div className="flex gap-3 pl-2">
                  <div className="mt-1">
                    <Badge 
                      variant={config.badge} 
                      className={cn(`h-5 px-1.5 text-[10px] uppercase tracking-wider`, config.badgeClass)}
                    >
                      {config.badgeText}
                    </Badge>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {alert.title}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      {alert.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary self-center" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="p-3 border-t border-border/50 bg-muted/20 mt-auto">
         <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground hover:text-primary">
            View All Alerts
         </Button>
      </div>
    </Card>
  );
}
