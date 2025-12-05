import { useRoute, Link, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockTenantHealth } from "@/lib/mock-tenant-data";
import { TenantHealthDetail, TenantPillarName, TenantVitalStatus } from "@/lib/tenant-types";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  ArrowDownRight, 
  ArrowUpRight, 
  Banknote, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  ClipboardList,
  CreditCard, 
  HeartHandshake, 
  Mail, 
  MessageSquare, 
  Minus, 
  ShieldAlert, 
  Stethoscope, 
  User, 
  UserCircle,
  Wrench
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HealthBadge } from "@/components/ui/HealthBadge";

// --- Helper Components ---

function TrendIndicator({ value }: { value?: number }) {
  if (value === undefined) return null;
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  return (
    <div className={cn(
      "flex items-center text-xs font-bold px-2 py-0.5 rounded-full",
      isPositive ? "text-health-good bg-health-good-bg" : 
      isNegative ? "text-health-critical bg-health-critical-bg" :
      "text-muted-foreground bg-muted"
    )}>
      {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : 
       isNegative ? <ArrowDownRight className="w-3 h-3 mr-1" /> : 
       <Minus className="w-3 h-3 mr-1" />}
      {Math.abs(value)} in last 90 days
    </div>
  );
}

function PillarMiniCard({ name, score, trend }: { name: TenantPillarName; score: number; trend?: number }) {
  const statusColor = score >= 80 ? "bg-health-good" : score >= 60 ? "bg-health-watch" : "bg-health-critical";
  const textColor = score >= 80 ? "text-health-good" : score >= 60 ? "text-health-watch" : "text-health-critical";

  return (
    <div className="rounded-xl border bg-white/80 shadow-sm p-4 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{name}</span>
        {trend !== undefined && (
          <span className={cn("text-[10px] font-mono", trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-muted-foreground")}>
            {trend > 0 ? "+" : ""}{trend}
          </span>
        )}
      </div>
      <div>
        <div className="flex items-end gap-2 mb-1.5">
          <span className={cn("text-2xl font-display font-bold", textColor)}>{score}</span>
          <span className="text-xs text-muted-foreground mb-1">/ 100</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full", statusColor)} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}

function TenantSnapshot({ data }: { data: TenantHealthDetail }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Identity & Main Score */}
      <div className="rounded-xl border bg-white/80 shadow-sm p-6 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10" />
        
        <div className="flex items-start gap-4 relative z-10">
          <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
            <AvatarImage src={data.avatarUrl} />
            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
              {data.tenantName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">{data.tenantName}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span className="font-medium text-foreground/80">{data.unitLabel}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>{data.propertyName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Calendar className="w-3 h-3" />
              <span>Lease: {data.leaseStart} – {data.leaseEnd}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-4xl font-display font-bold text-foreground">{data.overallScore}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">Health Score</div>
          </div>
          <div className="text-right">
            <TrendIndicator value={data.overallTrend90d} />
            <div className="text-[10px] text-muted-foreground mt-1 max-w-[150px] leading-tight">
              Overall health is <strong>{data.overallScore}</strong>. Payment history is mixed, but satisfaction is strong.
            </div>
          </div>
        </div>
      </div>

      {/* Pillar Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 gap-4">
        {data.pillars.map(pillar => (
          <PillarMiniCard key={pillar.name} {...pillar} />
        ))}
      </div>
    </div>
  );
}

function DiagnosisCard({ diagnosis }: { diagnosis: typeof mockTenantHealth['diagnoses'][0] }) {
  const severityColors = {
    "Low": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Medium": "bg-amber-50 text-amber-700 border-amber-200",
    "High": "bg-red-50 text-red-700 border-red-200",
    "Critical": "bg-rose-50 text-rose-700 border-rose-200"
  };

  return (
    <div className="rounded-xl border bg-white/80 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("font-mono text-[10px] uppercase tracking-wider border", severityColors[diagnosis.severity])}>
              {diagnosis.severity}
            </Badge>
            <div className="flex gap-1">
              {diagnosis.impactedPillars.map(p => (
                <Badge key={p} variant="secondary" className="text-[10px] font-normal">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
          <h4 className="font-display font-bold text-lg text-foreground">
            {diagnosis.label}
          </h4>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {diagnosis.narrative}
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
          <h5 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Evidence
          </h5>
          <ul className="space-y-1.5">
            {diagnosis.evidence.map((ev, i) => (
              <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                {ev}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
          <h5 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
            <Stethoscope className="w-3 h-3" /> Prescriptions
          </h5>
          <ul className="space-y-1.5">
            {diagnosis.prescriptions.map((rx, i) => (
              <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                {rx}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TenantVitalStatusDot({ status }: { status: TenantVitalStatus }) {
  const color =
    status === "good"
      ? "bg-health-good"
      : status === "warning"
      ? "bg-health-watch"
      : "bg-health-critical";

  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      <span className="text-xs capitalize text-muted-foreground">{status}</span>
    </div>
  );
}

function TenantVitalsTable({ vitals }: { vitals: TenantHealthDetail['allVitals'] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white/80 shadow-sm">
      <div className="px-4 py-3 border-b bg-slate-50/50 flex items-center gap-2">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Tenant Vitals</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border/50">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Vital</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Now</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Avg</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">90d Change</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 bg-white">
            {vitals.map((vital) => (
              <tr key={vital.key} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{vital.label}</td>
                <td className="px-4 py-3 text-sm font-bold font-mono text-foreground">{vital.value}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{vital.portfolioAverage || "-"}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{vital.change90d || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <TenantVitalStatusDot status={vital.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TenantTimeline({ events }: { events: TenantHealthDetail['events'] }) {
  const getIcon = (type: string) => {
    switch(type) {
      case "Payment": return <CreditCard className="w-3 h-3 text-white" />;
      case "WorkOrder": return <Wrench className="w-3 h-3 text-white" />;
      case "Communication": return <MessageSquare className="w-3 h-3 text-white" />;
      case "Violation": return <ShieldAlert className="w-3 h-3 text-white" />;
      case "Lease": return <HeartHandshake className="w-3 h-3 text-white" />;
      default: return <Activity className="w-3 h-3 text-white" />;
    }
  };

  const getColor = (type: string) => {
    switch(type) {
      case "Payment": return "bg-emerald-500 border-emerald-200";
      case "WorkOrder": return "bg-blue-500 border-blue-200";
      case "Communication": return "bg-slate-500 border-slate-200";
      case "Violation": return "bg-red-500 border-red-200";
      case "Lease": return "bg-amber-500 border-amber-200";
      default: return "bg-slate-400 border-slate-200";
    }
  };

  return (
    <div className="rounded-xl border bg-white/80 shadow-sm p-4 flex flex-col h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
          <p className="text-xs text-muted-foreground">Recent activity and key events</p>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-xs">View All</Button>
      </div>

      <div className="relative mt-2 space-y-6 pl-2">
        {/* Vertical Line */}
        <div className="absolute top-2 bottom-2 left-[11px] w-px bg-border/60" />

        {events.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4 pl-6">No recent events recorded.</div>
        ) : (
          events.map((evt) => (
            <div key={evt.id} className="relative flex gap-4 group">
              <div className={cn(
                "relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                getColor(evt.type)
              )}>
                {getIcon(evt.type)}
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono mb-0.5">{evt.date}</div>
                <div className="text-sm font-medium text-foreground">{evt.label}</div>
                {evt.detail && (
                  <div className="text-xs text-muted-foreground mt-0.5">{evt.detail}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function TenantDetail() {
  const [, params] = useRoute("/tenants/:id");
  const data = mockTenantHealth; // In real app use params.id to fetch

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/tenants" className="hover:text-primary transition-colors">Tenants</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-foreground">{data.tenantName}</span>
        </div>

        {/* Section 1: Snapshot */}
        <TenantSnapshot data={data} />

        {/* Section 2: Diagnoses */}
        <section>
          <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Active Diagnoses
          </h2>
          {data.diagnoses.length === 0 ? (
            <div className="p-8 text-center border rounded-xl bg-white/50 text-muted-foreground">
              No active issues detected. This tenant appears stable.
            </div>
          ) : (
            <div className="space-y-4">
              {data.diagnoses.map(diag => (
                <DiagnosisCard key={diag.id} diagnosis={diag} />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: Vitals & Timeline */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TenantVitalsTable vitals={data.allVitals} />
          <TenantTimeline events={data.events} />
        </div>

      </div>
    </DashboardLayout>
  );
}
