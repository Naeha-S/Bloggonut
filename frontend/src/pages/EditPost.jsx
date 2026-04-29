import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookMarked, Loader } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const CATEGORIES = ['Technology', 'Design', 'Development', 'AI', 'Startup', 'Lifestyle'];

export function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
    image: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

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
          tags: data.tags ? data.tags.join(', ') : '',
        });
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('bms_token');
      if (!token) throw new Error('You must be logged in to edit a post.');

      const tagsArray = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);

      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, tags: tagsArray }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to edit post');
      navigate(`/post/${id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
        <div className="editor-loader" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#737373]">Opening copy desk</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <Link to={`/post/${id}`} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#111111] no-underline hover:text-[#CC0000]">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to post
        </Link>
      </div>

      <header className="newsprint-header">
        <p className="news-kicker">Copy desk</p>
        <h1 className="newsprint-title mt-4">Edit the story.</h1>
        <p className="newsprint-dek">Revise the headline, metadata, and body while keeping the published structure intact.</p>
      </header>

      {error ? (
        <div className="mb-6 border border-[#111111] bg-[#F7E2E2] px-4 py-4">
          <p className="font-serif text-sm text-[#404040]">{error}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="newsprint-form border border-[#111111]">
        <div className="border-b border-[#111111] px-5 py-5">
          <label htmlFor="edit-title">Headline</label>
          <input
            id="edit-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-3 w-full border-0 bg-transparent pb-2 font-display text-5xl leading-[0.95] tracking-tight text-[#111111] outline-none"
            required
          />
        </div>

        <div className="border-b border-[#111111] px-5 py-5">
          <label htmlFor="edit-description">Deck</label>
          <input
            id="edit-description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-base mt-3"
            required
          />
        </div>

        <div className="grid grid-cols-1 border-b border-[#111111] lg:grid-cols-12">
          <div className="border-b border-[#111111] px-5 py-5 lg:col-span-6 lg:border-b-0 lg:border-r lg:border-[#111111]">
            <label htmlFor="edit-image">Image URL</label>
            <input
              id="edit-image"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input-base mt-3"
            />
          </div>

          <div className="grid gap-5 px-5 py-5 lg:col-span-6">
            <div>
              <label htmlFor="edit-category">Category</label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-base mt-3"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-tags">Tags</label>
              <input
                id="edit-tags"
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input-base mt-3"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-[#111111] px-5 py-5">
          <label htmlFor="edit-content">Story body</label>
          <textarea
            id="edit-content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="mt-3 min-h-[480px] w-full border border-[#111111] bg-transparent px-4 py-4 font-serif text-base leading-relaxed text-[#404040] outline-none focus:bg-[#F5F5F5]"
            required
          />
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader className="h-4 w-4 animate-spin" strokeWidth={1.5} /> : <BookMarked className="h-4 w-4" strokeWidth={1.5} />}
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
