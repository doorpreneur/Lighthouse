import { 
  calculateOwnerHealth, 
  calculateBuildingHealth, 
  calculateUnitHealth, 
  calculateTenantHealth, 
  calculateWorkflowHealth, 
  calculateTeamHealth,
  calculateBusinessHealth
} from "./health-engine";

import {
  OwnerHealth,
  BuildingHealth,
  UnitHealth,
  TenantHealth,
  WorkflowHealth,
  TeamMemberHealth,
  BusinessHealth
} from "./types";

// --- Mock Data Generation ---

const ownersData = [
  {
    id: "own-001",
    name: "Acme Properties LLC",
    unitsCount: 120,
    occupancyRate: 0.95,
    avgDaysVacantLast12Months: 12,
    rentCollectionRate: 0.98,
    maintenanceSpendPerUnit: 1200,
    maintenanceTrend: "stable",
    numberOfOpenOwnerIssues: 1,
    avgResponseTimeToOwnerMessages: 4,
    churnRiskFlag: false,
  },
  {
    id: "own-002",
    name: "Smith Family Trust",
    unitsCount: 45,
    occupancyRate: 0.88,
    avgDaysVacantLast12Months: 25,
    rentCollectionRate: 0.92,
    maintenanceSpendPerUnit: 1800,
    maintenanceTrend: "increasing",
    numberOfOpenOwnerIssues: 3,
    avgResponseTimeToOwnerMessages: 24,
    churnRiskFlag: true,
  },
  {
    id: "own-003",
    name: "Urban Living Groups",
    unitsCount: 250,
    occupancyRate: 0.98,
    avgDaysVacantLast12Months: 5,
    rentCollectionRate: 0.99,
    maintenanceSpendPerUnit: 900,
    maintenanceTrend: "decreasing",
    numberOfOpenOwnerIssues: 0,
    avgResponseTimeToOwnerMessages: 2,
    churnRiskFlag: false,
  },
  {
    id: "own-004",
    name: "Highland Investors",
    unitsCount: 80,
    occupancyRate: 0.75,
    avgDaysVacantLast12Months: 40,
    rentCollectionRate: 0.85,
    maintenanceSpendPerUnit: 2500,
    maintenanceTrend: "increasing",
    numberOfOpenOwnerIssues: 5,
    avgResponseTimeToOwnerMessages: 48,
    churnRiskFlag: true,
  },
  {
    id: "own-005",
    name: "Blue Sky Realty",
    unitsCount: 15,
    occupancyRate: 1.0,
    avgDaysVacantLast12Months: 0,
    rentCollectionRate: 0.95,
    maintenanceSpendPerUnit: 1100,
    maintenanceTrend: "stable",
    numberOfOpenOwnerIssues: 0,
    avgResponseTimeToOwnerMessages: 6,
    churnRiskFlag: false,
  }
] as const;

const buildingsData = [
  {
    id: "bld-001",
    name: "The Heights",
    address: "123 Main St",
    totalUnits: 50,
    occupancyRate: 0.96,
    vacancyRate: 0.04,
    openWorkOrdersCount: 2,
    avgWorkOrderAgeDays: 3,
    inspectionScore: 95,
    lastInspectionDate: "2024-10-15",
    lastCapitalRepairDate: "2023-05-20",
    cleanlinessScore: 90,
    safetyIncidentsPast12Months: 0,
  },
  {
    id: "bld-002",
    name: "Riverside Apartments",
    address: "45 River Rd",
    totalUnits: 100,
    occupancyRate: 0.85,
    vacancyRate: 0.15,
    openWorkOrdersCount: 18,
    avgWorkOrderAgeDays: 12,
    inspectionScore: 72,
    lastInspectionDate: "2024-08-10",
    lastCapitalRepairDate: "2020-11-15",
    cleanlinessScore: 65,
    safetyIncidentsPast12Months: 2,
  },
  {
    id: "bld-003",
    name: "Sunset Villas",
    address: "88 Sunset Blvd",
    totalUnits: 20,
    occupancyRate: 1.0,
    vacancyRate: 0.0,
    openWorkOrdersCount: 0,
    avgWorkOrderAgeDays: 0,
    inspectionScore: 98,
    lastInspectionDate: "2024-11-01",
    lastCapitalRepairDate: "2024-01-10",
    cleanlinessScore: 95,
    safetyIncidentsPast12Months: 0,
  },
  {
    id: "bld-004",
    name: "The Old Mill",
    address: "1 Industrial Way",
    totalUnits: 30,
    occupancyRate: 0.60,
    vacancyRate: 0.40,
    openWorkOrdersCount: 25,
    avgWorkOrderAgeDays: 20,
    inspectionScore: 45,
    lastInspectionDate: "2024-03-15",
    lastCapitalRepairDate: "2015-06-20",
    cleanlinessScore: 40,
    safetyIncidentsPast12Months: 4,
  }
] as const;

