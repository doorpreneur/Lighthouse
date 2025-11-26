import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Activity, 
  Users, 
  Building2, 
  DoorOpen, 
  UserCircle, 
  Workflow, 
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import { CategorySummary } from "@/lib/types";

function SummaryCard({ 
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
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold font-mono">{summary.avgScore}</div>
            <HealthBadge score={summary.avgScore} size="sm" />
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-health-good" /> Healthy</span>
              <span>{summary.healthyCount}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="flex items-center"><AlertCircle className="w-3 h-3 mr-1 text-health-watch" /> Watch</span>
              <span>{summary.watchCount}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span className="flex items-center"><AlertTriangle className="w-3 h-3 mr-1 text-health-critical" /> Critical</span>
              <span className="font-semibold text-health-critical">{summary.criticalCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
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
          <Skeleton className="h-12 w-1/3" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground">
              Business Health Monitoring System
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-card border rounded-lg p-4 shadow-sm">
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall Score</div>
              <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</div>
            </div>
            <HealthBadge score={business.overallScore} riskLevel={business.riskLevel} size="xl" showLabel />
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SummaryCard 
            title="Owners" 
            summary={business.ownerHealthSummary} 
            icon={Users} 
            href="/owners"
          />
          <SummaryCard 
            title="Buildings" 
            summary={business.buildingHealthSummary} 
            icon={Building2} 
            href="/buildings"
          />
          <SummaryCard 
            title="Units" 
            summary={business.unitHealthSummary} 
            icon={DoorOpen} 
            href="/units"
          />
          <SummaryCard 
            title="Tenants" 
            summary={business.tenantHealthSummary} 
            icon={UserCircle} 
            href="/tenants"
          />
          <SummaryCard 
            title="Workflows" 
            summary={business.workflowHealthSummary} 
            icon={Workflow} 
            href="/workflows"
          />
          <SummaryCard 
            title="Team" 
            summary={business.teamHealthSummary} 
            icon={Briefcase} 
            href="/team"
          />
        </div>
        
        {/* Alert Section (Mockup) */}
        {business.riskLevel === "critical" || business.riskLevel === "watch" ? (
          <Card className="border-health-watch/50 bg-health-watch-bg/10">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-health-watch" />
              <CardTitle className="text-lg">Attention Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Several areas of the business are flagging for attention. Review the critical items in the 
                <strong> {business.buildingHealthSummary.criticalCount > 0 ? "Buildings" : "Workflows"}</strong> section.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
