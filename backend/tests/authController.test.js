import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signup, login } from '../controllers/authController.js';

// Mock supabase before any imports resolve
vi.mock('../config/supabase.js', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
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

describe('authController – signup', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when email is invalid', async () => {
    const req = { body: { email: 'not-an-email', password: 'password123' } };
    const res = makeRes();
    await signup(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid email/i);
  });

  it('returns 400 when password is too short', async () => {
    const req = { body: { email: 'user@example.com', password: '123' } };
    const res = makeRes();
    await signup(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/at least 6 characters/i);
  });

  it('returns 201 on successful signup', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { user: { id: 'uid-1' } },
      error: null,
    });
    const req = { body: { email: 'user@example.com', password: 'password123' } };
    const res = makeRes();
    await signup(req, res);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
  });

  it('returns 400 when supabase returns an error', async () => {
    supabase.auth.signUp.mockResolvedValueOnce({
      data: null,
      error: { message: 'Email already registered' },
    });
    const req = { body: { email: 'user@example.com', password: 'password123' } };
    const res = makeRes();
    await signup(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email already registered');
  });
});

describe('authController – login', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when email is invalid', async () => {
    const req = { body: { email: 'bad-email', password: 'password123' } };
    const res = makeRes();
    await login(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid email/i);
  });

  it('returns 400 when password is too short', async () => {
    const req = { body: { email: 'user@example.com', password: 'abc' } };
    const res = makeRes();
    await login(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/at least 6 characters/i);
  });

  it('returns 200 with token on successful login', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        session: { access_token: 'tok-abc' },
        user: { id: 'uid-1', email: 'user@example.com' },
      },
      error: null,
    });
    const req = { body: { email: 'user@example.com', password: 'password123' } };
    const res = makeRes();
    await login(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('tok-abc');
    expect(res.body.message).toBe('Login successful');
  });

  it('returns 401 when supabase returns an error', async () => {
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' },
    });
    const req = { body: { email: 'user@example.com', password: 'wrongpass' } };
    const res = makeRes();
    await login(req, res);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid login credentials');
  });
});
