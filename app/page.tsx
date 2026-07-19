'use client';

import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  Shield,
  Workflow,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Users,
    title: 'Client management',
    description:
      'Centralize every client relationship with contact info, contracts, and project history in one place.',
  },
  {
    icon: Workflow,
    title: 'Project orchestration',
    description:
      'Plan, assign, and track deliverables across teams with AI-assisted timelines and dependencies.',
  },
  {
    icon: BarChart3,
    title: 'Revenue intelligence',
    description:
      'Real-time MRR, churn, and forecasting baked in — no spreadsheets, no manual rollups.',
  },
  {
    icon: Zap,
    title: 'Automated workflows',
    description:
      'Trigger AI-powered actions on status changes, deadlines, and client communications.',
  },
  {
    icon: Shield,
    title: 'Enterprise security',
    description:
      'Role-based access, audit logs, and SOC 2-ready controls keep your data locked down.',
  },
  {
    icon: Sparkles,
    title: 'AI copilot',
    description:
      'Ask questions, generate proposals, and surface insights with an assistant that knows your agency.',
  },
];

const stats = [
  { value: '2,400+', label: 'Agencies' },
  { value: '$480M', label: 'Revenue tracked' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'Customer rating' },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[140px]" />
      <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-accent/20 blur-[140px]" />

      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">AI Agency OS</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#stats" className="hover:text-foreground transition-colors">
            Customers
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm" className="rounded-lg">
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6">
        <section className="flex flex-col items-center pt-20 pb-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            Now with AI Copilot
          </div>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight leading-[1.05] sm:text-6xl">
            The operating system for{' '}
            <span className="gradient-text">modern AI agencies</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Manage clients, projects, revenue, and your team in one premium
            workspace — built for speed, clarity, and scale.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 rounded-xl px-6">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl px-6"
              >
                View live demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · 14-day full-access trial
          </p>
        </section>

        <section id="stats" className="pb-24">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold tracking-tight">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="pb-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need to run your agency
            </h2>
            <p className="mt-3 text-muted-foreground">
              Replace a dozen disconnected tools with one premium workspace.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass group rounded-2xl p-6 transition-all hover:bg-card/80 hover:border-primary/20"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="pb-24">
          <div className="glass-strong gradient-border relative overflow-hidden rounded-3xl p-10 text-center">
            <div className="absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to run your agency on autopilot?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Join 2,400+ agencies already scaling with AI Agency OS.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 rounded-xl px-8">
                    Get started free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  {['No credit card', 'Cancel anytime', 'Setup in minutes'].map(
                    (item) => (
                      <span key={item} className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-primary" />
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span>AI Agency OS</span>
          </div>
          <p>© 2026 AI Agency OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
