'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading, initialized } = useAuthStore();

  useEffect(() => {
    if (initialized && !session && !loading) {
      router.replace('/sign-in');
    }
  }, [initialized, session, loading, router]);

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
