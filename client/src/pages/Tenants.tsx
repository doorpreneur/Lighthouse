import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";
import { UserCircle } from "lucide-react";

import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";
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

  const priorityAlerts: AlertItem[] = [
    {
      id: "1",
      title: "Michael Scott",
      description: "3 noise complaints in last 7 days. Violation notice required.",
      severity: "high",
      href: "/tenants/t-001"
    },
    {
      id: "2",
      title: "Pam Beesly",
      description: "Rent payment overdue by 15 days.",
      severity: "critical",
      href: "/tenants/t-002"
    },
    {
      id: "3",
      title: "Dwight Schrute",
      description: "Unauthorized modifications to unit reported.",
      severity: "warning",
      href: "/tenants/t-003"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid gap-8 lg:grid-cols-2">
          <HealthHeader 
            title="Tenants Health"
            score={summary.avgScore}
            trend={3.1}
            trendLabel="vs last month"
            summary="Tenant satisfaction is rebounding after the recent community events. Payment reliability remains strong."
          />
          <PriorityAttentionCard 
            criticalCount={12} 
            alerts={priorityAlerts} 
          />
        </div>

        <div className="border-t border-border/40" />

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Tenant Vitals
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <DiagnosticCard 
              title="Tenants"
              icon={UserCircle}
              href="/tenants"
              healthScore={summary.avgScore}
              trend={0}
              stats={[`${summary.totalCount} Active Tenants`, "96% Collection Rate"]}
              issues={[
                { text: "12 late payments this month", severity: "warning" },
                { text: "2 lease violations reported", severity: "warning" }
              ]}
              insight={{ label: "Arrears Risk", text: "$2.1k pending" }}
              primaryAction="Review Delinquencies"
            />
          </div>
        </section>

        <div className="border-t border-border/40" />

        <section className="space-y-6">
           <div className="flex items-center justify-between">
             <div>
               <h3 className="text-lg font-bold text-foreground tracking-tight">Tenant Roster</h3>
               <p className="text-sm text-muted-foreground mt-1">Current residents and lease status</p>
             </div>
           </div>

          <HealthTable 
            title=""
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
        </section>
      </div>
    </DashboardLayout>
  );
}
