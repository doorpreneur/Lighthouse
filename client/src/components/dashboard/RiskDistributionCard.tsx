import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, Cell } from "recharts";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskDistributionCardProps {
  criticalCount: number;
  watchCount: number;
  healthyCount: number;
  className?: string;
}

export function RiskDistributionCard({ 
  criticalCount, 
  watchCount, 
  healthyCount,
  className 
}: RiskDistributionCardProps) {
  const total = criticalCount + watchCount + healthyCount;
  
  // Mock data for the bar chart
  const data = [
    { name: 'Owners', value: 15, color: 'bg-health-good' },
    { name: 'Bldgs', value: 8, color: 'bg-health-watch' },
    { name: 'Units', value: 25, color: 'bg-health-good' },
    { name: 'Tenants', value: 12, color: 'bg-health-critical' },
    { name: 'Flows', value: 20, color: 'bg-health-watch' },
    { name: 'Team', value: 10, color: 'bg-health-good' },
  ];

  // Calculate percentages for the donut
  const criticalPct = (criticalCount / total) * 100;
  const watchPct = (watchCount / total) * 100;
  // healthy is the rest

  return (
    <Card className={cn("border-0 shadow-soft rounded-2xl card-gradient overflow-visible", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-display font-bold">Risk Distribution & Top Risk Type</CardTitle>
        <div className="flex gap-2">
          <span className="flex items-center text-[10px] font-mono text-muted-foreground uppercase">
            <span className="w-2 h-2 rounded-full bg-health-critical mr-1"></span> Critical
          </span>
          <span className="flex items-center text-[10px] font-mono text-muted-foreground uppercase">
            <span className="w-2 h-2 rounded-full bg-health-watch mr-1"></span> Watch
          </span>
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8 items-center p-6">
        {/* Left: Donut / Radial Visual */}
        <div className="relative flex items-center justify-center aspect-square max-h-[200px]">
          {/* Background Circle */}
          <div className="absolute inset-0 rounded-full border-[16px] border-muted/30"></div>
          
          {/* Critical Segment (Simulated with conic gradient) */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                hsl(var(--health-critical)) 0% ${criticalPct}%, 
                hsl(var(--health-watch)) ${criticalPct}% ${criticalPct + watchPct}%, 
                transparent ${criticalPct + watchPct}% 100%
              )`,
              mask: 'radial-gradient(transparent 60%, black 61%)',
              WebkitMask: 'radial-gradient(transparent 60%, black 61%)'
            }}
          ></div>

          {/* Center Icon/Content - Replacing Rocket with Shield */}
          <div className="relative z-10 flex flex-col items-center justify-center">
             <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center backdrop-blur-sm border border-white/50 shadow-lg transform rotate-[-10deg]">
                <ShieldAlert className="h-8 w-8 text-primary" />
             </div>
          </div>
          
          {/* Decorative Blobs matching the screenshot style */}
          <div className="absolute -left-4 top-10 w-8 h-16 bg-health-good/20 rounded-full blur-xl"></div>
          <div className="absolute -right-4 bottom-10 w-12 h-12 bg-health-critical/20 rounded-full blur-xl"></div>
        </div>

        {/* Right: Stats & Bars */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <div>
               <p className="text-xs font-mono text-muted-foreground uppercase mb-1">Total Entities</p>
               <div className="text-3xl font-display font-bold tracking-tight">
                 {total.toLocaleString()}
                 <span className="text-muted-foreground text-lg">.00</span>
               </div>
             </div>
             <div className="px-3 py-1 rounded-full bg-health-good-bg text-health-good text-xs font-mono border border-health-good/20">
               0.14% ↗
             </div>
          </div>

          <div className="space-y-2">
             <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-muted-foreground uppercase">Entities at Risk</p>
                <div className="px-3 py-1 rounded-full bg-health-critical-bg text-health-critical text-xs font-mono border border-health-critical/20">
                  {((criticalCount + watchCount) / total * 100).toFixed(2)}% ↘
                </div>
             </div>
             <div className="text-2xl font-display font-bold tracking-tight">
                {(criticalCount + watchCount).toLocaleString()}
                <span className="text-muted-foreground text-base">.00</span>
             </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-24 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                 <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} 
                        fillOpacity={index % 2 === 0 ? 1 : 0.1}
                      />
                    ))}
                 </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
