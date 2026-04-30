"use client"

import * as React from "react"
import { Sparkles, MapPin, Users, Building2, Loader2, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { postJson } from "@/lib/api-client"
import { cn } from "@/lib/utils"

export function RiskAssessmentTool() {
  const [location, setLocation] = React.useState("")
  const [population, setPopulation] = React.useState("")
  const [infrastructure, setInfrastructure] = React.useState<string[]>([])
  const [result, setResult] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const infraOptions = [
    "Coastal infrastructure",
    "Energy grid",
    "Transportation network",
    "Water systems",
    "Critical buildings"
  ]

  const handleToggleInfra = (item: string) => {
    setInfrastructure(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    )
  }

  const handleGenerate = async () => {
    if (!location || !population) return
    setIsLoading(true)
    try {
      const infraPayload =
        infrastructure.length > 0 ? infrastructure : (["general urban infrastructure"] as string[])
      const outcome = await postJson<{ snippet: string }>("/api/risk-assessment", {
        location,
        population,
        infrastructureTypes: infraPayload,
      })
      if (!outcome.ok) {
        console.error("Risk assessment API error", outcome.error)
        setResult("We could not generate a preview right now. Please try again in a moment.")
        return
      }
      setResult(outcome.data.snippet)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto glass-card rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden border-primary/20">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3" /> AI Preview Tool
            </div>
            <h2 className="text-3xl font-bold mb-4 font-headline">Generate a City Risk Preview</h2>
            <p className="text-muted-foreground">See how Urban Resilience AI analyzes city-specific characteristics to provide immediate actionable insights.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> City / Region
              </Label>
              <Input 
                placeholder="e.g. Miami, Florida" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Estimated Population
              </Label>
              <Input 
                placeholder="e.g. 500,000" 
                value={population} 
                onChange={(e) => setPopulation(e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Key Infrastructure
              </Label>
              <div className="flex flex-wrap gap-2">
                {infraOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleToggleInfra(opt)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      infrastructure.includes(opt) 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-white/5 border-white/10 hover:border-primary/50"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !location || !population}
              className="w-full h-12 bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-transform"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> Generate Risk Snippet</>
              )}
            </Button>
          </div>
        </div>

        <div className="relative min-h-[300px] lg:min-h-[450px]">
          {result ? (
            <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
              <div className="flex-1 bg-background/40 backdrop-blur-sm rounded-2xl p-6 border border-white/10 overflow-auto scrollbar-hide font-body text-sm leading-relaxed space-y-4">
                <p className="whitespace-pre-wrap">{result}</p>
              </div>
              <Button variant="ghost" className="mt-4 self-center text-primary" onClick={() => setResult(null)}>
                <RefreshCcw className="w-4 h-4 mr-2" /> Try another city
              </Button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-2xl bg-black/10">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="text-primary/40 w-8 h-8" />
              </div>
              <p className="text-muted-foreground max-w-[240px]">Fill in your city details to generate a personalized climate risk analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}