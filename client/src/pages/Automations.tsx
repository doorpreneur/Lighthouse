import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Mail, 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Play,
  MoreHorizontal,
  Trash2
} from "lucide-react";

export default function Automations() {
  const [prompt, setPrompt] = useState("");

  const automations = [
    {
      id: 1,
      icon: AlertCircle,
      description: "When unit is vacant for > 30 days, send alert to Property Manager",
      active: true,
      type: "Alert"
    },
    {
      id: 2,
      icon: Clock,
      description: "When lease expires in < 60 days, create renewal task",
      active: true,
      type: "Task"
    },
    {
      id: 3,
      icon: Zap,
      description: "When work order is overdue by 48h, escalate to Regional Manager",
      active: true,
      type: "Escalation"
    },
    {
      id: 4,
      icon: Mail,
      description: "When new tenant moves in, send welcome email with handbook",
      active: true,
      type: "Communication"
    },
    {
      id: 5,
      icon: FileText,
      description: "When inspection is completed, archive report to owner docs",
      active: true,
      type: "Document"
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Zap className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            Automations
            <Badge variant="secondary" className="ml-2 rounded-full px-3 font-normal">
              {automations.filter(a => a.active).length} active
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Build complex workflows simply by describing them.
          </p>
        </div>

        {/* AI Input Section */}
        <Card className="border-2 border-primary/20 shadow-lg bg-gradient-to-br from-white to-slate-50 overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary" />
          <CardContent className="p-8">
            <div className="relative">
              <div className="absolute -top-3 -left-2">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your automation... e.g., 'When a new lease is signed, create a welcome task and email the owner'"
                className="w-full text-xl font-medium bg-transparent border-0 shadow-none focus-visible:ring-0 resize-none placeholder:text-muted-foreground/40 min-h-[120px] p-0 md:text-xl"
              />
              <div className="flex items-center justify-between mt-4 border-t pt-4">
                 <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-7">
                      <Mail className="h-3 w-3 mr-1" /> Send Email
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-7">
                      <FileText className="h-3 w-3 mr-1" /> Update Sheet
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-7">
                      <AlertCircle className="h-3 w-3 mr-1" /> Alert Team
                    </Button>
                 </div>
                 <Button className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all hover:scale-105">
                   Create Automation
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Active Automations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
             <h2 className="text-lg font-semibold tracking-tight text-foreground">Active Workflows</h2>
          </div>

          <div className="grid gap-3">
            {automations.map((item) => (
              <div 
                key={item.id} 
                className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${
                    item.type === 'Alert' ? 'bg-red-50 text-red-600' :
                    item.type === 'Task' ? 'bg-blue-50 text-blue-600' :
                    item.type === 'Escalation' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 text-base">
                      {item.description.split(" → ")[0]}
                      {item.description.includes("→") && (
                        <>
                          <span className="mx-2 text-muted-foreground">→</span>
                          <span className="font-bold text-primary">{item.description.split(" → ")[1]}</span>
                        </>
                      )}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal text-muted-foreground bg-slate-50">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Play className="h-3 w-3" /> Runs daily
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={item.active} />
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
