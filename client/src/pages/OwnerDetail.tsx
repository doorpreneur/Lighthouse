import { useRoute, Link, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockOwnerHealth } from "@/lib/mock-owner-data";
import { OwnerPillarName, OwnerVitalStatus } from "@/lib/owner-types";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  ArrowDownRight, 
  ArrowUpRight, 
  Banknote, 
  Building, 
  Building2,
  CheckCircle2, 
  ChevronRight, 
  ClipboardList, 
  HeartPulse, 
  LayoutDashboard, 
  Minus, 
  PieChart,
  ShieldAlert, 
  Stethoscope, 
  Users,
  Wallet
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

function PillarCard({ name, score, trend }: { name: OwnerPillarName; score: number; trend?: number }) {
  const iconMap: Record<OwnerPillarName, any> = {
    "Financial Stability": Wallet,
    "Portfolio Performance": PieChart,
    "Engagement": Users,
    "Risk": ShieldAlert
  };
  const Icon = iconMap[name] || Activity;

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

function VitalRow({ label, value, status, change }: { label: string; value: string; status: OwnerVitalStatus; change?: string }) {
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

function DiagnosisCard({ diagnosis }: { diagnosis: typeof mockOwnerHealth['diagnoses'][0] }) {
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

export default function OwnerDetail() {
  const [, params] = useRoute("/owners/:id");
  const [, setLocation] = useLocation();
  const data = mockOwnerHealth; // Using mock data directly

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm mt-2">
                <AvatarImage src={data.avatarUrl} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                  {data.ownerName.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Link href="/owners" className="hover:text-primary transition-colors">Owners</Link>
                <ChevronRight className="w-4 h-4" />
                <span>Owner Detail</span>
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
                {data.ownerName}
              </h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{data.totalProperties} Properties</span>
                <span className="text-border">|</span>
                <span>{data.totalUnits} Units</span>
                <span className="text-border">|</span>
                <span>{data.contactName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-soft border border-border/50">
            <div className="text-right">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">Portfolio Health</div>
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
          {/* Left Column: Diagnoses & Properties */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Diagnoses Section */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">Portfolio Diagnoses</h2>
                  <p className="text-sm text-muted-foreground">Strategic issues identified across the portfolio.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {data.diagnoses.map(diag => (
                  <DiagnosisCard key={diag.id} diagnosis={diag} />
                ))}
              </div>
            </section>

            {/* Properties List */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold">Property Performance</h2>
                    <p className="text-sm text-muted-foreground">Individual asset health status.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View All Properties</Button>
              </div>

              <Card className="border-0 shadow-soft rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-mono uppercase text-xs">Property</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Units</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Occupancy</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Maint. Ratio</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Health</TableHead>
                      <TableHead className="font-mono uppercase text-xs">Key Issues</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.properties.map((prop) => (
                      <TableRow 
                        key={prop.propertyId} 
                        className="hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() => setLocation(`/buildings/${prop.propertyId}`)}
                      >
                        <TableCell className="font-medium group-hover:text-primary transition-colors">{prop.propertyName}</TableCell>
                        <TableCell>{prop.units}</TableCell>
                        <TableCell>
                           <span className={cn(parseInt(prop.occupancyRate) < 90 ? "text-red-600 font-bold" : "text-green-600")}>
                             {prop.occupancyRate}
                           </span>
                        </TableCell>
                        <TableCell>{prop.maintenanceCostRatio}</TableCell>
                        <TableCell>
                          <HealthBadge score={prop.propertyHealthScore} size="sm" />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {prop.keyIssues?.map(issue => (
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
                  Owner Vitals
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
                        <Wallet className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                        <p className="text-xs font-bold text-foreground mb-1">Financial Insight</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Portfolio Cash Flow is down <strong>8%</strong> due to the maintenance surge. Recommend reviewing capital reserves.
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
