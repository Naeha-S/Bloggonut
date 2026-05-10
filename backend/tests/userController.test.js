import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getUserProfile,
  createOrUpdateProfile,
  getAuthorProfile,
} from '../controllers/userController.js';

vi.mock('../config/supabase.js', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from '../config/supabase.js';

function makeChain(result) {
  const p = Promise.resolve(result);
  const chain = {
    select: vi.fn(() => makeChain(result)),
    insert: vi.fn(() => makeChain(result)),
    update: vi.fn(() => makeChain(result)),
    eq: vi.fn(() => makeChain(result)),
    limit: vi.fn(() => makeChain(result)),
    single: vi.fn(() => p),
    then: (resolve, reject) => p.then(resolve, reject),
    catch: (reject) => p.catch(reject),
  };
  return chain;
}

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

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('userController – getUserProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with profile data on success', async () => {
    const profile = { user_id: VALID_UUID, display_name: 'Test User' };
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: profile, error: null }),
    });
    const req = { params: { userId: VALID_UUID } };
    const res = makeRes();
    await getUserProfile(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.display_name).toBe('Test User');
  });

  it('returns 404 when profile is not found (PGRST116)', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    });
    const req = { params: { userId: VALID_UUID } };
    const res = makeRes();
    await getUserProfile(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Profile not found');
  });

  it('returns 500 on unexpected error', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'OTHER', message: 'DB error' } }),
    });
    const req = { params: { userId: VALID_UUID } };
    const res = makeRes();
    await getUserProfile(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('DB error');
  });
});

describe('userController – createOrUpdateProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  const validBody = {
    display_name: 'Alice',
    bio: 'A developer',
    website: 'https://alice.dev',
    twitter: 'alicedev',
    linkedin: 'alicedev',
    github: 'alicedev',
  };

  it('returns 400 on invalid website URL', async () => {
    const req = {
      body: { ...validBody, website: 'not-a-url' },
      user: { id: VALID_UUID },
    };
    const res = makeRes();
    await createOrUpdateProfile(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when display_name is empty string', async () => {
    const req = {
      body: { ...validBody, display_name: '' },
      user: { id: VALID_UUID },
    };
    const res = makeRes();
    await createOrUpdateProfile(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('creates a new profile when one does not exist', async () => {
    const inserted = { user_id: VALID_UUID, ...validBody };
    // First call: check existing profile → not found
    supabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      // Second call: insert new profile
      .mockReturnValueOnce(makeChain({ data: [inserted], error: null }));

    const req = { body: validBody, user: { id: VALID_UUID } };
    const res = makeRes();
    await createOrUpdateProfile(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Profile updated successfully');
    expect(res.body.data.display_name).toBe('Alice');
  });

  it('updates an existing profile', async () => {
    const updated = { user_id: VALID_UUID, ...validBody, display_name: 'Alice Updated' };
    supabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'prof-1' }, error: null }),
      })
      .mockReturnValueOnce(makeChain({ data: [updated], error: null }));

    const req = {
      body: { ...validBody, display_name: 'Alice Updated' },
      user: { id: VALID_UUID },
    };
    const res = makeRes();
    await createOrUpdateProfile(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.display_name).toBe('Alice Updated');
  });

  it('returns 500 when supabase operation fails', async () => {
    supabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      .mockReturnValueOnce(makeChain({ data: null, error: { message: 'Insert failed' } }));

    const req = { body: validBody, user: { id: VALID_UUID } };
    const res = makeRes();
    await createOrUpdateProfile(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Insert failed');
  });

  it('accepts an empty string for website (treated as no website)', async () => {
    const inserted = { user_id: VALID_UUID, ...validBody, website: '' };
    supabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      })
      .mockReturnValueOnce(makeChain({ data: [inserted], error: null }));

    const req = { body: { ...validBody, website: '' }, user: { id: VALID_UUID } };
    const res = makeRes();
    await createOrUpdateProfile(req, res);
    expect(res.statusCode).toBe(200);
  });
});

describe('userController – getAuthorProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 404 when no posts found for author', async () => {
    supabase.from.mockReturnValueOnce(makeChain({ data: [], error: null }));
    const req = { params: { authorName: 'unknown-author' } };
    const res = makeRes();
    await getAuthorProfile(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Author not found');
  });

  it('returns author profile with posts on success', async () => {
    const authorPosts = [{ id: 'post-1', title: 'My Post', author_id: VALID_UUID }];
    const profile = { user_id: VALID_UUID, display_name: 'Alice' };

    // Call 1: find author_id from posts table
    supabase.from
      .mockReturnValueOnce(makeChain({ data: [{ author_id: VALID_UUID }], error: null }))
      // Call 2: get user profile (via single)
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: profile, error: null }),
      })
      // Call 3: get all author posts
      .mockReturnValueOnce(makeChain({ data: authorPosts, error: null }));

    const req = { params: { authorName: 'Alice' } };
    const res = makeRes();
    await getAuthorProfile(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.profile.display_name).toBe('Alice');
    expect(res.body.totalPosts).toBe(1);
    expect(res.body.posts).toEqual(authorPosts);
  });

  it('returns a default profile when user_profiles has no record (PGRST116)', async () => {
    const authorPosts = [{ id: 'post-1', title: 'My Post', author_id: VALID_UUID }];

    supabase.from
      .mockReturnValueOnce(makeChain({ data: [{ author_id: VALID_UUID }], error: null }))
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      })
      .mockReturnValueOnce(makeChain({ data: authorPosts, error: null }));

    const req = { params: { authorName: 'Bob' } };
    const res = makeRes();
    await getAuthorProfile(req, res);
    expect(res.statusCode).toBe(200);
    // Should return a fallback profile with display_name set to the author name
    expect(res.body.profile).toEqual({ user_id: VALID_UUID, display_name: 'Bob' });
  });

  it('returns 500 on unexpected DB error', async () => {
    supabase.from
      .mockReturnValueOnce(makeChain({ data: [{ author_id: VALID_UUID }], error: null }))
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { code: 'OTHER', message: 'DB error' } }),
      });

    const req = { params: { authorName: 'Alice' } };
    const res = makeRes();
    await getAuthorProfile(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('DB error');
  });
});
