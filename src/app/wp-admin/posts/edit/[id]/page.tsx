'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  ArrowLeft,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export default function WPAdminEditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { posts, updatePost, deletePost } = useCMS();

  const existingPost = posts.find((p) => p.id === postId);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState<CMSBlogPost['category']>('Market Intelligence');
  const [tagInput, setTagInput] = useState('');
  const [readTime, setReadTime] = useState(5);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [authorName, setAuthorName] = useState('Asad Ali');
  const [authorRole, setAuthorRole] = useState('Principal Broker');

  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setContent(existingPost.content);
      setExcerpt(existingPost.excerpt);
      setCoverImage(existingPost.coverImage);
      setCategory(existingPost.category);
      setTagInput(existingPost.tags.join(', '));
      setReadTime(existingPost.readTimeMinutes);
      setStatus(existingPost.status);
      setIsFeatured(!!existingPost.featured);
      if (existingPost.author) {
        setAuthorName(existingPost.author.name);
        setAuthorRole(existingPost.author.role);
      }
    }
  }, [existingPost]);

  if (!existingPost) {
    return (
      <div className="p-8 text-center text-xs text-[#646970] bg-white rounded border border-[#c3c4c7]">
        Post not found. <Link href="/wp-admin/posts" className="text-[#2271b1] underline">Back to Posts</Link>
      </div>
    );
  }

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

  const handleUpdate = async (saveStatus?: 'published' | 'draft') => {
    if (!title.trim()) {
      alert('Please enter a post title.');
      return;
    }

    setIsSaving(true);
    try {
      const targetStatus = saveStatus || status;
      const tagsArray = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await updatePost(postId, {
        title,
        slug: slug.trim() || existingPost.slug,
        excerpt: excerpt || content.slice(0, 150) + '...',
        content,
        coverImage,
        category,
        tags: tagsArray,
        readTimeMinutes: readTime,
        status: targetStatus,
        featured: isFeatured,
        author: {
          name: authorName,
          role: authorRole,
          avatar: existingPost.author?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop',
        },
      });

      setStatus(targetStatus);
      setNotice('Post updated successfully.');
      setTimeout(() => setNotice(null), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Move post "${title}" to trash?`)) {
      await deletePost(postId);
      router.push('/wp-admin/posts');
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
          <div>
            <h1 className="text-2xl font-normal text-[#1d2327]">Edit Post</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/blog/${existingPost.slug}`}
            target="_blank"
            className="px-3 py-1.5 text-xs font-semibold text-[#2271b1] bg-white border border-[#2271b1] rounded hover:bg-[#f0f6fc] transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" /> View Post
          </Link>
          <button
            type="button"
            onClick={() => handleUpdate()}
            disabled={isSaving}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2271b1] border border-[#2271b1] rounded hover:bg-[#135e96] transition-colors"
          >
            {isSaving ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

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
              onChange={(e) => setTitle(e.target.value)}
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
              rows={20}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 bg-white border border-[#c3c4c7] rounded-b focus:border-[#2271b1] outline-none font-mono text-sm leading-relaxed text-[#1d2327]"
            />
          ) : (
            <div className="w-full min-h-[450px] p-6 bg-white border border-[#c3c4c7] rounded-b prose prose-slate max-w-none text-sm text-[#1d2327]">
              <div className="whitespace-pre-wrap">{content}</div>
            </div>
          )}

          {/* Excerpt Box */}
          <div className="bg-white border border-[#c3c4c7] rounded shadow-sm p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#1d2327] uppercase">Excerpt & Meta Description</h3>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
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

              <div className="flex items-center justify-between text-[#646970] text-[11px] pt-1">
                <span>Published on:</span>
                <strong>{new Date(existingPost.publishedAt).toLocaleDateString()}</strong>
              </div>

              <div className="pt-3 border-t border-[#f0f0f1] flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-xs text-[#d63638] hover:underline"
                >
                  Move to trash
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate()}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-[#2271b1] text-white font-semibold rounded hover:bg-[#135e96] transition-colors"
                >
                  {isSaving ? 'Updating...' : 'Update'}
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
                className="w-full px-2 py-1 border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] outline-none"
              />
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
