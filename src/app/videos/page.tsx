'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/website/SectionHeading';
import { Breadcrumbs } from '@/components/website/Breadcrumbs';
import { Modal } from '@/components/website/Modal';
import { ShortsPlayer } from '@/components/website/ShortsPlayer';
import { ShortsSlider } from '@/components/website/ShortsSlider';
import { ConstructionSeriesSection } from '@/components/website/ConstructionSeriesSection';
import { VIDEOS_DATA, STANDARD_VIDEOS_DATA, VideoItem } from '@/lib/website-data';
import { SHORTS_DATA, ShortVideoItem } from '@/lib/shorts-data';
import { CONSTRUCTION_SERIES_DATA } from '@/lib/construction-series-data';
import { Button } from '@/components/website/Button';
import { trackEvent } from '@/lib/analytics';
import {
  Play,
  Smartphone,
  Film,
  HardHat,
  Building2,
  MessageSquare,
  Flame,
  ExternalLink,
  Sparkles,
  Calculator
} from 'lucide-react';

export default function VideosPage() {
  const [activeTab, setActiveTab] = useState<'CONSTRUCTION' | 'SHORTS' | 'ALL'>('CONSTRUCTION');
  const [selectedStandardVideo, setSelectedStandardVideo] = useState<VideoItem | null>(null);
  const [selectedShortIndex, setSelectedShortIndex] = useState<number | null>(null);
  const [activeShortFilter, setActiveShortFilter] = useState<string>('ALL');

  const standardVideos = STANDARD_VIDEOS_DATA;
  const allShorts = SHORTS_DATA;

  const filteredShorts = allShorts.filter((s) => {
    if (activeShortFilter === 'ALL') return true;
    if (activeShortFilter === 'KOHISTAN') return s.society.toLowerCase().includes('kohistan');
    if (activeShortFilter === 'HOUSES') return s.category === 'HOUSE_TOUR';
    if (activeShortFilter === 'CONSTRUCTION') return s.category === 'CONSTRUCTION_TIPS';
    if (activeShortFilter === 'PLOTS') return s.category === 'PLOT_SALE';
    if (activeShortFilter === 'ADVISORY') return s.category === 'ADVISORY';
    return true;
  });

  const handleOpenStandardVideo = (v: VideoItem) => {
    setSelectedStandardVideo(v);
    trackEvent('video_watched', { videoId: v.id, isShort: false });
  };

  const handleOpenShort = (index: number) => {
    setSelectedShortIndex(index);
    trackEvent('short_grid_clicked', { videoId: filteredShorts[index]?.videoId });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Ground Reality Video Hub' }]} />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <SectionHeading
          eyebrow="Visual Proof & Ground Reality"
          title="Video Hub & Construction Masterclass"
          subtitle="Explore the 20-part 'Plot Say Ghar Tak' engineering series, 48+ vertical shorts with hover playback, and complete on-ground site walkthroughs in Wah Cantt and Islamabad."
          className="mb-0 max-w-3xl"
        />

        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
          <Link
            href="/calculators"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#333333] text-[#FEFEFE] text-xs font-mono font-bold uppercase transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>BOQ Calculator</span>
          </Link>
          <a
            href="https://www.youtube.com/@asadlandholdings/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-[#FEFEFE] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span>YouTube Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-[#000000] pb-4 mb-8 font-mono text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('CONSTRUCTION')}
          className={`px-5 py-2.5 flex items-center gap-2 border uppercase font-bold transition-all whitespace-nowrap ${
            activeTab === 'CONSTRUCTION'
              ? 'bg-[#000000] text-amber-400 border-[#000000] shadow'
              : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5] hover:border-[#000000]'
          }`}
        >
          <HardHat className="w-4 h-4 text-amber-400" />
          <span>Plot Say Ghar Tak Series ({CONSTRUCTION_SERIES_DATA.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SHORTS')}
          className={`px-5 py-2.5 flex items-center gap-2 border uppercase font-bold transition-all whitespace-nowrap ${
            activeTab === 'SHORTS'
              ? 'bg-[#000000] text-[#FEFEFE] border-[#000000] shadow'
              : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5] hover:border-[#000000]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Vertical Shorts ({allShorts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-5 py-2.5 flex items-center gap-2 border uppercase font-bold transition-all whitespace-nowrap ${
            activeTab === 'ALL'
              ? 'bg-[#000000] text-[#FEFEFE] border-[#000000] shadow'
              : 'bg-[#F4F4F4] text-[#000000] border-[#E5E5E5] hover:border-[#000000]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Standard Videos ({standardVideos.length})</span>
        </button>
      </div>

      {/* TAB 1: PLOT SAY GHAR TAK CONSTRUCTION SERIES */}
      {activeTab === 'CONSTRUCTION' && (
        <div className="mb-16">
          <ConstructionSeriesSection className="border-0 bg-transparent py-0 text-inherit" />
        </div>
      )}

      {/* TAB 2: VERTICAL SHORTS FEED & CAROUSEL */}
      {activeTab === 'SHORTS' && (
        <div className="mb-16">
          {/* Featured Hover Slider */}
          <div className="mb-10 border border-[#000000]">
            <ShortsSlider
              title="Interactive Shorts Carousel"
              subtitle="Hover over any short to preview live video playback with audio control. Click to launch full screen."
              eyebrow="Live Hover Previews"
              className="border-0 py-8 md:py-10"
            />
          </div>

          {/* Sub-Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-8 font-mono text-xs">
            {[
              { key: 'ALL', label: `All (${allShorts.length})` },
              { key: 'KOHISTAN', label: 'Kohistan Enclave' },
              { key: 'HOUSES', label: 'House Tours' },
              { key: 'CONSTRUCTION', label: 'Construction & Engineering' },
              { key: 'PLOTS', label: 'Plot Deals' },
              { key: 'ADVISORY', label: 'Market Tips' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveShortFilter(filter.key)}
                className={`px-3.5 py-1.5 uppercase font-bold text-[11px] transition-all border ${
                  activeShortFilter === filter.key
                    ? 'bg-[#000000] text-[#FEFEFE] border-[#000000]'
                    : 'bg-[#F4F4F4] text-[#666666] border-[#E5E5E5] hover:border-[#000000] hover:text-[#000000]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Complete 48 Shorts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredShorts.map((short, idx) => (
              <div
                key={short.id}
                onClick={() => handleOpenShort(idx)}
                className="group relative aspect-[9/16] bg-[#000000] border border-[#222222] hover:border-[#000000] overflow-hidden cursor-pointer shadow-lg transition-all transform hover:-translate-y-1"
              >
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/30 to-black/60 z-10" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between font-mono text-[9px]">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#000000]/80 border border-[#333333] text-[#FEFEFE] font-bold">
                    <Flame className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                    {short.views}
                  </span>
                  <span className="px-1.5 py-0.5 bg-red-600 text-[#FEFEFE] font-bold uppercase">
                    SHORTS
                  </span>
                </div>

                {/* Center Play Icon */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#FEFEFE] text-[#000000] flex items-center justify-center border border-[#000000] group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-4 h-4 fill-[#000000] ml-0.5" />
                  </div>
                </div>

                {/* Bottom Title & Details */}
                <div className="absolute bottom-0 inset-x-0 p-3 z-20 text-[#FEFEFE] font-sans">
                  <div className="flex items-center gap-1 mb-1 font-mono text-[9px] text-[#BDBDBD]">
                    <span className="px-1 py-0.5 bg-[#1A1A1A] border border-[#333333] uppercase text-[#FEFEFE]">
                      {short.society}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold uppercase line-clamp-2 leading-tight group-hover:text-yellow-400 transition-colors">
                    {short.cleanTitle}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STANDARD FULL-LENGTH SITE VIDEOS */}
      {activeTab === 'ALL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {standardVideos.map((video) => (
            <div key={video.id} className="border border-[#E5E5E5] bg-[#FEFEFE] p-4 flex flex-col justify-between">
              <div>
                <div
                  onClick={() => handleOpenStandardVideo(video)}
                  className="relative aspect-video bg-[#000000] overflow-hidden mb-4 cursor-pointer group"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                    <div className="w-12 h-12 bg-[#FEFEFE] text-[#000000] flex items-center justify-center border border-[#000000] group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-[#000000] ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-[#000000] text-[#FEFEFE] text-[9px] font-mono px-2 py-0.5 z-10">
                    {video.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#666666] mb-2">
                  <span>{video.society}</span>
                  <span>{video.publishedDate}</span>
                </div>

                <h3
                  onClick={() => handleOpenStandardVideo(video)}
                  className="text-base font-bold text-[#000000] uppercase tracking-tight line-clamp-2 cursor-pointer hover:underline mb-2 font-sans"
                >
                  {video.title}
                </h3>
              </div>

              <p className="text-xs text-[#666666] font-sans leading-relaxed line-clamp-3 mt-3">
                {video.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* STANDARD VIDEO MODAL PLAYER */}
      <Modal
        isOpen={!!selectedStandardVideo}
        onClose={() => setSelectedStandardVideo(null)}
        title={selectedStandardVideo?.title || 'Video Player'}
      >
        {selectedStandardVideo && (
          <div className="space-y-4 font-sans text-xs">
            <div className="relative aspect-video bg-[#000000] border border-[#000000]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${
                  selectedStandardVideo.videoUrl.split('v=')[1] || 'dQw4w9WgXcQ'
                }?autoplay=1`}
                title={selectedStandardVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-[#444444] leading-relaxed">
              {selectedStandardVideo.description}
            </p>

            <div className="flex justify-end pt-2 font-mono text-xs">
              <a
                href={`https://wa.me/923005123456?text=${encodeURIComponent(
                  `Hello Asad Land Holdings, I watched video: "${selectedStandardVideo.title}" and want to enquire.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#000000] text-[#FEFEFE] font-bold uppercase"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Enquire on WhatsApp
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* VERTICAL SHORTS MODAL PLAYER */}
      {selectedShortIndex !== null && (
        <ShortsPlayer
          shorts={filteredShorts.map((s) => ({
            id: s.id,
            title: s.title,
            society: s.society,
            duration: s.duration,
            thumbnail: s.thumbnail,
            videoUrl: s.videoUrl,
            youtubeId: s.videoId,
            publishedDate: s.publishedDate,
            category: s.category as any,
            description: s.description,
            isShort: true,
            aspectRatio: '9:16',
            linkedPropertyId: s.linkedPropertyId,
            linkedSocietySlug: s.linkedSocietySlug,
          }))}
          initialIndex={selectedShortIndex}
          onClose={() => setSelectedShortIndex(null)}
        />
      )}
    </div>
  );
}
