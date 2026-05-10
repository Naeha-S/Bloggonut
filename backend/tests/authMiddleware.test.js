import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware } from '../middleware/authMiddleware.js';

vi.mock('../config/supabase.js', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
  },
}));

import { supabase } from '../config/supabase.js';

function makeRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return res;
}

describe('authMiddleware', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when Authorization header is missing', async () => {
    const req = { headers: {} };
    const res = makeRes();
    const next = vi.fn();
    await authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('No token provided');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Invalid token' },
    });
    const req = { headers: { authorization: 'Bearer bad-token' } };
    const res = makeRes();
    const next = vi.fn();
    await authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when user is null without error', async () => {
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });
    const req = { headers: { authorization: 'Bearer some-token' } };
    const res = makeRes();
    const next = vi.fn();
    await authMiddleware(req, res, next);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches user and calls next() when token is valid', async () => {
    const mockUser = { id: 'uid-1', email: 'user@example.com' };
    supabase.auth.getUser.mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });
    const req = { headers: { authorization: 'Bearer valid-token' } };
    const res = makeRes();
    const next = vi.fn();
    await authMiddleware(req, res, next);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalledOnce();
  });

  it('returns 500 when supabase.auth.getUser throws', async () => {
    supabase.auth.getUser.mockRejectedValueOnce(new Error('Network error'));
    const req = { headers: { authorization: 'Bearer some-token' } };
    const res = makeRes();
    const next = vi.fn();
    await authMiddleware(req, res, next);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Server error in auth middleware');
    expect(next).not.toHaveBeenCalled();
  });
});
