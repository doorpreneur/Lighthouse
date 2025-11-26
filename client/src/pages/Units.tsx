import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function Units() {
  const { data, isLoading } = useQuery({
    queryKey: ["units"],
    queryFn: api.getUnits
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
          <h1 className="text-3xl font-bold tracking-tight">Units</h1>
        </div>

        <HealthTable 
          title="Unit Health"
          data={data || []}
          columns={[
            { header: "Unit", accessorKey: "unitLabel", className: "font-medium" },
            { header: "Building", accessorKey: "buildingId" }, // Ideally would map to name
            { 
              header: "Status", 
              cell: (item) => (
                <Badge variant={item.occupancyStatus === "occupied" ? "default" : "secondary"}>
                  {item.occupancyStatus}
                </Badge>
              ) 
            },
            { header: "Condition", accessorKey: "conditionScore" },
            { header: "Issues (12m)", accessorKey: "numberOfWorkOrdersLast12Months" },
            { header: "Payment", cell: (item) => item.rentPaymentTimeliness === 0 ? "On Time" : `${item.rentPaymentTimeliness}d Late` },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
