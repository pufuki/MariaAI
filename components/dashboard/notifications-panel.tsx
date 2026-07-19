'use client';

import { Bell, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notifications } from '@/lib/data/dashboard';
import { cn } from '@/lib/utils';

export function NotificationsPanel() {
  return (
    <Card className="glass rounded-2xl border-border/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="font-semibold tracking-tight">Notifications</h3>
        </div>
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
          {notifications.filter((n) => n.unread).length} new
        </span>
      </div>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={cn(
              'flex gap-3 rounded-xl p-3 transition-colors',
              n.unread ? 'bg-secondary/40' : 'hover:bg-secondary/20',
            )}
          >
            <div className="relative mt-0.5">
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  n.unread ? 'bg-primary' : 'bg-muted-foreground/30',
                )}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.description}</p>
              <p className="mt-1 text-xs text-muted-foreground/70">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full rounded-xl"
        size="sm"
      >
        <Check className="h-3.5 w-3.5" />
        Mark all as read
      </Button>
    </Card>
  );
}
