'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, Trash2, Pencil, Send, Check, X, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/states';

interface Proposal {
  id: string;
  client_id: string | null;
  title: string;
  content: string;
  status: string;
  value: number;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
}

const statusConfig: Record<string, { color: string; icon: typeof FileText }> = {
  draft: { color: 'bg-muted/50 text-muted-foreground border-border', icon: FileText },
  sent: { color: 'bg-accent/10 text-accent border-accent/20', icon: Send },
  accepted: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Check },
  rejected: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: X },
};

export default function ProposalsPage() {
  const { session } = useAuthStore();
  const { toast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Proposal | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client_id: '',
    title: '',
    content: '',
    status: 'draft',
    value: '0',
  });

  const fetch = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const [propRes, clientRes] = await Promise.all([
      supabase.from('proposals').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').order('name'),
    ]);
    if (propRes.error) setError(propRes.error.message);
    else setProposals(propRes.data ?? []);
    if (!clientRes.error) setClients(clientRes.data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { fetch(); }, [fetch]);

  function openCreate() {
    setEditing(null);
    setForm({ client_id: '', title: '', content: '', status: 'draft', value: '0' });
    setDialogOpen(true);
  }

  function openEdit(p: Proposal) {
    setEditing(p);
    setForm({
      client_id: p.client_id ?? '',
      title: p.title,
      content: p.content,
      status: p.status,
      value: String(p.value),
    });
    setDialogOpen(true);
  }

  async function save() {
    if (!form.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const payload = {
      client_id: form.client_id || null,
      title: form.title.trim(),
      content: form.content,
      status: form.status,
      value: parseFloat(form.value) || 0,
    };
    if (editing) {
      const { error } = await supabase.from('proposals').update(payload).eq('id', editing.id);
      if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Proposal updated' }); setDialogOpen(false); fetch(); }
    } else {
      const { error } = await supabase.from('proposals').insert(payload);
      if (error) toast({ title: 'Create failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Proposal created' }); setDialogOpen(false); fetch(); }
    }
    setSaving(false);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('proposals').delete().eq('id', id);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Proposal deleted' }); fetch(); }
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('proposals').update({ status }).eq('id', id);
    if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    else { toast({ title: `Marked as ${status}` }); fetch(); }
  }

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? 'No client';

  return (
    <div className="space-y-6">
      <PageHeader title="Proposals" description="Build and track proposals for your clients.">
        <Button className="rounded-xl" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New proposal
        </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: proposals.length },
          { label: 'Draft', value: proposals.filter((p) => p.status === 'draft').length },
          { label: 'Sent', value: proposals.filter((p) => p.status === 'sent').length },
          { label: 'Accepted', value: proposals.filter((p) => p.status === 'accepted').length },
        ].map((s) => (
          <Card key={s.label} className="glass rounded-2xl border-border/50 p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{s.value}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Loading proposals…" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetch} />
      ) : proposals.length === 0 ? (
        <Card className="glass rounded-2xl border-border/50">
          <EmptyState
            icon={FileText}
            title="No proposals yet"
            description="Create your first proposal to start winning deals."
            action={<Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />New proposal</Button>}
          />
        </Card>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {proposals.map((p) => {
            const cfg = statusConfig[p.status] ?? statusConfig.draft;
            return (
              <Card key={p.id} className="glass group rounded-2xl border-border/50 p-5 transition-all hover:border-primary/20 hover:bg-card/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium">{p.title}</h3>
                    <p className="text-sm text-muted-foreground">{clientName(p.client_id)}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 rounded-full border ${cfg.color}`}>
                    {p.status}
                  </Badge>
                </div>
                {p.content && (
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.content}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    {Number(p.value).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                      <SelectTrigger className="h-8 w-28 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="glass-strong rounded-xl">
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(p)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => remove(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit proposal' : 'New proposal'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" className="rounded-xl" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AI Chatbot Implementation" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Client</Label>
                <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent className="glass-strong rounded-xl">
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input id="value" type="number" className="rounded-xl" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" className="min-h-[160px] rounded-xl" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Describe the scope, deliverables, timeline…" />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="glass-strong rounded-xl">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="rounded-xl">Cancel</Button></DialogClose>
            <Button className="rounded-xl" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create proposal'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
