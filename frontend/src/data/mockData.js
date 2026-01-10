// Mock Data for Collections Management Platform

export const currentUser = {
  id: 'user-001',
  name: 'Sarah Chen',
  email: 'sarah.chen@fedex.com',
  role: 'admin', // admin, dca_agent, compliance, executive
  avatar: 'SC',
  organization: 'FedEx Collections'
};

export const roles = [
  { id: 'admin', name: 'Enterprise Admin', description: 'Full system access' },
  { id: 'dca_agent', name: 'DCA Agent', description: 'Case management and collection' },
  { id: 'compliance', name: 'Compliance Officer', description: 'Audit and compliance review' },
  { id: 'executive', name: 'Executive', description: 'Dashboard and reporting' }
];

export const dcaList = [
  { dca_id: 'DCA-001', name: 'Atlas Recovery Co', region_focus: ['Chennai', 'Bengaluru'], capacity: 120, active_cases: 83, recovery_rate_30d: 0.42, sla_compliance: 0.91 },
  { dca_id: 'DCA-002', name: 'Phoenix Collections', region_focus: ['Mumbai', 'Delhi'], capacity: 150, active_cases: 127, recovery_rate_30d: 0.38, sla_compliance: 0.87 },
  { dca_id: 'DCA-003', name: 'Apex Debt Solutions', region_focus: ['Hyderabad', 'Pune'], capacity: 100, active_cases: 92, recovery_rate_30d: 0.45, sla_compliance: 0.94 },
  { dca_id: 'DCA-004', name: 'Stellar Recovery Services', region_focus: ['Kolkata', 'Chennai'], capacity: 80, active_cases: 65, recovery_rate_30d: 0.51, sla_compliance: 0.89 },
  { dca_id: 'DCA-005', name: 'Vanguard Collections', region_focus: ['Delhi', 'Jaipur'], capacity: 110, active_cases: 98, recovery_rate_30d: 0.39, sla_compliance: 0.92 },
  { dca_id: 'DCA-006', name: 'Prime Debt Recovery', region_focus: ['Mumbai', 'Ahmedabad'], capacity: 90, active_cases: 71, recovery_rate_30d: 0.47, sla_compliance: 0.96 }
];

const customers = [
  { name: 'Acme Logistics Pvt Ltd', customer_id: 'CU-00938', region: 'Chennai' },
  { name: 'TechFlow Solutions', customer_id: 'CU-01024', region: 'Bengaluru' },
  { name: 'Global Trade Corp', customer_id: 'CU-00871', region: 'Mumbai' },
  { name: 'Sunrise Industries', customer_id: 'CU-01156', region: 'Delhi' },
  { name: 'Metro Services Ltd', customer_id: 'CU-00765', region: 'Hyderabad' },
  { name: 'Omega Manufacturing', customer_id: 'CU-01089', region: 'Pune' },
  { name: 'Delta Enterprises', customer_id: 'CU-00923', region: 'Kolkata' },
  { name: 'Sigma Retail Group', customer_id: 'CU-01201', region: 'Jaipur' },
  { name: 'Alpha Exports', customer_id: 'CU-00845', region: 'Chennai' },
  { name: 'Nova Textiles', customer_id: 'CU-01067', region: 'Ahmedabad' },
  { name: 'Pinnacle Tech', customer_id: 'CU-00956', region: 'Bengaluru' },
  { name: 'Zenith Corp', customer_id: 'CU-01134', region: 'Mumbai' },
  { name: 'Quantum Industries', customer_id: 'CU-00889', region: 'Delhi' },
  { name: 'Vista Holdings', customer_id: 'CU-01178', region: 'Hyderabad' },
  { name: 'Horizon Pharma', customer_id: 'CU-00798', region: 'Pune' }
];

const stages = ['Notice Sent', 'First Contact', 'Negotiation', 'Settlement', 'Closed'];
const priorities = ['HIGH', 'MEDIUM', 'LOW'];

const generateRandomDate = (daysBack, daysForward = 0) => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * (daysBack + daysForward)) - daysBack;
  now.setDate(now.getDate() + randomDays);
  return now.toISOString();
};

