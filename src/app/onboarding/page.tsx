import { DemoRequestForm } from "@/components/DemoRequestForm";
import { ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/sections/navbar";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 flex flex-col">
      <Navbar />
      
      <div className="absolute inset-0 bg-map-pattern opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <main className="relative flex-1 flex flex-col justify-center py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Enterprise Onboarding</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-headline leading-tight">
              Secure Your City&apos;s <span className="text-primary block">Resilient Future.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join 50+ innovative cities transforming their climate strategy with high-fidelity AI analytics. Complete the onboarding request below to initialize your dedicated simulation environment.
            </p>
          </div>
          
          <div className="animate-in slide-in-from-right duration-700 delay-150 fill-mode-both">
            <DemoRequestForm />
          </div>
        </div>
      </main>
    </div>
  );
}
