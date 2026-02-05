// Balto-like coaching system types

export interface CoachingChecklistItem {
  id: string;
  label: string;
  category: 'opening' | 'discovery' | 'presentation' | 'closing';
  isRequired: boolean;
  completedAt?: Date;
}

export interface TalkTrack {
  id: string;
  title: string;
  trigger: string;
  script: string;
  tips: string[];
  category: 'objection' | 'upsell' | 'compliance' | 'closing';
}

export interface ComplianceAlert {
  id: string;
  label: string;
  severity: 'info' | 'warning' | 'critical';
  isAcknowledged: boolean;
}

export interface ActiveCall {
  id: string;
  agentId: string;
  agentName: string;
  customerName: string;
  customerPhone: string;
  moveRoute: string;
  startTime: Date;
  complianceScore: number;
  completedItems: string[];
  status: 'active' | 'on-hold' | 'wrap-up';
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  avatar?: string;
  callsToday: number;
  avgHandleTime: string;
  complianceRate: number;
  conversionRate: number;
  status: 'available' | 'on-call' | 'away' | 'offline';
}

export interface TeamMetrics {
  totalCalls: number;
  avgComplianceScore: number;
  conversionRate: number;
  avgHandleTime: string;
  callsByHour: { hour: string; calls: number }[];
  topPerformers: { name: string; score: number }[];
  alertsCount: number;
}

// Demo data
export const DEMO_CHECKLIST: CoachingChecklistItem[] = [
  { id: '1', label: 'Greet customer by name', category: 'opening', isRequired: true },
  { id: '2', label: 'Verify contact information', category: 'opening', isRequired: true },
  { id: '3', label: 'Confirm move origin & destination', category: 'discovery', isRequired: true },
  { id: '4', label: 'Identify special items (piano, antiques)', category: 'discovery', isRequired: false },
  { id: '5', label: 'Discuss packing needs', category: 'discovery', isRequired: false },
  { id: '6', label: 'Review estimate details', category: 'presentation', isRequired: true },
  { id: '7', label: 'Explain valuation options', category: 'presentation', isRequired: true },
  { id: '8', label: 'Present packing service upsell', category: 'presentation', isRequired: false },
  { id: '9', label: 'Disclose binding estimate terms', category: 'closing', isRequired: true },
  { id: '10', label: 'Confirm payment method', category: 'closing', isRequired: true },
  { id: '11', label: 'Schedule follow-up', category: 'closing', isRequired: false },
];

export const DEMO_TALK_TRACKS: TalkTrack[] = [
  {
    id: 'obj-1',
    title: '"That\'s too expensive"',
    trigger: 'price objection',
    category: 'objection',
    script: "I understand price is important. Let me break down exactly what's included so you can see the value. Our binding estimate means no surprises on move day, and we include [full protection/professional packing/etc.]...",
    tips: [
      'Acknowledge their concern first',
      'Emphasize binding estimate protection',
      'Compare to industry horror stories',
      'Offer flexible payment options'
    ]
  },
  {
    id: 'obj-2',
    title: '"I need to think about it"',
    trigger: 'delay objection',
    category: 'objection',
    script: "Of course, this is an important decision. What specific aspects would you like to consider? I want to make sure you have all the information you need...",
    tips: [
      'Identify the real hesitation',
      'Offer to send written summary',
      'Create urgency with availability',
      'Schedule a follow-up call'
    ]
  },
  {
    id: 'obj-3',
    title: '"I\'m comparing quotes"',
    trigger: 'competition objection',
    category: 'objection',
    script: "Smart move! Comparing quotes is the right thing to do. When you compare, make sure you're looking at binding vs. non-binding, insurance coverage, and reviews. We're confident in our value because...",
    tips: [
      'Praise their due diligence',
      'Ask what others are offering',
      'Highlight differentiators',
      'Mention FMCSA carrier vetting'
    ]
  },
  {
    id: 'up-1',
    title: 'Full Packing Service',
    trigger: 'packing upsell',
    category: 'upsell',
    script: "Many of our customers find the full packing service to be a huge stress reliever. Our trained team handles everything with care, and it's covered under our valuation protection...",
    tips: [
      'Mention time savings',
      'Emphasize professional materials',
      'Note protection benefits',
      'Offer partial packing option'
    ]
  },
  {
    id: 'up-2',
    title: 'Valuation Coverage',
    trigger: 'insurance upsell',
    category: 'upsell',
    script: "I want to make sure your belongings are protected. Basic coverage is 60 cents per pound, but for high-value items, our Full Value Protection ensures replacement value...",
    tips: [
      'Explain the coverage difference',
      'Ask about high-value items',
      'Share claim process ease',
      'Compare to personal insurance'
    ]
  },
  {
    id: 'comp-1',
    title: 'Binding Estimate Disclosure',
    trigger: 'compliance',
    category: 'compliance',
    script: "Before we proceed, I need to explain that this is a binding estimate. This means the total cost won't exceed this amount as long as the inventory remains the same...",
    tips: [
      'REQUIRED: Must disclose before booking',
      'Explain benefits to customer',
      'Document acknowledgment',
      'Answer any questions'
    ]
  },
];

