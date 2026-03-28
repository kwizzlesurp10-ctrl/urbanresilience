/**
 * @fileOverview A Genkit flow for generating personalized, illustrative risk assessment snippets for cities.
 * Uses strict Zod boundaries and multi-agent Tooling orchestration.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const PersonalizedRiskAssessmentSnippetInputSchema = z.object({
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location name is too long")
    .trim()
    .describe('The specific location of the city (e.g., "Miami, Florida, USA").'),
  population: z
    .string()
    .min(1, "Population is required")
    .max(50, "Population format too long")
    .trim()
    .describe('The estimated population of the city (e.g., "500,000", "2 million").'),
  infrastructureTypes: z
    .array(z.string().min(1).max(100))
    .max(10, "Maximum of 10 infrastructure types allowed")
    .describe('List of key infrastructure types present in the city.'),
});

export type PersonalizedRiskAssessmentSnippetInput = z.infer<
  typeof PersonalizedRiskAssessmentSnippetInputSchema
>;

export const PersonalizedRiskAssessmentSnippetOutputSchema = z
  .string()
  .describe('A personalized, illustrative risk assessment summary snippet for the city.');

export type PersonalizedRiskAssessmentSnippetOutput = z.infer<
  typeof PersonalizedRiskAssessmentSnippetOutputSchema
>;

/** Tool: Simulate Topological Data for specific coordinates/locations */
const simulateTopologicalData = ai.defineTool({
  name: 'simulateTopologicalData',
  description: 'Simulates topological heat maps and flood tables for a specific city location to establish geographic baselines.',
  inputSchema: z.object({ location: z.string() }),
  outputSchema: z.object({ riskLevel: z.string(), primaryHazard: z.string() }),
}, async ({location}) => {
  // Purely mock logic for simulation purposes
  const isCoastal = location.toLowerCase().match(/(miami|florida|coastal|netherlands|ocean|sea)/i);
  return {
    riskLevel: isCoastal ? "Critical Stage 4" : "Elevated Stage 2",
    primaryHazard: isCoastal ? "Coastal Flooding & Surge" : "Urban Heat Island & Microbursts",
  };
});

/** Tool: Fetch Economic Impact Models */
const fetchEconomicImpactData = ai.defineTool({
  name: 'fetchEconomicImpactData',
  description: 'Calculates the estimated economic loss if extreme hazard events hit the specified population scale.',
  inputSchema: z.object({ population: z.string() }),
  outputSchema: z.object({ projectedLoss: z.string() }),
}, async ({population}) => {
  // Simplified economic calculation based loosely on population string magnitude
  const numericPop = parseInt(population.replace(/[^0-9]/g, '')) || 10000;
  return { 
    projectedLoss: `$${((numericPop / 1000) * 1.5).toFixed(1)}M per extreme event` 
  };
});

/** Orchestrated Genkit Flow */
const personalizedRiskAssessmentSnippetFlow = ai.defineFlow(
  {
    name: 'personalizedRiskAssessmentSnippetFlow',
    inputSchema: PersonalizedRiskAssessmentSnippetInputSchema,
    outputSchema: PersonalizedRiskAssessmentSnippetOutputSchema,
  },
  async (input) => {
    // We execute the multi-step generation dynamically feeding Genkit the available tools
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `Act as a climate resilience expert building a preview for a comprehensive city report.

Analyze the following city:
- Location: ${input.location}
- Population: ${input.population}
- Infrastructure: ${input.infrastructureTypes.join(', ')}

First, use 'simulateTopologicalData' and 'fetchEconomicImpactData' to gather facts.
Then, synthesize a compelling, concise risk assessment summary (2-4 paragraphs) that cites the retrieved risk level, hazard types, and exact projected economic loss. Avoid markdown headers. Focus on the value proposition of proactive analytics.`,
      tools: [simulateTopologicalData, fetchEconomicImpactData],
    });

    return response.text;
  }
);

export async function generateRiskAssessmentSnippet(
  input: PersonalizedRiskAssessmentSnippetInput
): Promise<PersonalizedRiskAssessmentSnippetOutput> {
  const parseResult = PersonalizedRiskAssessmentSnippetInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error("Invalid Input Parameters: " + parseResult.error.message);
  }
  return personalizedRiskAssessmentSnippetFlow(parseResult.data);
}
