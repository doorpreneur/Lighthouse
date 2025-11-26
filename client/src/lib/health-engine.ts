import {
  OwnerHealth,
  BuildingHealth,
  UnitHealth,
  TenantHealth,
  WorkflowHealth,
  TeamMemberHealth,
  BusinessHealth,
  RiskLevel,
  CategorySummary,
  BaseEntity
} from "./types";

// Helper to determine risk level from score
export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "healthy";
  if (score >= 50) return "watch";
  return "critical";
}

// --- Scoring Functions ---

export function calculateOwnerHealth(owner: Omit<OwnerHealth, "healthScore" | "riskLevel">): OwnerHealth {
  let score = 100;

  // Penalties
  if (owner.occupancyRate < 0.9) score -= 10;
  if (owner.occupancyRate < 0.8) score -= 15;
  
  if (owner.rentCollectionRate < 0.95) score -= 10;
  if (owner.rentCollectionRate < 0.85) score -= 20;

  if (owner.numberOfOpenOwnerIssues > 2) score -= 10;
  if (owner.maintenanceTrend === "increasing") score -= 10;
  if (owner.churnRiskFlag) score -= 25;

  score = Math.max(0, Math.min(100, score));
  
  return {
    ...owner,
    healthScore: score,
    riskLevel: getRiskLevel(score)
  };
}

export function calculateBuildingHealth(building: Omit<BuildingHealth, "healthScore" | "riskLevel">): BuildingHealth {
  let score = 100;

  if (building.occupancyRate < 0.9) score -= 10;
  if (building.openWorkOrdersCount > 5) score -= 10;
  if (building.openWorkOrdersCount > 15) score -= 20;
  
  if (building.avgWorkOrderAgeDays > 7) score -= 10;
  
  if (building.inspectionScore < 80) score -= 10;
  if (building.inspectionScore < 60) score -= 20;
  
  if (building.safetyIncidentsPast12Months > 0) score -= (20 * building.safetyIncidentsPast12Months);
  
  if (building.cleanlinessScore < 70) score -= 10;

  score = Math.max(0, Math.min(100, score));

  return {
    ...building,
    healthScore: score,
    riskLevel: getRiskLevel(score)
  };
}

export function calculateUnitHealth(unit: Omit<UnitHealth, "healthScore" | "riskLevel">): UnitHealth {
  let score = 100;

  if (unit.occupancyStatus === "vacant") score -= 10;
  if (unit.occupancyStatus === "notice") score -= 5;
  
  if (unit.numberOfWorkOrdersLast12Months > 5) score -= 10;
  if (unit.repeatIssuesCount > 0) score -= (10 * unit.repeatIssuesCount);
  
  if (unit.rentPaymentTimeliness > 5) score -= 10;
  if (unit.rentPaymentTimeliness > 15) score -= 20;
  
  if (unit.conditionScore < 70) score -= 10;

  score = Math.max(0, Math.min(100, score));

  return {
    ...unit,
    healthScore: score,
    riskLevel: getRiskLevel(score)
  };
}

export function calculateTenantHealth(tenant: Omit<TenantHealth, "healthScore" | "riskLevel">): TenantHealth {
  let score = 100;

  if (tenant.onTimePaymentRate < 0.9) score -= 20;
  if (tenant.avgDaysLate > 5) score -= 10;
  
  if (tenant.numberOfComplaintsAgainst > 0) score -= (15 * tenant.numberOfComplaintsAgainst);
  if (tenant.leaseRenewalLikelihood < 0.5) score -= 10;
  
  if (tenant.communicationToneScore < 50) score -= 10;

  score = Math.max(0, Math.min(100, score));

  return {
    ...tenant,
    healthScore: score,
    riskLevel: getRiskLevel(score)
  };
}

export function calculateWorkflowHealth(workflow: Omit<WorkflowHealth, "healthScore" | "riskLevel">): WorkflowHealth {
  let score = 100;

  if (workflow.onTimeCompletionRate < 0.9) score -= 10;
  if (workflow.onTimeCompletionRate < 0.7) score -= 20;
  
  if (workflow.backlogCount > 10) score -= 10;
  
  if (workflow.reworkRate > 0.1) score -= 10;
  if (workflow.reworkRate > 0.2) score -= 20;
  
  if (workflow.customerSatisfactionScore < 80) score -= 10;

  score = Math.max(0, Math.min(100, score));

  return {
    ...workflow,
    healthScore: score,
    riskLevel: getRiskLevel(score)
  };
}

export function calculateTeamHealth(member: Omit<TeamMemberHealth, "healthScore" | "riskLevel">): TeamMemberHealth {
  let score = 100;

  if (member.overdueTasksCount > 2) score -= 15;
  if (member.overdueTasksCount > 5) score -= 30;
  
  if (member.completionRate < 0.9) score -= 10;
  
  if (member.customerFeedbackScore < 4.0) score -= 10; // Assuming 5 star scale or similar normalized
  if (member.customerFeedbackScore < 80) score -= 10; // If 100 scale

  if (member.burnoutRiskScore > 70) score -= 20;
  if (member.burnoutRiskScore > 90) score -= 40;

  score = Math.max(0, Math.min(100, score));

  return {
    ...member,
    healthScore: score,
    riskLevel: getRiskLevel(score)
  };
}

export function calculateBusinessHealth(
  owners: OwnerHealth[],
  buildings: BuildingHealth[],
  units: UnitHealth[],
  tenants: TenantHealth[],
  workflows: WorkflowHealth[],
  team: TeamMemberHealth[]
): BusinessHealth {
  const getSummary = (items: BaseEntity[]): CategorySummary => {
    const total = items.length;
    if (total === 0) return { avgScore: 0, totalCount: 0, healthyCount: 0, watchCount: 0, criticalCount: 0 };
    
    const sum = items.reduce((acc, item) => acc + item.healthScore, 0);
    return {
      avgScore: Math.round(sum / total),
      totalCount: total,
      healthyCount: items.filter(i => i.riskLevel === "healthy").length,
      watchCount: items.filter(i => i.riskLevel === "watch").length,
      criticalCount: items.filter(i => i.riskLevel === "critical").length,
    };
  };

  const ownerSummary = getSummary(owners);
  const buildingSummary = getSummary(buildings);
  const unitSummary = getSummary(units);
  const tenantSummary = getSummary(tenants);
  const workflowSummary = getSummary(workflows);
  const teamSummary = getSummary(team);

  // Weighted average for overall business health
  // Prioritizing Owners (Revenue source) and Buildings (Asset value)
  const overallScore = Math.round(
    (ownerSummary.avgScore * 0.25) +
    (buildingSummary.avgScore * 0.20) +
    (unitSummary.avgScore * 0.10) +
    (tenantSummary.avgScore * 0.15) +
    (workflowSummary.avgScore * 0.15) +
    (teamSummary.avgScore * 0.15)
  );

  return {
    overallScore,
    riskLevel: getRiskLevel(overallScore),
    ownerHealthSummary: ownerSummary,
    buildingHealthSummary: buildingSummary,
    unitHealthSummary: unitSummary,
    tenantHealthSummary: tenantSummary,
    workflowHealthSummary: workflowSummary,
    teamHealthSummary: teamSummary
  };
}
