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
import { DemoRequestForm } from "@/components/forms/demo-request-form"
import { RiskAssessmentTool } from "@/components/ai/risk-assessment-tool"
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
              <Button className="h-14 px-8 bg-primary text-primary-foreground text-lg font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                Request Your City Risk Demo
              </Button>
              <Button variant="ghost" className="h-14 px-8 text-lg font-semibold rounded-full border border-white/10 hover:bg-white/5">
                Download Baseline Report
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
                src="https://picsum.photos/seed/urbanhero/1200/1200" 
                alt="City Grid Data Visualization" 
                fill 
                className="object-cover opacity-60"
                data-ai-hint="isometric city"
              />
              {/* Glassmorphism Overlays */}
              <div className="absolute top-10 left-10 glass-card p-6 rounded-2xl animate-bounce-slow">
                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">High Flood Risk</p>
                <p className="text-2xl font-bold">84% Severity</p>
                <div className="h-1 w-full bg-white/10 rounded-full mt-2">
                  <div className="h-full w-4/5 bg-primary rounded-full" />
                </div>
              </div>
              <div className="absolute bottom-20 right-10 glass-card p-6 rounded-2xl animate-pulse">
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

      {/* Solution Overview */}
      <section className="py-24 bg-muted/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              { title: "Predict", icon: MapIcon, desc: "Leverage AI to identify hyperlocal vulnerabilities across 20+ climate scenarios." },
              { title: "Prioritize", icon: BarChart3, desc: "Focus budgets where they save the most lives and infrastructure value." },
              { title: "Communicate", icon: Users2, desc: "Secure public buy-in and federal funding with high-fidelity visualizations." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40 mb-8 rotate-3 hover:rotate-0 transition-transform">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tool Section */}
      <section className="py-24" id="ai-tool">
        <div className="max-w-7xl mx-auto px-6">
          <RiskAssessmentTool />
        </div>
      </section>

      {/* Feature Walkthrough - Scroll Driven */}
      <section className="py-24" id="features">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {[
            {
              title: "Hyperlocal Risk Maps",
              badge: "Visibility",
              desc: "Go beyond city-wide averages. Our platform maps risks down to the block level, accounting for micro-topography, surface permeability, and building materials.",
              img: "https://picsum.photos/seed/mapview/800/600",
              features: ["Street-level resolution", "20+ Hazard Layers", "Real-time updates"]
            },
            {
              title: "Scenario Planning & Economic Impact",
              badge: "Intelligence",
              desc: "Simulate the ROI of a new seawall vs. green infrastructure. See exactly how many businesses and homes are saved in a 1-in-100 year storm.",
              img: "https://picsum.photos/seed/scenario/800/600",
              features: ["Multi-climate simulation", "ROI calculator", "Asset vulnerability index"],
              reverse: true
            },
            {
              title: "Stakeholder-Ready Dashboards",
              badge: "Transparency",
              desc: "Generate professional reports for city council, FEMA, and the public with one click. High-integrity data formatted for compliance and grants.",
              img: "https://picsum.photos/seed/dash/800/600",
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

      {/* Social Proof */}
      <section className="py-24 bg-muted/30" id="case-studies">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Cities Already Moving Faster</h2>
            <p className="text-muted-foreground">Quantified outcomes from our municipal partners.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { city: "Coastal Metropolis", metric: "$420M", label: "Infrastructure Assets Protected", logo: "🏙️" },
              { city: "Summit County", metric: "65%", label: "Faster Grant Submission", logo: "🏔️" },
              { city: "East Harbor", metric: "3.2k", label: "Households out of Flood Zone", logo: "🌊" }
            ].map((caseStudy, idx) => (
              <div key={idx} className="glass-card p-10 rounded-2xl text-center space-y-6">
                <span className="text-4xl">{caseStudy.logo}</span>
                <h3 className="text-xl font-bold">{caseStudy.city}</h3>
                <div className="space-y-2">
                  <p className="text-5xl font-black text-primary tracking-tighter">{caseStudy.metric}</p>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{caseStudy.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Strip */}
      <section className="py-12 border-y border-white/5 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-40 hover:opacity-100 transition-opacity">
            {["NOAA", "FEMA", "USGS", "ESRI", "AWS", "Google Cloud"].map(name => (
              <span key={name} className="text-2xl font-bold grayscale hover:grayscale-0 cursor-default">{name}</span>
            ))}
          </div>
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
              { name: "Resilience Pilot", price: "Contact Us", desc: "For cities testing AI integration for a single specific hazard area.", features: ["Single hazard mapping", "Economic impact preview", "Stakeholder portal access"] },
              { name: "Full City Shield", price: "Custom", desc: "Comprehensive block-level mapping and department-wide deployment.", features: ["All hazard layers", "24/7 data sync", "Priority grant support", "Unlimited seats"], featured: true },
              { name: "Regional Network", price: "Custom", desc: "For state or county-wide implementations with multiple municipalities.", features: ["Inter-city data sharing", "Regional hazard modeling", "SLA & security hardening"] }
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
                <Button className={cn("w-full h-12 font-bold rounded-full", tier.featured ? "bg-primary text-primary-foreground" : "variant-outline")}>
                  Select Plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Form Section */}
      <section className="py-24 hero-gradient border-t border-white/10" id="demo">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold font-headline">Ready to build a <span className="text-primary">Resilient Future?</span></h2>
            <p className="text-xl text-muted-foreground">Join 50+ innovative cities transforming their climate strategy with high-fidelity AI analytics.</p>
            <div className="space-y-6">
              {[
                { title: "Personalized Strategy Session", desc: "We'll analyze your specific regional hazards during the demo." },
                { title: "No-Commitment Evaluation", desc: "See your city's data in our platform before signing anything." },
                { title: "Compliance Ready", desc: "Built with SOC2 and FedRAMP guidelines in mind." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DemoRequestForm />
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
                Our models combine high-resolution satellite imagery (30cm), LIDAR data, and historical meteorological records to achieve up to 94% accuracy in predictive hazard mapping compared to ground-truth observations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can it integrate with our existing GIS software?</AccordionTrigger>
              <AccordionContent>
                Yes, Urban Resilience AI offers full bidirectional integration with ESRI ArcGIS, QGIS, and other major municipal software via our secure REST API and standard GeoJSON exports.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is my city's data secure?</AccordionTrigger>
              <AccordionContent>
                We employ enterprise-grade encryption both at rest and in transit. The platform is SOC2 Type II compliant and meets all major municipal data privacy requirements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How long does a typical implementation take?</AccordionTrigger>
              <AccordionContent>
                A standard pilot implementation for a specific hazard area takes approximately 3-4 weeks. Full-city deployment typically occurs over 2-3 months.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Does this help with FEMA and federal grant applications?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Our stakeholder reporting tool generates data visualizations and economic impact assessments specifically formatted for BRIC and other federal resilience grant requirements.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>We have a small team. Is the platform easy to use?</AccordionTrigger>
              <AccordionContent>
                The platform is designed by former urban planners for simplicity. Most users can generate their first scenario analysis within 15 minutes of logging in, without any coding knowledge.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <span className="font-bold text-xl tracking-tight">Urban Resilience AI</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Protecting urban futures with proactive climate intelligence. Built for city makers, by city makers.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Risk Maps</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Scenario Planner</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Grant Reports</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">API Access</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">ESG Commitments</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Security & Compliance</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Globe className="w-4 h-4" /> Global Accessibility</li>
                <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> SOC2 Compliant</li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4" /> WCAG 2.2 AA</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-muted-foreground">© 2025 Urban Resilience AI. All rights reserved. Built with precision for the next century.</p>
            <div className="flex gap-8 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white">Terms of Service</Link>
              <Link href="#" className="hover:text-white">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
