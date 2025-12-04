import { UnitHealthDetail } from "./property-health-types";

export const mockUnitHealth: UnitHealthDetail = {
  unitId: "u-102",
  unitLabel: "Unit 102",
  propertyId: "bld-001",
  propertyName: "The Heights at Downtown",
  address: "123 Main St, Unit 102",
  healthScore: 45,
  occupancyStatus: "Occupied",
  floorPlan: "2 Bed / 2 Bath (Plan B)",
  sqft: 1150,
  rent: 2450,
  marketRent: 2600,
  keyIssues: ["Recurring plumbing leaks", "Late rent"],
  
  vitals: [
    { key: "wo_open", label: "Open Work Orders", value: "3", change90d: "+2", status: "critical" },
    { key: "days_open", label: "Avg WO Age", value: "12 days", change90d: "+5 days", status: "warning" },
    { key: "rent_payment", label: "Rent Status", value: "Late (15d)", status: "critical" },
    { key: "last_renewal", label: "Lease Remaining", value: "4 mos", status: "good" },
    { key: "inspection", label: "Internal Inspection", value: "72/100", change90d: "-10", status: "warning" },
  ],

  diagnoses: [
    {
      id: "udiag-1",
      label: "Chronic Plumbing Instability",
      severity: "High",
      impactedPillars: ["Physical", "Financial"],
      narrative: "Repeated leak reports in the master bathroom suggest a systemic pipe corrosion issue rather than isolated failures. This is causing water damage to the unit below.",
      evidence: [
        "3 separate leak work orders in 60 days.",
        "Total repair costs for this unit exceed annual budget by 40%.",
        "Moisture readings in adjacent wall are elevated (45%)."
      ],
      prescriptions: [
        "Schedule exploratory wall opening for pipe inspection.",
        "Inspect Unit 101 ceiling for water intrusion.",
        "Consider full repiping of stack B."
      ]
    },
    {
      id: "udiag-2",
      label: "At-Risk Tenancy",
      severity: "Medium",
      impactedPillars: ["Financial", "Risk"],
      narrative: "Tenant has been late on rent 2 of the last 3 months, coinciding with the recurring maintenance issues. Risk of delinquency or lease break is elevated.",
      evidence: [
        "Current balance: $1,225 (Past Due).",
        "Last payment was 12 days late.",
        "Tenant complained about 'unlivable conditions' in last WO note."
      ],
      prescriptions: [
        "Property Manager to conduct welfare check / personal outreach.",
        "Offer payment plan for current arrears.",
        "Prioritize plumbing repairs to restore goodwill."
      ]
    }
  ],

  recentWorkOrders: [
    { id: "wo-8821", title: "Leak under master bath sink", status: "Open", priority: "High", createdAt: "2 days ago", category: "Plumbing" },
    { id: "wo-8755", title: "Water stain on living room ceiling", status: "In Progress", priority: "Medium", createdAt: "5 days ago", category: "Plumbing" },
    { id: "wo-8102", title: "Dishwasher not draining", status: "Completed", priority: "Low", createdAt: "3 weeks ago", category: "Appliance" },
  ],

  tenant: {
    name: "Sarah Jenkins",
    leaseStart: "2023-06-01",
    leaseEnd: "2024-06-01",
    tenureYears: 1.5,
    paymentStatus: "Late",
    npsScore: 6,
    lastContact: "3 days ago (Email)"
  },

  history: [
    { date: "Oct 12", event: "Rent Payment Late", type: "financial" },
    { date: "Oct 10", event: "Work Order #8821 Created (Leak)", type: "maintenance" },
    { date: "Sep 28", event: "Routine Inspection (Score: 72)", type: "maintenance" },
    { date: "Sep 01", event: "Rent Payment On Time", type: "financial" },
    { date: "Aug 15", event: "Lease Renewal Offer Sent", type: "tenant" }
  ]
};
