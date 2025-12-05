import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AlertsPrescriptions() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Prescriptions</h1>
          <p className="text-muted-foreground">Monitor active alerts and system prescriptions.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No active alerts requiring immediate attention.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
