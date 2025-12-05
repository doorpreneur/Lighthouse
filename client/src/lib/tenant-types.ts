export type TenantPillarName =
  | "Payment Health"
  | "Communication"
  | "Behavior & Risk"
  | "Satisfaction & Retention";

export type TenantPillarScore = {
  name: TenantPillarName;
  score: number;          // 0–100
  trend90d?: number;      // +5, -8, etc.
};

export type TenantVitalStatus = "good" | "warning" | "critical";

export type TenantVital = {
  key: string;            // e.g. "onTimePaymentRate"
  label: string;          // "On-Time Payments (12m)"
  value: string;          // "92%", "3 late in 6m", etc.
  portfolioAverage?: string;  // same metric across all tenants (optional)
  change90d?: string;     // "+4%", "-2 late", etc.
  status: TenantVitalStatus;
};

export type TenantDiagnosis = {
  id: string;
  label: string;          // "Chronic late payer"
  severity: "Low" | "Medium" | "High" | "Critical";
  impactedPillars: TenantPillarName[];
  narrative: string;      // 1–3 sentence explanation
  evidence: string[];     // bullet lines like "4 late payments in the last 6 months."
  prescriptions: string[];// action bullets
};

export type TenantEvent = {
  id: string;
  date: string;           // ISO string or display-formatted
  type: "Payment" | "WorkOrder" | "Communication" | "Violation" | "Lease";
  label: string;          // "Late payment posted", "Noise complaint", etc.
  detail?: string;        // short description
};

export type TenantHealthDetail = {
  tenantId: string;
  tenantName: string;        // "John Smith"
  unitLabel?: string;        // "Unit 201"
  propertyName?: string;     // "123 Main St"
  leaseId?: string;
  leaseStart?: string;
  leaseEnd?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;

  overallScore: number;      // 0–100
  overallTrend90d?: number;

  pillars: TenantPillarScore[];
  keyVitals: TenantVital[];
  allVitals: TenantVital[];

  diagnoses: TenantDiagnosis[];
  events: TenantEvent[];     // chronological “timeline” of key events
};
