import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Eye, Share2, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { topicSlug } from '../../data/topics';

const MotionLink = motion(Link);

export function PostCard({ post, index = 0, featured = false, compact = false }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const navigate = useNavigate();

  const openTopic = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/topics/${topicSlug(post.category)}`);
  };

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  // Featured card is larger with prominent image
  if (featured) {
    return (
      <MotionLink
        to={`/post/${post.id}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -12 }}
        className="card-panel group cursor-pointer overflow-hidden flex flex-col h-full hover-lift depth-layer-3 relative"
      >
        {/* Featured Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 z-20 signature-badge"
        >
          Featured
        </motion.div>

        {/* Large Image Section */}
        {post.image && (
          <div className="relative h-80 overflow-hidden bg-surface-secondary">
            <motion.img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-text-main/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        
        {/* Content Section */}
        <div className="p-8 flex-1 flex flex-col">
          {/* Category Badge */}
          <motion.div className="flex items-center gap-2 mb-4">
            <motion.button 
              type="button"
              onClick={openTopic}
              className="px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase bg-surface-secondary text-accent rounded-full border border-secondary/30"
              whileHover={{ scale: 1.05 }}
            >
              {post.category}
            </motion.button>
            <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
          </motion.div>

          {/* Title - Larger */}
          <motion.h2 
            className="text-3xl font-display font-semibold mb-4 text-text-main group-hover:text-accent transition-colors leading-snug"
          >
            {post.title}
          </motion.h2>

          {/* Description - Expanded */}
          <p className="text-text-muted text-base mb-6 flex-1 leading-relaxed font-light line-clamp-4">
            {post.description}
          </p>

          {/* Author & Date */}
          <div className="flex items-center gap-3 mb-6 border-t border-border pt-6">
            <motion.img 
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author}&backgroundColor=transparent`} 
              alt={post.author} 
              className="w-10 h-10 rounded-full border-2 border-border bg-surface-secondary"
              whileHover={{ scale: 1.15 }}
            />
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="font-semibold text-text-main hover:text-accent transition-colors cursor-pointer">{post.author}</span>
              <span className="text-text-light">•</span>
              <span>{new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Engagement Footer */}
          <div className="flex items-center justify-between text-text-muted">
            <div className="flex items-center gap-6">
              <motion.button 
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors ${
                  isLiked ? 'text-accent' : 'hover:text-accent'
                }`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-semibold">{likeCount}</span>
              </motion.button>
              
              <motion.button 
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">{post.comments || 0}</span>
              </motion.button>

              <motion.button 
                className="flex items-center gap-1.5 hover:text-accent transition-colors"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="w-5 h-5" />
                <span className="text-sm font-semibold">{Math.floor(Math.random() * 1000) + 100}</span>
              </motion.button>
            </div>
            
            <motion.button 
              className="p-2 rounded-xl hover:bg-surface-secondary text-text-muted hover:text-accent transition-colors"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(event) => event.preventDefault()}
            >
              <Bookmark className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </MotionLink>
    );
  }

  // Compact card is smaller for sidebar layouts
  if (compact) {
    return (
      <MotionLink
        to={`/post/${post.id}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ x: 8 }}
        className="card-panel group cursor-pointer overflow-hidden flex gap-4 hover-lift depth-layer-1 p-4"
      >
        {/* Small Image */}
        {post.image && (
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-2xl bg-surface-secondary">
            <motion.img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
            />
          </div>
        )}
        
        {/* Compact Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Category */}
          <button
            type="button"
            onClick={openTopic}
            className="text-xs font-semibold text-accent uppercase tracking-wide mb-1.5 text-left"
          >
            {post.category}
          </button>

          {/* Title - Compact */}
          <h3 className="text-sm font-display font-semibold text-text-main group-hover:text-accent transition-colors line-clamp-2 mb-1.5">
            {post.title}
          </h3>

          {/* Author & Engagement - Inline */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-medium">{post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              <Heart className="w-3 h-3" />
              {likeCount}
            </span>
          </div>
        </div>
      </MotionLink>
    );
  }

  // Default card - standard size
  return (
    <MotionLink
      to={`/post/${post.id}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="card-panel group cursor-pointer overflow-hidden flex flex-col h-full hover-lift depth-layer-2"
    >
      {/* Image Section */}
      {post.image && (
        <div className="relative h-56 sm:h-60 overflow-hidden bg-surface-secondary">
          <motion.img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-text-main/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      {/* Content Section */}
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        {/* Author & Date */}
        <div className="flex items-center gap-3 mb-4">
          <motion.img 
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${post.author}&backgroundColor=transparent`} 
            alt={post.author} 
            className="w-8 h-8 rounded-full border-2 border-border bg-surface-secondary"
            whileHover={{ scale: 1.1 }}
          />
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-medium text-text-main hover:text-accent transition-colors cursor-pointer">{post.author}</span>
            <span className="text-text-light">•</span>
            <span>{new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Title */}
        <motion.h2 
          className="text-xl font-display font-semibold mb-3 text-text-main group-hover:text-accent transition-colors line-clamp-2 leading-snug"
        >
          {post.title}
        </motion.h2>

        {/* Description */}
        <p className="text-text-muted text-sm mb-4 line-clamp-3 flex-1 leading-relaxed font-light">
          {post.description}
        </p>

        {/* Category Badge */}
        <motion.div className="flex items-center gap-2 mb-5">
          <motion.button 
            type="button"
            onClick={openTopic}
            className="px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase bg-surface-secondary text-accent rounded-full border border-secondary/30"
            whileHover={{ scale: 1.05 }}
          >
            {post.category}
          </motion.button>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent mb-5" />

        {/* Engagement Footer */}
        <div className="flex items-center justify-between text-text-muted">
          <div className="flex items-center gap-5">
            <motion.button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${
                isLiked ? 'text-accent' : 'hover:text-accent'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{likeCount}</span>
            </motion.button>
            
            <motion.button 
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{post.comments || 0}</span>
            </motion.button>

            <motion.button 
              className="flex items-center gap-1.5 hover:text-accent transition-colors text-xs"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
              <span className="font-medium">{Math.floor(Math.random() * 1000) + 100}</span>
            </motion.button>
          </div>
          
          <motion.button 
            className="p-1.5 rounded-xl hover:bg-surface-secondary text-text-muted hover:text-accent transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(event) => event.preventDefault()}
          >
            <Bookmark className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </MotionLink>
  );
}
