import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";
import { Users, Activity, DollarSign, UserCheck } from "lucide-react";
import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";
import { useLocation } from "wouter";

export default function Owners() {
  const [, setLocation] = useLocation();
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
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="grid gap-8 lg:grid-cols-2">
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

        <div className="border-t border-border/40" />

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Performance Vitals
            </h3>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <DiagnosticCard 
              title="Portfolio Scale"
              icon={Users}
              href="/owners"
              healthScore={92}
              trend={3}
              stats={[`${summary.totalCount} Active Owners`, "5 New this month"]}
              issues={[
                { text: "2 owners inactive (pending offboard)", severity: "warning" },
                { text: "1 pending onboarding", severity: "neutral" }
              ]}
              insight={{ label: "Acquisition Pace", text: "+8% YoY" }}
              primaryAction="View Inactive Owners"
            />
            
            <DiagnosticCard 
              title="Occupancy Health"
              icon={Activity}
              href="/properties"
              healthScore={88}
              trend={-1}
              stats={["94% Avg Occupancy", "2.5 Months Avg Vacancy"]}
              issues={[
                { text: "Downtown properties lagging (85%)", severity: "critical" },
                { text: "Unit 4B vacancy > 60 days", severity: "warning" }
              ]}
              insight={{ label: "Vacancy Cost", text: "-$12.5k/mo" }}
              primaryAction="Analyze Vacancy"
            />
            
            <DiagnosticCard 
              title="Financial Performance"
              icon={DollarSign}
              href="/reports"
              healthScore={98}
              trend={1}
              stats={["98.2% Rent Collected", "$450k Total Revenue"]}
              issues={[
                { text: "3 late payments > 10 days", severity: "warning" },
                { text: "1 owner distribution holding", severity: "neutral" }
              ]}
              insight={{ label: "Revenue vs Target", text: "+2.5%" }}
              primaryAction="View Financials"
            />
            
            <DiagnosticCard 
              title="Owner Retention"
              icon={UserCheck}
              href="/owners"
              healthScore={65}
              trend={-5}
              stats={["2 'At Risk' Owners", "95% Renewal Rate"]}
              issues={[
                { text: "Contract renewal stalled (Smith LLC)", severity: "critical" },
                { text: "Recent NPS dip reported", severity: "warning" }
              ]}
              insight={{ label: "Churn Risk Est.", text: "$24k ARR" }}
              primaryAction="Review At-Risk Accounts"
            />
          </div>
        </section>

        <div className="border-t border-border/40" />

        <section className="space-y-6">
           <div className="flex items-center justify-between">
             <div>
               <h3 className="text-lg font-bold text-foreground tracking-tight">Owner Directory</h3>
               <p className="text-sm text-muted-foreground mt-1">Manage and monitor individual owner performance</p>
             </div>
           </div>

          <HealthTable 
            title=""
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
        </section>
      </div>
    </DashboardLayout>
  );
}
