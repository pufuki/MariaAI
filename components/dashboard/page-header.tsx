'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(ref.current?.children ?? [], {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
