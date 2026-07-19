'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, FolderKanban, FileText, User } from 'lucide-react';
import { activities, type Activity } from '@/lib/data/dashboard';

const typeIcon: Record<Activity['type'], typeof User> = {
  client: UserPlus,
  project: FolderKanban,
  invoice: FileText,
  team: User,
};

const typeColor: Record<Activity['type'], string> = {
  client: 'text-emerald-400 bg-emerald-500/10',
  project: 'text-primary bg-primary/10',
  invoice: 'text-accent bg-accent/10',
  team: 'text-amber-400 bg-amber-500/10',
};

export function ActivityFeed() {
  return (
    <Card className="glass rounded-2xl border-border/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold tracking-tight">Recent activity</h3>
        <button className="text-xs text-primary hover:underline">
          View all
        </button>
      </div>
      <div className="space-y-1">
        {activities.map((a, i) => {
          const Icon = typeIcon[a.type];
          return (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/30"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColor[a.type]}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{a.user}</span>{' '}
                  <span className="text-muted-foreground">{a.action}</span>{' '}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
