import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApiClient } from '../src/utils/api';

describe('API client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('builds GET request and parses JSON response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });
    global.fetch = mockFetch;

    const api = createApiClient({ baseURL: 'https://api.example.com' });
    const result = await api.get('/knowledge/tree');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/knowledge/tree',
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual({ data: 'test' });
  });

  it('builds POST request with JSON body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    global.fetch = mockFetch;

    const api = createApiClient({ baseURL: 'https://api.example.com' });
    await api.post('/auth/login', { code: 'abc123' });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example.com/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ code: 'abc123' }),
      })
    );
  });

  it('attaches Authorization header when token is set', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    global.fetch = mockFetch;

    const api = createApiClient({ baseURL: 'https://api.example.com', token: 'jwt-token-123' });
    await api.get('/profile');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer jwt-token-123' }),
      })
    );
  });

  it('throws on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }),
    });
    global.fetch = mockFetch;

    const api = createApiClient({ baseURL: 'https://api.example.com' });
    await expect(api.get('/profile')).rejects.toThrow();
  });
});
