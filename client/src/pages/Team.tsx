import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { VitalsGrid, VitalItem } from "@/components/domain/VitalsGrid";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";
import { useLocation } from "wouter";

const TrendIndicator = ({ trend, label }: { trend: "up" | "down" | "stable", label: string }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5">
        {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-health-good" />}
        {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-health-critical" />}
        {trend === "stable" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

export default function Team() {
  const [, setLocation] = useLocation();
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  const { data: team, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: api.getTeam
  });

  if (isLoading || !business) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  const summary = business.teamHealthSummary;

  const priorityAlerts: AlertItem[] = [
    {
      id: "1",
      title: "Sarah Connor",
      description: "Task overload detected. 15 overdue items.",
      severity: "critical",
      href: "/team/tm-001",
      impact: "8 owners, 23 units",
      timeToResolve: "~2 hours to clear backlog",
      actionLabel: "Reassign 5 tasks"
    },
    {
      id: "2",
      title: "John Doe",
      description: "Missed 3 critical deadlines this week.",
      severity: "high",
      href: "/team/tm-002",
      impact: "3 compliance workflows",
      timeToResolve: "Immediate action needed",
      actionLabel: "Schedule 1:1 Review"
    },
    {
      id: "3",
      title: "Operations Team",
      description: "Staff shortage in maintenance division.",
      severity: "warning",
      href: "/team/tm-003",
      impact: "Avg response time +4h",
      timeToResolve: "Hiring pending (2 weeks)",
      actionLabel: "Approve temporary contractor"
    }
  ];

  const vitals: VitalItem[] = [
    { label: "Team Size", value: summary.totalCount, status: "neutral" },
    { label: "Task Completion", value: "94%", target: "90%", status: "healthy" },
    { label: "Overdue Tasks", value: "12", target: "0", status: "watch" },
    { label: "Burnout Risk", value: "High", target: "Low", status: "critical" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid gap-8 lg:grid-cols-2">
          <HealthHeader 
            title="Team Health"
            score={summary.avgScore}
            trend={-2.1}
            trendLabel="vs last month"
            summary="Peter Silberman has 8 overdue tasks and 60% SLA. Reassign 5 tasks to Sarah Connor (95% SLA, balanced workload) by EOD."
          />
          <PriorityAttentionCard 
            criticalCount={4} 
            alerts={priorityAlerts} 
          />
        </div>

        {/* Impact Analysis / Forecast Section */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start animate-in fade-in slide-in-from-top-2">
          <div className="p-2 bg-amber-100 rounded-lg shrink-0">
             <Activity className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 mb-1">Impact Forecast</h4>
            <p className="text-sm text-amber-800/90 leading-relaxed">
              If Miles Dyson doesn't clear 10 tasks this week, his health will drop to <span className="font-bold text-amber-950">critical</span> and impact <span className="font-bold text-amber-950">12 buildings</span>.
            </p>
          </div>
        </div>

        <div className="border-t border-border/40" />

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Team Vitals
            </h3>
          </div>
          <VitalsGrid items={vitals} />
        </section>

        <div className="border-t border-border/40" />

        <section className="space-y-6">
           <div className="flex items-center justify-between">
             <div>
               <h3 className="text-lg font-bold text-foreground tracking-tight">Team Performance</h3>
               <p className="text-sm text-muted-foreground mt-1">Individual contributions and workload analysis</p>
             </div>
           </div>

          <HealthTable 
            title=""
            data={team || []}
            onRowClick={(item) => setLocation(`/team/${item.id}`)}
            columns={[
              { header: "Name", accessorKey: "name", className: "font-medium text-foreground" },
              { header: "Role", accessorKey: "role" },
              { 
                header: "Open Tasks", 
                cell: (item) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{item.activeTasksCount}</span>
                    <TrendIndicator trend={item.activeTasksTrend} label="vs last week" />
                  </div>
                )
              },
              { header: "Overdue", accessorKey: "overdueTasksCount", cell: (item) => item.overdueTasksCount > 0 ? <span className="text-health-critical font-bold">{item.overdueTasksCount}</span> : "0" },
              { 
                header: "SLA Adherence", 
                cell: (item) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{(item.completionRate * 100).toFixed(0)}%</span>
                    <TrendIndicator trend={item.completionRateTrend} label="vs last month" />
                  </div>
                ) 
              },
              { 
                header: "Prescription", 
                cell: (item) => (
                  <div className="flex items-start gap-2 max-w-[250px]">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground/80 leading-snug">{item.prescription}</span>
                  </div>
                )
              },
              { 
                header: "Workload", 
                cell: (item) => {
                  const load = item.activeTasksCount;
                  return load > 30 ? <Badge variant="destructive">Overloaded</Badge> : 
                         load > 15 ? <Badge variant="outline" className="border-health-watch text-health-watch">Heavy</Badge> :
                         <Badge variant="secondary">Balanced</Badge>
                }
              },
            ]}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
