'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, CreditCard, Trash2, Pencil, Download, Check, Clock, AlertCircle, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/states';

interface Invoice {
  id: string;
  client_id: string | null;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string | null;
  paid_date: string | null;
  created_at: string;
}

interface Client { id: string; name: string; }

const statusConfig: Record<string, { color: string; icon: typeof FileText }> = {
  draft: { color: 'bg-muted/50 text-muted-foreground border-border', icon: FileText },
  pending: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Clock },
  paid: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Check },
  overdue: { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: AlertCircle },
};

export default function InvoicesPage() {
  const { session } = useAuthStore();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    client_id: '', invoice_number: '', amount: '0', status: 'draft', due_date: '',
  });

  const fetch = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const [invRes, cliRes] = await Promise.all([
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('id, name').order('name'),
    ]);
    if (invRes.error) setError(invRes.error.message);
    else setInvoices(invRes.data ?? []);
    if (!cliRes.error) setClients(cliRes.data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { fetch(); }, [fetch]);

  function nextInvoiceNumber() {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${String(count).padStart(3, '0')}`;
  }

  function openCreate() {
    setEditing(null);
    setForm({ client_id: '', invoice_number: nextInvoiceNumber(), amount: '0', status: 'draft', due_date: '' });
    setDialogOpen(true);
  }

  function openEdit(inv: Invoice) {
    setEditing(inv);
    setForm({
      client_id: inv.client_id ?? '', invoice_number: inv.invoice_number,
      amount: String(inv.amount), status: inv.status,
      due_date: inv.due_date ?? '',
    });
    setDialogOpen(true);
  }

  async function save() {
    if (!form.invoice_number.trim()) { toast({ title: 'Invoice number required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = {
      client_id: form.client_id || null,
      invoice_number: form.invoice_number.trim(),
      amount: parseFloat(form.amount) || 0,
      status: form.status,
      due_date: form.due_date || null,
      paid_date: form.status === 'paid' ? new Date().toISOString().split('T')[0] : null,
    };
    if (editing) {
      const { error } = await supabase.from('invoices').update(payload).eq('id', editing.id);
      if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Invoice updated' }); setDialogOpen(false); fetch(); }
    } else {
      const { error } = await supabase.from('invoices').insert(payload);
      if (error) toast({ title: 'Create failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Invoice created' }); setDialogOpen(false); fetch(); }
    }
    setSaving(false);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Invoice deleted' }); fetch(); }
  }

  async function markPaid(id: string) {
    const { error } = await supabase.from('invoices').update({ status: 'paid', paid_date: new Date().toISOString().split('T')[0] }).eq('id', id);
    if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Marked as paid' }); fetch(); }
  }

  const clientName = (id: string | null) => clients.find((c) => c.id === id)?.name ?? 'No client';
  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';

  const totalCollected = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + Number(i.amount), 0);
  const totalOutstanding = invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + Number(i.amount), 0);
  const totalOverdue = invoices.filter((i) => i.status === 'overdue').reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" description="Track invoices and payments.">
        <Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />New invoice</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Collected', value: `$${totalCollected.toLocaleString()}`, color: 'text-emerald-400' },
          { label: 'Outstanding', value: `$${totalOutstanding.toLocaleString()}`, color: 'text-amber-400' },
          { label: 'Overdue', value: `$${totalOverdue.toLocaleString()}`, color: 'text-red-400' },
        ].map((s) => (
          <Card key={s.label} className="glass rounded-2xl border-border/50 p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Loading invoices…" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetch} />
      ) : invoices.length === 0 ? (
        <Card className="glass rounded-2xl border-border/50">
          <EmptyState icon={CreditCard} title="No invoices yet" description="Create your first invoice to start tracking payments." action={<Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />New invoice</Button>} />
        </Card>
      ) : (
        <Card className="glass overflow-hidden rounded-2xl border-border/50 p-0">
          <div className="divide-y divide-border/30">
            {invoices.map((inv) => {
              const cfg = statusConfig[inv.status] ?? statusConfig.draft;
              return (
                <div key={inv.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{inv.invoice_number}</p>
                      <p className="text-xs text-muted-foreground">{clientName(inv.client_id)} · Due {fmtDate(inv.due_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`rounded-full border ${cfg.color}`}>{inv.status}</Badge>
                    <span className="text-sm font-medium">${Number(inv.amount).toLocaleString()}</span>
                    {inv.status !== 'paid' && (
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-emerald-400 hover:text-emerald-400" onClick={() => markPaid(inv.id)}>
                        <Check className="h-3.5 w-3.5" />Mark paid
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(inv)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive hover:text-destructive" onClick={() => remove(inv.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit invoice' : 'New invoice'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="inv-num">Invoice # *</Label>
                <Input id="inv-num" className="rounded-xl" value={form.invoice_number} onChange={(e) => setForm({ ...form, invoice_number: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Client</Label>
                <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent className="glass-strong rounded-xl">{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" type="number" className="rounded-xl" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due">Due date</Label>
                <Input id="due" type="date" className="rounded-xl" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="glass-strong rounded-xl">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="rounded-xl">Cancel</Button></DialogClose>
            <Button className="rounded-xl" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Create invoice'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
