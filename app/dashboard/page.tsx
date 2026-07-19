'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { kpis } from '@/lib/data/dashboard';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { NotificationsPanel } from '@/components/dashboard/notifications-panel';
import { QuickActions } from '@/components/dashboard/quick-actions';

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from('.dash-header > *', {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      });
      gsap.from('.dash-grid > *', {
        y: 24,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        stagger: 0.06,
        ease: 'power3.out',
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="dash-header flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening across your agency today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.label} kpi={kpi} index={i} />
        ))}
      </div>

      <div className="dash-grid grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <NotificationsPanel />
      </div>
    </div>
  );
}
