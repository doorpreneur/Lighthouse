import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const data = [
  { date: 'Oct 29', revenue: 12000, maintenance: 7000 },
  { date: 'Oct 30', revenue: 15500, maintenance: 5500 },
  { date: 'Oct 31', revenue: 16000, maintenance: 11000 },
  { date: 'Nov 1', revenue: 21000, maintenance: 9000 },
  { date: 'Nov 2', revenue: 18000, maintenance: 6500 }, // The dip
  { date: 'Nov 3', revenue: 9500, maintenance: 8000 },
  { date: 'Nov 4', revenue: 11000, maintenance: 7000 },
  { date: 'Nov 5', revenue: 9000, maintenance: 6500 },
  { date: 'Nov 6', revenue: 11000, maintenance: 13000 },
  { date: 'Nov 7', revenue: 13000, maintenance: 11000 },
  { date: 'Nov 8', revenue: 9500, maintenance: 9000 },
  { date: 'Nov 9', revenue: 10500, maintenance: 10500 },
  { date: 'Nov 10', revenue: 12500, maintenance: 5000 },
];

export function RevenueTrendCard({ className }: { className?: string }) {
  return (
    <Card className={cn("border-0 shadow-soft rounded-2xl card-gradient overflow-visible", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-display font-bold">Revenue vs Maintenance Trend</CardTitle>
        <div className="flex bg-muted/50 p-1 rounded-lg gap-1">
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium rounded-md bg-white shadow-sm text-primary">High</Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium rounded-md text-muted-foreground hover:text-primary">Medium</Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs font-medium rounded-md text-muted-foreground hover:text-primary">Low</Button>
        </div>
      </CardHeader>
      <CardContent className="relative h-[300px] w-full pt-6">
        
        {/* The "Bonus 7X" Overlay Style Card */}
        <div className="absolute left-[40%] top-[15%] z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 delay-300">
          <div className="mb-2 text-primary animate-bounce">
            <Sparkles className="h-5 w-5" fill="currentColor" />
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl p-4 text-center min-w-[100px]">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Efficiency</p>
            <p className="text-4xl font-display font-bold text-foreground tracking-tight">94%</p>
          </div>
          <div className="w-3 h-3 bg-white/80 rotate-45 -mt-1.5 border-b border-r border-white/50"></div>
          <div className="w-3 h-3 rounded-full border-2 border-white bg-primary mt-1 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"></div>
        </div>

        {/* Specific Highlight Point for the other line */}
        <div className="absolute left-[25%] bottom-[45%] z-10 flex flex-col items-center">
          <div className="bg-health-good text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg mb-2">
            $11,000
          </div>
          <div className="w-2 h-2 rounded-full border-2 border-white bg-health-good shadow-sm"></div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="maintenance" 
              stroke="hsl(var(--health-good))" 
              strokeWidth={3} 
              dot={false} 
              strokeOpacity={0.6}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
