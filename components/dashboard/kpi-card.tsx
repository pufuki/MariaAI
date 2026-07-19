'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, FolderKanban, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Kpi } from '@/lib/data/dashboard';

const iconMap = {
  revenue: DollarSign,
  clients: Users,
  projects: FolderKanban,
  utilization: Activity,
};

export function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = iconMap[kpi.icon];

  useGSAP(
    () => {
      gsap.from(ref.current, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: index * 0.08,
        ease: 'power3.out',
      });
    },
    { scope: ref },
  );

  const positive = kpi.delta >= 0;

  return (
    <Card
      ref={ref}
      className="glass relative overflow-hidden rounded-2xl border-border/50 p-5 transition-all hover:border-primary/20 hover:bg-card/60"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
            positive
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400',
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(kpi.delta)}%
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{kpi.label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{kpi.value}</p>
      </div>
    </Card>
  );
}
