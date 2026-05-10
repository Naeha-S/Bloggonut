import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';

vi.mock('../config/supabase.js', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from '../config/supabase.js';

/** Creates a fully chainable + awaitable Supabase query mock. */
function makeChain(result) {
  const p = Promise.resolve(result);
  const chain = {
    select: vi.fn(() => makeChain(result)),
    insert: vi.fn(() => makeChain(result)),
    update: vi.fn(() => makeChain(result)),
    delete: vi.fn(() => makeChain(result)),
    eq: vi.fn(() => makeChain(result)),
    order: vi.fn(() => makeChain(result)),
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

describe('postController – getPosts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with merged posts on success', async () => {
    const dbPost = {
      id: VALID_UUID,
      title: 'DB Post',
      created_at: new Date().toISOString(),
    };
    supabase.from.mockReturnValueOnce(makeChain({ data: [dbPost], error: null }));
    const req = {};
    const res = makeRes();
    await getPosts(req, res);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // The DB post should be first (most recent)
    expect(res.body.some((p) => p.id === VALID_UUID)).toBe(true);
  });

  it('returns dummy posts when table does not exist (42P01)', async () => {
    supabase.from.mockReturnValueOnce(makeChain({ data: null, error: { code: '42P01' } }));
    const req = {};
    const res = makeRes();
    await getPosts(req, res);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns 500 on unexpected supabase error', async () => {
    supabase.from.mockReturnValueOnce(makeChain({ data: null, error: { code: 'OTHER', message: 'DB down' } }));
    const req = {};
    const res = makeRes();
    await getPosts(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('DB down');
  });

  it('merges DB posts with dummy posts and deduplicates by id', async () => {
    // First dummy post has id 1 – providing a DB post with the same id should keep only one
    const duplicatePost = { id: 1, title: 'Duplicate', created_at: new Date().toISOString() };
    supabase.from.mockReturnValueOnce(makeChain({ data: [duplicatePost], error: null }));
    const req = {};
    const res = makeRes();
    await getPosts(req, res);
    const count = res.body.filter((p) => p.id === 1).length;
    expect(count).toBe(1);
  });
});

describe('postController – getPostById', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns a dummy post for a numeric (non-UUID) id', async () => {
    const req = { params: { id: '1' } };
    const res = makeRes();
    await getPostById(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('returns 404 for a non-UUID id that has no dummy match', async () => {
    const req = { params: { id: '9999' } };
    const res = makeRes();
    await getPostById(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Post not found');
  });

  it('returns DB post for a valid UUID id', async () => {
    const dbPost = { id: VALID_UUID, title: 'Real Post' };
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: dbPost, error: null }),
    });
    const req = { params: { id: VALID_UUID } };
    const res = makeRes();
    await getPostById(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Real Post');
  });

  it('falls back to dummy post when UUID has no DB match (PGRST116)', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
    });
    // Use id=1 encoded as UUID-like? No – use a numeric id that does NOT match UUID format
    // Actually for UUID path we need a UUID that happens to match dummy. Dummies use numeric ids.
    // So a UUID lookup in dummy posts won't match (numeric id vs UUID string).
    // This test confirms 404 when UUID not in DB and not in dummies.
    const req = { params: { id: VALID_UUID } };
    const res = makeRes();
    await getPostById(req, res);
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Post not found');
  });

  it('falls back gracefully on table missing (42P01) for UUID id', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: '42P01' } }),
    });
    const req = { params: { id: VALID_UUID } };
    const res = makeRes();
    await getPostById(req, res);
    // UUID won't match any dummy post numeric id → 404
    expect(res.statusCode).toBe(404);
  });

  it('returns 500 on unexpected DB error for UUID id', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'OTHER', message: 'Fatal error' } }),
    });
    const req = { params: { id: VALID_UUID } };
    const res = makeRes();
    await getPostById(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Fatal error');
  });
});

describe('postController – createPost', () => {
  beforeEach(() => vi.clearAllMocks());

  const validBody = {
    title: 'A Great Post Title',
    description: 'A sufficiently long description here',
    content: 'This is more than twenty characters of content.',
    category: 'Technology',
    tags: ['tag1'],
    image: 'https://example.com/image.jpg',
  };

  it('returns 400 when title is too short', async () => {
    const req = {
      body: { ...validBody, title: 'Hi' },
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createPost(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/too short/i);
  });

  it('returns 400 when description is too short', async () => {
    const req = {
      body: { ...validBody, description: 'Short' },
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createPost(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/too short/i);
  });

  it('returns 400 when content is too short', async () => {
    const req = {
      body: { ...validBody, content: 'Too short' },
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createPost(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/too short/i);
  });

  it('returns 400 when image URL is invalid', async () => {
    const req = {
      body: { ...validBody, image: 'not-a-url' },
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createPost(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('returns 201 on success', async () => {
    const createdPost = { id: VALID_UUID, ...validBody };
    supabase.from.mockReturnValueOnce(makeChain({ data: [createdPost], error: null }));
    const req = {
      body: validBody,
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createPost(req, res);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Post created');
  });

  it('returns 500 when supabase insert fails', async () => {
    supabase.from.mockReturnValueOnce(makeChain({ data: null, error: { message: 'Insert failed' } }));
    const req = {
      body: validBody,
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createPost(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Insert failed');
  });
});

describe('postController – updatePost', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 403 when user is not the author', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { author_id: 'other-uid' }, error: null }),
    });
    const req = {
      params: { id: VALID_UUID },
      body: { title: 'Updated Title Here' },
      user: { id: 'uid-1' },
    };
    const res = makeRes();
    await updatePost(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/not authorized/i);
  });

  it('returns 200 on successful update', async () => {
    const updatedPost = { id: VALID_UUID, title: 'Updated Title Here' };
    // First call: fetch post author_id
    supabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { author_id: 'uid-1' }, error: null }),
      })
      // Second call: update
      .mockReturnValueOnce(makeChain({ data: [updatedPost], error: null }));

    const req = {
      params: { id: VALID_UUID },
      body: { title: 'Updated Title Here' },
      user: { id: 'uid-1' },
    };
    const res = makeRes();
    await updatePost(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Post updated');
  });

  it('returns 500 on DB error when fetching post', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    });
    const req = {
      params: { id: VALID_UUID },
      body: { title: 'Updated Title Here' },
      user: { id: 'uid-1' },
    };
    const res = makeRes();
    await updatePost(req, res);
    expect(res.statusCode).toBe(500);
  });
});

describe('postController – deletePost', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 403 when user is not the author', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { author_id: 'other-uid' }, error: null }),
    });
    const req = { params: { id: VALID_UUID }, user: { id: 'uid-1' } };
    const res = makeRes();
    await deletePost(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/not authorized/i);
  });

  it('returns 200 on successful delete', async () => {
    supabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { author_id: 'uid-1' }, error: null }),
      })
      .mockReturnValueOnce(makeChain({ error: null }));

    const req = { params: { id: VALID_UUID }, user: { id: 'uid-1' } };
    const res = makeRes();
    await deletePost(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Post deleted');
  });

  it('returns 500 when delete DB call fails', async () => {
    supabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { author_id: 'uid-1' }, error: null }),
      })
      .mockReturnValueOnce(makeChain({ error: { message: 'Delete failed' } }));

    const req = { params: { id: VALID_UUID }, user: { id: 'uid-1' } };
    const res = makeRes();
    await deletePost(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Delete failed');
  });
});
