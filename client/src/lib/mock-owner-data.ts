import { OwnerHealthDetail } from "./owner-types";

export const mockOwnerHealth: OwnerHealthDetail = {
  ownerId: "own-001",
  ownerName: "Acme Properties LLC",
  contactName: "John Acme",
  email: "john@acmeproperties.com",
  phone: "(555) 987-6543",
  avatarUrl: "https://github.com/shadcn.png",

  totalProperties: 5,
  totalUnits: 120,

  overallScore: 68,
  overallTrend90d: -5,

  pillars: [
    { name: "Financial Stability", score: 72, trend90d: -3 },
    { name: "Portfolio Performance", score: 65, trend90d: -8 },
    { name: "Engagement", score: 85, trend90d: 5 },
    { name: "Risk", score: 50, trend90d: -12 },
  ],

  keyVitals: [
    { key: "cash_flow", label: "Cash Flow (90d)", value: "$45,200", change90d: "-8%", status: "warning" },
    { key: "occupancy", label: "Portfolio Occ.", value: "88%", change90d: "-4%", status: "critical" },
    { key: "maint_ratio", label: "Maint. Cost Ratio", value: "18%", change90d: "+6%", status: "critical" },
    { key: "sentiment", label: "Owner Sentiment", value: "Positive", status: "good" },
  ],

  allVitals: [
    { key: "cash_flow", label: "Cash Flow (90d)", value: "$45,200", change90d: "-8%", status: "warning" },
    { key: "occupancy", label: "Portfolio Occupancy", value: "88%", change90d: "-4%", status: "critical" },
    { key: "maint_ratio", label: "Maintenance Cost Ratio", value: "18%", change90d: "+6%", status: "critical" },
    { key: "renewal_rate", label: "Lease Renewal Rate", value: "62%", change90d: "-5%", status: "warning" },
    { key: "ar_days", label: "Avg A/R Days", value: "12", change90d: "+4", status: "warning" },
    { key: "response_time", label: "Avg Response Time", value: "4h", change90d: "-2h", status: "good" },
    { key: "distributions", label: "Distributions YTD", value: "$120k", change90d: "+2%", status: "good" },
    { key: "churn_risk", label: "Churn Risk", value: "Medium", status: "warning" },
  ],

  diagnoses: [
    {
      id: "odiag-1",
      label: "Portfolio-Wide Maintenance Surge",
      severity: "High",
      impactedPillars: ["Financial Stability", "Portfolio Performance"],
      narrative: "Maintenance costs have spiked across 3 of 5 properties simultaneously, significantly eroding Net Operating Income (NOI) margins for the quarter.",
      evidence: [
        "Maintenance cost ratio jumped from 12% → 18% in 90 days.",
        "Aggregate repair spend is $15k over budget.",
        "Unit 102 (The Heights) alone accounts for 20% of overage."
      ],
      prescriptions: [
        "Audit vendor invoices for recent plumbing work.",
        "Implement approval cap of $500 for on-site managers.",
        "Review capital improvement plan vs. repair categorization."
      ]
    },
    {
      id: "odiag-2",
      label: "Occupancy Erosion Risk",
      severity: "Medium",
      impactedPillars: ["Portfolio Performance", "Risk"],
      narrative: "Vacancy rates are creeping up in the C-class assets. While A-class properties are stable, the overall portfolio occupancy has dipped below the 90% threshold.",
      evidence: [
        "Riverside Apartments occupancy dropped to 85%.",
        "Notice-to-vacate volume is up 15% year-over-year.",
        "Avg days on market increased to 25 days."
      ],
      prescriptions: [
        "Launch targeted leasing special for Riverside Apts.",
        "Refresh listing photos for vacant units.",
        "Conduct market rent survey to ensure competitiveness."
      ]
    }
  ],

  properties: [
    { propertyId: "bld-001", propertyName: "The Heights", address: "123 Main St", units: 50, propertyHealthScore: 72, occupancyRate: "96%", noiMargin: "52%", maintenanceCostRatio: "14%", keyIssues: ["Mechanical Aging"] },
    { propertyId: "bld-002", propertyName: "Riverside Apartments", address: "45 River Rd", units: 100, propertyHealthScore: 55, occupancyRate: "85%", noiMargin: "38%", maintenanceCostRatio: "22%", keyIssues: ["High Vacancy", "Rising Maintenance"] },
    { propertyId: "bld-003", propertyName: "Sunset Villas", address: "88 Sunset Blvd", units: 20, propertyHealthScore: 92, occupancyRate: "100%", noiMargin: "60%", maintenanceCostRatio: "5%", keyIssues: [] },
    { propertyId: "bld-004", propertyName: "The Old Mill", address: "1 Industrial Way", units: 30, propertyHealthScore: 45, occupancyRate: "60%", noiMargin: "25%", maintenanceCostRatio: "18%", keyIssues: ["Major Rehab Needed", "Safety Risks"] },
    { propertyId: "bld-005", propertyName: "Downtown Lofts", address: "500 Broadway", units: 12, propertyHealthScore: 88, occupancyRate: "100%", noiMargin: "55%", maintenanceCostRatio: "8%", keyIssues: [] },
  ]
};
