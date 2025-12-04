import { useRoute, Link, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockTeamMember } from "@/lib/mock-team-data";
import { cn } from "@/lib/utils";
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Mail, 
  Phone, 
  TrendingUp, 
  User, 
  AlertCircle,
  Award,
  Target,
  Zap,
  BarChart3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

function ScoreCard({ title, score, trend, icon: Icon, context }: { title: string, score: number, trend: number, icon: any, context: string }) {
  const isPositive = trend >= 0;
  return (
    <Card className="border-0 shadow-sm bg-white/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon className="w-4 h-4" />
          </div>
          <div className={cn("text-xs font-bold px-1.5 py-0.5 rounded flex items-center", isPositive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100")}>
            {isPositive ? "+" : ""}{trend}%
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{score}</div>
        <div className="text-xs font-medium text-foreground/80">{title}</div>
        <div className="text-[10px] text-muted-foreground mt-1">{context}</div>
      </CardContent>
    </Card>
  );
}

export default function TeamMemberDetail() {
  const [, params] = useRoute("/team/:id");
  const data = mockTeamMember; // In real app, fetch by ID using params.id

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/team" className="hover:text-primary transition-colors">Team</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-foreground">{data.name}</span>
        </div>

        {/* Header Profile Card */}
        <Card className="border-0 shadow-soft bg-gradient-to-r from-white to-slate-50 overflow-hidden">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={data.avatarUrl} />
                <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                  {data.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-display font-bold tracking-tight">{data.name}</h1>
                  <Badge variant="secondary" className="font-medium">{data.role}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {data.tenure} Tenure
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {data.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {data.phone}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:ml-auto flex items-center gap-8">
              <div className="text-right space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Burnout Risk</div>
                <div className="flex items-center justify-end gap-2">
                  <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", data.burnoutRiskScore > 70 ? "bg-red-500" : "bg-green-500")} 
                      style={{ width: `${data.burnoutRiskScore}%` }} 
                    />
                  </div>
                  <span className="font-bold text-sm">{data.burnoutRiskScore}%</span>
                </div>
              </div>
              
              <div className="pl-8 border-l border-border/50">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1 text-right">Performance</div>
                <HealthBadge score={data.healthScore} size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Performance & Workload */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Performance Scorecards */}
            <section>
              <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Performance Scorecards
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreCard 
                  title="Efficiency" 
                  score={data.metrics.efficiency.score} 
                  trend={data.metrics.efficiency.trend}
                  icon={Zap}
                  context={data.metrics.efficiency.context}
                />
                <ScoreCard 
                  title="Quality" 
                  score={data.metrics.quality.score} 
                  trend={data.metrics.quality.trend}
                  icon={Award}
                  context={data.metrics.quality.context}
                />
                <ScoreCard 
                  title="Speed" 
                  score={data.metrics.speed.score} 
                  trend={data.metrics.speed.trend}
                  icon={Clock}
                  context={data.metrics.speed.context}
                />
                <ScoreCard 
                  title="Reliability" 
                  score={data.metrics.reliability.score} 
                  trend={data.metrics.reliability.trend}
                  icon={Target}
                  context={data.metrics.reliability.context}
                />
              </div>
            </section>

            {/* Active Tasks Kanban-lite */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Active Workload
                  <Badge variant="secondary" className="ml-2">{data.activeTasksCount}</Badge>
                </h2>
                <Button variant="outline" size="sm">View All Tasks</Button>
              </div>
              
              <Card className="border-0 shadow-soft overflow-hidden">
                <div className="divide-y">
                  {data.activeTasks.map(task => (
                    <div key={task.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 group">
                      <div className="flex items-start gap-3">
                        <div className={cn("w-2 h-2 rounded-full mt-2", 
                          task.priority === "High" ? "bg-red-500" : 
                          task.priority === "Medium" ? "bg-orange-500" : "bg-blue-500"
                        )} />
                        <div>
                          <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                            {task.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                            <span className="font-medium text-foreground/80">{task.relatedEntity}</span>
                            <span>•</span>
                            <span className={cn(task.dueDate === "Overdue" ? "text-red-600 font-bold" : "")}>
                              Due {task.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={task.status === "In Progress" ? "default" : task.status === "Review" ? "secondary" : "outline"}>
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

          </div>

          {/* Right Column: Activity & Goals */}
          <div className="space-y-6">
            
            {/* Recent Activity Feed */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-display flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative border-l border-border/50 ml-2 space-y-6 pb-2">
                  {data.recentActivity.map((item, i) => (
                    <div key={i} className="pl-6 relative">
                      <div className={cn("absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm", 
                        item.impact === "positive" ? "bg-green-500" : 
                        item.impact === "negative" ? "bg-red-500" : "bg-slate-400"
                      )} />
                      <div className="text-xs font-mono text-muted-foreground mb-0.5">{item.date}</div>
                      <div className="text-sm font-medium leading-tight">{item.action}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Coaching / Notes */}
            <Card className="border-0 shadow-soft bg-blue-50/50 border-blue-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Manager Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-900/80 leading-relaxed">
                  Sarah is excelling in tenant relations but is carrying a high load of administrative tasks. Consider delegating invoice approvals to free up time for strategic renewal negotiations.
                </p>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
