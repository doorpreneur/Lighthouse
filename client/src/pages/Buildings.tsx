import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Buildings() {
  const { data, isLoading } = useQuery({
    queryKey: ["buildings"],
    queryFn: api.getBuildings
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
          <h1 className="text-3xl font-bold tracking-tight">Buildings</h1>
        </div>

        <HealthTable 
          title="Building Health"
          data={data || []}
          columns={[
            { header: "Name", accessorKey: "name", className: "font-medium" },
            { header: "Address", accessorKey: "address" },
            { header: "Units", accessorKey: "totalUnits" },
            { header: "Occupancy", cell: (item) => `${(item.occupancyRate * 100).toFixed(0)}%` },
            { header: "Open WOs", accessorKey: "openWorkOrdersCount" },
            { header: "Safety Incidents", accessorKey: "safetyIncidentsPast12Months" },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
