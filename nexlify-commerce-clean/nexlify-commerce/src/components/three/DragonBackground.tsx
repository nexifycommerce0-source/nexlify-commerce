'use client';

import { useEffect, useRef } from 'react';

export default function DragonBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dead = false;
    let destroy: (() => void) | undefined;
    import('./dragonScroll').then((m) => {
      if (dead || !ref.current) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      destroy = m.createScrollDragon(ref.current, { reduced }).destroy;
    });
    return () => {
      dead = true;
      destroy?.();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#05070d]"
    />
  );
}
