export interface Kpi {
  label: string;
  value: string;
  delta: number;
  icon: 'revenue' | 'clients' | 'projects' | 'utilization';
}

export const kpis: Kpi[] = [
  { label: 'Monthly Revenue', value: '$84,250', delta: 12.5, icon: 'revenue' },
  { label: 'Active Clients', value: '38', delta: 8.2, icon: 'clients' },
  { label: 'Open Projects', value: '24', delta: -3.1, icon: 'projects' },
  { label: 'Team Utilization', value: '87%', delta: 5.4, icon: 'utilization' },
];

export const revenueData = [
  { month: 'Jan', revenue: 52000, target: 50000 },
  { month: 'Feb', revenue: 58000, target: 55000 },
  { month: 'Mar', revenue: 61000, target: 60000 },
  { month: 'Apr', revenue: 67500, target: 65000 },
  { month: 'May', revenue: 71200, target: 70000 },
  { month: 'Jun', revenue: 78400, target: 75000 },
  { month: 'Jul', revenue: 84250, target: 80000 },
];

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'client' | 'project' | 'invoice' | 'team';
}

export const activities: Activity[] = [
  {
    id: '1',
    user: 'Sarah Chen',
    action: 'closed a deal with',
    target: 'Nimbus Labs',
    time: '12m ago',
    type: 'client',
  },
  {
    id: '2',
    user: 'Marcus Lee',
    action: 'shipped milestone for',
    target: 'Acme Migration',
    time: '1h ago',
    type: 'project',
  },
  {
    id: '3',
    user: 'Priya Patel',
    action: 'sent invoice to',
    target: 'Quantum Foods',
    time: '3h ago',
    type: 'invoice',
  },
  {
    id: '4',
    user: 'James Wright',
    action: 'joined the team',
    target: 'AI Engineer',
    time: '5h ago',
    type: 'team',
  },
  {
    id: '5',
    user: 'Sarah Chen',
    action: 'started project for',
    target: 'Vertex Analytics',
    time: 'Yesterday',
    type: 'project',
  },
];

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New client onboarded',
    description: 'Nimbus Labs has accepted your proposal.',
    time: '12m ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Invoice overdue',
    description: 'Quantum Foods invoice is 3 days overdue.',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    title: 'Milestone completed',
    description: 'Acme Migration Phase 2 is done.',
    time: '3h ago',
    unread: true,
  },
  {
    id: '4',
    title: 'Weekly report ready',
    description: 'Your agency performance summary is available.',
    time: 'Yesterday',
    unread: false,
  },
];

export const quickActions = [
  { label: 'Add Client', href: '/dashboard/crm' },
  { label: 'New Proposal', href: '/dashboard/proposals' },
  { label: 'New Invoice', href: '/dashboard/invoices' },
  { label: 'Invite Team', href: '/dashboard/team' },
];
