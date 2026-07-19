'use client';

import { useState } from 'react';
import { User, Bell, Shield, CreditCard, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  function save() {
    toast({ title: 'Settings saved', description: 'Your changes are live.' });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and workspace preferences."
      />

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === t.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary/40 hover:text-foreground',
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <Card className="glass rounded-2xl border-border/50 p-6">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold tracking-tight">Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Update your personal information.
                </p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    defaultValue={user?.user_metadata?.name ?? ''}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    defaultValue={user?.email ?? ''}
                    disabled
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Agency Owner" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC-08 (Pacific)" className="rounded-xl" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="rounded-xl" onClick={save}>
                  Save changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold tracking-tight">Company</h3>
                <p className="text-sm text-muted-foreground">
                  Your agency details.
                </p>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company name</Label>
                  <Input id="company-name" defaultValue="Nebula AI" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="nebula.ai" className="rounded-xl" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="rounded-xl" onClick={save}>
                  Save changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold tracking-tight">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Choose what you want to be notified about.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                {[
                  { label: 'New client sign-ups', desc: 'When a client joins your agency', defaultChecked: true },
                  { label: 'Invoice payments', desc: 'When an invoice is paid', defaultChecked: true },
                  { label: 'Project milestones', desc: 'When a milestone is completed', defaultChecked: true },
                  { label: 'Weekly summary', desc: 'A digest of your week every Monday', defaultChecked: false },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch defaultChecked={n.defaultChecked} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold tracking-tight">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your account secure.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Two-factor authentication</p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Session timeout</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically sign out after 30 minutes of inactivity.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold tracking-tight">Billing</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your subscription and payment method.
                </p>
              </div>
              <Separator />
              <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Scale Plan</p>
                    <p className="text-sm text-muted-foreground">
                      $99/mo · Renews Aug 1, 2026
                    </p>
                  </div>
                  <Button variant="outline" className="rounded-lg">
                    Change plan
                  </Button>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">•••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expires 12/27</p>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-lg">
                    Update
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
