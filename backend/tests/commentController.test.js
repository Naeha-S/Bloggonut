import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCommentsForPost,
  createComment,
  deleteComment,
} from '../controllers/commentController.js';

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
    delete: vi.fn(() => makeChain(result)),
    eq: vi.fn(() => makeChain(result)),
    order: vi.fn(() => makeChain(result)),
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

describe('commentController – getCommentsForPost', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 200 with empty array for invalid UUID postId', async () => {
    const req = { params: { postId: 'not-a-uuid' } };
    const res = makeRes();
    await getCommentsForPost(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 200 with empty array for missing postId', async () => {
    const req = { params: { postId: undefined } };
    const res = makeRes();
    await getCommentsForPost(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 200 with comments for a valid UUID', async () => {
    const comments = [
      { id: 'c1', content: 'Hello', post_id: VALID_UUID },
    ];
    supabase.from.mockReturnValueOnce(makeChain({ data: comments, error: null }));
    const req = { params: { postId: VALID_UUID } };
    const res = makeRes();
    await getCommentsForPost(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(comments);
  });

  it('returns 200 with empty array on error code 22P02', async () => {
    supabase.from.mockReturnValueOnce(makeChain({ data: null, error: { code: '22P02' } }));
    const req = { params: { postId: VALID_UUID } };
    const res = makeRes();
    await getCommentsForPost(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 200 with empty array on error code 42P01', async () => {
    supabase.from.mockReturnValueOnce(makeChain({ data: null, error: { code: '42P01' } }));
    const req = { params: { postId: VALID_UUID } };
    const res = makeRes();
    await getCommentsForPost(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns 500 on unexpected error', async () => {
    supabase.from.mockReturnValueOnce(makeChain({ data: null, error: { code: 'OTHER', message: 'DB error' } }));
    const req = { params: { postId: VALID_UUID } };
    const res = makeRes();
    await getCommentsForPost(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('DB error');
  });
});

describe('commentController – createComment', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when postId is not a UUID', async () => {
    const req = {
      params: { postId: '123' },
      body: { content: 'A comment' },
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createComment(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/saved posts/i);
  });

  it('returns 400 when comment content is empty', async () => {
    const req = {
      params: { postId: VALID_UUID },
      body: { content: '' },
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createComment(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/cannot be empty/i);
  });

  it('returns 201 on successful comment creation', async () => {
    const newComment = { id: 'c1', content: 'Great post!', post_id: VALID_UUID };
    supabase.from.mockReturnValueOnce(makeChain({ data: [newComment], error: null }));
    const req = {
      params: { postId: VALID_UUID },
      body: { content: 'Great post!' },
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createComment(req, res);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Comment added');
    expect(res.body.data).toEqual(newComment);
  });

  it('returns 500 when supabase insert fails', async () => {
    supabase.from.mockReturnValueOnce(makeChain({ data: null, error: { message: 'Insert failed' } }));
    const req = {
      params: { postId: VALID_UUID },
      body: { content: 'A comment' },
      user: { id: 'uid-1', email: 'user@example.com' },
    };
    const res = makeRes();
    await createComment(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Insert failed');
  });
});

describe('commentController – deleteComment', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 403 when user does not own the comment', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { user_id: 'other-uid' }, error: null }),
    });
    const req = { params: { id: 'c1' }, user: { id: 'uid-1' } };
    const res = makeRes();
    await deleteComment(req, res);
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/not authorized/i);
  });

  it('returns 200 on successful delete', async () => {
    supabase.from
      .mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { user_id: 'uid-1' }, error: null }),
      })
      .mockReturnValueOnce(makeChain({ error: null }));

    const req = { params: { id: 'c1' }, user: { id: 'uid-1' } };
    const res = makeRes();
    await deleteComment(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Comment deleted');
  });

  it('returns 500 when fetch comment fails', async () => {
    supabase.from.mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    });
    const req = { params: { id: 'c1' }, user: { id: 'uid-1' } };
    const res = makeRes();
    await deleteComment(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Not found');
  });
});
