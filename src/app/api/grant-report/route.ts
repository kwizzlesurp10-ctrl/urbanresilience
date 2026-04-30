import { NextResponse } from 'next/server';
import { generateGrantReport } from '@/ai/flows/grant-report-generator-flow';
import { grantReportRequestSchema } from '@/lib/api-schemas';
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

  const parsed = grantReportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err({ code: 'VALIDATION_ERROR', message: parsed.error.flatten() }),
      { status: 422 }
    );
  }

  try {
    const data = await generateGrantReport(parsed.data);
    return NextResponse.json(ok(data));
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Report generation failed';
    return NextResponse.json(err({ code: 'UPSTREAM_ERROR', message }), { status: 502 });
  }
}
