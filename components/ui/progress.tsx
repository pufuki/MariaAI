'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    role="progressbar"
    aria-valuenow={value ?? undefined}
    aria-valuemin={0}
    aria-valuemax={100}
    className={cn(
      'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
      className,
    )}
    {...props}
  >
    <div
      className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
      style={{ width: `${Math.min(Math.max(value ?? 0, 0), 100)}%` }}
    />
  </div>
));
Progress.displayName = 'Progress';

export { Progress };
