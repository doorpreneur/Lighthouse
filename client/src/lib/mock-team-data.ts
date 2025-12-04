import { TeamMemberDetail } from "./team-types";

export const mockTeamMember: TeamMemberDetail = {
  id: "tm-001",
  name: "Sarah Connor",
  role: "Property Manager",
  email: "sarah.connor@prophealth.com",
  phone: "(555) 123-4567",
  avatarUrl: "https://github.com/shadcn.png",
  tenure: "3.5 Years",
  
  healthScore: 88,
  riskLevel: "healthy",
  
  activeTasksCount: 15,
  overdueTasksCount: 1,
  avgTaskAgeDays: 2,
  completionRate: 0.95,
  customerFeedbackScore: 92,
  burnoutRiskScore: 40,

  metrics: {
    efficiency: { label: "Efficiency", score: 92, trend: 4, context: "Tasks completed / hr" },
    quality: { label: "Quality", score: 95, trend: 1, context: "First-time resolution" },
    speed: { label: "Speed", score: 85, trend: -2, context: "Avg response time" },
    reliability: { label: "Reliability", score: 98, trend: 0, context: "SLA adherence" },
  },

  vitals: [
    { key: "tasks_open", label: "Active Load", value: "15", status: "good", change90d: "-2" },
    { key: "csat", label: "CSAT Score", value: "4.8/5", status: "good", change90d: "+0.1" },
    { key: "response_time", label: "Avg Response", value: "2.4h", status: "warning", change90d: "+0.5h" },
    { key: "burnout", label: "Burnout Risk", value: "Low", status: "good" },
  ],

  activeTasks: [
    { id: "tsk-101", title: "Quarterly Budget Review", status: "In Progress", priority: "High", dueDate: "Today", relatedEntity: "The Heights" },
    { id: "tsk-102", title: "Approve Vendor Invoice #8821", status: "To Do", priority: "Medium", dueDate: "Tomorrow", relatedEntity: "Acme Plumbing" },
    { id: "tsk-103", title: "Tenant Onboarding: Unit 305", status: "In Progress", priority: "High", dueDate: "In 2 days", relatedEntity: "Unit 305" },
    { id: "tsk-104", title: "Schedule Fire Inspection", status: "To Do", priority: "Low", dueDate: "Next Week", relatedEntity: "Riverside Apts" },
    { id: "tsk-105", title: "Lease Renewal Negotiation", status: "Review", priority: "Medium", dueDate: "Overdue", relatedEntity: "Unit 102" },
  ],

  recentActivity: [
    { date: "2 hours ago", action: "Resolved high-priority plumbing ticket", impact: "positive" },
    { date: "Yesterday", action: "Closed 5 maintenance requests", impact: "positive" },
    { date: "2 days ago", action: "Missed internal sync meeting", impact: "negative" },
    { date: "3 days ago", action: "Updated Q4 financial forecast", impact: "neutral" },
  ]
};
