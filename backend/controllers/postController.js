import { supabase } from '../config/supabase.js';
import { z } from 'zod';

const TOPIC_IMAGES = {
  Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  Design: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200',
  Development: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
  AI: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
  Startup: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
  Lifestyle: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200',
};

const DUMMY_POST_BLUEPRINTS = [
  {
    title: 'The Future of AI in Modern Web Development',
    description: 'Explore how artificial intelligence is shaping the way we build interfaces and automate workflows.',
    author: 'Sarah Chen',
    category: 'AI',
    tags: ['AI', 'WebDev', 'Future'],
    likes: 342,
    comments: 56,
  },
  {
    title: 'Mastering Framer Motion in React Apps',
    description: 'A comprehensive guide to adding delightful micro-interactions and smooth animations to your React applications.',
    author: 'Alex Rivera',
    category: 'Development',
    tags: ['React', 'Animation', 'UI/UX'],
    likes: 891,
    comments: 124,
  },
  {
    title: 'Design Systems That Scale: Building for Growth',
    description: 'Learn how to create sustainable design systems that evolve with your product and team.',
    author: 'Jordan Lee',
    category: 'Design',
    tags: ['Design', 'Systems', 'Scalability'],
    likes: 567,
    comments: 89,
  },
  {
    title: 'The Art of Minimalist Web Design',
    description: 'Why less is more: Creating powerful interfaces with intentional simplicity and restraint.',
    author: 'Maya Patel',
    category: 'Design',
    tags: ['Minimalism', 'UX', 'Web Design'],
    likes: 723,
    comments: 102,
  },
  {
    title: 'Sustainable Coding Practices for Long-term Success',
    description: 'Building maintainable, scalable code that stands the test of time and complexity.',
    author: 'Chris Thompson',
    category: 'Development',
    tags: ['Code Quality', 'Best Practices', 'Architecture'],
    likes: 445,
    comments: 67,
  },
  {
    title: 'Typography: The Unsung Hero of Web Design',
    description: 'How thoughtful font choices can transform your digital products and enhance readability.',
    author: 'Emma Wilson',
    category: 'Design',
    tags: ['Typography', 'Design', 'Readability'],
    likes: 612,
    comments: 94,
  },
  {
    title: 'Web Performance: Speed is a Feature',
    description: 'Optimizing your site for performance is not just about metrics, it is about user experience.',
    author: 'David Kim',
    category: 'Technology',
    tags: ['Performance', 'Optimization', 'Speed'],
    likes: 834,
    comments: 156,
  },
  {
    title: 'Accessibility: Designing for Everyone',
    description: 'Creating inclusive interfaces that work for all users, regardless of ability or device.',
    author: 'Sofia Martinez',
    category: 'Design',
    tags: ['Accessibility', 'Inclusion', 'WCAG'],
    likes: 521,
    comments: 78,
  },
  {
    title: 'How Edge Computing Changes Product Architecture',
    description: 'Push computation closer to users and rethink the tradeoffs in modern distributed systems.',
    author: 'Nina Brooks',
    category: 'Technology',
    tags: ['Edge', 'Systems', 'Architecture'],
    likes: 478,
    comments: 65,
  },
  {
    title: 'Security by Default: Small Habits That Prevent Big Failures',
    description: 'Practical routines that keep product teams from shipping accidental vulnerabilities.',
    author: 'Omar Hadi',
    category: 'Technology',
    tags: ['Security', 'Safety', 'Engineering'],
    likes: 559,
    comments: 91,
  },
  {
    title: 'Browser APIs Worth Using in 2026',
    description: 'A focused tour of browser-native features that eliminate unnecessary dependencies.',
    author: 'Iris Johnson',
    category: 'Technology',
    tags: ['Browser', 'APIs', 'Frontend'],
    likes: 399,
    comments: 48,
  },
  {
    title: 'Designing Human-Centered AI Products',
    description: 'Useful AI starts with the person using it, not the model behind it.',
    author: 'Avery Singh',
    category: 'AI',
    tags: ['AI UX', 'Product', 'Ethics'],
    likes: 642,
    comments: 105,
  },
  {
    title: 'Prompting Better Product Decisions',
    description: 'A practical guide to turning prompt-driven workflows into sharper product thinking.',
    author: 'Layla Morgan',
    category: 'AI',
    tags: ['Prompting', 'Workflow', 'Decision Making'],
    likes: 517,
    comments: 73,
  },
  {
    title: 'AI Agents for Small Teams',
    description: 'How tiny teams can combine automation, retrieval, and guardrails to move faster.',
    author: 'Theo Martin',
    category: 'AI',
    tags: ['Agents', 'Automation', 'Teams'],
    likes: 688,
    comments: 88,
  },
  {
    title: 'Retrieval-Augmented UX for Knowledge Products',
    description: 'RAG is not only a backend pattern; it changes the way people explore information.',
    author: 'Priya Nair',
    category: 'AI',
    tags: ['RAG', 'Search', 'Knowledge'],
    likes: 431,
    comments: 54,
  },
  {
    title: 'From Side Project to Startup Habit',
    description: 'How founders keep momentum alive while turning experiments into real products.',
    author: 'Miles Carter',
    category: 'Startup',
    tags: ['Founders', 'Momentum', 'MVP'],
    likes: 503,
    comments: 77,
  },
  {
    title: 'Landing Pages That Convert Without Feeling Pushy',
    description: 'A lean approach to product storytelling, proof, and conversion-friendly structure.',
    author: 'Zara Khan',
    category: 'Startup',
    tags: ['Growth', 'Landing Page', 'Conversion'],
    likes: 584,
    comments: 92,
  },
  {
    title: 'Bootstrapping with Constraints',
    description: 'Practical tradeoffs that help early teams stay focused on what actually matters.',
    author: 'Ben Ortiz',
    category: 'Startup',
    tags: ['Bootstrapping', 'Focus', 'Constraints'],
    likes: 461,
    comments: 61,
  },
  {
    title: 'Creative Routines for Makers',
    description: 'Daily rituals that help builders stay inventive without burning out.',
    author: 'Hannah Reed',
    category: 'Lifestyle',
    tags: ['Creativity', 'Routine', 'Focus'],
    likes: 374,
    comments: 49,
  },
  {
    title: 'Remote Work Without Burnout',
    description: 'A calmer setup for people who want deep work and a sustainable pace.',
    author: 'Daniel Park',
    category: 'Lifestyle',
    tags: ['Remote Work', 'Balance', 'Health'],
    likes: 529,
    comments: 84,
  },
  {
    title: 'Reading More in a Distracted World',
    description: 'Small systems that make long-form reading stick again.',
    author: 'Lina Gomez',
    category: 'Lifestyle',
    tags: ['Reading', 'Habits', 'Attention'],
    likes: 288,
    comments: 37,
  },
  {
    title: 'Motion Systems That Feel Intentional',
    description: 'Use movement to clarify hierarchy, not just to decorate the interface.',
    author: 'Ethan Cole',
    category: 'Design',
    tags: ['Motion', 'UX', 'Interaction'],
    likes: 676,
    comments: 99,
  },
  {
    title: 'Testing React Apps Without Slowing Down',
    description: 'A practical test stack that keeps feedback fast and confidence high.',
    author: 'Noah Evans',
    category: 'Development',
    tags: ['Testing', 'React', 'Quality'],
    likes: 701,
    comments: 113,
  },
  {
    title: 'TypeScript Patterns for Large Codebases',
    description: 'Keep the types useful, the code readable, and the compiler doing real work.',
    author: 'Grace Liu',
    category: 'Development',
    tags: ['TypeScript', 'Patterns', 'Scale'],
    likes: 645,
    comments: 97,
  },
  {
    title: 'API Design for Product Teams',
    description: 'Simple contracts and naming choices that make teams faster over time.',
    author: 'Jasper Young',
    category: 'Development',
    tags: ['API', 'Product', 'Architecture'],
    likes: 512,
    comments: 68,
  },
];

