'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronsLeft,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/ui-store';
import { navItems, brand } from '@/lib/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, sidebarOpen, toggleSidebar, setSidebarOpen } =
    useUIStore();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-card/40 backdrop-blur-xl transition-all duration-300',
          sidebarCollapsed ? 'w-[68px]' : 'w-60',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <brand.icon className="h-4 w-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-sm font-semibold tracking-tight">
                {brand.name}
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
                  sidebarCollapsed && 'justify-center',
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                    active && 'text-primary',
                  )}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {active && !sidebarCollapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            onClick={toggleSidebar}
            className="hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground lg:flex"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronsLeft
              className={cn(
                'h-4 w-4 transition-transform',
                sidebarCollapsed && 'rotate-180',
              )}
            />
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