const activityTypes = [
  { type: 'call', note: 'Left voicemail regarding outstanding balance' },
  { type: 'call', note: 'Spoke with accounts payable, promised callback' },
  { type: 'email', note: 'Sent payment reminder email' },
  { type: 'note', note: 'Customer requested payment plan' },
  { type: 'payment', note: 'Partial payment received' },
  { type: 'escalation', note: 'Escalated to senior collector' },
  { type: 'call', note: 'Customer confirmed receipt of invoice' },
  { type: 'note', note: 'Dispute raised - investigating' }
];

const evidenceTypes = ['call_record', 'email_thread', 'payment_proof', 'signed_agreement', 'invoice_copy'];

export const generateCases = (count = 100) => {
  const cases = [];
  
  for (let i = 1; i <= count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const dca = dcaList[Math.floor(Math.random() * dcaList.length)];
    const stageIndex = Math.floor(Math.random() * stages.length);
    const outstanding = Math.floor(Math.random() * 50000) + 1000;
    const agingDays = Math.floor(Math.random() * 180) + 1;
    const priority = agingDays > 90 ? 'HIGH' : agingDays > 45 ? 'MEDIUM' : 'LOW';
    
    // Generate SOP progress based on stage
    const sopProgress = stages.slice(0, stageIndex + 1).map((step, idx) => ({
      step,
      status: idx < stageIndex ? 'done' : idx === stageIndex ? 'in_progress' : 'pending',
      ts: idx <= stageIndex ? generateRandomDate(30 + (stageIndex - idx) * 10) : null,
      evidence_required: idx < 2
    }));
    
    // Add remaining steps as pending
    stages.slice(stageIndex + 1).forEach(step => {
      sopProgress.push({ step, status: 'pending', ts: null, evidence_required: step === 'Settlement' });
    });
    
    // Generate activities
    const activityCount = Math.floor(Math.random() * 5) + 1;
    const activities = [];
    for (let j = 0; j < activityCount; j++) {
      const actTemplate = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      activities.push({
        id: `ACT-${i}-${j}`,
        actor: j % 2 === 0 ? 'collector_01' : 'dca_manager',
        type: actTemplate.type,
        note: actTemplate.note,
        ts: generateRandomDate(agingDays - j * 5)
      });
    }
    activities.sort((a, b) => new Date(b.ts) - new Date(a.ts));
    
    // Generate evidence
    const evidenceCount = Math.floor(Math.random() * 3);
    const evidence = [];
    for (let k = 0; k < evidenceCount; k++) {
      const evType = evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)];
      evidence.push({
        id: `E-${i}-${k}`,
        type: evType,
        filename: `${evType}_${i}_${k}.${evType === 'call_record' ? 'mp3' : 'pdf'}`,
        uploaded_by: 'collector_01',
        uploaded_at: generateRandomDate(agingDays / 2)
      });
    }
    
    cases.push({
      case_id: `C-2026-${String(i).padStart(4, '0')}`,
      customer,
      outstanding_amount: outstanding,
      currency: 'INR',
      aging_days: agingDays,
      priority,
      assigned_dca: dca.name,
      assigned_dca_id: dca.dca_id,
      stage: stages[stageIndex],
      expected_recovery: Math.floor(outstanding * (0.5 + Math.random() * 0.4)),
      p_recover: parseFloat((0.3 + Math.random() * 0.6).toFixed(2)),
      sla_deadline: generateRandomDate(-5, 14),
      last_activity_at: activities[0]?.ts || generateRandomDate(7),
      dispute_flag: Math.random() < 0.15,
      evidence,
      activities,
      sop_progress: sopProgress
    });
  }
  
  return cases;
};

export const cases = generateCases(100);

export const kpiData = {
  totalOverdue: cases.reduce((sum, c) => sum + c.outstanding_amount, 0),
  recoveryRate: 0.42,
  avgTimeToRecover: 45,
  slaBreachesToday: cases.filter(c => {
    const deadline = new Date(c.sla_deadline);
    const today = new Date();
    return deadline < today && c.stage !== 'Closed';
  }).length,
  activeDCAs: dcaList.length,
  totalCases: cases.length,
  closedCases: cases.filter(c => c.stage === 'Closed').length,
  disputes: cases.filter(c => c.dispute_flag).length
};

