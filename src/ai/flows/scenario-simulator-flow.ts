/**
 * @fileOverview A specialized Genkit flow for generating scenario planning & ROI simulations.
 * Showcases Genkit's strict structured output capabilities mapping directly to a front-end Charting engine.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ScenarioSimulatorInputSchema = z.object({
  regionName: z.string().min(2).max(100).trim(),
  intervention: z.enum(["Seawall Construction", "Mangrove Restoration", "Deep Tunnel Drainage", "Strategic Relocation"]),
  budgetMillions: z.number().min(1).max(10000),
});

export type ScenarioSimulatorInput = z.infer<typeof ScenarioSimulatorInputSchema>;

export const ScenarioSimulatorOutputSchema = z.object({
  executiveSummary: z.string().describe("A professional 2-sentence summary of the intervention impact."),
  roiPercentage: z.number().describe("Estimated Return on Investment percentage after 15 years."),
  timelineYears: z.number().describe("Estimated years to complete the intervention."),
  vitalAssetsProtected: z.array(z.string()).describe("List of 3 critical city assets protected (e.g. 'Downtown Transit Hub')."),
  riskReductions: z.array(z.object({
    zone: z.string().describe("Name of the city zone (e.g. 'Commercial District')"),
    baselineRisk: z.number().describe("Risk score (1-100) before intervention"),
    mitigatedRisk: z.number().describe("Risk score (1-100) after intervention")
  })).length(3).describe("Exactly 3 distinct zones providing comparative risk metrics for charting."),
});

export type ScenarioSimulatorOutput = z.infer<typeof ScenarioSimulatorOutputSchema>;

const scenarioSimulatorFlow = ai.defineFlow({
  name: 'scenarioSimulatorFlow',
  inputSchema: ScenarioSimulatorInputSchema,
  outputSchema: ScenarioSimulatorOutputSchema,
}, async (input) => {
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are an elite urban resilience financial simulator. Calculate the outcome of the following proposed intervention:
    Region: ${input.regionName}
    Intervention Type: ${input.intervention}
    Budget: $${input.budgetMillions}M
    
    Return realistic, strictly formatted metrics detailing ROI, assets protected, and a comparative risk reduction for 3 key zones to be graphed on a bar chart.`,
    output: { schema: ScenarioSimulatorOutputSchema }
  });
  
  return output!;
});

export async function runScenarioSimulation(input: ScenarioSimulatorInput): Promise<ScenarioSimulatorOutput> {
  const parseResult = ScenarioSimulatorInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error("Invalid Input Parameters: " + parseResult.error.message);
  }
  return scenarioSimulatorFlow(parseResult.data);
}
