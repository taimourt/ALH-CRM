'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import {
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
  ExternalLink,
} from 'lucide-react';

export default function WPAdminPostsPage() {
  const { posts, deletePost, updatePost } = useCMS();
  const [currentTab, setCurrentTab] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (currentTab === 'published' && post.status !== 'published') return false;
      if (currentTab === 'draft' && post.status !== 'draft') return false;
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
  }, [posts, currentTab, selectedCategory, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPostIds(filteredPosts.map((p) => p.id));
    } else {
      setSelectedPostIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete post "${title}"?`)) {
      await deletePost(id);
      setNotice(`Post "${title}" deleted.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPostIds.length === 0) return;
    if (confirm(`Move ${selectedPostIds.length} posts to trash?`)) {
      for (const id of selectedPostIds) {
        await deletePost(id);
      }
      setSelectedPostIds([]);
      setNotice(`${selectedPostIds.length} posts deleted.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Page Title & Add New Button */}
      <div className="flex items-center gap-3 border-b border-[#c3c4c7] pb-3">
        <h1 className="text-2xl font-normal text-[#1d2327]">Posts</h1>
        <Link
          href="/wp-admin/posts/new"
          className="px-2.5 py-1 text-xs font-semibold text-[#2271b1] border border-[#2271b1] bg-white rounded hover:bg-[#2271b1] hover:text-white transition-colors"
        >
          Add New Post
        </Link>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

      {/* Tabs (All, Published, Drafts) */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-[#646970]">
          <button
            onClick={() => setCurrentTab('all')}
            className={`hover:text-[#2271b1] ${
              currentTab === 'all' ? 'text-[#1d2327] font-bold' : ''
            }`}
          >
            All <span className="text-[#646970]">({posts.length})</span>
          </button>
          <span>|</span>
          <button
            onClick={() => setCurrentTab('published')}
            className={`hover:text-[#2271b1] ${
              currentTab === 'published' ? 'text-[#1d2327] font-bold' : ''
            }`}
          >
            Published{' '}
            <span className="text-[#646970]">
              ({posts.filter((p) => p.status === 'published').length})
            </span>
          </button>
          <span>|</span>
          <button
            onClick={() => setCurrentTab('draft')}
            className={`hover:text-[#2271b1] ${
              currentTab === 'draft' ? 'text-[#1d2327] font-bold' : ''
            }`}
          >
            Drafts{' '}
            <span className="text-[#646970]">
              ({posts.filter((p) => p.status === 'draft').length})
            </span>
          </button>
        </div>

        {/* Search Posts */}
        <div className="flex items-center gap-1">
          <input
            type="search"
            placeholder="Search Posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-2.5 py-1 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
          />
        </div>
      </div>

      {/* Filter & Bulk Actions Bar */}
      <div className="bg-white p-2 border border-[#c3c4c7] rounded flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              if (e.target.value === 'delete') handleBulkDelete();
            }}
            defaultValue=""
            className="text-xs px-2 py-1 border border-[#8c8f94] rounded bg-white"
          >
            <option value="" disabled>Bulk actions</option>
            <option value="delete">Move to Trash</option>
          </select>
          <button
            onClick={handleBulkDelete}
            disabled={selectedPostIds.length === 0}
            className="px-2.5 py-1 bg-[#f6f7f7] border border-[#dcdcde] text-[#2c3338] rounded hover:bg-[#f0f0f1] disabled:opacity-40"
          >
            Apply
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-2 py-1 border border-[#8c8f94] rounded bg-white"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-[#646970]">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* WordPress Table */}
      <div className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f6f7f7] border-b border-[#c3c4c7] text-[#1d2327]">
              <th className="p-3 w-8">
                <input
                  type="checkbox"
                  checked={
                    filteredPosts.length > 0 &&
                    selectedPostIds.length === filteredPosts.length
                  }
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Author</th>
              <th className="p-3 font-semibold">Categories</th>
              <th className="p-3 font-semibold">Tags</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c4c7]">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#646970]">
                  No posts found. <Link href="/wp-admin/posts/new" className="text-[#2271b1] underline">Create one now</Link>.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => {
                const isSelected = selectedPostIds.includes(post.id);

                return (
                  <tr
                    key={post.id}
                    className={`hover:bg-[#f6f7f7] group transition-colors ${
                      isSelected ? 'bg-[#f0f6fc]' : ''
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(post.id)}
                        className="rounded"
                      />
                    </td>

                    <td className="p-3">
                      <div className="font-semibold text-[#1d2327]">
                        <Link
                          href={`/wp-admin/posts/edit/${post.id}`}
                          className="hover:text-[#2271b1] text-sm"
                        >
                          {post.title}
                        </Link>
                        {post.status === 'draft' && (
                          <span className="text-[#646970] font-normal ml-2">— Draft</span>
                        )}
                      </div>

                      {/* WordPress Hover Action Row */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/wp-admin/posts/edit/${post.id}`}
                          className="text-[#2271b1] hover:underline"
                        >
                          Edit
                        </Link>
                        <span className="text-[#c3c4c7]">|</span>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="text-[#d63638] hover:underline"
                        >
                          Trash
                        </button>
                        <span className="text-[#c3c4c7]">|</span>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-[#2271b1] hover:underline flex items-center gap-0.5"
                        >
                          View <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </td>

                    <td className="p-3 text-[#2c3338]">
                      {post.author?.name || 'Asad Ali'}
                    </td>

                    <td className="p-3 text-[#2271b1]">
                      {post.category}
                    </td>

                    <td className="p-3 text-[#646970]">
                      {post.tags.slice(0, 3).join(', ')}
                    </td>

                    <td className="p-3">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-[#00a32a] font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#dba617] font-semibold">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-[#646970]">
                      <div>{new Date(post.publishedAt).toLocaleDateString()}</div>
                      <div className="text-[10px]">{post.status === 'published' ? 'Published' : 'Last Modified'}</div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
