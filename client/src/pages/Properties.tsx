import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";
import { Building2 } from "lucide-react";
import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";
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

  const priorityAlerts: AlertItem[] = [
    {
      id: "1",
      title: "Riverside Apartments",
      description: "Boiler system nearing end of life. Immediate inspection required.",
      severity: "critical",
      href: "/properties/bld-002"
    },
    {
      id: "2",
      title: "The Old Mill",
      description: "Roof leak reported in North Wing affecting 3 units.",
      severity: "high",
      href: "/properties/bld-004"
    },
    {
      id: "3",
      title: "Sunset Villas",
      description: "Landscaping contract renewal overdue.",
      severity: "warning",
      href: "/properties/bld-003"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid gap-6 lg:grid-cols-2">
          <HealthHeader 
            title="Properties Health"
            score={summary.avgScore}
            trend={-1.2}
            trendLabel="vs last month"
            summary="Physical asset scores are dipping slightly due to deferred maintenance in the older properties."
          />
          <PriorityAttentionCard 
            criticalCount={5} 
            alerts={priorityAlerts} 
          />
        </div>

        <section>
          <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">Diagnostic Overview</h3>
          <DiagnosticCard 
            title="Properties"
            icon={Building2}
            href="/properties"
            healthScore={summary.avgScore}
            trend={1}
            stats={[`${summary.totalCount} Properties`, "94% Occupancy Rate"]}
            issues={[
              { text: "2 critical safety inspections overdue", severity: "critical" },
              { text: "5 properties with HVAC alerts", severity: "warning" }
            ]}
            insight={{ label: "Needs Attention", text: "Sunset Blvd Apts (Low Occ)" }}
            primaryAction="View Critical Properties"
          />
        </section>

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
