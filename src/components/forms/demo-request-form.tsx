"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronRight, ChevronLeft, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  organization: z.string().min(2, "Organization name is required"),
  region: z.string().min(2, "Region is required"),
  challenges: z.array(z.string()).min(1, "Select at least one challenge"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  consent: z.boolean().refine(val => val === true, "Consent is required"),
})

type FormData = z.infer<typeof formSchema>

export function DemoRequestForm() {
  const [step, setStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      challenges: [],
      consent: false,
    }
  })

  const currentChallenges = watch("challenges")

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log(data)
    setIsSubmitting(false)
    toast({
      title: "Demo Requested!",
      description: "Our urban resilience team will contact you within 24 hours.",
    })
    setStep(4) // Success state
  }

  const challengesOptions = [
    { id: "flooding", label: "Flood Risk Management" },
    { id: "heat", label: "Urban Heat Islands" },
    { id: "infrastructure", label: "Aging Infrastructure" },
    { id: "equity", label: "Climate Equity & Justice" },
    { id: "funding", label: "Securing Federal Funding" },
  ]

  if (step === 4) {
    return (
      <div className="text-center py-12 px-6 glass-card rounded-2xl">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="text-primary w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Thank you, {watch("name")}!</h3>
        <p className="text-muted-foreground">We've received your request for {watch("organization")}. A specialist will be in touch shortly.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-xl mx-auto glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Step {step} of 3</span>
          <span className="text-xs text-muted-foreground">{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <Progress value={(step / 3) * 100} className="h-2" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold">Tell us about your organization</h3>
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select onValueChange={(val) => setValue("role", val, { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban-planner">Urban Planner</SelectItem>
                  <SelectItem value="resilience-officer">Resilience Officer</SelectItem>
                  <SelectItem value="city-engineer">City Engineer</SelectItem>
                  <SelectItem value="policy-maker">Policy Maker</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization Name</Label>
              <Input id="organization" placeholder="City of Metropolis" {...register("organization")} />
              {errors.organization && <p className="text-destructive text-sm">{errors.organization.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Geographic Region</Label>
              <Input id="region" placeholder="Northeast US / Southeast Asia / etc." {...register("region")} />
              {errors.region && <p className="text-destructive text-sm">{errors.region.message}</p>}
            </div>
            <Button type="button" onClick={nextStep} className="w-full group">
              Next <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold">Key Resilience Challenges</h3>
            <p className="text-sm text-muted-foreground mb-4">Select all that apply to your current planning needs.</p>
            <div className="grid gap-3">
              {challengesOptions.map((opt) => (
                <div key={opt.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <Checkbox 
                    id={`challenge-${opt.id}`}
                    checked={currentChallenges.includes(opt.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue("challenges", [...currentChallenges, opt.id])
                      } else {
                        setValue("challenges", currentChallenges.filter(id => id !== opt.id))
                      }
                    }}
                  />
                  <Label htmlFor={`challenge-${opt.id}`} className="flex-1 cursor-pointer font-medium py-1">
                    {opt.label}
                  </Label>
                </div>
              ))}
              {errors.challenges && <p className="text-destructive text-sm">{errors.challenges.message}</p>}
            </div>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button type="button" onClick={nextStep} className="flex-1 group">
                Next <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold">Final Details</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Jane Doe" {...register("name")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" type="email" placeholder="jane@cityofmetropolis.gov" {...register("email")} />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>
            <div className="flex items-start space-x-3 pt-4">
              <Checkbox 
                id="consent" 
                checked={watch("consent")}
                onCheckedChange={(checked) => setValue("consent", !!checked)}
              />
              <Label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">
                I agree to receive communications regarding my demo request and Urban Resilience AI products. I can unsubscribe at any time.
              </Label>
            </div>
            {errors.consent && <p className="text-destructive text-sm">{errors.consent.message}</p>}
            
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-bold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Get My Demo
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
