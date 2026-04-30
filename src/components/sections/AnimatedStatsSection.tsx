'use client';

import { useEffect, useRef, useState } from 'react';
import { Activity, Globe2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

type Stat = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: typeof Shield;
};

const stats: Stat[] = [
  { label: 'Cities in active pilots', value: 50, suffix: '+', icon: Globe2 },
  { label: 'Hazard layers', value: 20, suffix: '+', icon: Shield },
  { label: 'Model refresh cadence', value: 24, suffix: 'h', prefix: '<', icon: Activity },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

function AnimatedNumber({
  target,
  prefix = '',
  suffix = '',
  durationMs,
  reducedMotion,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  durationMs: number;
  reducedMotion: boolean;
}) {
  const [display, setDisplay] = useState(reducedMotion ? target : 0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(target);
      return;
    }
    let frame: number;
    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(eased * target));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs, reducedMotion]);

  return (
    <span className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function AnimatedStatsSection() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20"
      id="stats"
      aria-labelledby="stats-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="relative mx-auto max-w-7xl px-6">
        <h2 id="stats-heading" className="sr-only">
          Platform reach
        </h2>
        <div
          className={cn(
            'grid gap-8 sm:grid-cols-3',
            visible && 'animate-in fade-in slide-in-from-bottom-4 duration-700'
          )}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card flex flex-col items-center rounded-2xl border border-white/10 p-8 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <p className="text-4xl font-black tracking-tight text-foreground lg:text-5xl">
                {visible ? (
                  <AnimatedNumber
                    target={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    durationMs={1600}
                    reducedMotion={reducedMotion}
                  />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
