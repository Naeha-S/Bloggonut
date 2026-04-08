import React from 'react';
import { MessageSquare, Heart, Bookmark, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PostCard({ post }) {
  return (
    <article className="card-panel group cursor-pointer overflow-hidden flex flex-col hover:border-text-muted transition-colors">
      {post.image && (
        <div className="relative h-48 sm:h-52 overflow-hidden border-b border-border">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author}&backgroundColor=transparent`} 
            alt={post.author} 
            className="w-6 h-6 rounded-full border border-border"
          />
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-medium text-text-main hover:underline">{post.author}</span>
            <span>•</span>
            <span>{new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2 text-text-main group-hover:text-primary-500 transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-text-muted text-sm mb-4 line-clamp-3 flex-1">
          {post.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 text-[10px] font-semibold tracking-wider uppercase bg-surface-hover text-text-main rounded">
            {post.category}
          </span>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between text-text-muted">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 hover:text-text-main transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-medium">{post.likes || 0}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-text-main transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-medium">{post.comments || 0}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-surface-hover hover:text-text-main transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
