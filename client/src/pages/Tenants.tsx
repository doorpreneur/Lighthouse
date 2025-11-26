import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { VitalsGrid, VitalItem } from "@/components/domain/VitalsGrid";

export default function Tenants() {
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  const { data: tenants, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: api.getTenants
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

  const summary = business.tenantHealthSummary;

  const vitals: VitalItem[] = [
    { label: "Active Tenants", value: summary.totalCount, status: "neutral" },
    { label: "On-Time Payment", value: "96%", target: "98%", status: "watch" },
    { label: "NPS Score", value: "42", target: "50", status: "watch" },
    { label: "Renewal Intent", value: "78%", target: "75%", status: "healthy" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <HealthHeader 
          title="Tenants Health"
          score={summary.avgScore}
          trend={3.1}
          trendLabel="vs last month"
          summary="Tenant satisfaction is rebounding after the recent community events. Payment reliability remains strong."
        />

        <section>
          <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">Key Vitals</h3>
          <VitalsGrid items={vitals} />
        </section>

        <HealthTable 
          title="Tenant Roster"
          data={tenants || []}
          columns={[
            { header: "Tenant Name", accessorKey: "name", className: "font-medium text-foreground" },
            { header: "Unit", accessorKey: "unitId" },
            { header: "On-Time %", cell: (item) => `${(item.onTimePaymentRate * 100).toFixed(0)}%` },
            { header: "Open Tickets", accessorKey: "numberOfComplaintsFiled" }, // using complaints as proxy
            { header: "Last Ticket", cell: () => `${(Math.random() * 10).toFixed(0)} days ago`, className: "text-muted-foreground text-xs" }, // Mock
            { header: "Renewal Prob", cell: (item) => `${(item.leaseRenewalLikelihood * 100).toFixed(0)}%` },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
