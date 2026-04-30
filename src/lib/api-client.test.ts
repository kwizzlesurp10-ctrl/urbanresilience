import { describe, expect, it } from 'vitest';
import { formatPostJsonError } from '@/lib/api-client';

describe('formatPostJsonError', () => {
  it('prefers API error.message and code', () => {
    expect(
      formatPostJsonError({
        status: 502,
        body: { ok: false, error: { code: 'UPSTREAM_ERROR', message: 'Gemini rate limit' } },
      })
    ).toBe('UPSTREAM_ERROR: Gemini rate limit');
  });

  it('handles empty object body with hint', () => {
    expect(formatPostJsonError({ status: 200, body: {} })).toContain('Empty response');
  });

  it('handles string body', () => {
    expect(formatPostJsonError({ status: 500, body: 'oops' })).toBe('oops');
  });

  it('handles empty HTTP body wrapper', () => {
    expect(
      formatPostJsonError({
        status: 502,
        body: { ok: false, error: { code: 'EMPTY_BODY', message: 'HTTP 502 with no response body' } },
      })
    ).toContain('EMPTY_BODY');
  });
});
