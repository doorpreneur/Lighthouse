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
import { Building2, Filter, DoorOpen } from "lucide-react";

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
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid gap-6 lg:grid-cols-2">
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

        <section>
          <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">Diagnostic Overview</h3>
          <DiagnosticCard 
            title="Units"
            icon={DoorOpen}
            href="/units"
            healthScore={summary.avgScore}
            trend={3}
            stats={[`${summary.totalCount} Total Units`, "233 Occupied (94%)"]}
            issues={[
              { text: "8 units offline for >30 days", severity: "critical" },
              { text: "3 active leaks reported", severity: "critical" }
            ]}
            insight={{ label: "Est. Vacancy Loss", text: "$4.2k/mo impact" }}
            primaryAction="View Vacant Units"
          />
        </section>

        <div className="space-y-4">
           <HealthTable 
             title={selectedBuildingId === "all" ? "All Unit Inventory" : `Units at ${buildingNameMap[selectedBuildingId]}`}
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
        </div>
      </div>
    </DashboardLayout>
  );
}
