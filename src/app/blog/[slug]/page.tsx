'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCMS } from '@/contexts/cms-context';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { FlowLines } from '@/components/website/FlowLines';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Phone,
  MessageSquare,
  Building,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function PublicBlogPostDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { posts, properties } = useCMS();

  const post = posts.find((p) => p.slug === slug && p.status === 'published');

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((p) => p.id !== post.id && p.status === 'published')
    .slice(0, 3);

  const relatedProperties = properties.slice(0, 2);

  const whatsappInquiryUrl = `https://wa.me/923005123456?text=${encodeURIComponent(
    `Hello Asad Land Holdings, I read your briefing "${post.title}" on the website and would like further details regarding verified real estate options.`
  )}`;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FEFEFE] text-[#000000] pt-6 pb-20 overflow-hidden">
      <FlowLines opacity={0.03} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Market Intelligence', href: '/blog' },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />

        {/* Article Header */}
        <div className="space-y-6 border-b border-[#E5E5E5] pb-8">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#000000] text-[#FEFEFE] text-[10px] font-mono uppercase tracking-widest font-bold">
              {post.category}
            </span>
            <span className="text-xs font-mono text-[#888888] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {post.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#000000] leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-[#666666] leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Author & Publish Date Row */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden relative border border-[#000000]">
                <Image
                  src={post.author?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256'}
                  alt={post.author?.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-[#000000]">{post.author?.name}</div>
                <div className="text-xs text-[#888888]">{post.author?.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#888888]">
                Published {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>

              <button
                onClick={handleShare}
                className="p-2 border border-[#E5E5E5] hover:border-[#000000] text-[#000000] rounded-none transition-colors"
                title="Share Article"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        <div className="aspect-[16/9] relative bg-slate-100 overflow-hidden border border-[#000000] shadow-sm">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <article className="prose prose-lg max-w-none text-[#1A1A1A] leading-relaxed font-sans space-y-6">
          <div className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed">
            {post.content}
          </div>
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-[#E5E5E5] flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono uppercase text-[#888888]">Topics:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-[#F5F5F5] border border-[#E5E5E5] text-xs font-mono text-[#333333]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Box & Consultation CTA */}
        <div className="bg-[#000000] text-[#FEFEFE] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#222222]">
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#888888]">
              Direct Expert Consultation
            </div>
            <h3 className="text-xl font-bold">Have Questions About This Briefing?</h3>
            <p className="text-xs text-[#CCCCCC] max-w-lg leading-relaxed">
              Connect directly with Asad Land Holdings senior property analysts and legal conveyance team for title verification or turnkey construction quotes.
            </p>
          </div>

          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-[#25D366] text-white font-mono uppercase text-xs font-bold tracking-wider hover:bg-[#20bd5a] transition-colors whitespace-nowrap flex items-center gap-2 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" /> Message on WhatsApp
          </a>
        </div>

        {/* Related Verified Properties */}
        {relatedProperties.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#E5E5E5]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#888888]">
              Verified Listings in Covered Societies
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedProperties.map((prop) => (
                <Link
                  key={prop.id}
                  href={`/properties/${prop.slug}`}
                  className="group flex gap-4 p-3 border border-[#E5E5E5] hover:border-[#000000] bg-white transition-colors"
                >
                  <div className="w-24 h-20 bg-slate-200 relative overflow-hidden shrink-0">
                    <Image
                      src={prop.image}
                      alt={prop.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-between overflow-hidden">
                    <div>
                      <div className="text-[10px] font-mono text-[#888888] uppercase">{prop.society}</div>
                      <h4 className="text-xs font-bold text-[#000000] truncate group-hover:underline">{prop.title}</h4>
                    </div>
                    <div className="text-xs font-bold text-[#000000]">
                      PKR {(prop.demandPrice / 100000).toFixed(1)} Lac
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-[#E5E5E5]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#888888]">
              More Market Briefings & Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blog/${rPost.slug}`}
                  className="group block p-4 border border-[#E5E5E5] hover:border-[#000000] bg-white transition-colors space-y-2"
                >
                  <span className="text-[10px] font-mono uppercase text-[#888888]">{rPost.category}</span>
                  <h4 className="text-xs font-bold text-[#000000] line-clamp-2 group-hover:underline">
                    {rPost.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#888888] block">
                    {rPost.readTimeMinutes} min read →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold text-[#000000] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
