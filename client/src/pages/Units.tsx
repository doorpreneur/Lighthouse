import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Building2, DoorOpen } from "lucide-react";

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

  const stats = [
    `Total Units: ${summary.totalCount}`,
    `Occupancy: 92% (Target: 95%)`,
    `Avg Turn Time: 12 days`,
    `Condition Issues: 8`
  ];

  const issues = [
    { text: "Unit 102: Active leak reported", severity: "critical" as const },
    { text: "Unit 405: HVAC failure", severity: "critical" as const },
    { text: "Unit 201: High humidity levels", severity: "warning" as const }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DiagnosticCard 
            title="Units Overview"
            icon={DoorOpen}
            healthScore={summary.avgScore}
            trend={0.5}
            stats={stats}
            issues={issues}
            insight={{ label: "Summary", text: "Unit conditions are stable. Turn times have improved." }}
            primaryAction="View Vacant Units"
            href="#"
            className="md:col-span-1 h-full"
          />
          
           <div className="md:col-span-2 flex flex-col justify-center space-y-4 p-6 bg-slate-50 rounded-2xl border border-dashed">
             <h3 className="text-lg font-semibold text-muted-foreground">Unit Turn Efficiency</h3>
             <p className="text-sm text-muted-foreground">Turn time analytics and vendor performance metrics available in full view.</p>
          </div>
        </div>

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
