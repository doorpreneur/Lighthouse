import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { VitalsGrid, VitalItem } from "@/components/domain/VitalsGrid";
import { Badge } from "@/components/ui/badge";

export default function Workflows() {
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  const { data: workflows, isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: api.getWorkflows
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

  const summary = business.workflowHealthSummary;

  const vitals: VitalItem[] = [
    { label: "Active Processes", value: "12", status: "neutral" },
    { label: "SLA Adherence", value: "89%", target: "95%", status: "watch" },
    { label: "Avg Cycle Time", value: "4.2 days", target: "5.0 days", status: "healthy" },
    { label: "Bottlenecks", value: "3", target: "0", status: "critical" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <HealthHeader 
          title="Workflow Health"
          score={summary.avgScore}
          trend={-5.4}
          trendLabel="vs last month"
          summary="Leasing workflows are slowing down due to high volume. Maintenance workflows are performing optimally."
        />

        <section>
          <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">Key Vitals</h3>
          <VitalsGrid items={vitals} />
        </section>

        <HealthTable 
          title="Operational Workflows"
          data={workflows || []}
          columns={[
            { header: "Workflow Name", accessorKey: "name", className: "font-medium text-foreground" },
            { 
              header: "Type", 
              cell: (item) => <Badge variant="outline" className="font-mono text-[10px]">{item.workflowType}</Badge>
            },
            { header: "Avg Cycle Time", cell: (item) => `${item.avgCycleTimeDays}d` },
            { header: "SLA Adherence", cell: (item) => `${(item.onTimeCompletionRate * 100).toFixed(0)}%` },
            { header: "Backlog", accessorKey: "backlogCount" },
            { 
              header: "Status", 
              cell: (item) => item.backlogCount > 10 ? 
                <Badge variant="destructive" className="text-[10px]">Bottleneck</Badge> : 
                <Badge variant="secondary" className="text-[10px] text-health-good bg-health-good-bg">Optimal</Badge> 
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
