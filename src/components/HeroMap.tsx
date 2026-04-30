'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

const MapboxRiskMap = dynamic(
  () => import('@/components/MapboxRiskMap').then((m) => m.MapboxRiskMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] w-full animate-pulse items-center justify-center rounded-2xl bg-black/30 text-sm text-muted-foreground">
        Loading map…
      </div>
    ),
  }
);

export type HeroMapProps = {
  className?: string;
};

export function HeroMap({ className }: HeroMapProps) {
  return (
    <div className={cn('relative h-[600px] w-full overflow-hidden rounded-3xl', className)}>
      <div className="absolute inset-0">
        <MapboxRiskMap className="h-full w-full" centerLng={-80.1918} centerLat={25.7617} initialZoom={10.2} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />

      <div className="pointer-events-none absolute left-6 top-8 max-w-[220px] rounded-2xl border border-white/10 bg-background/70 p-5 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Live hazard layer</p>
        <p className="mt-1 text-2xl font-bold">Composite risk</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-4/5 rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Illustrative heatmap for demo geography</p>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-6 max-w-[200px] rounded-2xl border border-white/10 bg-background/70 p-5 shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold uppercase tracking-wider text-secondary">Flood + heat stress</p>
        <p className="text-2xl font-bold">Block scale</p>
        <p className="mt-1 text-xs text-muted-foreground">Pan and zoom to explore the urban mesh</p>
      </div>
    </div>
  );
}
