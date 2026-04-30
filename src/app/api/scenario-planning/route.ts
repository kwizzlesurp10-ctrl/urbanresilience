import { NextResponse } from 'next/server';
import { runScenarioSimulation } from '@/ai/flows/scenario-simulator-flow';
import { scenarioPlanningRequestSchema } from '@/lib/api-schemas';
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

  const parsed = scenarioPlanningRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err({ code: 'VALIDATION_ERROR', message: parsed.error.flatten() }),
      { status: 422 }
    );
  }

  try {
    const data = await runScenarioSimulation(parsed.data);
    return NextResponse.json(ok(data));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Simulation failed';
    return NextResponse.json(err({ code: 'UPSTREAM_ERROR', message }), { status: 502 });
  }
}
