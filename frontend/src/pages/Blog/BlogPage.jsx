import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../../components/common/Container';
import Breadcrumb from '../../components/common/Breadcrumb';
import SectionTitle from '../../components/common/SectionTitle';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { BlogCard, BlogSearch, BlogCategories, BlogSkeleton } from '../../components/blog';
import { useBlog } from '../../hooks/useBlog';
import { FiBookOpen } from 'react-icons/fi';

export const BlogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;

  const {
    posts,
    categories,
    pagination,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    fetchPosts,
  } = useBlog({
    initialCategory,
    initialSearch,
    initialPage,
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchParams({
      category: category !== 'All' ? category : '',
      page: '1',
      ...(searchQuery ? { search: searchQuery } : {}),
    });
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
    setSearchParams({
      category: selectedCategory !== 'All' ? selectedCategory : '',
      page: '1',
      ...(term ? { search: term } : {}),
    });
  };

  const handlePageChange = (page) => {
    setSearchParams({
      category: selectedCategory !== 'All' ? selectedCategory : '',
      page: String(page),
      ...(searchQuery ? { search: searchQuery } : {}),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featuredPost = posts.length > 0 && selectedCategory === 'All' && !searchQuery ? posts[0] : null;
  const standardPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="py-8 space-y-8 bg-slate-50 min-h-screen">
      <Container size="wide">
        <Breadcrumb items={[{ label: 'Blog & Technical Guides' }]} />

        <SectionTitle
          title="Motorcycle Tech & Maintenance Guides"
          subtitle="Expert tutorials, maintenance checklists, track day insights, and gear safety standards."
          badge="Rider Knowledge Hub"
        />

        {/* Filter and Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <BlogCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          <BlogSearch value={searchQuery} onSearch={handleSearch} />
        </div>

        {/* Featured Hero Article */}
        {featuredPost && !isLoading && (
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
              Featured Editorial
            </span>
            <BlogCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <EmptyState
              icon={FiBookOpen}
              title="No Articles Found"
              description={`No guides matched "${searchQuery || selectedCategory}". Try searching for brakes, chain, helmet, or safety.`}
              actionLabel="View All Guides"
              onAction={() => handleCategoryChange('All')}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {standardPosts.map((post) => (
                <BlogCard key={post._id || post.slug} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-4 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default BlogPage;
