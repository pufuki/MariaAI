'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, Trash2, Pencil, Calendar, DollarSign, CheckCircle2, XCircle, Clock } from 'lucide-react';
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/states';

interface Contract {
  id: string;
  client_id: string | null;
  title: string;
  content: string;
  status: string;
  value: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

interface Client { id: string; name: string; }

const statusConfig: Record<string, { color: string; icon: typeof FileText }> = {
  draft: { color: 'bg-muted/50 text-muted-foreground border-border', icon: FileText },
  active: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  expired: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  terminated: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
};

export default function ContractsPage() {
  const { session } = useAuthStore();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Contract | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client_id: '', title: '', content: '', status: 'draft', value: '0',
    start_date: '', end_date: '',
  });

  const fetch = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const [conRes, cliRes] = await Promise.all([
      supabase.from('contracts').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').order('name'),
    ]);
    if (conRes.error) setError(conRes.error.message);
    else setContracts(conRes.data ?? []);
    if (!cliRes.error) setClients(cliRes.data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { fetch(); }, [fetch]);

  function openCreate() {
    setEditing(null);
    setForm({ client_id: '', title: '', content: '', status: 'draft', value: '0', start_date: '', end_date: '' });
    setDialogOpen(true);
  }

  function openEdit(c: Contract) {
    setEditing(c);
    setForm({
      client_id: c.client_id ?? '', title: c.title, content: c.content,
      status: c.status, value: String(c.value),
      start_date: c.start_date ?? '', end_date: c.end_date ?? '',
    });
    setDialogOpen(true);
  }

  async function save() {
    if (!form.title.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = {
      client_id: form.client_id || null,
      title: form.title.trim(),
      content: form.content,
      status: form.status,
      value: parseFloat(form.value) || 0,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };
    if (editing) {
      const { error } = await supabase.from('contracts').update(payload).eq('id', editing.id);
      if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Contract updated' }); setDialogOpen(false); fetch(); }
    } else {
      const { error } = await supabase.from('contracts').insert(payload);
      if (error) toast({ title: 'Create failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Contract created' }); setDialogOpen(false); fetch(); }
    }
    setSaving(false);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('contracts').delete().eq('id', id);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Contract deleted' }); fetch(); }
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from('contracts').update({ status }).eq('id', id);
    if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    else { toast({ title: `Status: ${status}` }); fetch(); }
  }

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? 'No client';
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="space-y-6">
      <PageHeader title="Contracts" description="Manage client contracts and agreements.">
        <Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />New contract</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: contracts.length },
          { label: 'Active', value: contracts.filter((c) => c.status === 'active').length },
          { label: 'Draft', value: contracts.filter((c) => c.status === 'draft').length },
          { label: 'Contract value', value: `$${contracts.reduce((s, c) => s + Number(c.value), 0).toLocaleString()}` },
        ].map((s) => (
          <Card key={s.label} className="glass rounded-2xl border-border/50 p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{s.value}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Loading contracts…" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetch} />
      ) : contracts.length === 0 ? (
        <Card className="glass rounded-2xl border-border/50">
          <EmptyState icon={FileText} title="No contracts yet" description="Create your first contract to get started." action={<Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />New contract</Button>} />
        </Card>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {contracts.map((c) => {
            const cfg = statusConfig[c.status] ?? statusConfig.draft;
            return (
              <Card key={c.id} className="glass group rounded-2xl border-border/50 p-5 transition-all hover:border-primary/20 hover:bg-card/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">{clientName(c.client_id)}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 rounded-full border ${cfg.color}`}>{c.status}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" />{Number(c.value).toLocaleString()}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{fmtDate(c.start_date)} → {fmtDate(c.end_date)}</span>
                </div>
                <div className="mt-4 flex items-center justify-end gap-1">
                  <Select value={c.status} onValueChange={(v) => updateStatus(c.id, v)}>
                    <SelectTrigger className="h-8 w-28 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="glass-strong rounded-xl">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => remove(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong rounded-2xl max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit contract' : 'New contract'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" className="rounded-xl" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AI Services Retainer" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Client</Label>
                <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent className="glass-strong rounded-xl">{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Value ($)</Label>
                <Input id="value" type="number" className="rounded-xl" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start">Start date</Label>
                <Input id="start" type="date" className="rounded-xl" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end">End date</Label>
                <Input id="end" type="date" className="rounded-xl" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" className="min-h-[120px] rounded-xl" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Contract terms and conditions…" />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="glass-strong rounded-xl">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="rounded-xl">Cancel</Button></DialogClose>
            <Button className="rounded-xl" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create contract'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
