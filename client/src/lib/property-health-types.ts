export type PillarName = "Physical" | "Financial" | "Tenant Experience" | "Risk";

export type PillarScore = {
  name: PillarName;
  score: number;          // 0–100
  trend90d?: number;      // +5, -8, etc.
};

export type VitalStatus = "good" | "warning" | "critical";

export type Vital = {
  key: string;            // e.g. "occupancyRate"
  label: string;          // "Occupancy"
  value: string;          // "92%"
  portfolioAverage?: string;
  change90d?: string;     // "+4%", "-2 days", etc.
  status: VitalStatus;
};

export type Diagnosis = {
  id: string;
  label: string;          // "Aging asset with rising maintenance"
  severity: "Low" | "Medium" | "High" | "Critical";
  impactedPillars: PillarName[];
  narrative: string;      // 1–3 sentence explanation
  evidence: string[];     // bullet lines like "Maintenance cost ratio increased from 8% → 13% in 12 months."
  prescriptions: string[];// action bullets
};

export type UnitHealth = {
  unitId: string;
  unitLabel: string;      // "Unit 201"
  healthScore: number;    // 0–100
  occupancyStatus: "Occupied" | "Vacant" | "Notice";
  keyIssues?: string[];   // e.g., ["High WO volume", "Long vacancy streak"]
};

export type WorkOrder = {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Completed" | "On Hold";
  priority: "Low" | "Medium" | "High" | "Emergency";
  createdAt: string;
  category: string;
};

export type TenantProfile = {
  name: string;
  leaseStart: string;
  leaseEnd: string;
  tenureYears: number;
  paymentStatus: "Good" | "Late" | "Arrears";
  npsScore?: number; // 0-10
  lastContact: string;
};

export type UnitHealthDetail = UnitHealth & {
  propertyId: string;
  propertyName: string;
  address: string;
  floorPlan: string; // "2 Bed / 2 Bath"
  sqft: number;
  rent: number;
  marketRent: number;
  
  // Detailed Vitals for Unit
  vitals: Vital[];
  
  // Specific Diagnoses for Unit
  diagnoses: Diagnosis[];
  
  // Recent Work Orders
  recentWorkOrders: WorkOrder[];
  
  // Tenant Info (if occupied)
  tenant?: TenantProfile;

  // History timeline (simplified)
  history: { date: string; event: string; type: "maintenance" | "financial" | "tenant" }[];
};

export type PropertyHealth = {
  propertyId: string;
  name: string;           // "123 Main St"
  address: string;
  totalUnits: number;
  overallScore: number;   // 0–100
  overallTrend90d?: number;
  pillars: PillarScore[];
  keyVitals: Vital[];
  allVitals: Vital[];
  diagnoses: Diagnosis[];
  units: UnitHealth[];
};
