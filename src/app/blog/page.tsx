'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCMS } from '@/contexts/cms-context';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { FlowLines } from '@/components/website/FlowLines';
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export default function PublicBlogPage() {
  const { posts } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const publishedPosts = useMemo(() => {
    return posts.filter((p) => p.status === 'published');
  }, [posts]);

  const categories = useMemo(() => {
    const list = [
      'ALL',
      'Market Intelligence',
      'Investment Guide',
      'Construction & Architecture',
      'Legal & Verification',
      'Society Spotlight',
    ];
    return list;
  }, []);

  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      if (selectedCategory !== 'ALL' && post.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [publishedPosts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts.filter((p) => p.id !== featuredPost?.id);

  return (
    <div className="relative min-h-screen bg-[#FEFEFE] text-[#000000] pt-6 pb-20 overflow-hidden">
      <FlowLines opacity={0.03} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Market Intelligence & Articles', href: '/blog' },
          ]}
        />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E5E5E5] pb-8">
          <div>
            <SectionHeading
              eyebrow="Empirical Real Estate Editorial"
              title="Market Intelligence & Construction Insights"
              subtitle="Empirical transaction data, Wah Cantt rate indices, legal verification protocols, and turnkey construction BOQs by Asad Land Holdings."
            />
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="w-4 h-4 text-[#CCCCCC] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Search analysis, BOQ, NOC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F9F9F9] border border-[#E5E5E5] rounded-none focus:border-[#000000] focus:bg-white transition-colors outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                  : 'bg-white text-[#666666] border-[#E5E5E5] hover:border-[#000000] hover:text-[#000000]'
              }`}
            >
              {cat === 'ALL' ? 'All Briefings' : cat}
            </button>
          ))}
        </div>

        {/* Featured Hero Post */}
        {featuredPost && !searchQuery && selectedCategory === 'ALL' && (
          <div className="group border border-[#000000] bg-white grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-slate-100 min-h-[320px]">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#000000] text-[#FEFEFE] text-[10px] font-mono uppercase tracking-widest px-3 py-1 font-bold">
                ⭐ Featured Analysis
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono text-[#CCCCCC]">
                  <span className="text-[#000000] font-semibold uppercase">{featuredPost.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {featuredPost.readTimeMinutes} min read
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] leading-tight group-hover:underline">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h3>

                <p className="text-sm text-[#666666] leading-relaxed line-clamp-3 sm:line-clamp-4">
                  {featuredPost.excerpt}
                </p>
              </div>

              {/* Author & CTA */}
              <div className="pt-6 border-t border-[#E5E5E5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden relative">
                    <Image
                      src={featuredPost.author?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256'}
                      alt={featuredPost.author?.name || 'Author'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#000000]">{featuredPost.author?.name}</div>
                    <div className="text-[10px] text-[#CCCCCC]">{featuredPost.author?.role}</div>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-bold text-[#000000] group-hover:translate-x-1 transition-transform"
                >
                  Read Full <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Articles */}
        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col justify-between bg-white border border-[#E5E5E5] hover:border-[#000000] transition-colors p-5 space-y-5"
              >
                <div className="space-y-4">
                  {/* Cover */}
                  <div className="aspect-[16/10] relative bg-slate-100 overflow-hidden border border-[#E5E5E5]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#000000]/90 text-[#FEFEFE] text-[9px] font-mono uppercase tracking-widest px-2 py-0.5">
                      {post.category}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#CCCCCC]">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTimeMinutes} min
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h4 className="text-base sm:text-lg font-bold text-[#000000] group-hover:underline line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h4>

                  <p className="text-xs text-[#666666] line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#CCCCCC]">
                    By <strong>{post.author?.name || 'Asad Ali'}</strong>
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-mono uppercase tracking-wider text-[11px] font-bold text-[#000000] group-hover:translate-x-1 transition-transform"
                  >
                    Read <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-[#CCCCCC] p-8 space-y-3">
            <BookOpen className="w-8 h-8 text-[#CCCCCC] mx-auto" />
            <h3 className="text-base font-bold text-[#000000]">No articles found</h3>
            <p className="text-xs text-[#666666]">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-1.5 bg-[#000000] text-[#FEFEFE] text-xs font-mono uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Newsletter & Direct Market Alert Subscription */}
        <div className="bg-[#000000] text-[#FEFEFE] p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="text-[11px] font-mono text-[#CCCCCC] uppercase tracking-widest">
              Direct Broker Intelligence
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Get Notified on Verified Rate Drops in Wah & Islamabad
            </h3>
            <p className="text-sm text-[#CCCCCC] leading-relaxed">
              We send monthly empirical transaction digests, upcoming RDA NOC notices, and itemized construction material price sheets. Zero spam.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to Asad Land Holdings Market Pulse.');
              }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <input
                type="email"
                placeholder="Enter your email address or WhatsApp..."
                required
                className="px-4 py-3 bg-[#111111] border border-[#333333] text-xs text-white placeholder:text-[#A3A3A3] outline-none flex-1 focus:border-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#FEFEFE] text-[#000000] text-xs font-mono uppercase font-bold tracking-wider hover:bg-[#E5E5E5] transition-colors whitespace-nowrap"
              >
                Subscribe Free
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
