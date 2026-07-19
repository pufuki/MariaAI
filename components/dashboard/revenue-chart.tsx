'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { revenueData } from '@/lib/data/dashboard';

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl border-border/50 p-3 text-xs">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-muted-foreground">
          <span
            className="mr-1.5 inline-block h-2 w-2 rounded-full"
            style={{ background: entry.color }}
          />
          {entry.name === 'revenue' ? 'Revenue' : 'Target'}: $
          {(entry.value / 1000).toFixed(1)}k
        </p>
      ))}
    </div>
  );
}

export function RevenueChart() {
  return (
    <Card className="glass rounded-2xl border-border/50 p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold tracking-tight">Revenue</h3>
          <p className="text-sm text-muted-foreground">
            Monthly revenue vs. target
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Target
          </span>
        </div>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueData}
            margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(265 89% 78%)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(265 89% 78%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tgtGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(240 6% 100% / 0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="hsl(240 5% 50%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(240 5% 50%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="target"
              stroke="hsl(217 91% 60%)"
              strokeWidth={2}
              fill="url(#tgtGrad)"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(265 89% 78%)"
              strokeWidth={2.5}
              fill="url(#revGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
