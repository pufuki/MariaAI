import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  Bot,
  Zap,
  UsersRound,
  BarChart3,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'CRM', href: '/dashboard/crm', icon: Users },
  { label: 'Proposals', href: '/dashboard/proposals', icon: FileText },
  { label: 'AI Chat', href: '/dashboard/ai-chat', icon: Bot },
  { label: 'Contracts', href: '/dashboard/contracts', icon: FileText },
  { label: 'Invoices', href: '/dashboard/invoices', icon: CreditCard },
  { label: 'Automations', href: '/dashboard/automations', icon: Zap },
  { label: 'Team', href: '/dashboard/team', icon: UsersRound },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export const brand = { name: 'AI Agency OS', icon: Sparkles };
