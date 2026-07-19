'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useToast } from '@/hooks/use-toast';

export function TopNav() {
  const router = useRouter();
  const { setSidebarOpen } = useUIStore();
  const { user, signOut } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const initials = (user?.email ?? 'U')
    .slice(0, 2)
    .toUpperCase();

  async function handleSignOut() {
    await signOut();
    toast({ title: 'Signed out', description: 'See you soon.' });
    router.replace('/sign-in');
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-muted-foreground hover:text-foreground"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients, projects, invoices…"
          className="h-9 rounded-lg border-border bg-card/50 pl-9 placeholder:text-muted-foreground"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-secondary/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl glass-strong"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.user_metadata?.name ?? 'Agency User'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg cursor-pointer">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg cursor-pointer"
              onClick={() => router.push('/dashboard/settings')}
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
