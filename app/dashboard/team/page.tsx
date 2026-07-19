'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, UsersRound, Trash2, Pencil, Mail, MoreHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/states';

interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  role: string;
  status: string;
  avatar_color: string;
  created_at: string;
}

const roleColors: Record<string, string> = {
  owner: 'bg-primary/15 text-primary border-primary/20',
  admin: 'bg-accent/15 text-accent border-accent/20',
  manager: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  developer: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  designer: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  marketer: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-400',
  invited: 'bg-amber-400',
  disabled: 'bg-muted-foreground/30',
};

const avatarColors = ['primary', 'accent', 'emerald', 'amber', 'rose', 'cyan'];
const avatarBg: Record<string, string> = {
  primary: 'bg-primary/20 text-primary',
  accent: 'bg-accent/20 text-accent',
  emerald: 'bg-emerald-500/20 text-emerald-400',
  amber: 'bg-amber-500/20 text-amber-400',
  rose: 'bg-rose-500/20 text-rose-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
};

export default function TeamPage() {
  const { session } = useAuthStore();
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'developer', status: 'active' });

  const fetch = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setMembers(data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { fetch(); }, [fetch]);

  function openCreate() {
    setEditing(null);
    setForm({ name: '', email: '', role: 'developer', status: 'active' });
    setDialogOpen(true);
  }

  function openEdit(m: TeamMember) {
    setEditing(m);
    setForm({ name: m.name, email: m.email ?? '', role: m.role, status: m.status });
    setDialogOpen(true);
  }

  async function save() {
    if (!form.name.trim()) { toast({ title: 'Name is required', variant: 'destructive' }); return; }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      role: form.role,
      status: form.status,
      avatar_color: editing?.avatar_color ?? avatarColors[members.length % avatarColors.length],
    };
    if (editing) {
      const { error } = await supabase.from('team_members').update(payload).eq('id', editing.id);
      if (error) toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Team member updated' }); setDialogOpen(false); fetch(); }
    } else {
      const { error } = await supabase.from('team_members').insert(payload);
      if (error) toast({ title: 'Add failed', description: error.message, variant: 'destructive' });
      else { toast({ title: 'Team member added' }); setDialogOpen(false); fetch(); }
    }
    setSaving(false);
  }

  async function remove(id: string) {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Team member removed' }); fetch(); }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Team" description="Manage your team members and their roles.">
        <Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />Invite member</Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total members', value: members.length },
          { label: 'Active', value: members.filter((m) => m.status === 'active').length },
          { label: 'Invited', value: members.filter((m) => m.status === 'invited').length },
          { label: 'Disabled', value: members.filter((m) => m.status === 'disabled').length },
        ].map((s) => (
          <Card key={s.label} className="glass rounded-2xl border-border/50 p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{s.value}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <LoadingState label="Loading team…" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetch} />
      ) : members.length === 0 ? (
        <Card className="glass rounded-2xl border-border/50">
          <EmptyState icon={UsersRound} title="No team members yet" description="Invite your first team member to collaborate." action={<Button className="rounded-xl" onClick={openCreate}><Plus className="h-4 w-4" />Invite member</Button>} />
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <Card key={m.id} className="glass group rounded-2xl border-border/50 p-5 transition-all hover:border-primary/20 hover:bg-card/60">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={avatarBg[m.avatar_color] ?? avatarBg.primary}>
                      {m.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.name}</p>
                    {m.email && <p className="truncate text-sm text-muted-foreground">{m.email}</p>}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl glass-strong">
                    <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => openEdit(m)}><Pencil className="h-4 w-4" />Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-lg cursor-pointer text-destructive focus:text-destructive" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" />Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="outline" className={`rounded-full border ${roleColors[m.role] ?? roleColors.developer}`}>
                  {m.role}
                </Badge>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={`h-2 w-2 rounded-full ${statusColors[m.status] ?? statusColors.active}`} />
                  {m.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong rounded-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit member' : 'Invite team member'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" className="rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="rounded-xl" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@agency.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-strong rounded-xl">
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="designer">Designer</SelectItem>
                    <SelectItem value="marketer">Marketer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="glass-strong rounded-xl">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline" className="rounded-xl">Cancel</Button></DialogClose>
            <Button className="rounded-xl" onClick={save} disabled={saving}>{saving ? 'Saving…' : editing ? 'Save changes' : 'Send invite'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
