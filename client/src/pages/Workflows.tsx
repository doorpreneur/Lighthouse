import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Workflows() {
  const { data, isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: api.getWorkflows
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <Skeleton className="h-[400px] w-full" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        </div>

        <HealthTable 
          title="Workflow Health"
          data={data || []}
          columns={[
            { header: "Name", accessorKey: "name", className: "font-medium" },
            { 
              header: "Type", 
              cell: (item) => <Badge variant="outline">{item.workflowType}</Badge>
            },
            { header: "Cycle Time", cell: (item) => `${item.avgCycleTimeDays} days` },
            { header: "On-Time", cell: (item) => `${(item.onTimeCompletionRate * 100).toFixed(0)}%` },
            { header: "Backlog", accessorKey: "backlogCount" },
            { header: "CSAT", accessorKey: "customerSatisfactionScore" },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
