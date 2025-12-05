import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";
import { Users } from "lucide-react";
import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";
import { useLocation } from "wouter";

export default function Owners() {
  const [, setLocation] = useLocation();
  // ... existing queries ...
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  const { data: owners, isLoading } = useQuery({
    queryKey: ["owners"],
    queryFn: api.getOwners
  });

  if (isLoading || !business) {
    // ... existing skeleton ...
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

  const summary = business.ownerHealthSummary;
  
  const priorityAlerts: AlertItem[] = [
    {
      id: "1",
      title: "Acme Properties LLC",
      description: "Portfolio health dropped 15% due to maintenance surge.",
      severity: "critical",
      href: "/owners/own-001"
    },
    {
      id: "2",
      title: "Summit Holdings",
      description: "Contract renewal pending - 30 days remaining.",
      severity: "high",
      href: "/owners/own-002"
    },
    {
      id: "3",
      title: "Westside Management",
      description: "Owner distributions delayed by 5 days.",
      severity: "warning",
      href: "/owners/own-003"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid gap-6 lg:grid-cols-2">
          <HealthHeader 
            title="Owners Health"
            score={summary.avgScore}
            trend={2.4}
            trendLabel="vs last month"
            summary="Owner sentiment is generally positive, though maintenance cost concerns are rising in the downtown portfolio."
          />
          <PriorityAttentionCard 
            criticalCount={2} 
            alerts={priorityAlerts} 
          />
        </div>

        <section>
          <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">Diagnostic Overview</h3>
          <DiagnosticCard 
            title="Owners"
            icon={Users}
            href="/owners"
            healthScore={summary.avgScore}
            trend={-2}
            stats={[`${summary.totalCount} Active Owners`, "248 Properties Managed"]}
            issues={[
              { text: "3 owners with >10% vacancy", severity: "critical" },
              { text: "1 owner requesting exit review", severity: "warning" }
            ]}
            insight={{ label: "Top Performer", text: "Smith Holdings (+12% ROI)" }}
            primaryAction="Review At-Risk Owners"
          />
        </section>

        <HealthTable 
          title="Owner Directory"
          // ... rest of table ...
          data={owners || []}
          onRowClick={(item) => setLocation(`/owners/${item.id}`)}
          columns={[
            { header: "Owner Name", accessorKey: "name", className: "font-medium text-foreground" },
            { header: "Units", accessorKey: "unitsCount" },
            { header: "Avg Cashflow", cell: () => `$${(Math.random() * 5000 + 2000).toFixed(0)}`, className: "font-mono" }, // Mock
            { header: "Maint/Unit", cell: (item) => `$${item.maintenanceSpendPerUnit}`, className: "font-mono" },
            { header: "Vacancy", cell: (item) => `${((1 - item.occupancyRate) * 100).toFixed(1)}%` },
            { header: "Risk Label", accessorKey: "riskLevel", cell: (item) => <span className="capitalize text-muted-foreground">{item.riskLevel}</span> },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
