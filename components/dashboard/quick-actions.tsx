'use client';

import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { quickActions } from '@/lib/data/dashboard';

export function QuickActions() {
  return (
    <Card className="glass rounded-2xl border-border/50 p-5">
      <h3 className="mb-4 font-semibold tracking-tight">Quick actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center justify-between rounded-xl border border-border/50 bg-secondary/20 p-3 transition-all hover:border-primary/30 hover:bg-secondary/40"
          >
            <span className="text-sm font-medium">{action.label}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Plus className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/dashboard/analytics"
        className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-3 text-sm font-medium transition-all hover:from-primary/20 hover:to-accent/20"
      >
        View full analytics
        <ArrowRight className="h-4 w-4 text-primary" />
      </Link>
    </Card>
  );
}
