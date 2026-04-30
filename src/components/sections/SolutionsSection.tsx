import { Building2, Cpu, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const pillars = [
  {
    title: 'Unified hazard intelligence',
    description:
      'Flood, heat, wind, and infrastructure strain in one operational view so departments stop reconciling conflicting spreadsheets.',
    icon: Shield,
  },
  {
    title: 'Investment-grade scenarios',
    description:
      'Stress-test interventions against budget envelopes and timelines before capital plans reach council or bond markets.',
    icon: Building2,
  },
  {
    title: 'Grant-ready evidence',
    description:
      'Structured narratives, compliance checkpoints, and partner suggestions aligned to major federal programs.',
    icon: Cpu,
  },
  {
    title: 'Public trust by design',
    description:
      'Dashboards and summaries built for residents, councils, and agencies—clear enough for hearings, rigorous enough for engineers.',
    icon: Users,
  },
];

export function SolutionsSection() {
  return (
    <section className="border-y border-white/5 bg-background py-24" id="solutions">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold font-headline">Solutions built for how cities actually work</h2>
          <p className="text-lg text-muted-foreground">
            From pilot corridors to enterprise rollouts, Urban Resilience AI connects science, finance, and storytelling
            in a single workflow.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {pillars.map((item) => (
            <div
              key={item.title}
              className="glass-card flex gap-6 rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild className="h-12 rounded-full px-8 font-bold">
            <Link href="/onboarding">Book a solutions walkthrough</Link>
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full border-white/15 px-8">
            <Link href="#ai-tool">Try the AI previews</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
