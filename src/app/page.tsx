import Image from "next/image"
import Link from "next/link"
import { 
  BarChart3, 
  Map as MapIcon, 
  TrendingUp, 
  Users2, 
  AlertTriangle, 
  FileWarning, 
  Zap, 
  Timer, 
  ArrowRight, 
  CheckCircle2,
  ShieldCheck,
  Globe,
  Database,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/sections/navbar"
import { RiskAssessmentTool } from "@/components/ai/risk-assessment-tool"
import { ScenarioPlanningTool } from "@/components/ai/scenario-planning-tool"
import { GrantReportingTool } from "@/components/ai/grant-reporting-tool"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="relative">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-8 max-w-2xl">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-semibold rounded-full border-primary/20 bg-primary/10 text-primary">
              The Standard in Urban Resilience
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-headline font-extrabold tracking-tight leading-[1.1]">
              See Your City's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Climate Weak Points</span> Before They Fail
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Urban Resilience AI equips city planners with hyperlocal climate analytics, predictive scenario modeling, and stakeholder-ready reports to build future-proof infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="h-14 px-8 bg-primary text-primary-foreground text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                <Link href="/onboarding">Request Your City Risk Demo</Link>
              </Button>
              <Button asChild variant="ghost" className="h-14 px-8 text-lg font-semibold rounded-full border border-white/10 hover:bg-white/5">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
            <div className="pt-8 flex items-center gap-6">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Trusted By</span>
              <div className="flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="w-12 h-12 bg-white/20 rounded-full" />
                <div className="w-12 h-12 bg-white/20 rounded-full" />
                <div className="w-12 h-12 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-auto h-[600px]">
            <div className="absolute inset-0 rounded-3xl overflow-hidden glass-card">
              <Image 
                src="/images/urban_hero_grid_1774677411990.png" 
                alt="City Grid Data Visualization" 
                fill 
                className="object-cover opacity-60"
                data-ai-hint="isometric city"
              />
              <div className="absolute top-10 left-10 glass-card p-6 rounded-2xl animate-bounce transform-gpu will-change-transform shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">High Flood Risk</p>
                <p className="text-2xl font-bold">84% Severity</p>
                <div className="h-1 w-full bg-white/10 rounded-full mt-2">
                  <div className="h-full w-4/5 bg-primary rounded-full" />
                </div>
              </div>
              <div className="absolute bottom-20 right-10 glass-card p-6 rounded-2xl animate-pulse transform-gpu will-change-transform shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Live Heat Index</p>
                <p className="text-2xl font-bold">104°F Peak</p>
                <p className="text-xs text-secondary mt-1">+12% vs Historical Avg</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6">Why Urban Resilience Fails Today</h2>
            <p className="text-lg text-muted-foreground">Traditional climate planning is broken, reactive, and disconnected from the real world.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FileWarning, title: "Outdated PDFs", desc: "Static reports that are obsolete the moment they're printed." },
              { icon: Database, title: "Fragmented Data", desc: "Siloed information across departments with zero interoperability." },
              { icon: Timer, title: "Manual Analysis", desc: "Months of human labor for analysis that should take seconds." },
              { icon: AlertTriangle, title: "Reactive Decisions", desc: "Reacting to catastrophes rather than preventing them." }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tool Section */}
      <section className="py-24" id="ai-tool">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          <RiskAssessmentTool />
          <ScenarioPlanningTool />
          <GrantReportingTool />
        </div>
      </section>

      {/* Feature Walkthrough */}
      <section className="py-24" id="features">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {[
            {
              title: "Hyperlocal Risk Maps",
              badge: "Visibility",
              desc: "Go beyond city-wide averages. Our platform maps risks down to the block level, accounting for micro-topography, surface permeability, and building materials.",
              img: "/images/mapview_hyperlocal_1774677425431.png",
              features: ["Street-level resolution", "20+ Hazard Layers", "Real-time updates"]
            },
            {
              title: "Scenario Planning & Economic Impact",
              badge: "Intelligence",
              desc: "Simulate the ROI of a new seawall vs. green infrastructure. See exactly how many businesses and homes are saved in a 1-in-100 year storm.",
              img: "/images/scenario_planning_1774677437551.png",
              features: ["Multi-climate simulation", "ROI calculator", "Asset vulnerability index"],
              reverse: true
            },
            {
              title: "Stakeholder-Ready Dashboards",
              badge: "Transparency",
              desc: "Generate professional reports for city council, FEMA, and the public with one click. High-integrity data formatted for compliance and grants.",
              img: "/images/stakeholder_dashboard_1774677451898.png",
              features: ["One-click grant reporting", "Interactive public portals", "Department-wide sync"]
            }
          ].map((feature, idx) => (
            <div key={idx} className={cn("grid lg:grid-cols-2 gap-16 items-center", feature.reverse && "lg:flex-row-reverse")}>
              <div className={cn("space-y-8", feature.reverse && "lg:order-2")}>
                <Badge variant="outline" className="text-primary border-primary/30 uppercase tracking-widest">{feature.badge}</Badge>
                <h2 className="text-4xl font-headline font-bold">{feature.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{feature.desc}</p>
                <ul className="space-y-4">
                  {feature.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium">
                      <CheckCircle2 className="text-primary w-5 h-5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={cn("relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10", feature.reverse && "lg:order-1")}>
                <Image src={feature.img} alt={feature.title} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-background" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Engagement Tiers</h2>
            <p className="text-muted-foreground">Tailored for different stages of municipal resilience maturity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Resilience Pilot", price: "Contact Us", desc: "For cities testing AI integration for a single specific hazard area.", features: ["Single hazard mapping", "Economic impact preview", "Stakeholder portal access"], featured: false },
              { name: "Full City Shield", price: "Custom", desc: "Comprehensive block-level mapping and department-wide deployment.", features: ["All hazard layers", "24/7 data sync", "Priority grant support", "Unlimited seats"], featured: true },
              { name: "Regional Network", price: "Custom", desc: "For state or county-wide implementations with multiple municipalities.", features: ["Inter-city data sharing", "Regional hazard modeling", "SLA & security hardening"], featured: false }
            ].map((tier, idx) => (
              <div key={idx} className={cn(
                "glass-card p-10 rounded-3xl relative flex flex-col",
                tier.featured ? "border-primary shadow-primary/10 ring-1 ring-primary" : ""
              )}>
                {tier.featured && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-bold">MOST RECOMMENDED</Badge>}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-muted-foreground text-sm">{tier.desc}</p>
                </div>
                <div className="mb-8">
                  <p className="text-3xl font-bold">{tier.price}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">Annual Municipal License</p>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="text-primary w-4 h-4" /> {f}
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild
                  variant={tier.featured ? "default" : "outline"} 
                  className={cn("w-full h-12 font-bold rounded-full")}
                >
                  <Link href="/onboarding">Select Plan</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background" id="faq">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How accurate is the hyperlocal risk data?</AccordionTrigger>
              <AccordionContent>
                Our models combine high-resolution satellite imagery, LIDAR data, and historical meteorological records to achieve up to 94% accuracy in predictive hazard mapping.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can it integrate with our existing GIS software?</AccordionTrigger>
              <AccordionContent>
                Yes, Urban Resilience AI offers full bidirectional integration with ESRI ArcGIS, QGIS, and other major municipal software.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl tracking-tight">Urban Resilience AI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 Urban Resilience AI. All rights reserved. Built with precision for the next century.</p>
        </div>
      </footer>
    </div>
  )
}
