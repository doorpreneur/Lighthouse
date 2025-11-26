import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Team() {
  const { data, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: api.getTeam
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
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        </div>

        <HealthTable 
          title="Team Health"
          data={data || []}
          columns={[
            { header: "Name", accessorKey: "name", className: "font-medium" },
            { header: "Role", accessorKey: "role" },
            { header: "Active Tasks", accessorKey: "activeTasksCount" },
            { header: "Overdue", accessorKey: "overdueTasksCount" },
            { header: "Completion Rate", cell: (item) => `${(item.completionRate * 100).toFixed(0)}%` },
            { header: "Burnout Risk", accessorKey: "burnoutRiskScore" },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
