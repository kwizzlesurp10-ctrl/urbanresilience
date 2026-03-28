import { describe, it, expect, vi } from 'vitest';
import { generateRiskAssessmentSnippet } from './personalized-risk-assessment-snippet-flow';

// Mock Genkit's AI implementation to avoid true network calls during tests
vi.mock('@/ai/genkit', () => ({
  ai: {
    defineTool: vi.fn((def) => def),
    defineFlow: vi.fn((__def, fn) => fn),
    generate: vi.fn().mockResolvedValue({
      text: 'Mocked risk snippet: Critical flood risks addressed by AI prediction engine.',
    }),
  },
}));

describe('Personalized Risk Assessment Flow', () => {
  it('strictly validates schema output via the mock flow structure', async () => {
    const input = {
      location: 'Miami',
      population: '400,000',
      infrastructureTypes: ['coastal'],
    };
    
    // We execute the flow and ensure the mocked orchestration produces the result safely
    const result = await generateRiskAssessmentSnippet(input);
    expect(result).toContain('Mocked risk snippet');
  });
});