const unitsData = [
  { id: "u-101", buildingId: "bld-001", unitLabel: "101", occupancyStatus: "occupied", daysVacantLastTurn: 5, daysSinceLastTurn: 120, numberOfWorkOrdersLast12Months: 2, repeatIssuesCount: 0, rentPaymentTimeliness: 0, conditionScore: 90 },
  { id: "u-102", buildingId: "bld-001", unitLabel: "102", occupancyStatus: "occupied", daysVacantLastTurn: 3, daysSinceLastTurn: 300, numberOfWorkOrdersLast12Months: 1, repeatIssuesCount: 0, rentPaymentTimeliness: 2, conditionScore: 85 },
  { id: "u-205", buildingId: "bld-002", unitLabel: "205", occupancyStatus: "vacant", daysVacantLastTurn: 45, daysSinceLastTurn: 45, numberOfWorkOrdersLast12Months: 8, repeatIssuesCount: 3, rentPaymentTimeliness: 0, conditionScore: 55 },
  { id: "u-206", buildingId: "bld-002", unitLabel: "206", occupancyStatus: "notice", daysVacantLastTurn: 10, daysSinceLastTurn: 365, numberOfWorkOrdersLast12Months: 4, repeatIssuesCount: 1, rentPaymentTimeliness: 15, conditionScore: 70 },
  { id: "u-301", buildingId: "bld-003", unitLabel: "301", occupancyStatus: "occupied", daysVacantLastTurn: 2, daysSinceLastTurn: 600, numberOfWorkOrdersLast12Months: 0, repeatIssuesCount: 0, rentPaymentTimeliness: 0, conditionScore: 95 },
  { id: "u-401", buildingId: "bld-004", unitLabel: "401", occupancyStatus: "occupied", daysVacantLastTurn: 60, daysSinceLastTurn: 90, numberOfWorkOrdersLast12Months: 12, repeatIssuesCount: 5, rentPaymentTimeliness: 20, conditionScore: 30 },
  { id: "u-402", buildingId: "bld-004", unitLabel: "402", occupancyStatus: "vacant", daysVacantLastTurn: 90, daysSinceLastTurn: 90, numberOfWorkOrdersLast12Months: 0, repeatIssuesCount: 0, rentPaymentTimeliness: 0, conditionScore: 20 },
] as const;

const tenantsData = [
  { id: "t-001", name: "John Doe", unitId: "u-101", onTimePaymentRate: 1.0, avgDaysLate: 0, numberOfComplaintsFiled: 0, numberOfComplaintsAgainst: 0, leaseRenewalLikelihood: 0.9, communicationToneScore: 95 },
  { id: "t-002", name: "Jane Smith", unitId: "u-102", onTimePaymentRate: 0.9, avgDaysLate: 3, numberOfComplaintsFiled: 1, numberOfComplaintsAgainst: 0, leaseRenewalLikelihood: 0.7, communicationToneScore: 80 },
  { id: "t-003", name: "Bob Johnson", unitId: "u-206", onTimePaymentRate: 0.5, avgDaysLate: 25, numberOfComplaintsFiled: 5, numberOfComplaintsAgainst: 2, leaseRenewalLikelihood: 0.1, communicationToneScore: 30 },
  { id: "t-004", name: "Alice Brown", unitId: "u-301", onTimePaymentRate: 1.0, avgDaysLate: 0, numberOfComplaintsFiled: 0, numberOfComplaintsAgainst: 0, leaseRenewalLikelihood: 0.95, communicationToneScore: 100 },
  { id: "t-005", name: "Mike Wilson", unitId: "u-401", onTimePaymentRate: 0.7, avgDaysLate: 10, numberOfComplaintsFiled: 2, numberOfComplaintsAgainst: 3, leaseRenewalLikelihood: 0.3, communicationToneScore: 40 },
] as const;

