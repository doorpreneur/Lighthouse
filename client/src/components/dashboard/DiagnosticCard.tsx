import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, AlertCircle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Issue {
  text: string;
  severity: 'critical' | 'warning' | 'neutral';
}

interface Insight {
  label: string;
  text: string;
  value?: string;
}

interface DiagnosticCardProps {
  title: string;
  icon: any;
  healthScore: number;
  trend: number;
  stats: string[];
  issues: Issue[];
  insight?: Insight;
  primaryAction: string;
  secondaryAction?: string;
  href: string;
  className?: string;
}

export function DiagnosticCard({
  title,
  icon: Icon,
  healthScore,
  trend,
  stats,
  issues,
  insight,
  primaryAction,
  secondaryAction,
  href,
  className
}: DiagnosticCardProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600 bg-green-50";
    if (trend < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  return (
    <Card className={cn("flex flex-col h-full overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200", className)}>
      <CardHeader className="pb-2 border-b bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
          </div>
          <Link href={href}>
            <span className="text-xs font-medium text-primary hover:underline cursor-pointer flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-5 space-y-6">
        {/* Main Metric */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">Health Score</div>
            <div className={cn("text-4xl font-bold tracking-tighter", getScoreColor(healthScore))}>
              {healthScore}<span className="text-lg text-muted-foreground font-normal">/100</span>
            </div>
          </div>
          <div className={cn("px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 mb-1", getTrendColor(trend))}>
            {trend > 0 ? <ArrowUpRight className="h-3 w-3" /> : trend < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {Math.abs(trend)} pts
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-slate-50 rounded-lg p-3 space-y-1">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-xs text-slate-600 font-medium flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-slate-400" />
              {stat}
            </div>
          ))}
        </div>

        {/* Issues Section */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            Attention Needed
          </h4>
          <div className="space-y-2">
            {issues.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                {issue.severity === 'critical' ? (
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                ) : (
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                )}
                <span className="text-slate-700 leading-tight">{issue.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insight/Impact */}
        {insight && (
          <div className="pt-2 border-t border-dashed">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">{insight.label}:</span>
              <span className="font-bold text-slate-900">{insight.text}</span>
            </div>
            {insight.value && (
              <div className="text-right text-xs font-mono text-slate-500 mt-0.5">{insight.value}</div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 mt-auto">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9 text-sm font-medium">
            {primaryAction}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
