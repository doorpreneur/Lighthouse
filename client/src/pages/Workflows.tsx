import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { VitalsGrid, VitalItem } from "@/components/domain/VitalsGrid";
import { Badge } from "@/components/ui/badge";

import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";

import { UnitLifecycleTimeline, type TimelineStep } from "@/components/dashboard/UnitLifecycleTimeline";
import { useState } from "react";

export default function Workflows() {
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  const { data: workflows, isLoading } = useQuery({
    queryKey: ["workflows"],
    queryFn: api.getWorkflows
  });

  // Mock timeline data
  const timelineSteps: TimelineStep[] = [
    { id: "pre-move-out", label: "Pre-Move Out Insp", status: "completed" },
    { id: "move-out", label: "Move Out", status: "completed" },
    { id: "move-out-insp", label: "Move Out Insp", status: "current" },
    { id: "punch-list", label: "Punch List", status: "pending" },
    { id: "maintenance", label: "Maintenance", status: "pending" },
    { id: "cleaning", label: "Cleaning", status: "pending" },
    { id: "rent-ready", label: "Rent Ready", status: "pending" },
  ];

  const [activeStep, setActiveStep] = useState<TimelineStep>(timelineSteps[2]); // Default to current

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

  const summary = business.workflowHealthSummary;

  const priorityAlerts: AlertItem[] = [
    {
      id: "1",
      title: "Unit Turn Process (Standard)",
      description: "Average duration exceeded SLA by 4 days.",
      severity: "high",
      href: "/workflows/wf-001"
    },
    {
      id: "2",
      title: "Emergency Repairs",
      description: "Approvals pending for 3 critical tickets.",
      severity: "critical",
      href: "/workflows/wf-002"
    },
    {
      id: "3",
      title: "Lease Renewals",
      description: "Backlog of 12 renewals waiting for review.",
      severity: "warning",
      href: "/workflows/wf-003"
    }
  ];

  const vitals: VitalItem[] = [
    { label: "Active Processes", value: "12", status: "neutral" },
    { label: "SLA Adherence", value: "89%", target: "95%", status: "watch" },
    { label: "Avg Cycle Time", value: "4.2 days", target: "5.0 days", status: "healthy" },
    { label: "Bottlenecks", value: "3", target: "0", status: "critical" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid gap-6 lg:grid-cols-2">
          <HealthHeader 
            title="Workflow Health"
            score={summary.avgScore}
            trend={-5.4}
            trendLabel="vs last month"
            summary="Leasing workflows are slowing down due to high volume. Maintenance workflows are performing optimally."
          />
          <PriorityAttentionCard 
            criticalCount={3} 
            alerts={priorityAlerts} 
          />
        </div>

        {/* Unit Lifecycle Timeline Section */}
        <section className="bg-white rounded-2xl p-6 shadow-soft border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Unit Lifecycle Tracker</h3>
              <p className="text-sm text-muted-foreground">Live view of Unit 402 turnover process</p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Status: {activeStep.label}
            </Badge>
          </div>
          
          <UnitLifecycleTimeline 
            steps={timelineSteps} 
            onStepClick={setActiveStep}
            className="mb-6"
          />

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Step Details: {activeStep.label}</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Responsible</span>
                <span className="font-medium">Maintenance Team</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Duration</span>
                <span className="font-medium">2 Days (Est)</span>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Status</span>
                <span className="font-medium capitalize">{activeStep.status}</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-4">Key Vitals</h3>
          <VitalsGrid items={vitals} />
        </section>

        <HealthTable 
          title="Operational Workflows"
          data={workflows || []}
          columns={[
            { header: "Workflow Name", accessorKey: "name", className: "font-medium text-foreground" },
            { 
              header: "Type", 
              cell: (item) => <Badge variant="outline" className="font-mono text-[10px]">{item.workflowType}</Badge>
            },
            { header: "Avg Cycle Time", cell: (item) => `${item.avgCycleTimeDays}d` },
            { header: "SLA Adherence", cell: (item) => `${(item.onTimeCompletionRate * 100).toFixed(0)}%` },
            { header: "Backlog", accessorKey: "backlogCount" },
            { 
              header: "Status", 
              cell: (item) => item.backlogCount > 10 ? 
                <Badge variant="destructive" className="text-[10px]">Bottleneck</Badge> : 
                <Badge variant="secondary" className="text-[10px] text-health-good bg-health-good-bg">Optimal</Badge> 
            },
          ]}
        />
      </div>
    </DashboardLayout>
  );
}
