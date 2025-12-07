import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Link as LinkIcon, 
  MoreHorizontal, 
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { TimelineStep } from "@/components/dashboard/UnitLifecycleTimeline";

interface StepTask {
  id: string;
  title: string;
  description: string;
  dueLabel: string;
  isOverdue?: boolean;
  status: "todo" | "done";
}

interface StepDetailsViewProps {
  step: TimelineStep;
}

export function StepDetailsView({ step }: StepDetailsViewProps) {
  // Mock data generator based on step
  const tasks: StepTask[] = [
    {
      id: "1",
      title: "Complete Visual Inspection",
      description: "Document all room conditions, flooring, and paint status.",
      dueLabel: "Due today",
      status: "todo"
    },
    {
      id: "2",
      title: "Test Appliances",
      description: "Verify functionality of fridge, stove, dishwasher and microwave.",
      dueLabel: "Due tomorrow",
      status: "todo"
    },
    {
      id: "3",
      title: "Check Safety Detectors",
      description: "Test smoke and CO detectors, replace batteries if needed.",
      dueLabel: "Overdue - 2 days",
      isOverdue: true,
      status: "todo"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
      {/* Left Column: Tasks */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-bold">Unit Tasks</h3>
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
              <Button variant="ghost" size="sm" className="h-7 px-3 bg-white shadow-sm text-foreground font-medium rounded-md">
                To-Do
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-3 text-muted-foreground hover:text-foreground rounded-md">
                Done
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Bottlenecks & Priority</h4>
            {tasks.filter(t => t.isOverdue).map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Upcoming</h4>
            {tasks.filter(t => !t.isOverdue).map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Context */}
      <div className="space-y-6">
        {/* Phase Summary Card */}
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg shadow-primary/20">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-bold text-lg">{step.label} Phase</h4>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
              {step.duration || "2 Days"}
            </Badge>
          </div>
          <p className="text-sm text-primary-foreground/90 leading-relaxed mb-6">
            Comprehensive assessment of unit condition following tenant move-out. 
            Goal is to identify all necessary repairs and cleaning for turnover.
          </p>
          <div className="flex items-center gap-3 pt-4 border-t border-white/20">
            <div className="flex -space-x-2">
              <Avatar className="border-2 border-primary h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar className="border-2 border-primary h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs font-medium opacity-80">2 Team Members Assigned</span>
          </div>
        </div>

        {/* Quick Links */}
        <Card className="border-none shadow-soft">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h4 className="font-semibold text-sm">Quick Links</h4>
            </div>
            <div className="divide-y">
              <LinkItem 
                icon={FileText} 
                label="Inspection Checklist Template" 
                sublabel="PDF • 2.4 MB" 
              />
              <LinkItem 
                icon={LinkIcon} 
                label="Vendor Directory" 
                sublabel="External Link" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Manager */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <h4 className="text-xs font-medium text-muted-foreground uppercase mb-3">Project Manager</h4>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-slate-100 text-slate-700">SM</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">Sarah Miller</p>
              <p className="text-xs text-muted-foreground">Property Manager</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: StepTask }) {
  return (
    <div className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200">
      <div className="mt-1">
        <button className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center">
          {task.status === "done" && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
        </button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h5 className="font-semibold text-foreground truncate">{task.title}</h5>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-muted-foreground hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            Read more
          </Button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Badge variant={task.isOverdue ? "destructive" : "secondary"} className={task.isOverdue ? "rounded-md" : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-200 rounded-md"}>
            {task.dueLabel}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[9px]">JD</AvatarFallback>
            </Avatar>
            <span>Assigned to John</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkItem({ icon: Icon, label, sublabel }: { icon: any, label: string, sublabel: string }) {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <LinkIcon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
