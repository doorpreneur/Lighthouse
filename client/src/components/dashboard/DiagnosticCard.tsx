import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface Member {
  name: string;
  initials: string;
  image?: string;
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
  variant?: 'default' | 'wide';
  highlighted?: boolean;
  members?: Member[];
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
  className,
  variant = 'default',
  highlighted = false,
  members
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

  if (variant === 'wide') {
    const cardClasses = cn(
      "flex flex-col md:flex-row h-full overflow-hidden transition-all duration-200",
      highlighted 
        ? "bg-blue-50/50 border-0 shadow-none" 
        : "border-0 shadow-sm hover:shadow-md bg-card",
      className
    );

    const panelClasses = highlighted ? "bg-transparent" : "bg-slate-50/30";
    const whitePanelClasses = highlighted ? "bg-white/60" : "bg-white";

    return (
      <Card className={cardClasses}>
        {/* Left Panel: Header & Score */}
        <div className={cn("md:w-1/4 p-6 border-b md:border-b-0 md:border-r flex flex-col justify-between", panelClasses, highlighted ? "border-blue-100" : "")}>
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Icon className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
            </div>
            
            <div className="mt-2">
              <div className="text-xs font-medium text-muted-foreground mb-1">Health Score</div>
              <div className={cn("text-5xl font-bold tracking-tighter", getScoreColor(healthScore))}>
                {healthScore}<span className="text-xl text-muted-foreground font-normal">/100</span>
              </div>
            </div>
          </div>

          <div className={cn("px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 w-fit mt-4", getTrendColor(trend))}>
            {trend > 0 ? <ArrowUpRight className="h-4 w-4" /> : trend < 0 ? <ArrowDownRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            {Math.abs(trend)} pts
          </div>
        </div>

        {/* Middle Panel: Stats & Issues */}
        <div className={cn("flex-1 p-6 grid md:grid-cols-2 gap-6 border-b md:border-b-0 md:border-r", highlighted ? "border-blue-100" : "")}>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Key Metrics</h4>
            <div className="space-y-2">
              {stats.map((stat, idx) => (
                <div key={idx} className={cn("flex items-center gap-3 p-2 rounded-lg", highlighted ? "bg-white/60" : "bg-slate-50")}>
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{stat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              Attention Needed
            </h4>
            <div className="space-y-2">
              {issues.map((issue, idx) => (
                <div key={idx} className={cn("flex items-start gap-2 text-sm p-2 rounded-lg border", highlighted ? "bg-white/60 border-transparent" : "bg-red-50/50 border-red-100/50")}>
                  {issue.severity === 'critical' ? (
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  ) : (
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  )}
                  <span className="text-slate-700 leading-snug">{issue.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Insight & Actions */}
        <div className={cn("md:w-1/4 p-6 flex flex-col", panelClasses)}>
          {insight && (
            <div className={cn("mb-6 p-4 rounded-xl border shadow-sm", whitePanelClasses, highlighted ? "border-transparent" : "border-slate-100")}>
              <div className="text-xs font-medium text-muted-foreground mb-1">{insight.label}</div>
              <div className="font-bold text-slate-900 text-lg leading-tight">{insight.text}</div>
              {insight.value && (
                <div className="text-xs font-mono text-slate-500 mt-1">{insight.value}</div>
              )}
            </div>
          )}
          
          <div className="mt-auto space-y-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              {primaryAction}
            </Button>
            <Link href={href}>
              <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
                View Full Report <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

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
      
      <CardContent className="flex-1 p-5 space-y-6 flex flex-col">
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

        {/* Stats or Avatars */}
        {members ? (
          <div className="space-y-2">
             <div className="text-xs text-muted-foreground font-medium">Team Members</div>
             <div className="flex -space-x-2 overflow-hidden py-1">
               {members.map((member, i) => (
                 <Avatar key={i} className="inline-block border-2 border-white ring-1 ring-slate-100 w-8 h-8">
                   <AvatarImage src={member.image} />
                   <AvatarFallback className="bg-slate-100 text-slate-600 text-[10px] font-bold">
                     {member.initials}
                   </AvatarFallback>
                 </Avatar>
               ))}
               {members.length > 5 && (
                 <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-slate-50 text-[10px] font-medium text-slate-500">
                   +{members.length - 5}
                 </div>
               )}
             </div>
             <div className="text-xs text-slate-500">
               {stats[1]} {/* Reuse the second stat as a summary text */}
             </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-3 space-y-1">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-xs text-slate-600 font-medium flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-slate-400" />
                {stat}
              </div>
            ))}
          </div>
        )}

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
          <div className="pt-2 border-t border-dashed mt-auto">
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
        <div className="pt-2">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-9 text-sm font-medium">
            {primaryAction}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
