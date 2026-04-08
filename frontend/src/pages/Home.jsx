import React, { useState, useEffect } from 'react';
import { PostCard } from '../components/post/PostCard';
import { TrendingUp, Clock, Loader } from 'lucide-react';

export function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-6">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end mb-10 pb-8 border-b border-border">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-main mb-4">
            Insights & Ideas
          </h1>
          <p className="text-text-muted text-lg">
            A minimal, distraction-free space for creators to write and readers to explore thoughtful ideas.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="btn-secondary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Trending</span>
          </button>
          <button className="btn-secondary">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Latest</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="text-center p-8 text-red-400 glass-panel">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
