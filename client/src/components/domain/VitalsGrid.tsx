import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

export interface VitalItem {
  label: string;
  value: string | number;
  target?: string;
  status: "healthy" | "watch" | "critical" | "neutral";
}

interface VitalsGridProps {
  items: VitalItem[];
}

export function VitalsGrid({ items }: VitalsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <Card key={idx} className="border-0 shadow-soft rounded-xl overflow-hidden hover:translate-y-[-2px] transition-transform duration-300">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                {item.label}
              </span>
              {item.status === "healthy" && <CheckCircle2 className="w-3 h-3 text-health-good" />}
              {item.status === "watch" && <AlertCircle className="w-3 h-3 text-health-watch" />}
              {item.status === "critical" && <AlertTriangle className="w-3 h-3 text-health-critical" />}
            </div>
            
            <div className="text-2xl font-display font-bold tracking-tight text-foreground mt-1">
              {item.value}
            </div>
            
            {item.target && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", 
                    item.status === "healthy" ? "bg-health-good" :
                    item.status === "watch" ? "bg-health-watch" :
                    item.status === "critical" ? "bg-health-critical" : "bg-primary"
                  )} style={{ width: '70%' }}></div>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                  Target: {item.target}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
