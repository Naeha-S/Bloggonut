import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, Loader, PenTool, BookMarked } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function EditPost() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
    image: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Technology', 'Design', 'Development', 'AI', 'Startup', 'Lifestyle'];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        
        setFormData({
          title: data.title || '',
          description: data.description || '',
          content: data.content || '',
          category: data.category || 'Technology',
          image: data.image || '',
          tags: data.tags ? data.tags.join(', ') : ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('bms_token');
      if (!token) throw new Error('You must be logged in to edit a post.');

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to edit post');
      
      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto py-12 px-4"
    >
      <motion.div variants={itemVariants}>
        <Link to={`/post/${id}`} className="inline-flex items-center gap-2 text-text-muted hover:text-accent mb-12 transition-colors text-sm font-semibold group">
          <motion.span whileHover={{ x: -4 }}>
            <ArrowLeft className="w-4 h-4" />
          </motion.span>
          <span>Back to Post</span>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <PenTool className="w-6 h-6 text-accent" />
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-text-main">Edit Your Story</h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: error ? 1 : 0, y: error ? 0 : -10 }}
        className="mb-6"
      >
        {error && (
          <div className="bg-rose-50/80 text-rose-700 p-4 rounded-2xl text-sm border border-rose-200 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-rose-200 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-rose-700 text-xs font-bold">!</span>
            </div>
            <p className="font-light">{error}</p>
          </div>
        )}
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-subtle">Article Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-transparent text-4xl md:text-5xl font-display font-semibold text-text-main placeholder:text-text-subtle focus:outline-none border-b-2 border-border focus:border-accent transition-colors pb-4"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-text-subtle">Subtitle</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-transparent text-xl text-text-muted placeholder:text-text-subtle focus:outline-none border-b border-border focus:border-accent transition-colors pb-3"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-text-subtle flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-accent" />
              Cover Image
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input-base w-full py-3 px-4"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-text-subtle">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-base w-full py-3 px-4 appearance-none cursor-pointer"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-widest text-text-subtle">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-base w-full py-3 px-4"
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-8 border-t border-border space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-text-subtle">Your Story</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full min-h-[500px] text-lg bg-surface rounded-xl border border-border px-6 py-6 text-text-main placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-all leading-relaxed resize-y font-sans"
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-end gap-4 pt-4 border-t border-border">
          <motion.button type="button" onClick={() => navigate(-1)} className="btn-secondary py-3 px-6">
            Cancel
          </motion.button>
          <motion.button type="submit" disabled={loading} className="btn-primary py-3 px-8 flex items-center gap-2 font-semibold text-base">
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <BookMarked className="w-5 h-5" />}
            <span>Save Changes</span>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
