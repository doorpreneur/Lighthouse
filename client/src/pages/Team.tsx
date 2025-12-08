import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/mock-data";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HealthTable } from "@/components/HealthTable";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthHeader } from "@/components/domain/HealthHeader";
import { VitalsGrid, VitalItem } from "@/components/domain/VitalsGrid";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Minus, CheckCircle, AlertTriangle, AlertOctagon, Sun, Sparkles, BarChart3, ArrowRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

import { PriorityAttentionCard, AlertItem } from "@/components/domain/PriorityAttentionCard";
import { useLocation } from "wouter";

const Sparkline = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 24;
  const width = 60;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-primary/50"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TrendIndicator = ({ trend, label }: { trend: "up" | "down" | "stable", label: string }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5">
        {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-health-good" />}
        {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-health-critical" />}
        {trend === "stable" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
};

const DailyFocus = () => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm mb-8 animate-in slide-in-from-top-4 duration-700">
    <div className="flex items-center gap-2 mb-4">
      <Sun className="h-5 w-5 text-orange-500 fill-orange-500 animate-pulse" />
      <h2 className="text-sm font-bold tracking-widest text-blue-900 uppercase">Today's Focus</h2>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      <div className="flex gap-3 items-start">
        <div className="bg-white p-2 rounded-lg shadow-sm border border-blue-100 text-blue-600 font-bold text-lg h-10 w-10 flex items-center justify-center shrink-0">1</div>
        <div>
          <h3 className="font-bold text-blue-950 mb-1">Clear Maintenance Backlog</h3>
          <p className="text-sm text-blue-800/80 leading-snug">Review 5 pending approvals for HVAC repairs before noon.</p>
        </div>
      </div>
      <div className="flex gap-3 items-start">
        <div className="bg-white p-2 rounded-lg shadow-sm border border-blue-100 text-blue-600 font-bold text-lg h-10 w-10 flex items-center justify-center shrink-0">2</div>
        <div>
          <h3 className="font-bold text-blue-950 mb-1">Onboard New Leases</h3>
          <p className="text-sm text-blue-800/80 leading-snug">Finalize move-in checklist for Units 304 and 102.</p>
        </div>
      </div>
      <div className="flex gap-3 items-start">
        <div className="bg-white p-2 rounded-lg shadow-sm border border-blue-100 text-blue-600 font-bold text-lg h-10 w-10 flex items-center justify-center shrink-0">3</div>
        <div>
          <h3 className="font-bold text-blue-950 mb-1">Team Sync</h3>
          <p className="text-sm text-blue-800/80 leading-snug">Discuss workload rebalancing with Sarah and Kyle.</p>
        </div>
      </div>
    </div>
  </div>
);

const CapacityChart = ({ data }: { data: any[] }) => {
  const chartData = data.map(d => ({
    name: d.name.split(' ')[0],
    tasks: d.activeTasksCount,
    capacity: 35 // Mock capacity limit
  }));

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border rounded-lg shadow-lg text-xs">
                    <p className="font-bold mb-1">{payload[0].payload.name}</p>
                    <p className="text-muted-foreground">Current Load: {payload[0].value}</p>
                    <p className="text-muted-foreground">Capacity: {payload[0].payload.capacity}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="tasks" radius={[4, 4, 0, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.tasks > 30 ? '#ef4444' : entry.tasks > 15 ? '#f97316' : '#3b82f6'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function Team() {
  const [, setLocation] = useLocation();
  const { data: business } = useQuery({
    queryKey: ["businessHealth"],
    queryFn: api.getBusinessHealth
  });

  const { data: team, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: api.getTeam
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

  const summary = business.teamHealthSummary;

  const priorityAlerts: AlertItem[] = [
    {
      id: "1",
      title: "Sarah Connor",
      description: "Task overload detected. 15 overdue items.",
      severity: "critical",
      href: "/team/tm-001",
      impact: "8 owners, 23 units",
      timeToResolve: "~2 hours to clear backlog",
      actionLabel: "Reassign 5 tasks"
    },
    {
      id: "2",
      title: "John Doe",
      description: "Missed 3 critical deadlines this week.",
      severity: "high",
      href: "/team/tm-002",
      impact: "3 compliance workflows",
      timeToResolve: "Immediate action needed",
      actionLabel: "Schedule 1:1 Review"
    },
    {
      id: "3",
      title: "Operations Team",
      description: "Staff shortage in maintenance division.",
      severity: "warning",
      href: "/team/tm-003",
      impact: "Avg response time +4h",
      timeToResolve: "Hiring pending (2 weeks)",
      actionLabel: "Approve temporary contractor"
    }
  ];

  const vitals: VitalItem[] = [
    { label: "Response Time", value: "1.2h", target: "< 2h", status: "healthy" },
    { label: "Escalation Rate", value: "5%", target: "< 3%", status: "watch" },
    { label: "Workload Balance", value: "85%", target: "Balanced", status: "healthy" },
    { label: "Capacity Available", value: "15 Tasks", target: "> 10", status: "neutral" },
    { label: "Satisfaction Score", value: "4.2/5", target: "4.5", status: "watch" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        
        {/* 1. Daily Focus */}
        <DailyFocus />

        {/* 2. Impact Forecast */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start animate-in fade-in slide-in-from-top-2">
          <div className="p-2 bg-amber-100 rounded-lg shrink-0">
             <Activity className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 mb-1">Impact Forecast</h4>
            <p className="text-sm text-amber-800/90 leading-relaxed">
              If Miles Dyson doesn't clear 10 tasks this week, his health will drop to <span className="font-bold text-amber-950">critical</span> and impact <span className="font-bold text-amber-950">12 buildings</span>.
            </p>
          </div>
        </div>

        {/* 3. Team Vitals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Team Vitals
            </h3>
          </div>
          <VitalsGrid items={vitals} className="lg:grid-cols-5" />
        </section>

        {/* 4. Team Health & Priority Attention */}
        <div className="grid gap-8 lg:grid-cols-2">
          <HealthHeader 
            title="Team Health"
            score={summary.avgScore}
            trend={-2.1}
            trendLabel="vs last month"
            summary="Peter Silberman has 8 overdue tasks and 60% SLA. Reassign 5 tasks to Sarah Connor (95% SLA, balanced workload) by EOD."
          />
          <PriorityAttentionCard 
            criticalCount={4} 
            alerts={priorityAlerts} 
          />
        </div>

        <div className="border-t border-border/40" />

        {/* 5. Team Performance Table */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
             <div>
               <h3 className="text-lg font-bold text-foreground tracking-tight">Team Performance</h3>
               <p className="text-sm text-muted-foreground mt-1">Individual contributions and workload analysis</p>
             </div>
           </div>

          <HealthTable 
            title=""
            data={team || []}
            onRowClick={(item) => setLocation(`/team/${item.id}`)}
            columns={[
              { 
                header: "Name", 
                cell: (item) => (
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{item.name}</span>
                    <Sparkline data={Array.from({ length: 10 }, () => Math.random() * 100)} />
                  </div>
                ),
                className: "font-medium text-foreground" 
              },
              { header: "Role", accessorKey: "role" },
              { 
                header: "Open Tasks", 
                cell: (item) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{item.activeTasksCount}</span>
                    <TrendIndicator trend={item.activeTasksTrend} label="vs last week" />
                  </div>
                )
              },
              { 
                header: "Overdue", 
                accessorKey: "overdueTasksCount", 
                cell: (item) => item.overdueTasksCount > 0 ? (
                  <span className="text-health-critical font-bold flex items-center gap-2">
                    {item.overdueTasksCount}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </span>
                ) : "0" 
              },
              { 
                header: "SLA Adherence", 
                cell: (item) => (
                  <div className="flex flex-col">
                    <span className="font-medium">{(item.completionRate * 100).toFixed(0)}%</span>
                    <TrendIndicator trend={item.completionRateTrend} label="vs last month" />
                  </div>
                ) 
              },
              { 
                header: "Prescription", 
                cell: (item) => (
                  <div className="flex items-start gap-2 max-w-[250px]">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-medium text-foreground/80 leading-snug">{item.prescription}</span>
                  </div>
                )
              },
              { 
                header: "Workload", 
                cell: (item) => {
                  const load = item.activeTasksCount;
                  if (load > 30) {
                    return (
                      <Badge variant="destructive" className="gap-1 pl-1 pr-2">
                        <AlertOctagon className="h-3 w-3" /> Overloaded
                      </Badge>
                    );
                  }
                  if (load > 15) {
                    return (
                      <Badge variant="outline" className="border-health-watch text-health-watch gap-1 pl-1 pr-2">
                        <AlertTriangle className="h-3 w-3" /> Heavy
                      </Badge>
                    );
                  }
                  return (
                    <Badge variant="secondary" className="gap-1 pl-1 pr-2">
                      <CheckCircle className="h-3 w-3" /> Balanced
                    </Badge>
                  );
                }
              },
            ]}
          />
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 6. Capacity & Distribution */}
          <section className="bg-white p-6 rounded-2xl shadow-soft border border-border/50">
            <div className="flex items-center justify-between mb-2">
               <div>
                 <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                   <BarChart3 className="h-5 w-5 text-primary" />
                   Workload Distribution
                 </h3>
                 <p className="text-sm text-muted-foreground mt-1">Active tasks vs. Capacity limit</p>
               </div>
            </div>
            {team && <CapacityChart data={team} />}
          </section>

          {/* 7. Recommended Actions */}
          <section className="bg-white p-6 rounded-2xl shadow-soft border border-border/50">
             <div className="flex items-center justify-between mb-6">
               <div>
                 <h3 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                   <Sparkles className="h-5 w-5 text-purple-500" />
                   AI Recommendations
                 </h3>
                 <p className="text-sm text-muted-foreground mt-1">Smart actions to optimize team health</p>
               </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 flex gap-4">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 text-purple-600 font-bold">1</div>
                <div>
                  <h4 className="font-bold text-purple-900 text-sm">Load Rebalancing</h4>
                  <p className="text-sm text-purple-800/80 mt-1">Move 5 maintenance tickets from Miles (Overloaded) to Kyle (Balanced). Estimated health gain: +5%</p>
                  <button className="mt-3 text-xs font-bold text-purple-700 flex items-center gap-1 hover:gap-2 transition-all">
                    Apply Action <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold">2</div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Skills Training</h4>
                  <p className="text-sm text-blue-800/80 mt-1">Schedule HVAC workshop for Sarah to reduce escalation rate on heating tickets.</p>
                  <button className="mt-3 text-xs font-bold text-blue-700 flex items-center gap-1 hover:gap-2 transition-all">
                    View Course Options <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
