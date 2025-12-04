import { useRoute, Link } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockPropertyHealth } from "@/lib/mock-property-data";
import { PillarName, VitalStatus } from "@/lib/property-health-types";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  ArrowDownRight, 
  ArrowUpRight, 
  Banknote, 
  Building, 
  CheckCircle2, 
  ChevronRight, 
  ClipboardList, 
  HeartPulse, 
  Home, 
  LayoutDashboard, 
  Minus, 
  ShieldAlert, 
  Stethoscope, 
  Users 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      {Math.abs(value)}%
    </div>
  );
}

function PillarCard({ name, score, trend }: { name: PillarName; score: number; trend?: number }) {
  const iconMap: Record<PillarName, any> = {
    "Physical": Building,
    "Financial": Banknote,
    "Tenant Experience": Users,
    "Risk": ShieldAlert
  };
  const Icon = iconMap[name];

  const statusColor = score >= 80 ? "text-health-good" : score >= 60 ? "text-health-watch" : "text-health-critical";
  const progressColor = score >= 80 ? "bg-health-good" : score >= 60 ? "bg-health-watch" : "bg-health-critical";

  return (
    <Card className="card-gradient border-0 shadow-soft rounded-2xl overflow-hidden hover:translate-y-[-2px] transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white shadow-sm text-primary/80 border border-primary/10">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">
              {name}
            </span>
          </div>
          <TrendIndicator value={trend} />
        </div>
        
        <div className="flex items-end gap-2 mb-2">
          <span className={cn("text-3xl font-display font-bold tracking-tight", statusColor)}>
            {score}
          </span>
          <span className="text-sm text-muted-foreground mb-1.5">/ 100</span>
        </div>

        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-1000", progressColor)} 
            style={{ width: `${score}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function VitalRow({ label, value, status, change }: { label: string; value: string; status: VitalStatus; change?: string }) {
  const statusStyles = {
    good: "bg-health-good/10 text-health-good",
    warning: "bg-health-watch/10 text-health-watch",
    critical: "bg-health-critical/10 text-health-critical"
  };

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 border-border/50 group hover:bg-primary/5 px-2 -mx-2 rounded-lg transition-colors">
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
      <div className="flex items-center gap-3">
        {change && (
          <span className="text-[10px] font-mono text-muted-foreground">
            {change}
          </span>
        )}
        <div className={cn("px-2 py-1 rounded-md text-xs font-bold font-mono min-w-[60px] text-center", statusStyles[status])}>
          {value}
        </div>
      </div>
    </div>
  );
}

function DiagnosisCard({ diagnosis }: { diagnosis: typeof mockPropertyHealth['diagnoses'][0] }) {
  const severityColors = {
    "Low": "bg-slate-100 text-slate-700 border-slate-200",
    "Medium": "bg-blue-50 text-blue-700 border-blue-200",
    "High": "bg-amber-50 text-amber-700 border-amber-200",
    "Critical": "bg-rose-50 text-rose-700 border-rose-200"
  };

  return (
    <div className="bg-white border border-border/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      <div className={cn("absolute top-0 left-0 w-1 h-full", 
        diagnosis.severity === "Critical" ? "bg-health-critical" :
        diagnosis.severity === "High" ? "bg-health-watch" :
        "bg-primary"
      )} />
      
      <div className="pl-3">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={cn("font-mono text-[10px] uppercase tracking-wider border", severityColors[diagnosis.severity])}>
                {diagnosis.severity} Severity
              </Badge>
              <div className="flex gap-1">
                {diagnosis.impactedPillars.map(p => (
                  <span key={p} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <h4 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {diagnosis.label}
            </h4>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
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
    </div>
  );
}

export default function PropertyDetail() {
  // In a real app, we would use the ID to fetch data
  const [, params] = useRoute("/buildings/:id");
  const data = mockPropertyHealth; // Using mock data directly

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Link href="/buildings" className="hover:text-primary transition-colors">Buildings</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Property Detail</span>
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
              {data.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <Home className="w-4 h-4" />
              <span>{data.address}</span>
              <span className="text-border">|</span>
              <span>{data.totalUnits} Units</span>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-soft border border-border/50">
            <div className="text-right">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">Overall Health</div>
              <div className="text-4xl font-display font-bold tracking-tight text-foreground">
                {data.overallScore}
              </div>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div className="flex flex-col items-center justify-center">
              <TrendIndicator value={data.overallTrend90d} />
              <span className="text-[10px] text-muted-foreground mt-1">vs last 90 days</span>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center relative">
              <HeartPulse className="w-6 h-6 text-primary" />
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${data.overallScore}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.pillars.map((pillar) => (
            <PillarCard key={pillar.name} {...pillar} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Diagnoses & Vitals */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Diagnoses Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">Active Diagnoses</h2>
                  <p className="text-sm text-muted-foreground">Issues identified by the health engine requiring attention.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {data.diagnoses.map(diag => (
                  <DiagnosisCard key={diag.id} diagnosis={diag} />
                ))}
              </div>
            </section>

            {/* Units List */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold">Unit Health</h2>
                    <p className="text-sm text-muted-foreground">Individual unit performance and status.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View All Units</Button>
              </div>

              <Card className="border-0 shadow-soft rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-mono uppercase text-xs">Unit</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Status</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Health</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Key Issues</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.units.map((unit) => (
                      <TableRow key={unit.unitId} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{unit.unitLabel}</TableCell>
                        <TableCell>
                          <Badge variant={unit.occupancyStatus === "Occupied" ? "outline" : "secondary"} className="font-normal">
                            {unit.occupancyStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <HealthBadge score={unit.healthScore} size="sm" />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {unit.keyIssues?.map(issue => (
                              <span key={issue} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-700 border border-red-100">
                                {issue}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </section>
          </div>

          {/* Right Column: Vitals & Stats */}
          <div className="space-y-6">
            <Card className="card-gradient border-0 shadow-soft rounded-2xl sticky top-24">
              <CardHeader className="pb-3 border-b border-border/50 bg-white/50 backdrop-blur-sm">
                <CardTitle className="font-display font-bold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Property Vitals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-3">Key Metrics</h4>
                  <div className="space-y-1">
                    {data.keyVitals.map(vital => (
                      <VitalRow 
                        key={vital.key} 
                        label={vital.label}
                        value={vital.value}
                        status={vital.status}
                        change={vital.change90d} 
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-3">Extended Metrics</h4>
                  <div className="space-y-1">
                    {data.allVitals.slice(4).map(vital => (
                      <VitalRow 
                        key={vital.key} 
                        label={vital.label}
                        value={vital.value}
                        status={vital.status}
                        change={vital.change90d}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 mt-4">
                  <div className="flex items-start gap-3">
                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Banknote className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-foreground mb-1">Financial Insight</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          NOI is trending <strong>4% below projection</strong> due to the mechanical issues identified in Diagnosis #1.
                        </p>
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
