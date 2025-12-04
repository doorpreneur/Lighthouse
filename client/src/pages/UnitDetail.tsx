import { useRoute, Link } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockUnitHealth } from "@/lib/mock-unit-data";
import { VitalStatus } from "@/lib/property-health-types";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  AlertCircle,
  ArrowLeft, 
  Building,
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Hammer, 
  HeartPulse, 
  History, 
  Home, 
  User, 
  UserCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Reused Helper Components (could be extracted) ---

function VitalCard({ label, value, status, change, icon: Icon }: { label: string; value: string; status: VitalStatus; change?: string; icon?: any }) {
  const statusColors = {
    good: "text-health-good bg-health-good/10 border-health-good/20",
    warning: "text-health-watch bg-health-watch/10 border-health-watch/20",
    critical: "text-health-critical bg-health-critical/10 border-health-critical/20"
  };

  return (
    <div className={cn("p-4 rounded-xl border flex flex-col gap-2 transition-all duration-200 hover:shadow-sm", statusColors[status])}>
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</span>
        {Icon && <Icon className="w-4 h-4 opacity-70" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-display font-bold">{value}</span>
        {change && <span className="text-xs font-mono opacity-80">{change}</span>}
      </div>
    </div>
  );
}

function DiagnosisItem({ diagnosis }: { diagnosis: typeof mockUnitHealth['diagnoses'][0] }) {
  const severityColors = {
    "Low": "bg-slate-100 text-slate-700 border-slate-200",
    "Medium": "bg-blue-50 text-blue-700 border-blue-200",
    "High": "bg-amber-50 text-amber-700 border-amber-200",
    "Critical": "bg-rose-50 text-rose-700 border-rose-200"
  };

  return (
    <div className="bg-white border border-border/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={cn("font-mono text-[10px] uppercase tracking-wider border", severityColors[diagnosis.severity])}>
              {diagnosis.severity}
            </Badge>
            <span className="text-xs text-muted-foreground">
               Impacts: {diagnosis.impactedPillars.join(", ")}
            </span>
          </div>
          <h4 className="font-display font-bold text-lg text-foreground">
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
            <CheckCircle2 className="w-3 h-3" /> Prescriptions
          </h5>
          <ul className="space-y-1.5">
            {diagnosis.prescriptions.map((rx, i) => (
              <li key={i} className="text-xs text-foreground/80 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                {rx}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function UnitDetail() {
  const [, params] = useRoute("/units/:id");
  const data = mockUnitHealth; // In real app, fetch by ID

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/buildings" className="hover:text-primary transition-colors">Buildings</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/buildings/${data.propertyId}`} className="hover:text-primary transition-colors">{data.propertyName}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground">{data.unitLabel}</span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b pb-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Home className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
                  {data.unitLabel}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5" /> {data.floorPlan}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span>{data.sqft} sqft</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span>${data.rent.toLocaleString()}/mo</span>
                  <Badge variant={data.occupancyStatus === "Occupied" ? "outline" : "destructive"} className="ml-2">
                    {data.occupancyStatus}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="text-right hidden sm:block">
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Unit Health</div>
                  <div className="text-sm text-muted-foreground">vs. Building Avg (72)</div>
               </div>
               <HealthBadge score={data.healthScore} size="lg" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Vitals Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {data.vitals.map(vital => (
                <VitalCard 
                   key={vital.key}
                   label={vital.label}
                   value={vital.value}
                   change={vital.change90d}
                   status={vital.status}
                />
              ))}
            </div>

            {/* Issues / Diagnoses */}
            <section>
               <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Active Health Issues
               </h2>
               <div className="space-y-4">
                  {data.diagnoses.map(diag => (
                     <DiagnosisItem key={diag.id} diagnosis={diag} />
                  ))}
               </div>
            </section>

            {/* Work Orders */}
            <section>
               <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-bold flex items-center gap-2">
                     <Hammer className="w-5 h-5 text-primary" />
                     Recent Work Orders
                  </h2>
                  <Button variant="outline" size="sm">View All</Button>
               </div>
               
               <Card className="border-0 shadow-soft overflow-hidden">
                  <div className="divide-y">
                     {data.recentWorkOrders.map(wo => (
                        <div key={wo.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4">
                           <div className="flex items-start gap-3">
                              <div className={cn("w-2 h-2 rounded-full mt-2", 
                                 wo.priority === "High" ? "bg-red-500" : 
                                 wo.priority === "Medium" ? "bg-amber-500" : "bg-green-500"
                              )} />
                              <div>
                                 <div className="font-medium text-sm flex items-center gap-2">
                                    {wo.title}
                                    <span className="text-xs font-mono text-muted-foreground px-1.5 py-0.5 bg-muted rounded">{wo.id}</span>
                                 </div>
                                 <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                    <span>{wo.category}</span>
                                    <span>•</span>
                                    <span>{wo.createdAt}</span>
                                 </div>
                              </div>
                           </div>
                           <Badge variant="secondary">{wo.status}</Badge>
                        </div>
                     ))}
                  </div>
               </Card>
            </section>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            
            {/* Tenant Profile */}
            {data.tenant && (
               <Card className="border-0 shadow-soft card-gradient">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg font-display flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-primary" />
                        Tenant Profile
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                           {data.tenant.name.charAt(0)}
                        </div>
                        <div>
                           <div className="font-bold">{data.tenant.name}</div>
                           <div className="text-xs text-muted-foreground">Lease ends {data.tenant.leaseEnd}</div>
                        </div>
                     </div>
                     
                     <Separator />
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Tenure</div>
                           <div className="font-mono font-medium">{data.tenant.tenureYears} years</div>
                        </div>
                        <div>
                           <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Payment</div>
                           <div className={cn("font-mono font-medium", data.tenant.paymentStatus === "Late" ? "text-red-600" : "text-green-600")}>
                              {data.tenant.paymentStatus}
                           </div>
                        </div>
                        <div>
                           <div className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">NPS</div>
                           <div className="font-mono font-medium flex items-center gap-1">
                              {data.tenant.npsScore} <span className="text-[10px] text-muted-foreground">/ 10</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="pt-2">
                        <Button className="w-full bg-white hover:bg-white/90 text-primary border border-primary/20 shadow-sm" size="sm">
                           View Tenant File
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* Activity Timeline */}
            <Card className="border-0 shadow-soft">
               <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-display flex items-center gap-2">
                     <History className="w-5 h-5 text-primary" />
                     Timeline
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-2">
                  <div className="relative border-l border-border/50 ml-2 space-y-6 pb-2">
                     {data.history.map((item, i) => (
                        <div key={i} className="pl-6 relative">
                           <div className={cn("absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm", 
                              item.type === "financial" ? "bg-green-500" : 
                              item.type === "maintenance" ? "bg-orange-500" : "bg-blue-500"
                           )} />
                           <div className="text-xs font-mono text-muted-foreground mb-0.5">{item.date}</div>
                           <div className="text-sm font-medium leading-tight">{item.event}</div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
