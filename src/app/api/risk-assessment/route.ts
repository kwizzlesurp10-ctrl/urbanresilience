import { NextResponse } from 'next/server';
import { generateRiskAssessmentSnippet } from '@/ai/flows/personalized-risk-assessment-snippet-flow';
import { riskAssessmentRequestSchema } from '@/lib/api-schemas';
import { err, ok } from '@/lib/result';

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

  const parsed = riskAssessmentRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err({ code: 'VALIDATION_ERROR', message: parsed.error.flatten() }),
      { status: 422 }
    );
  }

  const infra =
    parsed.data.infrastructureTypes.length > 0
      ? parsed.data.infrastructureTypes
      : ['general urban infrastructure'];

  try {
    const text = await generateRiskAssessmentSnippet({
      location: parsed.data.location,
      population: parsed.data.population,
      infrastructureTypes: infra,
    });
    return NextResponse.json(ok({ snippet: text }));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Generation failed';
    return NextResponse.json(err({ code: 'UPSTREAM_ERROR', message }), { status: 502 });
  }
}
