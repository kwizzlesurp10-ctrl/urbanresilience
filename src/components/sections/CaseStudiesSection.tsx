import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const cases = [
  {
    city: 'Coastal metro pilot',
    outcome:
      'Prioritized grey–green mix across three flood corridors; shortened grant narrative cycle by several weeks.',
    metric: '94%',
    metricLabel: 'stakeholder clarity score (survey)',
    image: '/images/mapview_hyperlocal_1774677425431.png',
    reverse: false,
  },
  {
    city: 'Inland heat belt',
    outcome:
      'Mapped urban heat islands against transit-dependent populations to target cooling investments.',
    metric: '12',
    metricLabel: 'new focus zones identified',
    image: '/images/scenario_planning_1774677437551.png',
    reverse: true,
  },
  {
    city: 'Regional resilience network',
    outcome:
      'Synchronized hazard layers across four municipalities for shared procurement and mutual aid planning.',
    metric: '4',
    metricLabel: 'cities on one data plane',
    image: '/images/stakeholder_dashboard_1774677451898.png',
    reverse: false,
  },
];

export function CaseStudiesSection() {
  return (
    <section className="py-24" id="case-studies">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-primary/40 uppercase tracking-widest text-primary">
            Case studies
          </Badge>
          <h2 className="mb-4 text-4xl font-bold font-headline">Where cities moved from insight to action</h2>
          <p className="text-lg text-muted-foreground">
            Representative outcomes from deployments that combined block-level analytics with executive-ready
            reporting.
          </p>
        </div>
        <div className="space-y-20">
          {cases.map((c) => (
            <div key={c.city} className="grid items-center gap-12 lg:grid-cols-2">
              <div className={cn('space-y-6', c.reverse && 'lg:order-2')}>
                <h3 className="text-3xl font-bold font-headline">{c.city}</h3>
                <p className="text-lg leading-relaxed text-muted-foreground">{c.outcome}</p>
                <div className="flex flex-wrap items-baseline gap-2 border-l-2 border-primary pl-4">
                  <span className="text-4xl font-black text-primary">{c.metric}</span>
                  <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {c.metricLabel}
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  'relative h-[320px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:h-[400px]',
                  c.reverse && 'lg:order-1'
                )}
              >
                <Image src={c.image} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
