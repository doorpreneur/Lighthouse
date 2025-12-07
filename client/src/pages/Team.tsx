import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { VitalsGrid, VitalItem } from "@/components/domain/VitalsGrid";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";
import { useLocation } from "wouter";

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
      href: "/team/tm-001"
    },
    {
      id: "2",
      title: "John Doe",
      description: "Missed 3 critical deadlines this week.",
      severity: "high",
      href: "/team/tm-002"
    },
    {
      id: "3",
      title: "Operations Team",
      description: "Staff shortage in maintenance division.",
      severity: "warning",
      href: "/team/tm-003"
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
            summary="Overall performance is strong, but high task loads are increasing burnout risk for key leasing agents."
          />
          <PriorityAttentionCard 
            criticalCount={4} 
            alerts={priorityAlerts} 
          />
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
              { header: "Open Tasks", accessorKey: "activeTasksCount" },
              { header: "Overdue", accessorKey: "overdueTasksCount", cell: (item) => item.overdueTasksCount > 0 ? <span className="text-health-critical font-bold">{item.overdueTasksCount}</span> : "0" },
              { header: "SLA Adherence", cell: (item) => `${(item.completionRate * 100).toFixed(0)}%` },
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