export const DEMO_COMPLIANCE_ALERTS: ComplianceAlert[] = [
  { id: 'ca-1', label: 'Disclose binding estimate terms', severity: 'critical', isAcknowledged: false },
  { id: 'ca-2', label: 'Explain valuation options', severity: 'warning', isAcknowledged: false },
  { id: 'ca-3', label: 'Confirm payment method accepted', severity: 'info', isAcknowledged: false },
  { id: 'ca-4', label: 'Mention cancellation policy', severity: 'warning', isAcknowledged: false },
];

export const DEMO_ACTIVE_CALLS: ActiveCall[] = [
  {
    id: 'call-1',
    agentId: 'agent-1',
    agentName: 'Sarah Mitchell',
    customerName: 'John Anderson',
    customerPhone: '(555) 234-5678',
    moveRoute: 'NYC → Miami',
    startTime: new Date(Date.now() - 8 * 60 * 1000),
    complianceScore: 85,
    completedItems: ['1', '2', '3', '6'],
    status: 'active'
  },
  {
    id: 'call-2',
    agentId: 'agent-2',
    agentName: 'Mike Johnson',
    customerName: 'Emily Chen',
    customerPhone: '(555) 345-6789',
    moveRoute: 'LA → Seattle',
    startTime: new Date(Date.now() - 3 * 60 * 1000),
    complianceScore: 92,
    completedItems: ['1', '2', '3', '4', '5', '6', '7'],
    status: 'active'
  },
  {
    id: 'call-3',
    agentId: 'agent-3',
    agentName: 'Lisa Wong',
    customerName: 'David Martinez',
    customerPhone: '(555) 456-7890',
    moveRoute: 'Chicago → Denver',
    startTime: new Date(Date.now() - 12 * 60 * 1000),
    complianceScore: 78,
    completedItems: ['1', '2', '3'],
    status: 'on-hold'
  },
];

export const DEMO_AGENT_PERFORMANCE: AgentPerformance[] = [
  {
    agentId: 'agent-1',
    agentName: 'Sarah Mitchell',
    callsToday: 12,
    avgHandleTime: '6:45',
    complianceRate: 94,
    conversionRate: 42,
    status: 'on-call'
  },
  {
    agentId: 'agent-2',
    agentName: 'Mike Johnson',
    callsToday: 15,
    avgHandleTime: '5:20',
    complianceRate: 98,
    conversionRate: 38,
    status: 'on-call'
  },
  {
    agentId: 'agent-3',
    agentName: 'Lisa Wong',
    callsToday: 9,
    avgHandleTime: '7:10',
    complianceRate: 86,
    conversionRate: 35,
    status: 'on-call'
  },
  {
    agentId: 'agent-4',
    agentName: 'Tom Harris',
    callsToday: 11,
    avgHandleTime: '5:55',
    complianceRate: 91,
    conversionRate: 44,
    status: 'available'
  },
  {
    agentId: 'agent-5',
    agentName: 'Anna Rodriguez',
    callsToday: 8,
    avgHandleTime: '8:15',
    complianceRate: 88,
    conversionRate: 52,
    status: 'away'
  },
];

export const DEMO_TEAM_METRICS: TeamMetrics = {
  totalCalls: 847,
  avgComplianceScore: 91,
  conversionRate: 38,
  avgHandleTime: '6:24',
  callsByHour: [
    { hour: '8am', calls: 45 },
    { hour: '9am', calls: 82 },
    { hour: '10am', calls: 96 },
    { hour: '11am', calls: 88 },
    { hour: '12pm', calls: 64 },
    { hour: '1pm', calls: 78 },
    { hour: '2pm', calls: 92 },
    { hour: '3pm', calls: 86 },
    { hour: '4pm', calls: 74 },
    { hour: '5pm', calls: 52 },
  ],
  topPerformers: [
    { name: 'Mike Johnson', score: 98 },
    { name: 'Sarah Mitchell', score: 94 },
    { name: 'Tom Harris', score: 91 },
    { name: 'Anna Rodriguez', score: 88 },
    { name: 'Lisa Wong', score: 86 },
  ],
  alertsCount: 3,
};
