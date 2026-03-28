/**
 * @fileOverview Genkit flow for generating automated Grant & Compliance Reports.
 * Transforms raw project paramaters into a FEMA/HUD compliant structured evaluation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GrantReportInputSchema = z.object({
  projectName: z.string().min(3).max(120).trim(),
  grantType: z.enum(["FEMA BRIC", "HUD CDBG-MIT", "EPA Environmental Justice", "State Infrastructure Bank"]),
  fundingRequested: z.number().min(0.1).max(500),
});

export type GrantReportInput = z.infer<typeof GrantReportInputSchema>;

export const GrantReportOutputSchema = z.object({
  reportTitle: z.string().describe("Official-sounding title for the grant report."),
  eligibilityScore: z.number().describe("Probability of approval (0-100)."),
  executiveDraft: z.string().describe("A formal 2-paragraph executive summary justifying the grant."),
  complianceChecklist: z.array(z.object({
    requirement: z.string(),
    status: z.enum(["Met", "At Risk", "Requires Revision"])
  })).length(4).describe("4 critical compliance requirements and their current status."),
  suggestedPartners: z.array(z.string()).describe("3 suggested local/federal agency partners to strengthen the bid.")
});

export type GrantReportOutput = z.infer<typeof GrantReportOutputSchema>;

const grantReportFlow = ai.defineFlow({
  name: 'grantReportFlow',
  inputSchema: GrantReportInputSchema,
  outputSchema: GrantReportOutputSchema,
}, async (input) => {
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are an elite federal grant compliance officer and AI reviewer.
    Assess the following urban resilience project for funding eligibility:
    Project: ${input.projectName}
    Target Grant: ${input.grantType}
    Funding Requested: $${input.fundingRequested}M

    Provide a highly structured, professional assessment highlighting compliance, eligibility, and an executive draft to be submitted to the agency.`,
    output: { schema: GrantReportOutputSchema }
  });
  
  return output!;
});

export async function generateGrantReport(input: GrantReportInput): Promise<GrantReportOutput> {
  const parseResult = GrantReportInputSchema.safeParse(input);
  if (!parseResult.success) {
    throw new Error("Invalid Input Parameters: " + parseResult.error.message);
  }
  return grantReportFlow(parseResult.data);
}
