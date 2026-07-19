'use client';

import { Plus, Calendar, Clock, MoreHorizontal } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const projects = [
  { name: 'Nimbus — AI Chatbot', client: 'Nimbus Labs', progress: 72, due: 'Aug 15', status: 'On Track' },
  { name: 'Acme Cloud Migration', client: 'Acme Corp', progress: 45, due: 'Sep 02', status: 'At Risk' },
  { name: 'Quantum Brand Refresh', client: 'Quantum Foods', progress: 90, due: 'Jul 28', status: 'On Track' },
  { name: 'Vertex Analytics Dashboard', client: 'Vertex Analytics', progress: 30, due: 'Sep 20', status: 'Planning' },
  { name: 'Helix Website Redesign', client: 'Helix Studios', progress: 15, due: 'Oct 10', status: 'Onboarding' },
];

const statusColor: Record<string, string> = {
  'On Track': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'At Risk': 'bg-red-500/10 text-red-400 border-red-500/20',
  Planning: 'bg-accent/10 text-accent border-accent/20',
  Onboarding: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Track deliverables, timelines, and team assignments."
      >
        <Button className="rounded-xl">
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card
            key={p.name}
            className="glass group rounded-2xl border-border/50 p-5 transition-all hover:border-primary/20 hover:bg-card/60"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <h3 className="truncate font-medium">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.client}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{p.progress}%</span>
              </div>
              <Progress value={p.progress} className="h-1.5" />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant="outline"
                className={`rounded-full border ${statusColor[p.status]}`}
              >
                {p.status}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {p.due}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
