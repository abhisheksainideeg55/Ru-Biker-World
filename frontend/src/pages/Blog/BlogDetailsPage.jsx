import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import { blogService } from '../../services/blogService';
import BlogCard from '../../components/blog/BlogCard';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowLeft,
  FiTag,
  FiShare2,
  FiBookOpen,
} from 'react-icons/fi';

export const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await blogService.getBlogPostBySlug(slug);
        if (res && res.data) {
          setPost(res.data);
          // Fetch related
          const relRes = await blogService.getRelatedPosts(slug);
          if (relRes && relRes.data) {
            setRelatedPosts(relRes.data);
          }
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load article.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-slate-50 min-h-screen">
        <Container size="wide">
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="w-24 h-4 bg-slate-200 rounded-md" />
            <div className="w-3/4 h-10 bg-slate-200 rounded-xl" />
            <div className="aspect-16/9 bg-slate-200 rounded-3xl" />
            <div className="space-y-3 pt-6">
              <div className="w-full h-4 bg-slate-200 rounded-md" />
              <div className="w-full h-4 bg-slate-200 rounded-md" />
              <div className="w-2/3 h-4 bg-slate-200 rounded-md" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-16 bg-slate-50 min-h-screen">
        <Container size="wide">
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
            <FiBookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Article Not Found</h2>
            <p className="text-xs text-slate-500">{error || 'This article does not exist or has been archived.'}</p>
            <Link
              to="/blog"
              className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl inline-block"
            >
              Back to Technical Guides
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen space-y-12">
      <Container size="wide">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumb & Navigation Header */}
          <div className="flex items-center justify-between">
            <Breadcrumb
              items={[
                { label: 'Blog', path: '/blog' },
                { label: post.category, path: `/blog?category=${post.category}` },
                { label: post.title },
              ]}
            />

            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>All Guides</span>
            </Link>
          </div>

          {/* Article Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-card space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="px-3.5 py-1 bg-amber-100 text-amber-950 text-xs font-black uppercase tracking-wider rounded-lg border border-amber-300">
                  {post.category}
                </span>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  <FiShare2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-black flex items-center justify-center text-xs">
                    {post.authorName ? post.authorName.charAt(0) : 'M'}
                  </div>
                  <span className="font-bold text-slate-900">{post.authorName}</span>
                </div>

                <span>·</span>

                <div className="flex items-center gap-1">
                  <FiCalendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-IN', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <span>·</span>

                <div className="flex items-center gap-1">
                  <FiClock className="w-3.5 h-3.5" />
                  <span>{post.readTime || 5} min read</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Excerpt Lead Paragraph */}
            <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border-l-4 border-amber-500 text-slate-800 font-semibold text-sm sm:text-base leading-relaxed">
              {post.excerpt}
            </div>

            {/* Article Content Body */}
            <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
              {post.content.split('\n\n').map((para, idx) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-lg sm:text-xl font-black text-slate-950 pt-4 font-display">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }

                if (trimmed.startsWith('#### ')) {
                  return (
                    <h4 key={idx} className="text-base sm:text-lg font-bold text-slate-900 pt-2 font-display">
                      {trimmed.replace('#### ', '')}
                    </h4>
                  );
                }

                return (
                  <p key={idx} className="leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Tags Footer */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                <FiTag className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500">Tags:</span>
                {post.tags.map((tag, i) => (
                  <Link
                    key={i}
                    to={`/blog?search=${tag}`}
                    className="px-3 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-black text-slate-950 font-display">
                  Related Technical Articles
                </h3>
                <Link
                  to="/blog"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  Explore All Guides →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                {relatedPosts.map((rel) => (
                  <BlogCard key={rel._id || rel.slug} post={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default BlogDetailsPage;
