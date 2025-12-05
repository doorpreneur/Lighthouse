import { TenantHealthDetail } from "./tenant-types";

export const mockTenantHealth: TenantHealthDetail = {
  tenantId: "t-001",
  tenantName: "Michael Scott",
  unitLabel: "Unit 201",
  propertyName: "The Heights",
  leaseId: "l-9921",
  leaseStart: "Jan 1, 2024",
  leaseEnd: "Dec 31, 2024",
  email: "m.scott@dundermifflin.com",
  phone: "(555) 019-2834",
  avatarUrl: "https://github.com/shadcn.png", // Placeholder

  overallScore: 78,
  overallTrend90d: 6,

  pillars: [
    { name: "Payment Health", score: 65, trend90d: 12 },
    { name: "Communication", score: 92, trend90d: 0 },
    { name: "Behavior & Risk", score: 88, trend90d: 5 },
    { name: "Satisfaction & Retention", score: 75, trend90d: -2 },
  ],

  keyVitals: [
    { key: "onTimeRate", label: "On-Time Payments", value: "83%", change90d: "+15%", status: "warning" },
    { key: "responseTime", label: "Response Time", value: "2h", change90d: "-30m", status: "good" },
    { key: "nps", label: "NPS Score", value: "8/10", change90d: "0", status: "good" },
    { key: "renewal", label: "Renewal Prob.", value: "65%", change90d: "-5%", status: "warning" },
  ],

  allVitals: [
    { key: "onTimeRate", label: "On-Time Payments (12m)", value: "83%", portfolioAverage: "91%", change90d: "+15%", status: "warning" },
    { key: "latePayments", label: "Late Payments (6m)", value: "3", portfolioAverage: "1.2", change90d: "-1", status: "warning" },
    { key: "responseTime", label: "Response Time to Messages", value: "2 hours", portfolioAverage: "6 hours", change90d: "-30m", status: "good" },
    { key: "woSatisfaction", label: "Work Order Satisfaction", value: "4.5 / 5", portfolioAverage: "4.3 / 5", change90d: "+0.2", status: "good" },
    { key: "renewal", label: "Renewal Probability", value: "65%", portfolioAverage: "70%", change90d: "-5%", status: "warning" },
    { key: "complaints", label: "Complaints Filed", value: "2", portfolioAverage: "0.5", change90d: "+1", status: "good" }, // Context: complaining is good for communication? or bad? Assuming neutral/good if valid.
    { key: "violations", label: "Lease Violations", value: "0", portfolioAverage: "0.1", change90d: "0", status: "good" },
  ],

  diagnoses: [
    {
      id: "tdiag-1",
      label: "Recovering Late Payer",
      severity: "Medium",
      impactedPillars: ["Payment Health"],
      narrative: "Tenant had a period of instability in Q1 but has adhered to the new payment plan for 3 consecutive months. Risk is trending down but still monitored.",
      evidence: [
        "3 late payments in Jan-Mar.",
        "Paid on time in Apr, May, Jun.",
        "Current balance is $0."
      ],
      prescriptions: [
        "Maintain automated payment reminders.",
        "Consider removing late fee requirement if on-time streak reaches 6 months."
      ]
    },
    {
      id: "tdiag-2",
      label: "HVAC Frustration",
      severity: "Low",
      impactedPillars: ["Satisfaction & Retention"],
      narrative: "Recent survey feedback indicates dissatisfaction with unit temperature control, which is the primary driver for the dip in renewal probability.",
      evidence: [
        "Rated 'Unit Comfort' 2/5 in May survey.",
        "Mentioned 'AC is loud' in last work order note."
      ],
      prescriptions: [
        "Schedule preventative maintenance check for Unit 201 AC.",
        "Follow up personally after service to ensure satisfaction."
      ]
    }
  ],

  events: [
    { id: "evt-1", date: "Jun 01, 2024", type: "Payment", label: "Rent Payment Received", detail: "On time via portal" },
    { id: "evt-2", date: "May 15, 2024", type: "Communication", label: "Quarterly Survey Completed", detail: "NPS: 8, Comfort: 2/5" },
    { id: "evt-3", date: "May 01, 2024", type: "Payment", label: "Rent Payment Received", detail: "On time via portal" },
    { id: "evt-4", date: "Apr 12, 2024", type: "WorkOrder", label: "WO #8821 Closed", detail: "Kitchen sink leak repair" },
    { id: "evt-5", date: "Apr 01, 2024", type: "Payment", label: "Rent Payment Received", detail: "On time (first after plan)" },
    { id: "evt-6", date: "Mar 15, 2024", type: "Lease", label: "Payment Plan Agreed", detail: "To clear Feb/Mar arrears" },
    { id: "evt-7", date: "Mar 05, 2024", type: "Violation", label: "Late Rent Notice Sent", detail: "5 days overdue" },
  ]
};
