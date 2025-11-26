import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface HealthDetailSheetProps {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HealthDetailSheet({ item, open, onOpenChange }: HealthDetailSheetProps) {
  if (!item) return null;

  // Filter out id, name, healthScore, riskLevel for the metrics list
  const metrics = Object.entries(item).filter(([key]) => 
    !["id", "name", "healthScore", "riskLevel", "buildingId", "unitId"].includes(key)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between mr-6">
            <SheetTitle className="text-2xl">{item.name || item.unitLabel || "Entity Detail"}</SheetTitle>
            <HealthBadge score={item.healthScore} riskLevel={item.riskLevel} size="lg" />
          </div>
          <SheetDescription>
            Detailed health breakdown and metrics.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-150px)] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Vital Signs</h3>
              <div className="grid gap-4">
                {metrics.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {typeof value === 'boolean' ? (value ? "Yes" : "No") : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Analysis</h3>
              <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
                <p>
                  This score is calculated based on the metrics above.
                  {item.healthScore >= 80 ? (
                    <span className="text-health-good block mt-2 font-medium">
                      Everything looks good. Keep monitoring for changes.
                    </span>
                  ) : item.healthScore >= 50 ? (
                    <span className="text-health-watch block mt-2 font-medium">
                      Some metrics are degrading. Review the highlighted areas.
                    </span>
                  ) : (
                    <span className="text-health-critical block mt-2 font-medium">
                      Immediate attention required. Multiple critical thresholds breached.
                    </span>
                  )}
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
