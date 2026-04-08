import { supabase } from '../config/supabase.js';
import { z } from 'zod';

const AuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signup = async (req, res) => {
  try {
    const validatedData = AuthSchema.parse(req.body);
    
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) throw error;
    res.status(201).json({ message: 'User created successfully', data });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = AuthSchema.parse(req.body);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) throw error;
    
    res.status(200).json({ 
      message: 'Login successful',
      token: data.session.access_token,
      user: data.user 
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(401).json({ error: err.message });
  }
};
