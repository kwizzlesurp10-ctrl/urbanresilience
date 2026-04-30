import { describe, expect, it } from 'vitest';
import { computeCityRiskScores } from '@/lib/city-risk-score';
import { cityRiskScoreRequestSchema, riskAssessmentRequestSchema } from '@/lib/api-schemas';

describe('computeCityRiskScores', () => {
  it('returns bounded scores and a tier', () => {
    const r = computeCityRiskScores({ cityName: 'Springfield' });
    expect(r.cityName).toBe('Springfield');
    expect(r.scores.floodExposure).toBeGreaterThanOrEqual(40);
    expect(r.scores.floodExposure).toBeLessThanOrEqual(98);
    expect(r.scores.heatStress).toBeGreaterThanOrEqual(35);
    expect(r.scores.infrastructureStrain).toBeGreaterThanOrEqual(30);
    expect(['elevated', 'moderate', 'watch', 'lower']).toContain(r.scores.tier);
    expect(r.summary).toContain('Springfield');
  });

  it('applies coastal boost when the city name matches coastal patterns', () => {
    const coastal = computeCityRiskScores({ cityName: 'Miami Beach' });
    expect(coastal.scores.floodExposure).toBeGreaterThanOrEqual(55);
  });
});

describe('api request schemas', () => {
  it('accepts valid risk assessment payload', () => {
    const p = riskAssessmentRequestSchema.safeParse({
      location: 'Austin',
      population: '1M',
      infrastructureTypes: ['Water systems'],
    });
    expect(p.success).toBe(true);
  });

  it('rejects empty city risk name', () => {
    const p = cityRiskScoreRequestSchema.safeParse({ cityName: 'x' });
    expect(p.success).toBe(false);
  });
});