const DUMMY_POSTS = DUMMY_POST_BLUEPRINTS.map((post, index) => ({
  id: index + 1,
  content: 'Long content here...',
  date: new Date(Date.now() - index * 12 * 60 * 60 * 1000).toISOString(),
  image: TOPIC_IMAGES[post.category],
  ...post,
}));

const mergePosts = (dbPosts = []) => {
  const seen = new Set();

  return [...dbPosts, ...DUMMY_POSTS]
    .filter((post) => {
      const key = post.id ?? post.title;
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort((left, right) => {
      const leftDate = new Date(left.date || left.created_at || 0).getTime();
      const rightDate = new Date(right.date || right.created_at || 0).getTime();
      return rightDate - leftDate;
    });
};

export const getPosts = async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    console.log('[posts:getPosts] raw db rows:', Array.isArray(data) ? data.length : 0);
    console.log('[posts:getPosts] raw db titles:', Array.isArray(data) ? data.map((post) => post.title).slice(0, 8) : []);

    // If table doesn't exist yet, return dummy data to fulfill user's "populate with sample posts for now"
    if (error && error.code === '42P01') {
      console.log('[posts:getPosts] table missing, using dummy posts:', DUMMY_POSTS.length);
      return res.status(200).json(mergePosts());
    }

    if (error) throw error;
    const mergedPosts = mergePosts(data || []);
    console.log('[posts:getPosts] merged posts:', mergedPosts.length);
    console.log('[posts:getPosts] merged ids:', mergedPosts.map((post) => post.id).slice(0, 12));
    res.status(200).json(mergedPosts);
  } catch (err) {
    console.error('[posts:getPosts] error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[posts:getPostById] requested id:', id);
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();

    if (error && error.code === '42P01') {
      const post = DUMMY_POSTS.find(p => p.id == id);
      console.log('[posts:getPostById] table missing, dummy match:', Boolean(post));
      return post ? res.status(200).json(post) : res.status(404).json({ error: 'Post not found' });
    }

    if (error && error.code === 'PGRST116') {
      const post = DUMMY_POSTS.find(p => p.id == id);
      console.log('[posts:getPostById] no db match, dummy match:', Boolean(post));
      return post ? res.status(200).json(post) : res.status(404).json({ error: 'Post not found' });
    }

    if (error) throw error;
    console.log('[posts:getPostById] db title:', data?.title || null);
    res.status(200).json(data || DUMMY_POSTS.find(p => p.id == id) || null);
  } catch (err) {
    console.error('[posts:getPostById] error:', err.message);
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

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = PostSchema.partial().parse(req.body);
    const user = req.user;

    const { data: post, error: fetchError } = await supabase.from('posts').select('author_id').eq('id', id).single();
    if (fetchError) throw fetchError;

    if (post.author_id !== user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const { data, error } = await supabase.from('posts').update(validatedData).eq('id', id).select();
    if (error) throw error;
    res.status(200).json({ message: 'Post updated', data });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const { data: post, error: fetchError } = await supabase.from('posts').select('author_id').eq('id', id).single();
    if (fetchError) throw fetchError;

    if (post.author_id !== user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
