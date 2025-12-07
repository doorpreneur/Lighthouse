import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Filter, DoorOpen, Timer, Search, DollarSign } from "lucide-react";

import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";

export default function Units() {
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  // ... existing queries ...
  const { data: units, isLoading: isLoadingUnits } = useQuery({
    queryKey: ["units"],
    queryFn: api.getUnits
  });

  const { data: buildings, isLoading: isLoadingBuildings } = useQuery({
    queryKey: ["buildings"],
    queryFn: api.getBuildings
  });

  const [, setLocation] = useLocation();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("all");

  const filteredUnits = useMemo(() => {
    if (!units) return [];
    if (selectedBuildingId === "all") return units;
    return units.filter(u => u.buildingId === selectedBuildingId);
  }, [units, selectedBuildingId]);

  // Create a map for building names for easier lookup
  const buildingNameMap = useMemo(() => {
    if (!buildings) return {};
    return buildings.reduce((acc, b) => {
      acc[b.id] = b.name;
      return acc;
    }, {} as Record<string, string>);
  }, [buildings]);

  if (isLoadingUnits || isLoadingBuildings || !business) {
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

  const priorityAlerts: AlertItem[] = [
    {
      id: "1",
      title: "Unit 102 - Plumbing Failure",
      description: "Active leak reported. Tenant temporarily displaced.",
      severity: "critical",
      href: "/units/u-102"
    },
    {
      id: "2",
      title: "Unit 405 - HVAC",
      description: "AC unit failure during heatwave. Expedited repair needed.",
      severity: "high",
      href: "/units/u-405"
    },
    {
      id: "3",
      title: "Unit 201 - Mold Risk",
      description: "High humidity levels detected in bathroom sensor.",
      severity: "warning",
      href: "/units/u-201"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid gap-8 lg:grid-cols-2">
          <HealthHeader 
            title="Units Health"
            score={summary.avgScore}
            trend={0.5}
            trendLabel="vs last month"
            summary="Unit conditions are stable. Turn times have improved this month, reducing vacancy loss."
          />
          <PriorityAttentionCard 
            criticalCount={8} 
            alerts={priorityAlerts} 
          />
        </div>

        <div className="border-t border-border/40" />

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-primary" />
              Unit Vitals
            </h3>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <DiagnosticCard 
              title="Occupancy"
              icon={DoorOpen}
              href="/units"
              healthScore={92}
              trend={0.5}
              stats={[`${summary.totalCount} Total Units`, "233 Occupied (94%)"]}
              issues={[
                { text: "15 units currently vacant", severity: "warning" },
                { text: "8 units offline for >30 days", severity: "critical" }
              ]}
              insight={{ label: "Projected Occ", text: "95% next month" }}
              primaryAction="View Vacancy List"
            />

            <DiagnosticCard 
              title="Turnover Speed"
              icon={Timer}
              href="/units"
              healthScore={85}
              trend={3}
              stats={["Avg Turn: 12 days", "Target: 14 days"]}
              issues={[
                { text: "Painting vendor delay (3 units)", severity: "warning" },
                { text: "Carpet replacement backlog", severity: "neutral" }
              ]}
              insight={{ label: "Efficiency Gain", text: "+2 days MoM" }}
              primaryAction="Track Turnovers"
            />

            <DiagnosticCard 
              title="Physical Condition"
              icon={Search}
              href="/inspections"
              healthScore={70}
              trend={-4}
              stats={["8 Condition Issues Reported", "Last Audit: 14 days ago"]}
              issues={[
                { text: "3 active leaks reported", severity: "critical" },
                { text: "Mold remediation needed (Unit 201)", severity: "critical" }
              ]}
              insight={{ label: "CapEx Risk", text: "High" }}
              primaryAction="Schedule Repairs"
            />

            <DiagnosticCard 
              title="Market Readiness"
              icon={DollarSign}
              href="/marketing"
              healthScore={90}
              trend={1}
              stats={["12 Units Listed", "Avg Days on Market: 18"]}
              issues={[
                { text: "2 units priced above market", severity: "warning" },
                { text: "Photos missing for Unit 405", severity: "neutral" }
              ]}
              insight={{ label: "Leasing Velocity", text: "3 apps/week" }}
              primaryAction="Review Listings"
            />
          </div>
        </section>

        <div className="border-t border-border/40" />

        <section className="space-y-6">
           <div className="flex items-center justify-between">
             <div>
               <h3 className="text-lg font-bold text-foreground tracking-tight">Unit Inventory</h3>
               <p className="text-sm text-muted-foreground mt-1">Detailed status of all residential units</p>
             </div>
           </div>

           <HealthTable 
             title=""
             data={filteredUnits}
             filterColumn="unitLabel"
             customFilter={
               <div className="relative w-full sm:w-[250px]">
                 <Select 
                   value={selectedBuildingId} 
                   onValueChange={setSelectedBuildingId}
                 >
                   <SelectTrigger className="h-9 bg-white border-primary/10 focus:ring-primary/20">
                     <div className="flex items-center gap-2 text-muted-foreground">
                       <Building2 className="h-3.5 w-3.5" />
                       <SelectValue placeholder="All Properties" />
                     </div>
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Properties</SelectItem>
                     {buildings?.map(b => (
                       <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
             }
             columns={[
               { header: "Unit ID", accessorKey: "unitLabel", className: "font-mono font-medium text-foreground group-hover:text-primary transition-colors" },
               { 
                 header: "Property", 
                 cell: (item) => buildingNameMap[item.buildingId] || item.buildingId,
                 className: "text-muted-foreground"
               },
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
             // @ts-ignore - Passing onRowClick to handle navigation
             onRowClick={(item) => setLocation(`/units/${item.id}`)}
           />
        </section>
      </div>
    </DashboardLayout>
  );
}
