'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import {
  FileText,
  Home,
  Layers,
  Hammer,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Send,
  Eye,
} from 'lucide-react';

export default function WPAdminDashboard() {
  const { posts, properties, floorPlans, inquiries, materialRates, settings, addPost } = useCMS();

  // Quick Draft State
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftSuccess, setDraftSuccess] = useState(false);

  const publishedPostsCount = posts.filter((p) => p.status === 'published').length;
  const draftPostsCount = posts.filter((p) => p.status === 'draft').length;
  const publishedPropertiesCount = properties.filter((p) => p.status === 'published').length;
  const unreadInquiriesCount = inquiries.filter((inq) => inq.status === 'unread').length;

  const handleSaveQuickDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    setIsDrafting(true);
    try {
      await addPost({
        title: draftTitle,
        content: draftContent,
        excerpt: draftContent.slice(0, 140) + '...',
        status: 'draft',
      });
      setDraftTitle('');
      setDraftContent('');
      setDraftSuccess(true);
      setTimeout(() => setDraftSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* WordPress Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c3c4c7] pb-4">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">Dashboard</h1>
          <p className="text-xs text-[#646970]">
            Asad Land Holdings Independent Website Management System (Isolated Database)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2271b1] bg-white border border-[#2271b1] rounded hover:bg-[#f0f6fc] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Visit Live Website
          </Link>
          <Link
            href="/wp-admin/posts/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2271b1] border border-[#2271b1] rounded hover:bg-[#135e96] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Write Post
          </Link>
        </div>
      </div>

      {/* WordPress Welcome Panel */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <h2 className="text-xl font-normal text-[#1d2327] mb-1">
            Welcome to Asad Land Holdings Website Admin!
          </h2>
          <p className="text-sm text-[#646970] mb-6">
            We’ve assembled some links to get you started managing your blog articles, verified property listings, architectural blueprints, and live material prices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Get Started */}
            <div>
              <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider mb-3">
                Get Started
              </h3>
              <Link
                href="/wp-admin/posts/new"
                className="inline-block px-4 py-2 bg-[#2271b1] text-white text-xs font-medium rounded hover:bg-[#135e96] transition-colors mb-3"
              >
                Write your first blog post
              </Link>
              <p className="text-xs text-[#646970]">
                or,{' '}
                <Link href="/wp-admin/properties/new" className="text-[#2271b1] hover:underline font-medium">
                  add a new property listing
                </Link>
              </p>
            </div>

            {/* Column 2: Next Steps */}
            <div>
              <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider mb-3">
                Next Steps
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/wp-admin/posts" className="text-[#2271b1] hover:underline flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#646970]" /> Manage published articles ({posts.length})
                  </Link>
                </li>
                <li>
                  <Link href="/wp-admin/properties" className="text-[#2271b1] hover:underline flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#646970]" /> Manage verified listings ({properties.length})
                  </Link>
                </li>
                <li>
                  <Link href="/wp-admin/floor-plans" className="text-[#2271b1] hover:underline flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#646970]" /> Update 2D/3D floor plans ({floorPlans.length})
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: More Actions */}
            <div>
              <h3 className="text-xs font-bold text-[#1d2327] uppercase tracking-wider mb-3">
                More Actions
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/wp-admin/rates" className="text-[#2271b1] hover:underline flex items-center gap-1.5">
                    <Hammer className="w-3.5 h-3.5 text-[#646970]" /> Update Cement & Steel rates
                  </Link>
                </li>
                <li>
                  <Link href="/wp-admin/inquiries" className="text-[#2271b1] hover:underline flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#646970]" /> View website inquiries ({unreadInquiriesCount} new)
                  </Link>
                </li>
                <li>
                  <Link href="/wp-admin/settings" className="text-[#2271b1] hover:underline flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#646970]" /> Configure SEO & WhatsApp numbers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* WordPress 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: At a Glance + Activity */}
        <div className="space-y-6">
          {/* At a Glance Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-3 border-b border-[#c3c4c7] font-semibold text-sm text-[#1d2327]">
              At a Glance
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#646970]" />
                    <Link href="/wp-admin/posts" className="text-[#2271b1] hover:underline font-semibold">
                      {publishedPostsCount} Posts
                    </Link>
                    {draftPostsCount > 0 && (
                      <span className="text-[#646970]">({draftPostsCount} drafts)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#646970]" />
                    <Link href="/wp-admin/properties" className="text-[#2271b1] hover:underline font-semibold">
                      {publishedPropertiesCount} Listings
                    </Link>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#646970]" />
                    <Link href="/wp-admin/floor-plans" className="text-[#2271b1] hover:underline font-semibold">
                      {floorPlans.length} Floor Plans
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#646970]" />
                    <Link href="/wp-admin/inquiries" className="text-[#2271b1] hover:underline font-semibold">
                      {inquiries.length} Inquiries
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f0f0f1] text-[11px] text-[#646970] flex items-center justify-between">
                <span>WordPress Real Estate Engine v6.8</span>
                <span className="text-[#00a32a] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Live & Synced
                </span>
              </div>
            </div>
          </div>

          {/* Activity Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-3 border-b border-[#c3c4c7] font-semibold text-sm text-[#1d2327]">
              Activity
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-[#646970] uppercase mb-2">
                  Recently Published
                </h4>
                <ul className="space-y-2.5">
                  {posts.slice(0, 3).map((post) => (
                    <li key={post.id} className="text-xs flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/wp-admin/posts/edit/${post.id}`}
                          className="text-[#2271b1] font-semibold hover:underline block"
                        >
                          {post.title}
                        </Link>
                        <span className="text-[11px] text-[#646970]">
                          Category: {post.category} · {post.readTimeMinutes} min read
                        </span>
                      </div>
                      <span className="text-[11px] text-[#646970] shrink-0">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-[#f0f0f1]">
                <h4 className="text-xs font-bold text-[#646970] uppercase mb-2">
                  Recent Inquiries
                </h4>
                <ul className="space-y-2">
                  {inquiries.slice(0, 2).map((inq) => (
                    <li key={inq.id} className="text-xs bg-[#f6f7f7] p-2 rounded border border-[#dcdcde]">
                      <div className="flex items-center justify-between font-semibold text-[#1d2327]">
                        <span>{inq.name} ({inq.phone})</span>
                        <span className="text-[10px] text-[#646970]">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#646970] truncate mt-0.5">{inq.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Draft + Material Prices */}
        <div className="space-y-6">
          {/* Quick Draft Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-3 border-b border-[#c3c4c7] font-semibold text-sm text-[#1d2327]">
              Quick Draft
            </div>
            <form onSubmit={handleSaveQuickDraft} className="p-4 space-y-3">
              {draftSuccess && (
                <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-2 text-xs text-[#00a32a]">
                  ✓ Draft saved! View in <Link href="/wp-admin/posts" className="underline font-bold">Posts</Link>.
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Title</label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="What's on your mind? (e.g. Kohistan Sector C Update)"
                  className="w-full text-xs px-2.5 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Content</label>
                <textarea
                  rows={4}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="Draft notes or bullet points here..."
                  className="w-full text-xs px-2.5 py-1.5 border border-[#8c8f94] rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  disabled={isDrafting}
                  className="px-3.5 py-1.5 bg-[#2271b1] text-white text-xs font-semibold rounded hover:bg-[#135e96] transition-colors disabled:opacity-50"
                >
                  {isDrafting ? 'Saving...' : 'Save Draft'}
                </button>

                <Link href="/wp-admin/posts" className="text-xs text-[#2271b1] hover:underline">
                  View all drafts
                </Link>
              </div>
            </form>
          </div>

          {/* Construction Material Live Rates Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-3 border-b border-[#c3c4c7] flex items-center justify-between font-semibold text-sm text-[#1d2327]">
              <span>Live Construction Rates Benchmark</span>
              <Link href="/wp-admin/rates" className="text-xs text-[#2271b1] font-normal hover:underline">
                Edit Rates →
              </Link>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#f6f7f7] p-2.5 rounded border border-[#dcdcde]">
                  <span className="text-[11px] text-[#646970] block">Cement (Fauji/Bestway)</span>
                  <strong className="text-sm text-[#1d2327]">PKR {materialRates.cementBagPKR} / bag</strong>
                </div>
                <div className="bg-[#f6f7f7] p-2.5 rounded border border-[#dcdcde]">
                  <span className="text-[11px] text-[#646970] block">Deformed Steel (Grade 60)</span>
                  <strong className="text-sm text-[#1d2327]">PKR {materialRates.steelTonPKR.toLocaleString()} / ton</strong>
                </div>
                <div className="bg-[#f6f7f7] p-2.5 rounded border border-[#dcdcde]">
                  <span className="text-[11px] text-[#646970] block">Red Bricks (Awwal)</span>
                  <strong className="text-sm text-[#1d2327]">PKR {materialRates.bricks1000PKR.toLocaleString()} / 1,000</strong>
                </div>
                <div className="bg-[#f6f7f7] p-2.5 rounded border border-[#dcdcde]">
                  <span className="text-[11px] text-[#646970] block">Grey Structure Rate</span>
                  <strong className="text-sm text-[#1d2327]">PKR {materialRates.greyStructureRatePerSqFtPKR} / sq ft</strong>
                </div>
              </div>

              <p className="text-[11px] text-[#646970] pt-1">
                Last updated: {new Date(materialRates.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
