import { z } from 'zod';

export const riskAssessmentRequestSchema = z.object({
  location: z.string().min(2).max(100).trim(),
  population: z.string().min(1).max(50).trim(),
  infrastructureTypes: z
    .array(z.string().min(1).max(100))
    .max(10)
    .optional()
    .default([]),
});

export const scenarioPlanningRequestSchema = z.object({
  regionName: z.string().min(2).max(100).trim(),
  intervention: z.enum([
    'Seawall Construction',
    'Mangrove Restoration',
    'Deep Tunnel Drainage',
    'Strategic Relocation',
  ]),
  budgetMillions: z.number().min(1).max(10000),
});

export const grantReportRequestSchema = z.object({
  projectName: z.string().min(3).max(120).trim(),
  grantType: z.enum([
    'FEMA BRIC',
    'HUD CDBG-MIT',
    'EPA Environmental Justice',
    'State Infrastructure Bank',
  ]),
  fundingRequested: z.number().min(1).max(1000000),
});

export const cityRiskScoreRequestSchema = z.object({
  cityName: z.string().min(2).max(120).trim(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const onboardingWelcomeRequestSchema = z.object({
  organization: z.string().min(2).max(200).trim(),
  role: z.string().min(1).max(100).optional(),
  region: z.string().min(1).max(200).optional(),
  name: z.string().min(1).max(120).optional(),
});

export type RiskAssessmentRequest = z.infer<typeof riskAssessmentRequestSchema>;
export type ScenarioPlanningRequest = z.infer<typeof scenarioPlanningRequestSchema>;
export type GrantReportRequest = z.infer<typeof grantReportRequestSchema>;
export type CityRiskScoreRequest = z.infer<typeof cityRiskScoreRequestSchema>;
export type OnboardingWelcomeRequest = z.infer<typeof onboardingWelcomeRequestSchema>;
