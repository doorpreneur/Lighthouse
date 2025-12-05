import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Insights() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">Deep dive into property performance metrics.</p>
        </div>
        
        <div className="grid gap-6">
          <Card className="h-96 flex items-center justify-center border-dashed">
            <p className="text-muted-foreground">Performance charts will appear here.</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
