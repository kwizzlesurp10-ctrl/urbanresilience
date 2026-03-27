'use server';
/**
 * @fileOverview A Genkit flow for generating personalized, illustrative risk assessment snippets for cities.
 *
 * - generateRiskAssessmentSnippet - A function that handles the generation of the risk assessment snippet.
 * - PersonalizedRiskAssessmentSnippetInput - The input type for the generateRiskAssessmentSnippet function.
 * - PersonalizedRiskAssessmentSnippetOutput - The return type for the generateRiskAssessmentSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRiskAssessmentSnippetInputSchema = z.object({
  location: z
    .string()
    .describe(
      'The specific location of the city (e.g., "Miami, Florida, USA", "Coastal region of Netherlands").'
    ),
  population: z
    .string()
    .describe('The estimated population of the city (e.g., "500,000", "2 million").'),
  infrastructureTypes: z
    .array(z.string())
    .describe(
      'A list of key infrastructure types present in the city (e.g., "coastal infrastructure", "transportation network", "energy grid", "water management systems", "critical buildings").'
    ),
});
export type PersonalizedRiskAssessmentSnippetInput = z.infer<
  typeof PersonalizedRiskAssessmentSnippetInputSchema
>;

const PersonalizedRiskAssessmentSnippetOutputSchema = z
  .string()
  .describe('A personalized, illustrative risk assessment summary snippet for the city.');
export type PersonalizedRiskAssessmentSnippetOutput = z.infer<
  typeof PersonalizedRiskAssessmentSnippetOutputSchema
>;

export async function generateRiskAssessmentSnippet(
  input: PersonalizedRiskAssessmentSnippetInput
): Promise<PersonalizedRiskAssessmentSnippetOutput> {
  return personalizedRiskAssessmentSnippetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRiskAssessmentSnippetPrompt',
  input: {schema: PersonalizedRiskAssessmentSnippetInputSchema},
  output: {schema: PersonalizedRiskAssessmentSnippetOutputSchema},
  prompt: `You are an AI-driven Climate Resilience Analytics Platform. Your task is to generate a concise, illustrative risk assessment summary snippet for a city based on the provided information.

Act as if this is a preview from a comprehensive report. Focus on potential climate vulnerabilities and how an analytics platform could help address them.

Input City Characteristics:
Location: {{{location}}}
Population: {{{population}}}
Key Infrastructure Types: {{{infrastructureTypes}}}

Generate a compelling, concise, and personalized risk assessment summary snippet (2-4 paragraphs) that highlights the city's potential climate challenges and the value proposition of proactive analytics. Do not use markdown headers. Focus on the most critical risks and how the platform could offer insights.`,
});

const personalizedRiskAssessmentSnippetFlow = ai.defineFlow(
  {
    name: 'personalizedRiskAssessmentSnippetFlow',
    inputSchema: PersonalizedRiskAssessmentSnippetInputSchema,
    outputSchema: PersonalizedRiskAssessmentSnippetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
