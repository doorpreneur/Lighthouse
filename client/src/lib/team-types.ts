import { TeamMemberHealth } from "./types";
import { Vital } from "./property-health-types";

export type Task = {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Review" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  relatedEntity: string; // e.g., "Unit 102" or "Invoice #992"
};

export type PerformanceMetric = {
  label: string;
  score: number; // 0-100
  trend: number; // +5, -2
  context: string; // e.g. "Top 10% of team"
};

export type TeamMemberDetail = TeamMemberHealth & {
  email: string;
  phone: string;
  avatarUrl: string;
  tenure: string;
  
  // Expanded Performance Metrics
  metrics: {
    efficiency: PerformanceMetric;
    quality: PerformanceMetric;
    speed: PerformanceMetric;
    reliability: PerformanceMetric;
  };

  // Workload Breakdown
  activeTasks: Task[];
  recentActivity: { date: string; action: string; impact: "positive" | "negative" | "neutral" }[];
  
  // Vitals specific to employee
  vitals: Vital[];
};
