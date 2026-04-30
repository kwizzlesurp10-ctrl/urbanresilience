import type { CityRiskScoreRequest } from '@/lib/api-schemas';

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function computeCityRiskScores(input: CityRiskScoreRequest): {
  cityName: string;
  scores: {
    floodExposure: number;
    heatStress: number;
    infrastructureStrain: number;
    compositeIndex: number;
    tier: 'elevated' | 'moderate' | 'watch' | 'lower';
  };
  summary: string;
} {
  const { cityName, latitude, longitude } = input;
  const seed = hashString(cityName.toLowerCase());
  const coastal = /miami|tampa|new orleans|coastal|beach|harbor|bay|sea|ocean|gulf|pacific|atlantic/i.test(
    cityName
  );

  let flood = 40 + (seed % 45);
  let heat = 35 + ((seed >> 3) % 50);
  const infra = 30 + ((seed >> 6) % 55);

  if (coastal) {
    flood = Math.min(98, flood + 15);
  }
  if (latitude !== undefined && longitude !== undefined) {
    const latFactor = Math.abs(latitude) / 90;
    heat = Math.round(heat * (0.85 + latFactor * 0.25));
  }

  const composite = Math.round((flood * 0.35 + heat * 0.35 + infra * 0.3) * 10) / 10;
  const tier =
    composite >= 75 ? 'elevated' : composite >= 50 ? 'moderate' : composite >= 30 ? 'watch' : 'lower';

  return {
    cityName,
    scores: {
      floodExposure: flood,
      heatStress: heat,
      infrastructureStrain: infra,
      compositeIndex: composite,
      tier,
    },
    summary: `Illustrative composite index for ${cityName}: flood ${flood}, heat ${heat}, infrastructure ${infra} (0–100 scale).`,
  };
}
