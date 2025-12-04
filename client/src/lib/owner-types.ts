export type OwnerPillarName = "Financial Stability" | "Portfolio Performance" | "Engagement" | "Risk";

export type OwnerPillarScore = {
  name: OwnerPillarName;
  score: number;          // 0–100
  trend90d?: number;      // +5, -8, etc.
};

export type OwnerVitalStatus = "good" | "warning" | "critical";

export type OwnerVital = {
  key: string;            // e.g. "cashFlowTrend"
  label: string;          // "Cash Flow Trend (90d)"
  value: string;          // "$+1,250", "-3.2%", etc.
  portfolioAverage?: string;  // across all owners (optional)
  change90d?: string;     // "+4%", "-$800", etc.
  status: OwnerVitalStatus;
};

export type OwnerDiagnosis = {
  id: string;
  label: string;          // "High maintenance burden across portfolio"
  severity: "Low" | "Medium" | "High" | "Critical";
  impactedPillars: OwnerPillarName[];
  narrative: string;      // 1–3 sentence explanation
  evidence: string[];     // bullet lines like "Maintenance cost ratio exceeds 15% for 4/7 properties."
  prescriptions: string[];// action bullets
};

export type OwnerPropertySummary = {
  propertyId: string;
  propertyName: string;   // "123 Main St"
  address: string;
  units: number;
  propertyHealthScore: number;   // 0–100
  occupancyRate: string;         // "96%"
  noiMargin?: string;            // "48%"
  maintenanceCostRatio?: string; // "9%"
  keyIssues?: string[];          // e.g. ["Rising maintenance", "High vacancy"]
};

export type OwnerHealthDetail = {
  ownerId: string;
  ownerName: string;       // "John Smith Holdings Inc."
  contactName?: string;    // if different from entity
  email?: string;
  phone?: string;
  avatarUrl?: string;

  totalProperties: number;
  totalUnits: number;

  overallScore: number;    // 0–100
  overallTrend90d?: number;

  pillars: OwnerPillarScore[];
  keyVitals: OwnerVital[];
  allVitals: OwnerVital[];

  diagnoses: OwnerDiagnosis[];
  properties: OwnerPropertySummary[];
};
