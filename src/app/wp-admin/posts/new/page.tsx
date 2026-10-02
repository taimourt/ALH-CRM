'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import { CMSBlogPost } from '@/lib/cms-types';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  Edit3,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function WPAdminNewPostPage() {
  const router = useRouter();
  const { addPost } = useCMS();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1200&auto=format&fit=crop'
  );
  const [category, setCategory] = useState<CMSBlogPost['category']>('Market Intelligence');
  const [tagInput, setTagInput] = useState('Wah Cantt, Kohistan Enclave, Real Estate');
  const [readTime, setReadTime] = useState(5);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isFeatured, setIsFeatured] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [authorName, setAuthorName] = useState('Asad Ali');
  const [authorRole, setAuthorRole] = useState('Principal Broker & Managing Director');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const insertText = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('post-content-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
  };

  const handleSave = async (saveStatus: 'published' | 'draft') => {
    if (!title.trim()) {
      alert('Please enter a post title.');
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const generatedSlug =
        slug.trim() ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      await addPost({
        title,
        slug: generatedSlug,
        excerpt: excerpt || content.slice(0, 150) + '...',
        content: content || 'Article content...',
        coverImage,
        category,
        tags: tagsArray,
        readTimeMinutes: readTime,
        status: saveStatus,
        featured: isFeatured,
        author: {
          name: authorName,
          role: authorRole,
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop',
        },
      });

      router.push('/wp-admin/posts');
    } catch (err) {
      console.error(err);
      alert('Failed to save post.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/wp-admin/posts"
            className="p-1.5 text-[#646970] hover:text-[#1d2327] hover:bg-[#dcdcde] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-normal text-[#1d2327]">Add New Post</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="px-3 py-1.5 text-xs font-semibold text-[#2c3338] bg-[#f6f7f7] border border-[#dcdcde] rounded hover:bg-[#f0f0f1] transition-colors"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2271b1] border border-[#2271b1] rounded hover:bg-[#135e96] transition-colors"
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Editor */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title Input */}
          <div>
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={handleTitleChange}
              className="w-full text-xl sm:text-2xl font-semibold px-4 py-2.5 bg-white border border-[#c3c4c7] rounded focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] outline-none text-[#1d2327]"
            />
          </div>

          {/* Permalink Preview */}
          <div className="text-xs text-[#646970] flex items-center gap-2 bg-white px-3 py-1.5 border border-[#dcdcde] rounded">
            <span>
              <strong>Permalink:</strong> {typeof window !== 'undefined' ? window.location.origin : ''}/blog/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-slug"
              className="px-1.5 py-0.5 border border-[#c3c4c7] rounded text-xs font-mono text-[#2271b1] outline-none"
            />
          </div>

          {/* Editor Toolbar */}
          <div className="bg-white border border-[#c3c4c7] rounded-t border-b-0 p-2 flex items-center justify-between flex-wrap gap-1">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => insertText('**', '**')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('*', '*')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <span className="text-[#c3c4c7]">|</span>
              <button
                type="button"
                onClick={() => insertText('## ')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Heading 2"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('### ')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Heading 3"
              >
                <Heading3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('> ')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Quote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <span className="text-[#c3c4c7]">|</span>
              <button
                type="button"
                onClick={() => insertText('- ')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('1. ')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('[Link Title](', ')')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Insert Link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('![Image Description](', ')')}
                className="p-1.5 hover:bg-[#f0f0f1] rounded text-[#2c3338]"
                title="Insert Image"
              >
                <ImageIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  viewMode === 'edit'
                    ? 'bg-[#2271b1] text-white'
                    : 'bg-[#f0f0f1] text-[#2c3338]'
                }`}
              >
                <Edit3 className="w-3 h-3" /> Text
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-2 py-1 rounded flex items-center gap-1 ${
                  viewMode === 'preview'
                    ? 'bg-[#2271b1] text-white'
                    : 'bg-[#f0f0f1] text-[#2c3338]'
                }`}
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
            </div>
          </div>

          {/* Content Area */}
          {viewMode === 'edit' ? (
            <textarea
              id="post-content-area"
              rows={18}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article in standard markdown format... You can use headings, bold text, lists, tables, and blockquotes."
              className="w-full p-4 bg-white border border-[#c3c4c7] rounded-b focus:border-[#2271b1] outline-none font-mono text-sm leading-relaxed text-[#1d2327]"
            />
          ) : (
            <div className="w-full min-h-[400px] p-6 bg-white border border-[#c3c4c7] rounded-b prose prose-slate max-w-none text-sm text-[#1d2327]">
              {content ? (
                <div className="whitespace-pre-wrap">{content}</div>
              ) : (
                <p className="text-[#646970] italic">No content written yet.</p>
              )}
            </div>
          )}

          {/* Excerpt Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#1d2327] uppercase">Excerpt & Meta Description</h3>
            <p className="text-[11px] text-[#646970]">
              Brief summary used for search engine snippets and archive cards.
            </p>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Provide a concise 1-2 sentence overview of this article..."
              className="w-full text-xs p-2.5 border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
            />
          </div>
        </div>

        {/* Right 1 Col: WordPress Meta Boxes */}
        <div className="space-y-4">
          {/* Publish Meta Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] font-semibold text-xs text-[#1d2327]">
              Publish
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#646970]">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="px-2 py-1 border border-[#8c8f94] rounded bg-white text-xs font-semibold"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#646970]">Visibility:</span>
                <strong className="text-[#1d2327]">Public</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#646970]">Featured Article:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <span>Pin to Top</span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#646970]">Est. Read Time:</span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={readTime}
                  onChange={(e) => setReadTime(Number(e.target.value))}
                  className="w-16 px-1.5 py-0.5 border border-[#8c8f94] rounded text-xs text-center"
                />
                <span className="text-[#646970]">min</span>
              </div>

              <div className="pt-3 border-t border-[#f0f0f1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                  className="text-xs text-[#2271b1] hover:underline"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(status)}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-[#2271b1] text-white font-semibold rounded hover:bg-[#135e96] transition-colors"
                >
                  {isSaving ? 'Saving...' : status === 'published' ? 'Publish' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Categories Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] font-semibold text-xs text-[#1d2327]">
              Categories
            </div>
            <div className="p-4 space-y-2 text-xs">
              {(
                [
                  'Market Intelligence',
                  'Investment Guide',
                  'Construction & Architecture',
                  'Legal & Verification',
                  'Society Spotlight',
                ] as const
              ).map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="text-[#2271b1]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] font-semibold text-xs text-[#1d2327]">
              Featured Image
            </div>
            <div className="p-4 space-y-3 text-xs">
              {coverImage && (
                <div className="aspect-video relative rounded overflow-hidden border border-[#dcdcde]">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] text-[#646970] mb-1">Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-2 py-1 text-xs border border-[#8c8f94] rounded focus:border-[#2271b1] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Tags Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] font-semibold text-xs text-[#1d2327]">
              Tags
            </div>
            <div className="p-4 space-y-2 text-xs">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Separate tags with commas"
                className="w-full px-2 py-1 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
              />
              <p className="text-[11px] text-[#646970]">
                e.g. Kohistan Enclave, Wah Cantt, Registry, NOC
              </p>
            </div>
          </div>

          {/* Author Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm">
            <div className="px-4 py-2.5 border-b border-[#c3c4c7] font-semibold text-xs text-[#1d2327]">
              Author
            </div>
            <div className="p-4 space-y-2 text-xs">
              <div>
                <label className="block text-[11px] text-[#646970] mb-1">Author Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-2 py-1 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#646970] mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-2 py-1 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
