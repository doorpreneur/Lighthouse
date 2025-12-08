import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Building2, 
  DoorOpen, 
  UserCircle, 
  Workflow, 
  Briefcase,
  Calendar,
  Download,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DiagnosticCard } from "@/components/dashboard/DiagnosticCard";

export default function Dashboard() {
  const { data: business, isLoading } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  if (isLoading || !business) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between">
             <Skeleton className="h-10 w-48" />
             <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate aggregate risk counts for the distribution card
  const summaries = [
    business.ownerHealthSummary,
    business.buildingHealthSummary,
    business.unitHealthSummary,
    business.tenantHealthSummary,
    business.workflowHealthSummary,
    business.teamHealthSummary
  ];

  const totalCritical = summaries.reduce((acc, curr) => acc + curr.criticalCount, 0);
  const totalWatch = summaries.reduce((acc, curr) => acc + curr.watchCount, 0);
  const totalHealthy = summaries.reduce((acc, curr) => acc + curr.healthyCount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Overview</h1>
            <p className="text-muted-foreground mt-1">
              Real-time health monitoring across your property ecosystem.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border shadow-sm text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/5">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Top Section: Health & Priority */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Overall Health */}
          <div className="lg:col-span-2">
            <HealthHeader 
              title="Overall Business Health"
              score={business.overallScore}
              trend={4.2}
              trendLabel="vs last month"
              summary={`Your ecosystem is in the ${business.riskLevel} zone. Property performance is up, but check workflow bottlenecks.`}
              variant="stage"
              targetScore={85}
            />
          </div>

          {/* Priority Attention */}
          <Card className="border-0 shadow-soft card-gradient flex flex-col h-full">
            <CardHeader className="pb-3 border-b border-border/50 bg-white/50 backdrop-blur-sm">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                Priority Attention
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {totalCritical} critical issues require action
              </p>
            </CardHeader>
            
            <div className="overflow-y-auto flex-1 p-2 space-y-2 max-h-[300px] lg:max-h-none">
              {/* Critical Unit Alert */}
              <Link href="/units/u-102">
                <div className="p-3 rounded-xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-red-500"></div>
                  <div className="flex gap-3 pl-2">
                    <div className="mt-1">
                      <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase tracking-wider">Critical</Badge>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        Unit 102 - Plumbing Risk
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">
                        Chronic instability reported. 3 recurring leaks.
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary self-center" />
                  </div>
                </div>
              </Link>

              {/* High Risk Property Alert */}
              <Link href="/properties/bld-001">
                <div className="p-3 rounded-xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                  <div className="absolute left-0 top-0 w-1 h-full bg-orange-500"></div>
                  <div className="flex gap-3 pl-2">
                    <div className="mt-1">
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase tracking-wider text-orange-600 border-orange-200 bg-orange-50">High Risk</Badge>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        Mechanical Aging
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">
                        HVAC audit recommended.
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary self-center" />
                  </div>
                </div>
              </Link>

              {/* Mock Alert 3 */}
              <div className="p-3 rounded-xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden opacity-80">
                 <div className="absolute left-0 top-0 w-1 h-full bg-yellow-500"></div>
                 <div className="flex gap-3 pl-2">
                    <div className="mt-1">
                      <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase tracking-wider text-yellow-600 border-yellow-200 bg-yellow-50">Warning</Badge>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-sm text-foreground">
                        Lease Expirations
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">
                        5 leases expiring in next 30 days.
                      </p>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="p-3 border-t border-border/50 bg-muted/20 mt-auto">
               <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground hover:text-primary">
                  View All Alerts
               </Button>
            </div>
          </Card>
        </div>

        {/* Diagnostic Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DiagnosticCard 
            title="Owners"
            icon={Users}
            href="/owners"
            healthScore={88}
            trend={-2}
            stats={["71 Active Owners", "248 Properties Managed"]}
            issues={[
              { text: "3 owners with >10% vacancy", severity: "critical" },
              { text: "1 owner requesting exit review", severity: "warning" }
            ]}
            insight={{ label: "Top Performer", text: "Smith Holdings (+12% ROI)" }}
            primaryAction="Review At-Risk Owners"
          />

          <DiagnosticCard 
            title="Properties"
            icon={Building2}
            href="/properties"
            healthScore={92}
            trend={1}
            stats={["50 Properties | 248 Units", "94% Occupancy Rate"]}
            issues={[
              { text: "2 critical safety inspections overdue", severity: "critical" },
              { text: "5 properties with HVAC alerts", severity: "warning" }
            ]}
            insight={{ label: "Needs Attention", text: "Sunset Blvd Apts (Low Occ)" }}
            primaryAction="View Critical Properties"
          />

          <DiagnosticCard 
            title="Units"
            icon={DoorOpen}
            href="/units"
            healthScore={85}
            trend={3}
            stats={["248 Total | 233 Occupied (94%)", "15 Vacant Units"]}
            issues={[
              { text: "8 units offline for >30 days", severity: "critical" },
              { text: "3 active leaks reported", severity: "critical" }
            ]}
            insight={{ label: "Est. Vacancy Loss", text: "$4.2k/mo impact" }}
            primaryAction="View Vacant Units"
          />

          <DiagnosticCard 
            title="Tenants"
            icon={UserCircle}
            href="/tenants"
            healthScore={96}
            trend={0}
            stats={["233 Active Tenants", "96% Collection Rate"]}
            issues={[
              { text: "12 late payments this month", severity: "warning" },
              { text: "2 lease violations reported", severity: "warning" }
            ]}
            insight={{ label: "Arrears Risk", text: "$2.1k pending" }}
            primaryAction="Review Delinquencies"
          />

          <DiagnosticCard 
            title="Workflows"
            icon={Workflow}
            href="/workflows"
            healthScore={78}
            trend={-4}
            stats={["Active Tasks: 47", "Overdue: 12 | Urgent: 8"]}
            issues={[
              { text: "Maintenance backlog growing", severity: "critical" },
              { text: "3 urgent approvals pending", severity: "critical" }
            ]}
            insight={{ label: "Main Bottleneck", text: "Plumbing Vendor (Avg 5d)" }}
            primaryAction="Clear Backlog"
          />

          <DiagnosticCard 
            title="Team"
            icon={Briefcase}
            href="/team"
            healthScore={94}
            trend={2}
            stats={["8 Team Members", "31 Properties/Person (avg)"]}
            issues={[
              { text: "1 property manager overloaded", severity: "warning" },
              { text: "2 training certifications expiring", severity: "neutral" }
            ]}
            insight={{ label: "Top Closer", text: "Sarah J. (100% rate)" }}
            primaryAction="Balance Workloads"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
