import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";
import { UserCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Tenants() {
  const [, setLocation] = useLocation();
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

  const stats = [
    `Active Tenants: ${summary.totalCount}`,
    `On-Time Payment: 96% (Target: 98%)`,
    `NPS Score: 42`,
    `Renewal Intent: 78%`
  ];

  const issues = [
    { text: "Michael Scott: 3 noise complaints (last 7d)", severity: "critical" as const }, // mapped from 'high' to critical for visibility
    { text: "Pam Beesly: Rent payment overdue (15 days)", severity: "critical" as const },
    { text: "Dwight Schrute: Unauthorized modifications", severity: "warning" as const }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DiagnosticCard 
            title="Tenants Overview"
            icon={UserCircle}
            healthScore={summary.avgScore}
            trend={3.1}
            stats={stats}
            issues={issues}
            insight={{ label: "Summary", text: "Tenant satisfaction is rebounding. Payment reliability remains strong." }}
            primaryAction="View Delinquencies"
            href="#"
            className="md:col-span-1 h-full"
          />
          
           <div className="md:col-span-2 flex flex-col justify-center space-y-4 p-6 bg-slate-50 rounded-2xl border border-dashed">
             <h3 className="text-lg font-semibold text-muted-foreground">Community Engagement</h3>
             <p className="text-sm text-muted-foreground">Events calendar and feedback loop metrics available in full view.</p>
          </div>
        </div>

        <HealthTable 
          title="Tenant Roster"
          data={tenants || []}
          onRowClick={(item) => setLocation(`/tenants/${item.id}`)}
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
