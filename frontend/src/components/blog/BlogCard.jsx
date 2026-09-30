import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';

export const BlogCard = ({ post, featured = false }) => {
  if (!post) return null;

  return (
    <article
      className={`group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-card transition-all duration-300 hover:border-slate-300 flex flex-col h-full w-full ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      {/* Cover Image */}
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          featured ? 'md:col-span-7 aspect-16/10 md:aspect-auto' : 'aspect-16/10'
        }`}
      >
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-xs text-amber-400 text-[10px] font-black uppercase tracking-wider rounded-lg border border-amber-400/20">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className={`p-5 sm:p-6 flex flex-col justify-between flex-1 ${
          featured ? 'md:col-span-5 md:py-8' : ''
        }`}
      >
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <FiCalendar className="w-3.5 h-3.5" />
              <span>
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <FiClock className="w-3.5 h-3.5" />
              <span>{post.readTime || 5} min read</span>
            </span>
          </div>

          <h3
            className={`font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 ${
              featured ? 'text-lg sm:text-2xl font-display' : 'text-base font-display'
            }`}
          >
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p
            className={`text-slate-600 text-xs leading-relaxed line-clamp-3 ${
              featured ? 'sm:text-sm' : ''
            }`}
          >
            {post.excerpt}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500">
            By {post.authorName || 'MotoZone Team'}
          </span>

          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors"
          >
            <span>Read Article</span>
            <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
