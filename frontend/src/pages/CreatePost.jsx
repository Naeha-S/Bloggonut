import React, { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Send, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
    image: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Technology', 'Design', 'Development', 'AI', 'Startup', 'Lifestyle'];

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
      if (!token) throw new Error('You must be logged in to create a post.');

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
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
      if (!response.ok) throw new Error(data.error || 'Failed to create post');
      
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main mb-8 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-md text-sm border border-red-500/20">
            {error}
          </div>
        )}
        
        {/* Header Setup */}
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Article Title"
            className="w-full bg-transparent text-4xl md:text-5xl font-bold text-text-main placeholder:text-border focus:outline-none placeholder:font-bold"
            required
          />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="A short description or subtitle..."
            className="w-full bg-transparent text-xl md:text-2xl text-text-muted placeholder:text-border focus:outline-none"
            required
          />
        </div>

        {/* Cover Image & Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Cover Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="input-base w-full py-2 pl-9 pr-3"
              />
            </div>
            {formData.image && (
              <div className="mt-2 h-32 w-full rounded-lg overflow-hidden border border-border">
                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-base w-full py-2 px-3 appearance-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Technology, Frontend, Design..."
                className="input-base w-full py-2 px-3"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-6 border-t border-border">
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Start writing your amazing article here..."
            className="w-full min-h-[400px] text-lg bg-transparent text-text-main placeholder:text-text-muted/50 focus:outline-none leading-relaxed resize-y"
            required
          />
        </div>

        {/* Call to Action */}
        <div className="flex justify-end pt-4 border-t border-border">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary py-2.5 px-6"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
