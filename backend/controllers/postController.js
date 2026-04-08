import { supabase } from '../config/supabase.js';
import { z } from 'zod';

const DUMMY_POSTS = [
  {
    id: 1,
    title: 'The Future of AI in Modern Web Development',
    description: 'Explore how artificial intelligence is shaping the way we build interfaces.',
    content: 'Long content here...',
    author: 'Sarah Chen',
    category: 'Technology',
    tags: ['AI', 'WebDev', 'Future'],
    date: new Date().toISOString(),
    likes: 342,
    comments: 56,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 2,
    title: 'Mastering Framer Motion in React Apps',
    description: 'A comprehensive guide to adding delightful micro-interactions.',
    content: 'Long content here...',
    author: 'Alex Rivera',
    category: 'Development',
    tags: ['React', 'Animation', 'UI/UX'],
    date: new Date().toISOString(),
    likes: 891,
    comments: 124,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
  }
];

export const getPosts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    
    // If table doesn't exist yet, return dummy data to fulfill user's "populate with sample posts for now"
    if (error && error.code === '42P01') {
      return res.status(200).json(DUMMY_POSTS);
    }
    
    if (error) throw error;
    res.status(200).json(data?.length ? data : DUMMY_POSTS);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
    
    if (error && error.code === '42P01') {
      const post = DUMMY_POSTS.find(p => p.id == id);
      return post ? res.status(200).json(post) : res.status(404).json({ error: 'Post not found' });
    }

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const PostSchema = z.object({
  title: z.string().min(5, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  content: z.string().min(20, 'Content is too short'),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  image: z.string().url().optional(),
});

export const createPost = async (req, res) => {
  try {
    const validatedData = PostSchema.parse(req.body);
    const user = req.user;

    const { data, error } = await supabase.from('posts').insert([
      {
        ...validatedData,
        author_id: user.id,
        author: user.email.split('@')[0], // simplistic author name
      }
    ]).select();

    if (error) throw error;
    res.status(201).json({ message: 'Post created', data });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message });
  }
};
