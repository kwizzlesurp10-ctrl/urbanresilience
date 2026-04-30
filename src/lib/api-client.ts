import { err, ok, type Result } from '@/lib/result';

export type ApiErrorBody = {
  ok: false;
  error: { code: string; message: unknown };
};

export type PostJsonError = { status: number; body: unknown };

/** Human-readable message for `postJson` error branch (safe for toasts and logs). */
export function formatPostJsonError(e: PostJsonError): string {
  const { status, body } = e;
  if (body == null) {
    return `Request failed (HTTP ${status}).`;
  }
  if (typeof body === 'string') {
    return body;
  }
  if (typeof body === 'object' && body !== null) {
    const rec = body as Record<string, unknown>;
    if ('error' in rec && rec.error && typeof rec.error === 'object') {
      const er = rec.error as Record<string, unknown>;
      const code = typeof er.code === 'string' ? er.code : undefined;
      if (typeof er.message === 'string' && er.message.trim()) {
        return code ? `${code}: ${er.message}` : er.message;
      }
      if (er.message != null) {
        try {
          return code
            ? `${code}: ${JSON.stringify(er.message)}`
            : JSON.stringify(er.message);
        } catch {
          return code ?? `Request failed (HTTP ${status}).`;
        }
      }
      if (code) {
        return `${code} (HTTP ${status}).`;
      }
    }
    if ('message' in rec && typeof rec.message === 'string' && rec.message.trim()) {
      return rec.message;
    }
    if (Object.keys(rec).length === 0) {
      return `Empty response from server (HTTP ${status}). Check the API route and GEMINI_API_KEY in .env.`;
    }
  }
  try {
    return `${JSON.stringify(body)} (HTTP ${status})`;
  } catch {
    return `Request failed (HTTP ${status}).`;
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<Result<T, PostJsonError>> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  let parsed: unknown;
  if (!rawText.trim()) {
    if (!res.ok) {
      return err({
        status: res.status,
        body: { ok: false, error: { code: 'EMPTY_BODY', message: `HTTP ${res.status} with no response body` } },
      });
    }
    parsed = {};
  } else {
    try {
      parsed = JSON.parse(rawText) as unknown;
    } catch {
      return err({
        status: res.status,
        body: {
          ok: false,
          error: {
            code: 'INVALID_JSON',
            message: `Expected JSON; got: ${rawText.slice(0, 120)}${rawText.length > 120 ? '…' : ''}`,
          },
        },
      });
    }
  }

  if (!res.ok) {
    return err({ status: res.status, body: parsed });
  }

  const envelope = parsed as { ok?: boolean; data?: T; error?: unknown };
  if (envelope && typeof envelope === 'object' && 'ok' in envelope) {
    if (envelope.ok === true) {
      if ('data' in envelope) {
        return ok(envelope.data as T);
      }
      return err({
        status: res.status,
        body: {
          ok: false,
          error: {
            code: 'MISSING_DATA',
            message: 'Server returned success without data',
          },
        },
      });
    }
    return err({ status: res.status, body: envelope });
  }

  if (parsed && typeof parsed === 'object' && Object.keys(parsed as object).length === 0) {
    return err({
      status: res.status,
      body: {
        ok: false,
        error: {
          code: 'EMPTY_ENVELOPE',
          message: 'Server returned an empty JSON object',
        },
      },
    });
  }

  return err({ status: res.status, body: parsed });
}
