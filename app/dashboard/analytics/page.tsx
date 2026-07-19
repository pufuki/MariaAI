'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/auth-store';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card } from '@/components/ui/card';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/states';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

interface Client { id: string; status: string; plan: string; mrr: number; }
interface Invoice { id: string; status: string; amount: number; created_at: string; }

function MiniTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl border-border/50 p-3 text-xs">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((e: any) => (
        <p key={e.name} className="text-muted-foreground">
          {e.name}: {typeof e.value === 'number' ? `$${e.value.toLocaleString()}` : e.value}
        </p>
      ))}
    </div>
  );
}

const pieColors = [
  'hsl(265 89% 78%)', 'hsl(217 91% 60%)', 'hsl(280 85% 65%)',
  'hsl(190 95% 55%)', 'hsl(330 80% 65%)',
];

export default function AnalyticsPage() {
  const { session } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const [cliRes, invRes] = await Promise.all([
      supabase.from('clients').select('id, status, plan, mrr'),
      supabase.from('invoices').select('id, status, amount, created_at'),
    ]);
    if (cliRes.error) setError(cliRes.error.message);
    else setClients(cliRes.data ?? []);
    if (!invRes.error) setInvoices(invRes.data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { fetch(); }, [fetch]);

  const totalMRR = clients.reduce((s, c) => s + Number(c.mrr), 0);
  const activeClients = clients.filter((c) => c.status === 'active').length;
  const collected = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0);
  const outstanding = invoices.filter((i) => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + Number(i.amount), 0);

  const planData = ['starter', 'growth', 'enterprise'].map((plan) => ({
    name: plan.charAt(0).toUpperCase() + plan.slice(1),
    clients: clients.filter((c) => c.plan === plan).length,
  }));

  const statusData = [
    { name: 'Active', value: clients.filter((c) => c.status === 'active').length },
    { name: 'Onboarding', value: clients.filter((c) => c.status === 'onboarding').length },
    { name: 'Past Due', value: clients.filter((c) => c.status === 'past_due').length },
    { name: 'Churned', value: clients.filter((c) => c.status === 'churned').length },
  ].filter((d) => d.value > 0);

  const invoiceData = [
    { name: 'Paid', value: invoices.filter((i) => i.status === 'paid').length },
    { name: 'Pending', value: invoices.filter((i) => i.status === 'pending').length },
    { name: 'Overdue', value: invoices.filter((i) => i.status === 'overdue').length },
    { name: 'Draft', value: invoices.filter((i) => i.status === 'draft').length },
  ].filter((d) => d.value > 0);

  const monthlyRevenue = invoices.reduce((acc, inv) => {
    const month = new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find((a) => a.month === month);
    if (existing) existing.revenue += Number(inv.amount);
    else acc.push({ month, revenue: Number(inv.amount) });
    return acc;
  }, [] as { month: string; revenue: number }[]);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Deep insights into your agency performance." />

      {loading ? (
        <LoadingState label="Loading analytics…" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetch} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total MRR', value: `$${totalMRR.toLocaleString()}`, icon: DollarSign, color: 'text-primary' },
              { label: 'Active Clients', value: activeClients, icon: Users, color: 'text-accent' },
              { label: 'Collected', value: `$${collected.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400' },
              { label: 'Outstanding', value: `$${outstanding.toLocaleString()}`, icon: Activity, color: 'text-amber-400' },
            ].map((s) => (
              <Card key={s.label} className="glass rounded-2xl border-border/50 p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/40 ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold tracking-tight">{s.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="glass rounded-2xl border-border/50 p-5">
              <h3 className="mb-4 font-semibold tracking-tight">Clients by plan</h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={planData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 100% / 0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(240 5% 50%)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(240 5% 50%)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<MiniTooltip />} cursor={{ fill: 'hsl(240 6% 100% / 0.03)' }} />
                    <Bar dataKey="clients" fill="hsl(265 89% 78%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="glass rounded-2xl border-border/50 p-5">
              <h3 className="mb-4 font-semibold tracking-tight">Client status</h3>
              <div className="h-[260px]">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                        {statusData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                      </Pie>
                      <Tooltip content={<MiniTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No data yet</div>
                )}
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
                {statusData.map((d, i) => (
                  <span key={d.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                    {d.name} ({d.value})
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="glass rounded-2xl border-border/50 p-5">
              <h3 className="mb-4 font-semibold tracking-tight">Invoice status breakdown</h3>
              <div className="h-[260px]">
                {invoiceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={invoiceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 100% / 0.05)" horizontal={false} />
                      <XAxis type="number" stroke="hsl(240 5% 50%)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" stroke="hsl(240 5% 50%)" fontSize={12} tickLine={false} axisLine={false} width={70} />
                      <Tooltip content={<MiniTooltip />} cursor={{ fill: 'hsl(240 6% 100% / 0.03)' }} />
                      <Bar dataKey="value" fill="hsl(217 91% 60%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No invoices yet</div>
                )}
              </div>
            </Card>

            <Card className="glass rounded-2xl border-border/50 p-5">
              <h3 className="mb-4 font-semibold tracking-tight">Revenue trend</h3>
              <div className="h-[260px]">
                {monthlyRevenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenue}>
                      <defs>
                        <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(265 89% 78%)" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="hsl(265 89% 78%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 100% / 0.05)" vertical={false} />
                      <XAxis dataKey="month" stroke="hsl(240 5% 50%)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(240 5% 50%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<MiniTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(265 89% 78%)" strokeWidth={2.5} fill="url(#revGrad2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No revenue data yet</div>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
