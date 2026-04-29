import { supabase } from '../config/supabase.js';
import { z } from 'zod';

const AuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['author', 'admirer']).optional().default('admirer'),
  display_name: z.string().min(1).max(60).optional(),
});

export const signup = async (req, res) => {
  try {
    const validatedData = AuthSchema.parse(req.body);

    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) throw error;

    // Create user profile row with role
    if (data?.user) {
      await supabase.from('user_profiles').insert([
        {
          user_id: data.user.id,
          display_name: validatedData.display_name || validatedData.email.split('@')[0],
          role: validatedData.role,
        },
      ]);
    }

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
    const { email, password } = AuthSchema.omit({ role: true, display_name: true }).parse(req.body);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Fetch user role from profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, display_name')
      .eq('user_id', data.user.id)
      .single();

    res.status(200).json({
      message: 'Login successful',
      token: data.session.access_token,
      user: {
        ...data.user,
        role: profile?.role || 'admirer',
        display_name: profile?.display_name || email.split('@')[0],
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(401).json({ error: err.message });
  }
};
