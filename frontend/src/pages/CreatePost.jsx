import React, { useState } from 'react';
import { ArrowLeft, BookMarked, Image as ImageIcon, Loader, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = ['Technology', 'Design', 'Development', 'AI', 'Startup', 'Lifestyle'];

export function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
    image: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image: event.target.result }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === 'dragenter' || event.type === 'dragover');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files?.[0]) {
      handleImageUpload(event.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('bms_token');
      if (!token) throw new Error('You must be logged in to create a post.');

      const tagsArray = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, tags: tagsArray }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create post');
      navigate('/');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#111111] no-underline hover:text-[#CC0000]">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to stories
        </Link>
      </div>

      <header className="newsprint-header">
        <p className="news-kicker">Authoring desk</p>
        <h1 className="newsprint-title mt-4">Compose a new story.</h1>
        <p className="newsprint-dek">Write directly into the edition with a sharper print-first composition and structured metadata.</p>
      </header>

      {error ? (
        <div className="mb-6 border border-[#111111] bg-[#F7E2E2] px-4 py-4">
          <p className="font-serif text-sm text-[#404040]">{error}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="newsprint-form border border-[#111111]">
        <div className="border-b border-[#111111] px-5 py-5">
          <label htmlFor="post-title">Headline</label>
          <input
            id="post-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Your front-page headline"
            className="mt-3 w-full border-0 bg-transparent pb-2 font-display text-5xl leading-[0.95] tracking-tight text-[#111111] outline-none placeholder:text-[#A3A3A3]"
            required
          />
        </div>

        <div className="border-b border-[#111111] px-5 py-5">
          <label htmlFor="post-description">Deck</label>
          <input
            id="post-description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="A concise summary beneath the headline"
            className="input-base mt-3"
            required
          />
        </div>

        <div className="grid grid-cols-1 border-b border-[#111111] lg:grid-cols-12">
          <div className="border-b border-[#111111] px-5 py-5 lg:col-span-6 lg:border-b-0 lg:border-r lg:border-[#111111]">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#111111]" strokeWidth={1.5} />
              <label>Cover image</label>
            </div>

            {formData.image ? (
              <div className="mt-4">
                <div className="relative border border-[#111111] bg-[#E5E5E5]">
                  <img src={formData.image} alt="Preview" className="h-72 w-full object-cover grayscale" />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center border border-[#111111] bg-[#F9F9F7] text-[#111111] hover:bg-[#111111] hover:text-[#F9F9F7]"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`mt-4 border border-dashed border-[#111111] px-6 py-10 text-center ${dragActive ? 'bg-[#F5F5F5]' : ''}`}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => event.target.files?.[0] && handleImageUpload(event.target.files[0])}
                />
                <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center gap-3">
                  <Upload className="h-8 w-8 text-[#111111]" strokeWidth={1.5} />
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#111111]">Drop image or click to upload</span>
                  <span className="font-serif text-sm text-[#525252]">JPG, PNG, or WebP up to 5MB.</span>
                </label>
              </div>
            )}
          </div>

          <div className="grid gap-5 px-5 py-5 lg:col-span-6">
            <div>
              <label htmlFor="post-category">Category</label>
              <select
                id="post-category"
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
              <label htmlFor="post-tags">Tags</label>
              <input
                id="post-tags"
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="technology, ai, design"
                className="input-base mt-3"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-[#111111] px-5 py-5">
          <label htmlFor="post-content">Story body</label>
          <textarea
            id="post-content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write the full article here"
            className="mt-3 min-h-[480px] w-full border border-[#111111] bg-transparent px-4 py-4 font-serif text-base leading-relaxed text-[#404040] outline-none focus:bg-[#F5F5F5]"
            required
          />
          <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-[#737373]">
            {formData.content.length} characters
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate('/')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader className="h-4 w-4 animate-spin" strokeWidth={1.5} /> : <BookMarked className="h-4 w-4" strokeWidth={1.5} />}
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
