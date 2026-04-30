import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { postJson } from '@/lib/api-client';

describe('postJson', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns ok data for successful Result envelope', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ ok: true, data: { snippet: 'hello' } }), { status: 200 })
    );
    const r = await postJson<{ snippet: string }>('/api/risk-assessment', {});
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.snippet).toBe('hello');
  });

  it('returns err for failed HTTP', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ ok: false, error: { code: 'x' } }), { status: 422 })
    );
    const r = await postJson('/api/x', {});
    expect(r.ok).toBe(false);
  });
});
