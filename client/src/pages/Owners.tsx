import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Owners() {
  const { data, isLoading } = useQuery({
    queryKey: ["owners"],
    queryFn: api.getOwners
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
          <h1 className="text-3xl font-bold tracking-tight">Owners</h1>
        </div>

        <HealthTable 
          title="Owner Health"
          data={data || []}
          columns={[
            { header: "Name", accessorKey: "name", className: "font-medium" },
            { header: "Units", accessorKey: "unitsCount" },
            { header: "Occupancy", cell: (item) => `${(item.occupancyRate * 100).toFixed(0)}%` },
            { header: "Collection", cell: (item) => `${(item.rentCollectionRate * 100).toFixed(0)}%` },
            { header: "Maint. Spend", cell: (item) => `$${item.maintenanceSpendPerUnit}` },
            { header: "Trend", accessorKey: "maintenanceTrend" },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
