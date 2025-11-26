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
  Download
} from "lucide-react";
import { Link } from "wouter";
import { CategorySummary } from "@/lib/types";
import { Button } from "@/components/ui/button";

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

        {/* Main Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Overall Health - Featured Card */}
          <Card className="md:col-span-2 lg:col-span-3 border-0 shadow-soft rounded-2xl bg-gradient-to-r from-primary/90 to-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 translate-x-20"></div>
            <CardContent className="p-8 relative z-10 flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 font-medium mb-2">Overall Business Health</p>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-5xl font-bold">{business.overallScore}</h2>
                  <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    +4.2% from last month
                  </div>
                </div>
                <p className="mt-4 text-primary-foreground/70 max-w-xl">
                  Your business is currently in the <strong>{business.riskLevel}</strong> zone. 
                  Building performance has improved by 12%, while workflow efficiency requires attention.
                </p>
              </div>
              <div className="hidden md:block">
                {/* Decorative circular chart representation */}
                <div className="h-32 w-32 rounded-full border-8 border-white/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-8 border-white border-t-transparent rotate-45 opacity-80"></div>
                  <span className="text-2xl font-bold">A+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <SummaryWidget 
            title="Owners Health" 
            summary={business.ownerHealthSummary} 
            icon={Users} 
            href="/owners"
          />
          <SummaryWidget 
            title="Buildings Condition" 
            summary={business.buildingHealthSummary} 
            icon={Building2} 
            href="/buildings"
          />
          <SummaryWidget 
            title="Unit Occupancy" 
            summary={business.unitHealthSummary} 
            icon={DoorOpen} 
            href="/units"
          />
          <SummaryWidget 
            title="Tenant Satisfaction" 
            summary={business.tenantHealthSummary} 
            icon={UserCircle} 
            href="/tenants"
          />
          <SummaryWidget 
            title="Workflow Efficiency" 
            summary={business.workflowHealthSummary} 
            icon={Workflow} 
            href="/workflows"
          />
          <SummaryWidget 
            title="Team Performance" 
            summary={business.teamHealthSummary} 
            icon={Briefcase} 
            href="/team"
          />
        </div>
        
        {/* Charts / Analytics Section Placeholder */}
        <div className="grid gap-6 md:grid-cols-2">
           <Card className="border-0 shadow-soft rounded-2xl p-6">
             <CardTitle className="text-lg mb-4">Revenue vs Maintenance</CardTitle>
             <div className="h-64 bg-muted/30 rounded-xl flex items-center justify-center border border-dashed">
               <p className="text-muted-foreground">Revenue Chart Placeholder</p>
             </div>
           </Card>
           <Card className="border-0 shadow-soft rounded-2xl p-6">
             <CardTitle className="text-lg mb-4">Risk Distribution</CardTitle>
             <div className="h-64 bg-muted/30 rounded-xl flex items-center justify-center border border-dashed">
               <p className="text-muted-foreground">Distribution Chart Placeholder</p>
             </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