const workflowsData = [
  { id: "wf-001", name: "Maintenance", workflowType: "maintenance", avgCycleTimeDays: 2.5, onTimeCompletionRate: 0.92, backlogCount: 5, reworkRate: 0.05, customerSatisfactionScore: 88 },
  { id: "wf-002", name: "Leasing", workflowType: "leasing", avgCycleTimeDays: 14, onTimeCompletionRate: 0.85, backlogCount: 12, reworkRate: 0.15, customerSatisfactionScore: 82 },
  { id: "wf-003", name: "Move Ins", workflowType: "moveIn", avgCycleTimeDays: 1, onTimeCompletionRate: 0.98, backlogCount: 2, reworkRate: 0.02, customerSatisfactionScore: 95 },
  { id: "wf-004", name: "Turnover", workflowType: "moveOut", avgCycleTimeDays: 10, onTimeCompletionRate: 0.60, backlogCount: 20, reworkRate: 0.25, customerSatisfactionScore: 65 },
  { id: "wf-005", name: "Claims", workflowType: "claims", avgCycleTimeDays: 45, onTimeCompletionRate: 0.40, backlogCount: 50, reworkRate: 0.10, customerSatisfactionScore: 50 },
] as const;

const teamData = [
  { id: "tm-001", name: "Sarah Connor", role: "Property Manager", activeTasksCount: 15, overdueTasksCount: 1, avgTaskAgeDays: 2, completionRate: 0.95, customerFeedbackScore: 92, burnoutRiskScore: 40 },
  { id: "tm-002", name: "Kyle Reese", role: "Maintenance Tech", activeTasksCount: 8, overdueTasksCount: 0, avgTaskAgeDays: 1, completionRate: 0.98, customerFeedbackScore: 95, burnoutRiskScore: 30 },
  { id: "tm-003", name: "Peter Silberman", role: "Leasing Agent", activeTasksCount: 25, overdueTasksCount: 8, avgTaskAgeDays: 5, completionRate: 0.75, customerFeedbackScore: 70, burnoutRiskScore: 85 },
  { id: "tm-004", name: "Miles Dyson", role: "Tech Lead", activeTasksCount: 40, overdueTasksCount: 15, avgTaskAgeDays: 10, completionRate: 0.60, customerFeedbackScore: 85, burnoutRiskScore: 95 },
] as const;

// --- Processed Data (Simulating Database) ---

export const owners: OwnerHealth[] = ownersData.map(d => calculateOwnerHealth(d as any));
export const buildings: BuildingHealth[] = buildingsData.map(d => calculateBuildingHealth(d as any));
export const units: UnitHealth[] = unitsData.map(d => calculateUnitHealth(d as any));
export const tenants: TenantHealth[] = tenantsData.map(d => calculateTenantHealth(d as any));
export const workflows: WorkflowHealth[] = workflowsData.map(d => calculateWorkflowHealth(d as any));
export const team: TeamMemberHealth[] = teamData.map(d => calculateTeamHealth(d as any));

export const businessHealth: BusinessHealth = calculateBusinessHealth(owners, buildings, units, tenants, workflows, team);

// --- API Simulation ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getBusinessHealth: async () => { await delay(500); return businessHealth; },
  getOwners: async () => { await delay(600); return owners; },
  getBuildings: async () => { await delay(400); return buildings; },
  getUnits: async () => { await delay(700); return units; },
  getTenants: async () => { await delay(500); return tenants; },
  getWorkflows: async () => { await delay(300); return workflows; },
  getTeam: async () => { await delay(400); return team; },
};
