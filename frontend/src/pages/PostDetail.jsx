import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Eye, Heart, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CommentsSection } from '../components/CommentsSection';
import { topicSlug } from '../data/topics';

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = document.getElementById('main-scroll-container');
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const value = scrollHeight <= clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      setProgress(Math.min(100, value));
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return <div className="reading-progress" style={{ width: `${progress}%` }} />;
}

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const user = JSON.parse(localStorage.getItem('bms_user') || 'null');
  const token = localStorage.getItem('bms_token');

  useEffect(() => {
    fetch(`http://localhost:5000/api/posts/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then((data) => {
        setPost(data);
        setLikes(data.likes || 0);
      })
      .catch((fetchError) => setError(fetchError.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete');
      navigate('/');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const readingTime = post ? Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200)) : null;

  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
        <div className="editor-loader" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#737373]">Opening story</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl border border-[#111111] px-5 py-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#CC0000]">Record missing</p>
        <p className="mt-3 font-serif text-sm text-[#525252]">{error || 'Post not found.'}</p>
        <Link to="/" className="btn-secondary mt-6">Back home</Link>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />

      <article className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#111111] no-underline hover:text-[#CC0000]">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Back to feed
          </Link>
        </div>

        <header className="border-b border-[#111111] pb-8">
          <Link to={`/topics/${topicSlug(post.category)}`} className="category-pill">
            {post.category}
          </Link>
          <h1 className="mt-5 font-display text-5xl leading-[0.9] tracking-tight text-[#111111] md:text-7xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl font-serif text-lg leading-relaxed text-[#525252]">{post.description}</p>

          <div className="mt-8 grid grid-cols-1 border border-[#111111] md:grid-cols-4">
            <div className="border-b border-[#111111] px-4 py-4 md:border-b-0 md:border-r md:border-[#111111]">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373]">Byline</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">{post.author}</p>
            </div>
            <div className="border-b border-[#111111] px-4 py-4 md:border-b-0 md:border-r md:border-[#111111]">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373]">Date</p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">
                {new Date(post.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="border-b border-[#111111] px-4 py-4 md:border-b-0 md:border-r md:border-[#111111]">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373]">Read time</p>
              <p className="mt-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">
                <Clock className="h-4 w-4" strokeWidth={1.5} />
                {readingTime} min
              </p>
            </div>
            <div className="px-4 py-4">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373]">Engagement</p>
              <div className="mt-2 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.14em] text-[#111111]">
                <button
                  type="button"
                  onClick={() => {
                    setLiked((value) => !value);
                    setLikes((value) => value + (liked ? -1 : 1));
                  }}
                  className="inline-flex items-center gap-2 hover:text-[#CC0000]"
                >
                  <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} strokeWidth={1.5} />
                  {likes}
                </button>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                  {post.comments || 0}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4" strokeWidth={1.5} />
                  {Math.floor(Math.random() * 900) + 100}
                </span>
              </div>
            </div>
          </div>

          {user && post.author_id === user.id ? (
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to={`/edit/${id}`} className="btn-secondary">
                <Pencil className="h-4 w-4" strokeWidth={1.5} />
                Edit
              </Link>
              <button type="button" onClick={handleDelete} className="btn-secondary">
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                Delete
              </button>
            </div>
          ) : null}
        </header>

        {post.image ? (
          <figure className="my-8 border border-[#111111] bg-[#E5E5E5]">
            <img src={post.image} alt={post.title} className="max-h-[520px] w-full object-cover grayscale" />
            <figcaption className="border-t border-[#111111] px-4 py-3 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[#737373]">
              Fig. 1.1
            </figcaption>
          </figure>
        ) : null}

        {post.tags?.length ? (
          <div className="mb-8 flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-chip">{tag}</span>
            ))}
          </div>
        ) : null}

        <section className="border border-[#111111] bg-[#F9F9F7]">
          <div className="border-b border-[#111111] px-5 py-4">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[#737373]">Full report</p>
          </div>
          <div className="px-5 py-6">
            <div className="newsprint-prose whitespace-pre-wrap">{post.content}</div>
          </div>
        </section>

        <section className="mt-8 border border-[#111111] px-5 py-5">
          <p className="font-display text-3xl text-[#111111]">Have a response?</p>
          <p className="mt-3 font-serif text-sm leading-relaxed text-[#525252]">
            Add your own perspective or publish a related piece from the writing desk.
          </p>
          <div className="mt-5">
            <Link to="/write" className="btn-primary">Write a story</Link>
          </div>
        </section>

        <CommentsSection postId={post.id} postAuthorId={post.author_id} />
      </article>
    </>
  );
}
