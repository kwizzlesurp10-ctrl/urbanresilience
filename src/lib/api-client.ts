import { err, ok, type Result } from '@/lib/result';

export type ApiErrorBody = {
  ok: false;
  error: { code: string; message: unknown };
};

export async function postJson<T>(
  path: string,
  body: unknown
): Promise<Result<T, { status: number; body: unknown }>> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  let parsed: unknown;
  try {
    parsed = await res.json();
  } catch {
    return err({ status: res.status, body: 'Invalid JSON response' });
  }

  if (!res.ok) {
    return err({ status: res.status, body: parsed });
  }

  const envelope = parsed as { ok?: boolean; data?: T; error?: unknown };
  if (envelope && typeof envelope === 'object' && 'ok' in envelope) {
    if (envelope.ok === true && 'data' in envelope) {
      return ok(envelope.data as T);
    }
    return err({ status: res.status, body: envelope });
  }

  return err({ status: res.status, body: parsed });
}
