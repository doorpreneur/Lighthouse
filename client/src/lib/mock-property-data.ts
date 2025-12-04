import { PropertyHealth } from "./property-health-types";

export const mockPropertyHealth: PropertyHealth = {
  propertyId: "bld-001",
  name: "The Heights at Downtown",
  address: "123 Main St, Metropolis, NY 10012",
  totalUnits: 124,
  overallScore: 72,
  overallTrend90d: -4,
  pillars: [
    { name: "Physical", score: 65, trend90d: -8 },
    { name: "Financial", score: 82, trend90d: 2 },
    { name: "Tenant Experience", score: 78, trend90d: 0 },
    { name: "Risk", score: 60, trend90d: -5 },
  ],
  keyVitals: [
    { key: "occupancy", label: "Occupancy", value: "94%", change90d: "-2%", status: "good" },
    { key: "maint_cost", label: "Maint. Cost / Unit", value: "$1,250", change90d: "+15%", status: "warning" },
    { key: "wo_volume", label: "Open Work Orders", value: "42", change90d: "+12", status: "critical" },
    { key: "inspection", label: "Last Inspection", value: "84/100", change90d: "-5pts", status: "warning" },
  ],
  allVitals: [
    { key: "occupancy", label: "Occupancy", value: "94%", portfolioAverage: "95%", change90d: "-2%", status: "good" },
    { key: "maint_cost", label: "Maintenance Cost Ratio", value: "14%", portfolioAverage: "8%", change90d: "+6%", status: "critical" },
    { key: "wo_volume", label: "Work Orders / Unit (90d)", value: "2.4", portfolioAverage: "1.1", change90d: "+0.8", status: "warning" },
    { key: "turn_time", label: "Avg Turn Time", value: "18 days", portfolioAverage: "14 days", change90d: "+4 days", status: "warning" },
    { key: "ar_days", label: "A/R Days", value: "4.2", portfolioAverage: "5.0", change90d: "-0.5", status: "good" },
    { key: "renewal_rate", label: "Renewal Rate", value: "68%", portfolioAverage: "65%", change90d: "+3%", status: "good" },
    { key: "inspection_score", label: "REAC / Inspection Score", value: "84", portfolioAverage: "88", change90d: "-4", status: "warning" },
    { key: "compliance", label: "Open Violations", value: "2", portfolioAverage: "0.5", change90d: "+1", status: "critical" },
  ],
  diagnoses: [
    {
      id: "diag-1",
      label: "Accelerated Mechanical Aging",
      severity: "High",
      impactedPillars: ["Physical", "Financial"],
      narrative: "HVAC and plumbing systems are generating disproportionate work order volume, driving up maintenance costs and reducing net operating income.",
      evidence: [
        "Maintenance cost ratio increased from 8% → 14% in 12 months.",
        "Plumbing-related work orders are 2.5x portfolio average.",
        "Capital reserves are currently underfunded for projected replacement needs."
      ],
      prescriptions: [
        "Commission Level 2 HVAC audit immediately.",
        "Re-forecast capital expenditure budget for Q3/Q4.",
        "Implement preventative maintenance check on all boiler units."
      ]
    },
    {
      id: "diag-2",
      label: "Declining Tenant Sentiment",
      severity: "Medium",
      impactedPillars: ["Tenant Experience"],
      narrative: "Response times to non-emergency maintenance requests have slipped, correlating with a dip in renewal intent for units turning over in the next 90 days.",
      evidence: [
        "Avg work order completion time rose from 3.2 → 5.8 days.",
        "NPS score dropped 8 points in last quarterly survey.",
        "3 recent negative reviews mention 'slow repairs'."
      ],
      prescriptions: [
        "Hire temporary maintenance tech to clear backlog.",
        "Implement automated status updates for work orders.",
        "Offer renewal incentives for affected units."
      ]
    }
  ],
  units: [
    { unitId: "u-101", unitLabel: "Unit 101", healthScore: 95, occupancyStatus: "Occupied" },
    { unitId: "u-102", unitLabel: "Unit 102", healthScore: 45, occupancyStatus: "Occupied", keyIssues: ["Recurring plumbing leaks", "Late rent"] },
    { unitId: "u-103", unitLabel: "Unit 103", healthScore: 88, occupancyStatus: "Occupied" },
    { unitId: "u-104", unitLabel: "Unit 104", healthScore: 30, occupancyStatus: "Vacant", keyIssues: ["Down for 45+ days", "Mold remediation"] },
    { unitId: "u-201", unitLabel: "Unit 201", healthScore: 92, occupancyStatus: "Occupied" },
    { unitId: "u-202", unitLabel: "Unit 202", healthScore: 65, occupancyStatus: "Notice", keyIssues: ["Deposit dispute"] },
    { unitId: "u-203", unitLabel: "Unit 203", healthScore: 78, occupancyStatus: "Occupied" },
    { unitId: "u-204", unitLabel: "Unit 204", healthScore: 96, occupancyStatus: "Occupied" },
  ]
};
