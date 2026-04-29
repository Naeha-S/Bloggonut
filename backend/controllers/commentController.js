import { supabase } from '../config/supabase.js';
import { z } from 'zod';

const CommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  post_id: z.string().uuid('Invalid post ID'),
});

const isUuid = (value = '') =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(`[comments:getCommentsForPost] fetching for postId: ${postId}`);

    if (!postId || !isUuid(postId)) {
      console.log(`[comments:getCommentsForPost] skipping invalid UUID: ${postId}`);
      return res.status(200).json([]);
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      // Handle Postgres error codes for invalid UUIDs just in case
      if (error.code === '22P02' || error.code === '42P01') {
        console.log(`[comments:getCommentsForPost] handled error code ${error.code}, returning []`);
        return res.status(200).json([]);
      }
      throw error;
    }

    res.status(200).json(data || []);
  } catch (err) {
    console.error(`[comments:getCommentsForPost] error:`, err.message);
    res.status(500).json({ error: err.message });
  }
};


export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!isUuid(postId)) {
      return res.status(400).json({ error: 'Comments are only available for saved posts right now.' });
    }

    const validatedData = CommentSchema.parse({ ...req.body, post_id: postId });
    const user = req.user;

    const { data, error } = await supabase.from('comments').insert([
      {
        ...validatedData,
        user_id: user.id,
        author: user.email.split('@')[0],
      }
    ]).select();

    if (error) throw error;
    res.status(201).json({ message: 'Comment added', data: data[0] });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (comment.user_id !== user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
