import { NextResponse } from 'next/server';
import { onboardingWelcomeRequestSchema } from '@/lib/api-schemas';
import { err, ok } from '@/lib/result';

const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-3-5-haiku-20241022';

async function anthropicWelcome(params: {
  organization: string;
  role?: string;
  region?: string;
  name?: string;
}): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const system =
    'You write brief, professional welcome copy for municipal climate resilience onboarding. Two short paragraphs, no markdown headings, warm but formal tone.';
  const user = [
    `Organization: ${params.organization}`,
    params.role ? `Role: ${params.role}` : null,
    params.region ? `Region: ${params.region}` : null,
    params.name ? `Contact name: ${params.name}` : null,
    'Welcome them to Urban Resilience AI and set expectations for next steps (demo scheduling, data onboarding).',
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${t.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = data.content?.find((c) => c.type === 'text')?.text?.trim();
  if (!text) {
    throw new Error('Empty response from Anthropic');
  }
  return text;
}

function fallbackWelcome(params: {
  organization: string;
  role?: string;
  region?: string;
  name?: string;
}): string {
  const greet = params.name ? `Thank you, ${params.name}.` : 'Thank you for your interest.';
  const region = params.region ? ` We noted your focus on ${params.region}.` : '';
  const role = params.role ? ` Your perspective as ${params.role.replace(/-/g, ' ')} helps us tailor the demo.` : '';
  return `${greet} Welcome ${params.organization} to Urban Resilience AI.${region}${role} Our team will review your request and follow up with scheduling and a short data checklist so we can configure your resilience workspace.`;
}

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

  const parsed = onboardingWelcomeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      err({ code: 'VALIDATION_ERROR', message: parsed.error.flatten() }),
      { status: 422 }
    );
  }

  try {
    if (process.env.ANTHROPIC_API_KEY) {
      const message = await anthropicWelcome(parsed.data);
      return NextResponse.json(ok({ message, source: 'anthropic' as const }));
    }
    return NextResponse.json(
      ok({ message: fallbackWelcome(parsed.data), source: 'fallback' as const })
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Welcome message failed';
    return NextResponse.json(err({ code: 'UPSTREAM_ERROR', message }), { status: 502 });
  }
}
