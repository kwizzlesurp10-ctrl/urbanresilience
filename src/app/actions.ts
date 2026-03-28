'use server';

import { generateRiskAssessmentSnippet, type PersonalizedRiskAssessmentSnippetInput, type PersonalizedRiskAssessmentSnippetOutput } from '@/ai/flows/personalized-risk-assessment-snippet-flow';
import { runScenarioSimulation, type ScenarioSimulatorInput, type ScenarioSimulatorOutput } from '@/ai/flows/scenario-simulator-flow';
import { generateGrantReport, type GrantReportInput, type GrantReportOutput } from '@/ai/flows/grant-report-generator-flow';

export async function generateRiskAssessmentSnippetAction(input: PersonalizedRiskAssessmentSnippetInput): Promise<PersonalizedRiskAssessmentSnippetOutput> {
  return generateRiskAssessmentSnippet(input);
}

export async function runScenarioSimulationAction(input: ScenarioSimulatorInput): Promise<ScenarioSimulatorOutput> {
  return runScenarioSimulation(input);
}

export async function generateGrantReportAction(input: GrantReportInput): Promise<GrantReportOutput> {
  return generateGrantReport(input);
}
