'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LoadingState({
  className,
  label = 'Loading…',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3 py-12 text-muted-foreground',
        className,
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <span className="text-lg font-bold">!</span>
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary/50"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/40 text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="font-medium">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
