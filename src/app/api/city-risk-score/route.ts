import { cityRiskScoreRequestSchema } from '@/lib/api-schemas';
import { computeCityRiskScores } from '@/lib/city-risk-score';
import { err, ok } from '@/lib/result';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      err({ code: 'INVALID_JSON', message: 'Request body must be JSON' }),
      { status: 400 }
    );
  }

  const parsed = cityRiskScoreRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err({ code: 'VALIDATION_ERROR', message: parsed.error.flatten() }),
      { status: 422 }
    );
  }

  return NextResponse.json(ok(computeCityRiskScores(parsed.data)));
}
