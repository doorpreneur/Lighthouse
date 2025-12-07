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
  impact?: string;
  timeToResolve?: string;
  actionLabel?: string;
  onAction?: () => void;
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
      
      <div className="overflow-y-auto flex-1 p-2 space-y-2 max-h-[400px] lg:max-h-none">
        {alerts.map((alert, index) => {
          const config = severityConfig[alert.severity];
          return (
            <div key={alert.id} className="p-3 rounded-xl bg-white border border-border/50 hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col gap-2">
              <div className={`absolute left-0 top-0 w-1 h-full ${config.color}`}></div>
              
              <Link href={alert.href} className="flex gap-3 pl-2 cursor-pointer">
                <div className="mt-1 flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                      {alert.title}
                    </div>
                    <Badge 
                      variant={config.badge} 
                      className={cn(`h-5 px-1.5 text-[10px] uppercase tracking-wider`, config.badgeClass)}
                    >
                      {config.badgeText}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {alert.description}
                  </p>
                  
                  {(alert.impact || alert.timeToResolve) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[10px] text-slate-500">
                      {alert.impact && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-slate-700">Impact:</span> {alert.impact}
                        </span>
                      )}
                      {alert.timeToResolve && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-slate-700">Est:</span> {alert.timeToResolve}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary self-center shrink-0" />
              </Link>

              {alert.actionLabel && (
                <div className="pl-10 pr-2 pb-1">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full h-7 text-xs bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary/30 justify-between group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert.onAction?.();
                    }}
                  >
                    {alert.actionLabel}
                    <span className="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all">→</span>
                  </Button>
                </div>
              )}
            </div>
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
