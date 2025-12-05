import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";
import { Users } from "lucide-react";
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
  
  // Map vitals to stats strings
  const stats = [
    `Active Owners: ${summary.totalCount}`,
    `Avg Occupancy: 94% (Target: 95%)`,
    `Rent Collection: 98.2%`,
    `Churn Risk: 2`
  ];

  // Map priority alerts to issues
  const issues = [
    { text: "Acme Properties LLC: Portfolio health dropped 15%", severity: "critical" as const },
    { text: "Summit Holdings: Contract renewal pending (30 days)", severity: "warning" as const },
    { text: "Westside Management: Owner distributions delayed", severity: "warning" as const }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DiagnosticCard 
            title="Owners Overview"
            icon={Users}
            healthScore={summary.avgScore}
            trend={2.4}
            stats={stats}
            issues={issues}
            insight={{ label: "Summary", text: "Owner sentiment is generally positive, though maintenance cost concerns are rising." }}
            primaryAction="Manage Owners"
            href="#"
            className="md:col-span-1 h-full"
          />
          
          {/* Placeholder for potentially other summary widgets or just leave empty/centered? 
              The user asked to redesign the cards. If I just put one card, it might look odd.
              But sticking to the request "be the same as the card designs in the overview page".
              I will put it in a grid but maybe make it span or just sit there.
              Actually, if I make it span full width it will look distorted.
              I'll keep it in a grid col-span-1 to match the look perfectly.
          */}
          <div className="md:col-span-2 flex flex-col justify-center space-y-4 p-6 bg-slate-50 rounded-2xl border border-dashed">
            <h3 className="text-lg font-semibold text-muted-foreground">Detailed Analytics View</h3>
            <p className="text-sm text-muted-foreground">Select an owner from the directory below to view detailed portfolio performance.</p>
          </div>
        </div>

        <HealthTable 
          title="Owner Directory"
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
