'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCMS } from '@/contexts/cms-context';
import { CMSVideo } from '@/lib/cms-types';
import {
  Film,
  Plus,
  Trash2,
  Edit,
  Play,
  CheckCircle2,
  ExternalLink,
  X,
} from 'lucide-react';

export default function WPAdminVideosPage() {
  const { videos, addVideo, updateVideo, deleteVideo } = useCMS();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CMSVideo | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [duration, setDuration] = useState('0:58');
  const [category, setCategory] = useState<CMSVideo['category']>('DEVELOPMENT_UPDATE');
  const [description, setDescription] = useState('');
  const [isShort, setIsShort] = useState(true);
  const [featured, setFeatured] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingVideo(null);
    setTitle('');
    setYoutubeId('');
    setDuration('0:58');
    setCategory('DEVELOPMENT_UPDATE');
    setDescription('Ground inspection and drone visual update.');
    setIsShort(true);
    setFeatured(true);
    setModalOpen(true);
  };

  const openEditModal = (v: CMSVideo) => {
    setEditingVideo(v);
    setTitle(v.title);
    setYoutubeId(v.youtubeId || '');
    setDuration(v.duration);
    setCategory(v.category);
    setDescription(v.description);
    setIsShort(!!v.isShort);
    setFeatured(!!v.featured);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !youtubeId.trim()) return;

    // Clean YouTube ID in case full URL was pasted
    let cleanId = youtubeId.trim();
    if (cleanId.includes('v=')) {
      cleanId = cleanId.split('v=')[1].split('&')[0];
    } else if (cleanId.includes('youtu.be/')) {
      cleanId = cleanId.split('youtu.be/')[1].split('?')[0];
    } else if (cleanId.includes('shorts/')) {
      cleanId = cleanId.split('shorts/')[1].split('?')[0];
    }

    if (editingVideo) {
      await updateVideo(editingVideo.id, {
        title,
        youtubeId: cleanId,
        thumbnail: `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`,
        duration,
        category,
        description,
        isShort,
        featured,
      });
      setNotice('Video walkthrough updated.');
    } else {
      await addVideo({
        title,
        youtubeId: cleanId,
        thumbnail: `https://img.youtube.com/vi/${cleanId}/hqdefault.jpg`,
        duration,
        category,
        description,
        isShort,
        featured,
      });
      setNotice('New video walkthrough added.');
    }

    setModalOpen(false);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async (id: string, vidTitle: string) => {
    if (confirm(`Delete video "${vidTitle}"?`)) {
      await deleteVideo(id);
      setNotice(`Video "${vidTitle}" deleted.`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-normal text-[#1d2327]">Media & Video Walkthroughs</h1>
          <button
            onClick={openAddModal}
            className="px-2.5 py-1 text-xs font-semibold text-[#2271b1] border border-[#2271b1] bg-white rounded hover:bg-[#2271b1] hover:text-white transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Video
          </button>
        </div>

        <Link
          href="/videos"
          target="_blank"
          className="text-xs text-[#2271b1] hover:underline flex items-center gap-1"
        >
          View Public Video Center <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {notice && (
        <div className="bg-[#e7f7ed] border-l-4 border-[#00a32a] p-3 text-xs text-[#00a32a] flex items-center justify-between">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#646970] font-bold">×</button>
        </div>
      )}

      {/* Grid of Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="bg-white border border-[#c3c4c7] rounded shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail */}
              <div className="aspect-video relative bg-slate-900 overflow-hidden border-b border-[#dcdcde]">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {vid.duration}
                </span>
                <span className="absolute top-2 left-2 bg-[#2271b1] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {vid.category.replace('_', ' ')}
                </span>
                {vid.isShort && (
                  <span className="absolute top-2 right-2 bg-[#d63638] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Short
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm text-[#1d2327] line-clamp-2">{vid.title}</h3>
                <p className="text-xs text-[#646970] line-clamp-2">{vid.description}</p>
                <div className="text-[11px] font-mono text-[#646970]">
                  YouTube ID: <span className="text-[#2271b1] font-bold">{vid.youtubeId}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-3 bg-[#f6f7f7] border-t border-[#c3c4c7] flex items-center justify-between text-xs">
              <button
                onClick={() => openEditModal(vid)}
                className="text-[#2271b1] hover:underline font-semibold flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>

              <a
                href={`https://youtube.com/watch?v=${vid.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#646970] hover:text-[#1d2327] flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" /> Watch
              </a>

              <button
                onClick={() => handleDelete(vid.id, vid.title)}
                className="text-[#d63638] hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded border border-[#c3c4c7] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#c3c4c7] pb-3">
              <h2 className="text-lg font-normal text-[#1d2327]">
                {editingVideo ? 'Edit Video Walkthrough' : 'Add New Video / Short'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[#646970] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Video Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kohistan Enclave Sector A Ground Possession Walkthrough"
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">YouTube Video ID or Full URL</label>
                <input
                  type="text"
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="e.g. dQw4w9WgXcQ or https://youtu.be/..."
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-mono outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded bg-white text-xs"
                  >
                    <option value="DEVELOPMENT_UPDATE">Development Update</option>
                    <option value="SITE_TOUR">Site Tour</option>
                    <option value="WALKTHROUGH">Walkthrough</option>
                    <option value="PRICE_ANALYSIS">Price Analysis</option>
                    <option value="ADVISORY">Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Duration (e.g. 0:58 or 4:32)</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isShort}
                    onChange={(e) => setIsShort(e.target.checked)}
                    className="rounded"
                  />
                  <span className="font-semibold">Vertical Short (Reel/TikTok format)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <span className="font-semibold">Featured on Homepage</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-[#8c8f94] rounded text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#c3c4c7]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 bg-[#f6f7f7] border border-[#dcdcde] rounded text-[#2c3338]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2271b1] text-white font-semibold rounded hover:bg-[#135e96]"
                >
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
