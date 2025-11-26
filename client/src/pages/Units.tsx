import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { VitalsGrid, VitalItem } from "@/components/domain/VitalsGrid";
import { Badge } from "@/components/ui/badge";

export default function Units() {
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  const { data: units, isLoading } = useQuery({
    queryKey: ["units"],
    queryFn: api.getUnits
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

  const summary = business.unitHealthSummary;

  const vitals: VitalItem[] = [
    { label: "Total Units", value: summary.totalCount, status: "neutral" },
    { label: "Occupancy", value: "92%", target: "95%", status: "watch" },
    { label: "Avg Turn Time", value: "12 days", target: "14 days", status: "healthy" },
    { label: "Condition Issues", value: "8", target: "0", status: "critical" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <HealthHeader 
          title="Units Health"
          score={summary.avgScore}
          trend={0.5}
          trendLabel="vs last month"
          summary="Unit conditions are stable. Turn times have improved this month, reducing vacancy loss."
        />

        <section>
          <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">Key Vitals</h3>
          <VitalsGrid items={vitals} />
        </section>

        <HealthTable 
          title="Unit Inventory"
          data={units || []}
          filterColumn="unitLabel"
          columns={[
            { header: "Unit ID", accessorKey: "unitLabel", className: "font-mono font-medium text-foreground" },
            { header: "Building", accessorKey: "buildingId" }, // Mapping needed for real name
            { 
              header: "Status", 
              cell: (item) => (
                <Badge variant={item.occupancyStatus === "occupied" ? "default" : "outline"} className="capitalize font-normal">
                  {item.occupancyStatus}
                </Badge>
              ) 
            },
            { header: "Days Vacant", cell: (item) => item.occupancyStatus !== "occupied" ? `${item.daysVacantLastTurn}d` : "-" },
            { header: "Rent", cell: () => `$${(Math.random() * 1500 + 1200).toFixed(0)}`, className: "font-mono" }, // Mock
            { header: "Tickets (90d)", accessorKey: "numberOfWorkOrdersLast12Months", cell: (item) => Math.round(item.numberOfWorkOrdersLast12Months / 4) }, // approx 90d
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
