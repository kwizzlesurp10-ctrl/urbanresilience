'use client';

import React, { useState } from 'react';
import { type ScenarioSimulatorOutput, type ScenarioSimulatorInput } from '@/ai/flows/scenario-simulator-flow';
import { postJson } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Activity, ShieldCheck, TrendingUp, DollarSign, BrainCircuit, Loader2 } from 'lucide-react';

const interventions = ["Seawall Construction", "Mangrove Restoration", "Deep Tunnel Drainage", "Strategic Relocation"];

const chartConfig = {
  baselineRisk: {
    label: "Baseline Risk",
    color: "hsl(var(--destructive))",
  },
  mitigatedRisk: {
    label: "Mitigated Risk",
    color: "hsl(var(--primary))",
  },
};

export function ScenarioPlanningTool() {
  const [regionName, setRegionName] = useState('');
  const [intervention, setIntervention] = useState(interventions[0]);
  const [budgetMillions, setBudgetMillions] = useState<number>(50);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScenarioSimulatorOutput | null>(null);

  const handleSimulate = async () => {
    if (!regionName || budgetMillions < 1) return;
    setIsLoading(true);
    try {
      const input: ScenarioSimulatorInput = {
        regionName,
        intervention: intervention as ScenarioSimulatorInput['intervention'],
        budgetMillions,
      };
      const outcome = await postJson<ScenarioSimulatorOutput>('/api/scenario-planning', input);
      if (!outcome.ok) {
        console.error('Simulation API error', outcome.error);
        return;
      }
      setResult(outcome.data);
    } catch (err) {
      console.error('Simulation Failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <Card className="glass-card border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-50"><BrainCircuit className="w-16 h-16 text-primary" /></div>
        <CardHeader className="relative z-10 pb-0">
          <CardTitle className="text-2xl flex items-center gap-2"><Activity className="text-secondary" /> AI Scenario Simulator</CardTitle>
          <CardDescription>Generative Economic ROI & Risk Delta Modeling</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
             <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Target Zone</label>
                <Input placeholder="e.g. Miami Beach Base" value={regionName} onChange={e => setRegionName(e.target.value)} />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Intervention Model</label>
                <Select value={intervention} onValueChange={setIntervention}>
                  <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Select Model" /></SelectTrigger>
                  <SelectContent>
                    {interventions.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase flex justify-between">
                  <span>CapEx Budget</span> <span className="text-primary font-bold">${budgetMillions}M</span>
                </label>
                <input 
                  type="range"
                  aria-label="CapEx Budget" 
                  min={1} max={5000} step={10} 
                  className="w-full accent-primary py-2 cursor-pointer" 
                  value={budgetMillions} onChange={e => setBudgetMillions(Number(e.target.value))} 
                />
             </div>
             <Button 
                onClick={handleSimulate} disabled={isLoading || !regionName}
                className="w-full h-10 hover:scale-[1.02] transition-transform"
             >
                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculating...</> : "Run Simulation"}
             </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
          <Card className="glass-card shadow-lg border-primary/20">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-lg">
                <span>Executive Summary</span>
                <span className="text-xs py-1 px-3 bg-primary/20 text-primary uppercase font-bold tracking-wider rounded-xl">Verified Model</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-foreground text-sm leading-relaxed border-l-2 border-primary pl-4 py-2 italic opacity-90">
                "{result.executiveSummary}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-background/50 rounded-xl border border-border/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-secondary w-5 h-5" />
                    <span className="text-xs text-muted-foreground uppercase font-bold">Proj. ROI</span>
                  </div>
                  <span className="text-3xl font-black text-foreground">{result.roiPercentage}%</span>
                </div>
                <div className="p-4 bg-background/50 rounded-xl border border-border/50 hover:bg-background/80 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="text-primary w-5 h-5" />
                    <span className="text-xs text-muted-foreground uppercase font-bold">Timeline</span>
                  </div>
                  <span className="text-3xl font-black text-foreground">{result.timelineYears} yrs</span>
                </div>
              </div>

              <div>
                 <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-muted-foreground uppercase"><ShieldCheck className="w-4 h-4 text-primary" /> Key Assets Safegaurded</h4>
                 <div className="flex flex-wrap gap-2">
                    {result.vitalAssetsProtected.map((asset, i) => (
                      <span key={i} className="text-xs bg-secondary/10 text-secondary-foreground border border-secondary/30 px-3 py-1.5 rounded-full">{asset}</span>
                    ))}
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-lg flex flex-col items-center justify-center p-6 border-secondary/20 min-h-[400px]">
             <h3 className="w-full text-center text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Risk Delta by Zone</h3>
             <ChartContainer config={chartConfig} className="w-full h-full min-h-[300px]">
                <BarChart data={result.riskReductions} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
                  <XAxis dataKey="zone" axisLine={false} tickLine={false} tickMargin={10} style={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <YAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tickMargin={10} style={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: 'hsl(var(--muted)/0.2)' }} />
                  <Bar dataKey="baselineRisk" fill="var(--color-baselineRisk)" name="Baseline Risk Factor" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="mitigatedRisk" fill="var(--color-mitigatedRisk)" name="Post-Intervention Risk" radius={[4, 4, 0, 0]} barSize={30} />
                  <ChartLegend content={<ChartLegendContent />} verticalAlign="top" />
                </BarChart>
             </ChartContainer>
          </Card>
        </div>
      )}
    </div>
  );
}
