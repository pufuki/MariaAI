'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Zap, Trash2, Pencil, ArrowRight, Bell, Mail, FileText, Calendar, UserPlus, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/states';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  action_type: string;
  enabled: boolean;
  created_at: string;
}

const triggerOptions = [
  { value: 'client_added', label: 'Client added', icon: UserPlus },
  { value: 'proposal_sent', label: 'Proposal sent', icon: FileText },
  { value: 'invoice_overdue', label: 'Invoice overdue', icon: Calendar },
  { value: 'contract_signed', label: 'Contract signed', icon: CheckCircle2 },
  { value: 'manual', label: 'Manual trigger', icon: Zap },
];

const actionOptions = [
  { value: 'send_email', label: 'Send email', icon: Mail },
  { value: 'create_task', label: 'Create task', icon: FileText },
  { value: 'notification', label: 'Send notification', icon: Bell },
  { value: 'schedule_meeting', label: 'Schedule meeting', icon: Calendar },
];

export default function AutomationsPage() {
  const { session } = useAuthStore();
  const { toast } = useToast();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Automation | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', trigger_type: 'client_added', action_type: 'send_email',
  });

  const fetch = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('automations').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setAutomations(data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { fetch(); }, [fetch]);

  function openCreate() {
    setEditing(null);
    setForm({ name: '', description: '', trigger_type: 'client_added', action_type: 'send_email' });
    setDialogOpen(true);
  }

  function openEdit(a: Automation) {
    setEditing(a);
    setForm({ name: a.name, description: a.description, trigger_type: a.trigger_type, action_type: a.action_type });
    setDialogOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { toast({ title: 'Name is required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description,
      trigger_type: form.trigger_type,
      action_type: form.action_type,
      trigger_config: {},
      action_config: {},
    };
    if (editing) {
      const { error } = await supabase.from('automations').update(payload).eq('id', editing.id);
      if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Automation updated' }); setDialogOpen(false); fetch(); }
    } else {
      const { error } = await supabase.from('automations').insert(payload);
      if (error) toast({ title: 'Create failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Automation created' }); setDialogOpen(false); fetch(); }
    }
    setSaving(false);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('automations').delete().eq('id', id);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Automation deleted' }); fetch(); }
  }

  async function toggle(id: string, enabled: boolean) {
    const { error } = await supabase.from('automations').update({ enabled: !enabled }).eq('id', id);
    if (error) toast({ title: 'Toggle failed', description: error.message, variant: 'destructive' });
    else fetch();
  }

  const triggerLabel = (t: string) => triggerOptions.find((o) => o.value === t)?.label ?? t;
  const actionLabel = (a: string) => actionOptions.find((o) => o.value === a)?.label ?? a;
  const TriggerIcon = ({ type }: { type: string }) => {
    const opt = triggerOptions.find((o) => o.value === type);
    return opt ? <opt.icon className="h-4 w-4" /> : <Zap className="h-4 w-4" />;
  };
  const ActionIcon = ({ type }: { type: string }) => {
    const opt = actionOptions.find((o) => o.value === type);
    return opt ? <opt.icon className="h-4 w-4" /> : <Bell className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Automations" description="Build workflows that run your agency on autopilot.">
        <Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />New automation</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total automations', value: automations.length },
          { label: 'Active', value: automations.filter((a) => a.enabled).length },
          { label: 'Inactive', value: automations.filter((a) => !a.enabled).length },
        ].map((s) => (
          <Card key={s.label} className="glass rounded-2xl border-border/50 p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{s.value}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Loading automations…" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetch} />
      ) : automations.length === 0 ? (
        <Card className="glass rounded-2xl border-border/50">
          <EmptyState icon={Zap} title="No automations yet" description="Create your first automation to save time on repetitive tasks." action={<Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />New automation</Button>} />
        </Card>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {automations.map((a) => (
            <Card key={a.id} className="glass group rounded-2xl border-border/50 p-5 transition-all hover:border-primary/20 hover:bg-card/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-medium">{a.name}</h3>
                    <span className={`h-2 w-2 rounded-full ${a.enabled ? 'bg-emerald-400' : 'bg-muted-foreground/30'}`} />
                  </div>
                  {a.description && <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>}
                </div>
                <Switch checked={a.enabled} onCheckedChange={() => toggle(a.id, a.enabled)} />
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <TriggerIcon type={a.trigger_type} />
                  </div>
                  <span className="text-sm">{triggerLabel(a.trigger_type)}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <ActionIcon type={a.action_type} />
                  </div>
                  <span className="text-sm">{actionLabel(a.action_type)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => remove(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit automation' : 'New automation'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" className="rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Welcome email for new clients" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" className="min-h-[60px] rounded-xl" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Sends a welcome email when a new client is added…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Trigger</Label>
                <Select value={form.trigger_type} onValueChange={(v) => setForm({ ...form, trigger_type: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-strong rounded-xl">
                    {triggerOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Action</Label>
                <Select value={form.action_type} onValueChange={(v) => setForm({ ...form, action_type: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-strong rounded-xl">
                    {actionOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="rounded-xl">Cancel</Button></DialogClose>
            <Button className="rounded-xl" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create automation'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
