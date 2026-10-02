'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { SHORTS_DATA, ShortVideoItem } from '@/lib/shorts-data';
import { ShortsPlayer } from './ShortsPlayer';
import { trackEvent } from '@/lib/analytics';
import {
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Flame,
  Building2,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface ShortsSliderProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  filterSociety?: string;
  className?: string;
  limit?: number;
}

export const ShortsSlider: React.FC<ShortsSliderProps> = ({
  title = 'Ground Reality Video Shorts',
  subtitle = 'Watch 48+ empirical on-site videos showing plot demarcation, foundation engineering, villa walkthroughs, and real estate valuation in Wah Cantt and Islamabad.',
  eyebrow = 'Direct On-Ground Intelligence',
  filterSociety,
  className = '',
  limit,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [selectedShortIndex, setSelectedShortIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter shorts based on props and active category tab
  const allShorts = filterSociety
    ? SHORTS_DATA.filter((s) => s.society.toLowerCase().includes(filterSociety.toLowerCase()))
    : SHORTS_DATA;

  const filteredShorts = allShorts.filter((s) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'KOHISTAN') return s.society.toLowerCase().includes('kohistan');
    if (activeCategory === 'HOUSES') return s.category === 'HOUSE_TOUR';
    if (activeCategory === 'CONSTRUCTION') return s.category === 'CONSTRUCTION_TIPS';
    if (activeCategory === 'PLOTS') return s.category === 'PLOT_SALE';
    if (activeCategory === 'ADVISORY') return s.category === 'ADVISORY';
    return true;
  });

  const displayShorts = limit ? filteredShorts.slice(0, limit) : filteredShorts;

  const updateScrollButtons = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    const progress = scrollWidth > clientWidth ? (scrollLeft / (scrollWidth - clientWidth)) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons, { passive: true });
      updateScrollButtons();
      return () => el.removeEventListener('scroll', updateScrollButtons);
    }
  }, [displayShorts]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleMouseEnter = (videoId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredVideoId(videoId);
      trackEvent('short_hover_preview', { videoId });
    }, 120);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredVideoId(null);
  };

  const openFullscreenShort = (index: number) => {
    setSelectedShortIndex(index);
    trackEvent('short_modal_opened', { videoId: displayShorts[index]?.videoId });
  };

  const categories = [
    { key: 'ALL', label: `All Shorts (${allShorts.length})` },
    { key: 'KOHISTAN', label: 'Kohistan Enclave' },
    { key: 'HOUSES', label: 'House Tours' },
    { key: 'CONSTRUCTION', label: 'Construction & Engineering' },
    { key: 'PLOTS', label: 'Plot Deals' },
    { key: 'ADVISORY', label: 'Market Tips' },
  ];

  return (
    <div className={`py-16 md:py-24 bg-[#0A0A0A] text-[#FEFEFE] border-y border-[#222222] relative overflow-hidden ${className}`}>
      {/* Background architectural grid pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#333333] text-[#FEFEFE] text-[10px] font-mono uppercase tracking-[0.25em] mb-4">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#FEFEFE] font-sans">
              {title}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-[#A0A0A0] max-w-2xl leading-relaxed font-sans">
              {subtitle}
            </p>
          </div>

          {/* Right Action & External YouTube Link */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.youtube.com/@asadlandholdings/shorts"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-[#FEFEFE] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>@asadlandholdings</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Slider Navigation Buttons */}
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 border border-[#333333] bg-[#141414] hover:bg-[#222222] disabled:opacity-30 disabled:hover:bg-[#141414] text-[#FEFEFE] flex items-center justify-center transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 border border-[#333333] bg-[#141414] hover:bg-[#222222] disabled:opacity-30 disabled:hover:bg-[#141414] text-[#FEFEFE] flex items-center justify-center transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-1.5 uppercase font-bold text-[11px] whitespace-nowrap transition-all border ${
                activeCategory === cat.key
                  ? 'bg-[#FEFEFE] text-[#000000] border-[#FEFEFE] shadow'
                  : 'bg-[#141414] text-[#A0A0A0] border-[#2A2A2A] hover:border-[#444444] hover:text-[#FEFEFE]'
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="text-[10px] text-[#777777] font-mono ml-auto hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-yellow-500" />
            Hover card to play preview
          </span>
        </div>

        {/* HORIZONTAL SCROLLABLE SLIDER */}
        <div
          ref={sliderRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth no-scrollbar select-none"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayShorts.map((short, idx) => {
            const isHovered = hoveredVideoId === short.videoId;

            return (
              <div
                key={short.id}
                style={{ scrollSnapAlign: 'start' }}
                onMouseEnter={() => handleMouseEnter(short.videoId)}
                onMouseLeave={handleMouseLeave}
                onClick={() => openFullscreenShort(idx)}
                className="group relative flex-shrink-0 w-[240px] sm:w-[270px] aspect-[9/16] bg-[#141414] border border-[#262626] hover:border-[#FEFEFE] shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* 1. Static Thumbnail Layer */}
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isHovered ? 'opacity-0' : 'opacity-90 group-hover:scale-105'
                  }`}
                  loading="lazy"
                />

                {/* 2. Interactive Live Video Hover Layer */}
                {isHovered && (
                  <div className="absolute inset-0 w-full h-full bg-[#000000] z-10 pointer-events-none">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${short.videoId}?autoplay=1&mute=${
                        isMuted ? '1' : '0'
                      }&controls=0&loop=1&playlist=${short.videoId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
                      title={short.title}
                      className="w-full h-full object-cover pointer-events-none scale-[1.05]"
                      allow="autoplay; encrypted-media"
                    />
                  </div>
                )}

                {/* 3. Dark Gradient Overlays for readable text */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/40 to-black/60 z-20 pointer-events-none" />

                {/* 4. Top Overlay Badges */}
                <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between font-mono text-[10px]">
                  {/* Views or Playing Indicator */}
                  {isHovered ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-[#FEFEFE] font-bold uppercase tracking-wider text-[9px] shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FEFEFE] animate-ping" />
                      PLAYING PREVIEW
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#000000]/80 backdrop-blur-sm border border-[#333333] text-[#FEFEFE] font-bold text-[9px]">
                      <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                      {short.views}
                    </span>
                  )}

                  {/* YouTube Shorts Tag / Mute Button if hovered */}
                  {isHovered ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="p-1.5 bg-[#000000]/90 hover:bg-[#222222] border border-[#444444] text-[#FEFEFE] rounded-none pointer-events-auto"
                      title={isMuted ? 'Unmute' : 'Mute'}
                      aria-label="Toggle sound"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-green-400" />}
                    </button>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-red-600 text-[#FEFEFE] text-[9px] font-bold uppercase">
                      SHORTS
                    </span>
                  )}
                </div>

                {/* 5. Center Play Button on hover (when not playing) */}
                {!isHovered && (
                  <div className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 bg-[#FEFEFE]/90 text-[#000000] flex items-center justify-center border border-[#000000] shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-[#000000] ml-0.5" />
                    </div>
                  </div>
                )}

                {/* 6. Bottom Metadata Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 z-30 text-[#FEFEFE] font-sans flex flex-col justify-end">
                  {/* Society & Tag badge */}
                  <div className="flex items-center gap-1.5 mb-1.5 font-mono text-[9px] text-[#C0C0C0]">
                    <span className="px-1.5 py-0.5 bg-[#1F1F1F] border border-[#333333] uppercase text-[#E0E0E0]">
                      {short.society}
                    </span>
                    <span className="text-[#888888]">•</span>
                    <span className="text-[#999999] truncate">{short.tag}</span>
                  </div>

                  {/* Short Title */}
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-[#FEFEFE] line-clamp-2 leading-snug group-hover:text-yellow-400 transition-colors">
                    {short.cleanTitle}
                  </h3>

                  {/* Quick Action Button on Hover */}
                  <div className="mt-2.5 pt-2 border-t border-[#333333]/80 flex items-center justify-between font-mono text-[10px] text-[#A0A0A0]">
                    <span className="inline-flex items-center gap-1 text-[#FEFEFE] font-bold group-hover:underline">
                      <Maximize2 className="w-3 h-3" /> Full Video
                    </span>
                    <a
                      href={`https://wa.me/923005123456?text=${encodeURIComponent(
                        `Hello Asad Land Holdings, I watched your video short: "${short.title}" (https://youtube.com/shorts/${short.videoId}) and want to enquire about property/construction rates.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#25D366] hover:bg-[#20ba59] text-[#000000] font-bold uppercase text-[9px]"
                    >
                      <MessageSquare className="w-2.5 h-2.5" /> Enquire
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar and view all link */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#222222] pt-4 font-mono text-xs text-[#888888]">
          <div className="w-full sm:w-64 h-1 bg-[#1A1A1A] overflow-hidden">
            <div
              className="h-full bg-[#FEFEFE] transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Showing {displayShorts.length} of {allShorts.length} verified ground reality shorts</span>
            <Link
              href="/videos"
              className="font-bold text-[#FEFEFE] hover:underline uppercase inline-flex items-center gap-1"
            >
              Open Full Video Hub →
            </Link>
          </div>
        </div>
      </div>

      {/* FULLSCREEN VERTICAL SHORTS MODAL PLAYER */}
      {selectedShortIndex !== null && (
        <ShortsPlayer
          shorts={displayShorts.map((s) => ({
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
};
