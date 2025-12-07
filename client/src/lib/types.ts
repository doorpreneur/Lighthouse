export type RiskLevel = "healthy" | "watch" | "critical";

export interface BaseEntity {
  id: string;
  name: string;
  healthScore: number;
  riskLevel: RiskLevel;
}

export interface OwnerHealth extends BaseEntity {
  unitsCount: number;
  occupancyRate: number; // 0-1
  avgDaysVacantLast12Months: number;
  rentCollectionRate: number; // 0-1
  maintenanceSpendPerUnit: number;
  maintenanceTrend: "increasing" | "stable" | "decreasing";
  numberOfOpenOwnerIssues: number;
  avgResponseTimeToOwnerMessages: number; // hours
  churnRiskFlag: boolean;
}

export interface BuildingHealth extends BaseEntity {
  address: string;
  totalUnits: number;
  occupancyRate: number;
  vacancyRate: number;
  openWorkOrdersCount: number;
  avgWorkOrderAgeDays: number;
  inspectionScore: number; // 0-100
  lastInspectionDate: string;
  lastCapitalRepairDate: string;
  cleanlinessScore: number; // 0-100
  safetyIncidentsPast12Months: number;
}

export interface UnitHealth extends BaseEntity {
  buildingId: string;
  unitLabel: string;
  occupancyStatus: "occupied" | "vacant" | "notice";
  daysVacantLastTurn: number;
  daysSinceLastTurn: number;
  numberOfWorkOrdersLast12Months: number;
  repeatIssuesCount: number;
  rentPaymentTimeliness: number; // avg days late
  conditionScore: number; // 0-100
}

export interface TenantHealth extends BaseEntity {
  unitId: string;
  onTimePaymentRate: number; // 0-1
  avgDaysLate: number;
  numberOfComplaintsFiled: number;
  numberOfComplaintsAgainst: number;
  leaseRenewalLikelihood: number; // 0-1
  communicationToneScore: number; // 0-100
}

export type WorkflowType =
  | "newManagement"
  | "leasing"
  | "moveIn"
  | "moveOut"
  | "maintenance"
  | "claims"
  | "inspections";

export interface WorkflowHealth extends BaseEntity {
  workflowType: WorkflowType;
  avgCycleTimeDays: number;
  onTimeCompletionRate: number; // 0-1
  backlogCount: number;
  reworkRate: number; // 0-1
  customerSatisfactionScore: number; // 0-100
}

export interface TeamMemberHealth extends BaseEntity {
  role: string;
  activeTasksCount: number;
  activeTasksTrend: "up" | "down" | "stable";
  overdueTasksCount: number;
  avgTaskAgeDays: number;
  completionRate: number; // 0-1
  completionRateTrend: "up" | "down" | "stable";
  customerFeedbackScore: number; // 0-100
  burnoutRiskScore: number; // 0-100
  prescription: string;
}

export interface BusinessHealth {
  overallScore: number;
  riskLevel: RiskLevel;
  ownerHealthSummary: CategorySummary;
  buildingHealthSummary: CategorySummary;
  unitHealthSummary: CategorySummary;
  tenantHealthSummary: CategorySummary;
  workflowHealthSummary: CategorySummary;
  teamHealthSummary: CategorySummary;
}

export interface CategorySummary {
  avgScore: number;
  totalCount: number;
  healthyCount: number;
  watchCount: number;
  criticalCount: number;
}
