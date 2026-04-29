import { supabase } from '../config/supabase.js';
import { z } from 'zod';

const ProfileSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional().or(z.literal('')),
  twitter: z.string().max(100).optional(),
  linkedin: z.string().max(100).optional(),
  github: z.string().max(100).optional(),
});

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const validatedData = ProfileSchema.parse(req.body);

    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;

    if (existingProfile) {
      result = await supabase
        .from('user_profiles')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select();
    } else {
      result = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userId,
            ...validatedData,
          },
        ])
        .select();
    }

    if (result.error) throw result.error;

    res.status(200).json({
      message: 'Profile updated successfully',
      data: result.data[0],
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getAuthorProfile = async (req, res) => {
  try {
    const { authorName } = req.params;

    const { data: posts } = await supabase
      .from('posts')
      .select('author_id')
      .eq('author', authorName)
      .limit(1);

    if (!posts || posts.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const userId = posts[0].author_id;

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const { data: authorPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId);

    res.status(200).json({
      profile: profile || { user_id: userId, display_name: authorName },
      posts: authorPosts || [],
      totalPosts: (authorPosts || []).length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
