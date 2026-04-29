export type RiskLevel = 'critical' | 'warning' | 'success' | 'normal';
export type DealStage = 'Sourcing' | 'Due Diligence' | 'Execution' | 'Portfolio';

export interface Task {
  id: string;
  dealId: string;
  dealName: string;
  title: string;
  dueDate: string;
  risk: RiskLevel;
  owner: string;
  stage: DealStage;
  type: 'urgent' | 'at-risk' | 'upcoming';
}

export interface Deal {
  id: string;
  name: string;
  stage: DealStage;
  kpi: string;
  lastActivity: string;
  primaryContact: string;
  lastInteractionDate: string;
  interactionsCount: number;
  daysInCurrentStage: number;
  riskFlags: string[];
}

export interface CalendarBlock {
  id: string;
  title: string;
  time: string;
  duration: '30m' | '1h' | '2h';
  type: 'task' | 'meeting' | 'insight';
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  action: string;
}

export const mockTasks: Task[] = [
  {
    id: 't1',
    dealId: 'd1',
    dealName: 'Acme Corp Buyout',
    title: 'Finalize Term Sheet with Legal',
    dueDate: 'Today, 2:00 PM',
    risk: 'critical',
    owner: 'Sarah J.',
    stage: 'Execution',
    type: 'urgent'
  },
  {
    id: 't2',
    dealId: 'd2',
    dealName: 'Nebula SaaS',
    title: 'Review updated ARR model',
    dueDate: 'Today, EOD',
    risk: 'warning',
    owner: 'Mike D.',
    stage: 'Due Diligence',
    type: 'urgent'
  },
  {
    id: 't3',
    dealId: 'd3',
    dealName: 'Project Titan',
    title: 'Missing Q3 Financials',
    dueDate: 'Overdue by 2 days',
    risk: 'critical',
    owner: 'Alex W.',
    stage: 'Sourcing',
    type: 'at-risk'
  },
  {
    id: 't4',
    dealId: 'd2',
    dealName: 'Nebula SaaS',
    title: 'Competitor Analysis Deck',
    dueDate: 'Tomorrow, 10:00 AM',
    risk: 'success',
    owner: 'Sarah J.',
    stage: 'Due Diligence',
    type: 'upcoming'
  }
];

export const mockDeals: Deal[] = [
  {
    id: 'd1',
    name: 'Acme Corp Buyout',
    stage: 'Execution',
    kpi: '$120M Val',
    lastActivity: 'Term sheet rev 3 shared',
    primaryContact: 'Sarah Jenkins',
    lastInteractionDate: new Date(Date.now() - 1000 * 3600 * 2).toISOString(), // 2 hours ago
    interactionsCount: 28,
    daysInCurrentStage: 12,
    riskFlags: []
  },
  {
    id: 'd2',
    name: 'Nebula SaaS',
    stage: 'Due Diligence',
    kpi: '$45M ARR',
    lastActivity: 'Management call completed',
    primaryContact: 'Mike Davis',
    lastInteractionDate: new Date(Date.now() - 1000 * 3600 * 24 * 5).toISOString(), // 5 days ago
    interactionsCount: 8,
    daysInCurrentStage: 35,
    riskFlags: ['Missing financials']
  },
  {
    id: 'd3',
    name: 'Project Titan',
    stage: 'Sourcing',
    kpi: '35% Margin',
    lastActivity: 'NDA signed',
    primaryContact: 'Alex Wong',
    lastInteractionDate: new Date(Date.now() - 1000 * 3600 * 24 * 12).toISOString(), // 12 days ago
    interactionsCount: 3,
    daysInCurrentStage: 42,
    riskFlags: ['Counterparty unresponsive']
  },
  {
    id: 'd4',
    name: 'Optima Logistics',
    stage: 'Portfolio',
    kpi: '1.2x MOIC',
    lastActivity: 'Q2 prep meeting scheduled',
    primaryContact: 'Emma Stone',
    lastInteractionDate: new Date(Date.now() - 1000 * 3600 * 24 * 1).toISOString(), // 1 day ago
    interactionsCount: 45,
    daysInCurrentStage: 120,
    riskFlags: []
  }
];

export const mockCalendar: CalendarBlock[] = [
  {
    id: 'c1',
    title: 'Review Term Sheet (Acme)',
    time: '09:00 AM',
    duration: '1h',
    type: 'task'
  },
  {
    id: 'c2',
    title: 'Partner Deal Review',
    time: '10:00 AM',
    duration: '1h',
    type: 'meeting'
  },
  {
    id: 'c3',
    title: 'Nebula Founder Call',
    time: '11:30 AM',
    duration: '30m',
    type: 'meeting'
  }
];

export const mockInsights: Insight[] = []; // Insights are now generated dynamically
