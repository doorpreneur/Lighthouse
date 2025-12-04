import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Building2, 
  DoorOpen, 
  UserCircle, 
  Workflow, 
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";
import { CategorySummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskDistributionCard } from "@/components/dashboard/RiskDistributionCard";
import { RevenueTrendCard } from "@/components/dashboard/RevenueTrendCard";

function SummaryWidget({ 
  title, 
  summary, 
  icon: Icon,
  href
}: { 
  title: string; 
  summary: CategorySummary; 
  icon: any;
  href: string;
}) {
  // Calculate a mock trend based on health score (just for visual demo)
  const trend = summary.avgScore > 85 ? "up" : summary.avgScore < 60 ? "down" : "neutral";
  const trendVal = summary.avgScore > 85 ? "+2.5%" : summary.avgScore < 60 ? "-1.2%" : "0.0%";

  return (
    <Link href={href}>
      <div className="cursor-pointer h-full">
        <MetricCard
          title={title}
          value={summary.avgScore}
          icon={<Icon className="h-5 w-5" />}
          trend={trend}
          trendValue={trendVal}
          subValue={`vs last month`}
          status={summary.avgScore >= 80 ? "healthy" : summary.avgScore >= 50 ? "watch" : "critical"}
          className="h-full"
        />
      </div>
    </Link>
  );
}

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

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          
          {/* Left Column - Stats & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Health */}
            <Card className="border-0 shadow-soft rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-blue-600 text-primary-foreground overflow-hidden relative">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 translate-x-20"></div>
              <div className="absolute left-0 bottom-0 h-32 w-32 bg-white/5 rounded-full blur-3xl -translate-x-10 translate-y-10"></div>
              <CardContent className="p-8 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <p className="text-primary-foreground/80 font-medium mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"/>
                    Overall Business Health
                  </p>
                  <div className="flex items-baseline gap-4">
                    <h2 className="text-5xl font-bold tracking-tight">{business.overallScore}</h2>
                    <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm border border-white/10 shadow-sm">
                      <ArrowUpRight className="h-4 w-4" />
                      +4.2%
                    </div>
                  </div>
                  <p className="mt-4 text-primary-foreground/80 leading-relaxed text-sm max-w-md">
                    Your ecosystem is in the <strong>{business.riskLevel}</strong> zone. 
                    Building performance is up, but check workflow bottlenecks.
                  </p>
                </div>
                <div className="hidden sm:block shrink-0">
                  <div className="h-28 w-28 rounded-full border-8 border-white/20 flex items-center justify-center relative shadow-inner">
                    <div className="absolute inset-0 rounded-full border-8 border-white/40 border-t-transparent rotate-45"></div>
                    <span className="text-3xl font-bold">A+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Widgets Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SummaryWidget 
                title="Owners" 
                summary={business.ownerHealthSummary} 
                icon={Users} 
                href="/owners"
              />
              <SummaryWidget 
                title="Buildings" 
                summary={business.buildingHealthSummary} 
                icon={Building2} 
                href="/buildings"
              />
              <SummaryWidget 
                title="Units" 
                summary={business.unitHealthSummary} 
                icon={DoorOpen} 
                href="/units"
              />
              <SummaryWidget 
                title="Tenants" 
                summary={business.tenantHealthSummary} 
                icon={UserCircle} 
                href="/tenants"
              />
              <SummaryWidget 
                title="Workflows" 
                summary={business.workflowHealthSummary} 
                icon={Workflow} 
                href="/workflows"
              />
              <SummaryWidget 
                title="Team" 
                summary={business.teamHealthSummary} 
                icon={Briefcase} 
                href="/team"
              />
            </div>

            {/* Analytics Section */}
            <div className="grid gap-6 md:grid-cols-2">
               <RevenueTrendCard />
               <RiskDistributionCard 
                 criticalCount={totalCritical} 
                 watchCount={totalWatch} 
                 healthyCount={totalHealthy}
               />
            </div>
          </div>

          {/* Right Column - Priority Attention */}
          <div className="space-y-6">
            <Card className="border-0 shadow-soft card-gradient h-full max-h-[calc(100vh-120px)] sticky top-24 flex flex-col">
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
              
              <div className="overflow-y-auto flex-1 p-2 space-y-2">
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
                          Chronic instability reported. 3 recurring leaks in 60 days.
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          The Heights
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary self-center" />
                    </div>
                  </div>
                </Link>

                {/* High Risk Building Alert */}
                <Link href="/buildings/bld-001">
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
                          HVAC audit recommended. Capital reserves underfunded.
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          The Heights
                        </div>
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
                          5 leases expiring in next 30 days. Renewal offers pending.
                        </p>
                      </div>
                   </div>
                </div>

                {/* Mock Alert 4 */}
                <div className="p-3 rounded-xl bg-white border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden opacity-80">
                   <div className="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
                   <div className="flex gap-3 pl-2">
                      <div className="mt-1">
                        <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase tracking-wider text-blue-600 border-blue-200 bg-blue-50">Workflow</Badge>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="font-semibold text-sm text-foreground">
                          Turnover Delay
                        </div>
                        <p className="text-xs text-muted-foreground leading-snug">
                          Avg turn time increased to 18 days (+4 days vs avg).
                        </p>
                      </div>
                   </div>
                </div>

              </div>
              
              <div className="p-3 border-t border-border/50 bg-muted/20">
                 <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground hover:text-primary">
                    View All Alerts
                 </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
