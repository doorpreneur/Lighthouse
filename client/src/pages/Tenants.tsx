import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function Tenants() {
  const { data, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: api.getTenants
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
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
        </div>

        <HealthTable 
          title="Tenant Health"
          data={data || []}
          columns={[
            { header: "Name", accessorKey: "name", className: "font-medium" },
            { header: "Unit", accessorKey: "unitId" },
            { header: "On-Time Rate", cell: (item) => `${(item.onTimePaymentRate * 100).toFixed(0)}%` },
            { header: "Complaints Filed", accessorKey: "numberOfComplaintsFiled" },
            { header: "Complaints Against", accessorKey: "numberOfComplaintsAgainst" },
            { header: "Renewal Prob", cell: (item) => `${(item.leaseRenewalLikelihood * 100).toFixed(0)}%` },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
