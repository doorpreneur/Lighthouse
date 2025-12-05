import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";
import { Building2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Properties() {
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  const { data: buildings, isLoading } = useQuery({
    queryKey: ["buildings"],
    queryFn: api.getBuildings
  });

  const [, setLocation] = useLocation();

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

  const summary = business.buildingHealthSummary;

  const stats = [
    `Properties: ${summary.totalCount}`,
    `Avg Inspection: 88/100 (Target: 90)`,
    `Open Work Orders: 45`,
    `Safety Incidents: 0`
  ];

  const issues = [
    { text: "Riverside Apartments: Boiler system nearing end of life", severity: "critical" as const },
    { text: "The Old Mill: Roof leak in North Wing", severity: "critical" as const }, // mapped from 'high'
    { text: "Sunset Villas: Landscaping contract overdue", severity: "warning" as const }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DiagnosticCard 
            title="Properties Overview"
            icon={Building2}
            healthScore={summary.avgScore}
            trend={-1.2}
            stats={stats}
            issues={issues}
            insight={{ label: "Summary", text: "Physical asset scores are dipping slightly due to deferred maintenance." }}
            primaryAction="View Inspections"
            href="#"
            className="md:col-span-1 h-full"
          />
          
          <div className="md:col-span-2 flex flex-col justify-center space-y-4 p-6 bg-slate-50 rounded-2xl border border-dashed">
             <h3 className="text-lg font-semibold text-muted-foreground">Property Map View</h3>
             <p className="text-sm text-muted-foreground">Map integration disabled in prototype mode.</p>
          </div>
        </div>

        <HealthTable 
          title="Property List"
          data={buildings || []}
          columns={[
            { 
              header: "Property Name", 
              accessorKey: "name", 
              className: "font-medium text-foreground hover:text-primary transition-colors" 
            },
            { header: "Occupancy", cell: (item) => `${(item.occupancyRate * 100).toFixed(0)}%` },
            { header: "Open WOs", accessorKey: "openWorkOrdersCount" },
            { header: "Last Inspection", accessorKey: "lastInspectionDate", className: "font-mono text-xs" },
            { header: "Maint YTD", cell: () => `$${(Math.random() * 25000 + 5000).toFixed(0)}`, className: "font-mono" }, // Mock
            { header: "Risk Label", accessorKey: "riskLevel", cell: (item) => <span className="capitalize text-muted-foreground">{item.riskLevel}</span> },
          ]}
          // @ts-ignore - Passing onRowClick to handle navigation
          onRowClick={(item) => setLocation(`/properties/${item.id}`)}
        />
      </div>
    </DashboardLayout>
  );
}
