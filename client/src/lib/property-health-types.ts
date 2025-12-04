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