export const trendData = [
  { month: 'Jul', '0-30': 125000, '31-60': 89000, '61-90': 67000, '90+': 45000 },
  { month: 'Aug', '0-30': 118000, '31-60': 95000, '61-90': 72000, '90+': 51000 },
  { month: 'Sep', '0-30': 132000, '31-60': 88000, '61-90': 65000, '90+': 48000 },
  { month: 'Oct', '0-30': 141000, '31-60': 92000, '61-90': 71000, '90+': 52000 },
  { month: 'Nov', '0-30': 128000, '31-60': 86000, '61-90': 68000, '90+': 55000 },
  { month: 'Dec', '0-30': 135000, '31-60': 91000, '61-90': 74000, '90+': 49000 }
];

export const funnelData = [
  { stage: 'New', count: 45, amount: 245000 },
  { stage: 'Contacted', count: 32, amount: 178000 },
  { stage: 'Negotiation', count: 18, amount: 124000 },
  { stage: 'Settlement', count: 12, amount: 89000 },
  { stage: 'Closed', count: 8, amount: 67000 }
];

export const notifications = [
  { id: 1, type: 'sla', title: 'SLA Breach Warning', message: '5 cases approaching SLA deadline in 24 hours', time: '10 min ago', read: false },
  { id: 2, type: 'escalation', title: 'Escalation Request', message: 'Atlas Recovery requested escalation for C-2026-0023', time: '25 min ago', read: false },
  { id: 3, type: 'payment', title: 'Payment Received', message: 'Payment of ₹15,000 received for C-2026-0089', time: '1 hour ago', read: true },
  { id: 4, type: 'assignment', title: 'Cases Assigned', message: '12 new cases assigned to Phoenix Collections', time: '2 hours ago', read: true },
  { id: 5, type: 'compliance', title: 'Compliance Alert', message: 'Missing evidence detected for 3 cases', time: '3 hours ago', read: false }
];

export const auditLogs = [
  { id: 1, action: 'Case Assigned', actor: 'Sarah Chen', target: 'C-2026-0045', details: 'Assigned to Atlas Recovery Co', timestamp: '2026-01-10T10:30:00+05:30' },
  { id: 2, action: 'Stage Updated', actor: 'John Smith', target: 'C-2026-0023', details: 'Stage changed from Contacted to Negotiation', timestamp: '2026-01-10T09:15:00+05:30' },
  { id: 3, action: 'Evidence Uploaded', actor: 'Mike Johnson', target: 'C-2026-0089', details: 'Uploaded call_record_0089.mp3', timestamp: '2026-01-10T08:45:00+05:30' },
  { id: 4, action: 'Payment Recorded', actor: 'System', target: 'C-2026-0034', details: 'Payment of ₹25,000 recorded', timestamp: '2026-01-09T16:20:00+05:30' },
  { id: 5, action: 'SLA Extended', actor: 'Admin', target: 'C-2026-0067', details: 'SLA deadline extended by 7 days', timestamp: '2026-01-09T14:00:00+05:30' }
];

export const sopTemplates = [
  {
    id: 'SOP-001',
    name: 'Standard Collection',
    stages: [
      { name: 'Notice Sent', sla_days: 3, artifacts: ['notice_copy'], description: 'Send initial collection notice' },
      { name: 'First Contact', sla_days: 7, artifacts: ['call_record'], description: 'Make first contact attempt' },
      { name: 'Negotiation', sla_days: 14, artifacts: ['call_record', 'email_thread'], description: 'Negotiate payment terms' },
      { name: 'Settlement', sla_days: 7, artifacts: ['signed_agreement'], description: 'Finalize settlement agreement' },
      { name: 'Closed', sla_days: 3, artifacts: ['payment_proof'], description: 'Close case after payment' }
    ]
  },
  {
    id: 'SOP-002',
    name: 'High Priority Collection',
    stages: [
      { name: 'Urgent Notice', sla_days: 1, artifacts: ['notice_copy'], description: 'Send urgent collection notice' },
      { name: 'Immediate Contact', sla_days: 2, artifacts: ['call_record'], description: 'Make immediate contact attempt' },
      { name: 'Escalation Review', sla_days: 3, artifacts: ['escalation_form'], description: 'Review for potential escalation' },
      { name: 'Legal Assessment', sla_days: 5, artifacts: ['legal_review'], description: 'Assess legal options' },
      { name: 'Resolution', sla_days: 7, artifacts: ['settlement_doc', 'payment_proof'], description: 'Resolve and close' }
    ]
  }
];
