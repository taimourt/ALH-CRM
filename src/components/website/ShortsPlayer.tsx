'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { VideoItem } from '@/lib/website-data';
import { trackEvent } from '@/lib/analytics';
import {
  MessageSquare,
  Share2,
  Building2,
  MapPin,
  X,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ShortsPlayerProps {
  shorts: VideoItem[];
  initialIndex?: number;
  onClose?: () => void;
}

export const ShortsPlayer: React.FC<ShortsPlayerProps> = ({
  shorts,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(0, initialIndex), shorts.length - 1)
  );

  const currentShort = shorts[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      trackEvent('video_watched', {
        videoId: shorts[currentIndex + 1]?.id,
        isShort: true,
      });
    }
  }, [currentIndex, shorts]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!currentShort) return null;

  const youtubeVideoId =
    currentShort.youtubeId ||
    (currentShort.videoUrl?.includes('embed/')
      ? currentShort.videoUrl.split('embed/')[1]?.split('?')[0]
      : currentShort.id.replace('short-', ''));

  const handleShare = () => {
    const shareUrl = `https://www.youtube.com/shorts/${youtubeVideoId}`;
    if (navigator.share) {
      navigator.share({
        title: currentShort.title,
        url: shareUrl,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert('YouTube Short link copied to clipboard!');
    }
  };

  const whatsappUrl = `https://wa.me/923218004186?text=${encodeURIComponent(
    `Hello Asad Land Holdings, I watched your video short: "${currentShort.title}" (https://youtube.com/shorts/${youtubeVideoId}) and want to enquire about property/construction rates.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      {/* Top Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2.5 bg-[#FEFEFE] text-[#000000] hover:bg-[#E5E5E5] font-bold transition-all shadow-xl"
        aria-label="Close shorts player"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Desktop Navigation Floating Arrows (Left / Right) */}
      <div className="hidden lg:flex absolute inset-y-0 left-8 items-center z-40">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 bg-[#1A1A1A]/90 hover:bg-[#333333] disabled:opacity-20 text-[#FEFEFE] border border-[#333333] transition-all"
          title="Previous Short (Left Arrow)"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      </div>

      <div className="hidden lg:flex absolute inset-y-0 right-8 items-center z-40">
        <button
          onClick={handleNext}
          disabled={currentIndex === shorts.length - 1}
          className="p-3 bg-[#1A1A1A]/90 hover:bg-[#333333] disabled:opacity-20 text-[#FEFEFE] border border-[#333333] transition-all"
          title="Next Short (Right Arrow)"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Vertical 9:16 Video Container */}
      <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[9/16] bg-[#0A0A0A] border border-[#333333] shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Background Embedded YouTube Video */}
        <div className="absolute inset-0 z-0 bg-[#000000]">
          <iframe
            key={youtubeVideoId}
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&controls=1&loop=1&playlist=${youtubeVideoId}&playsinline=1&rel=0`}
            title={currentShort.title}
            className="w-full h-full object-cover pointer-events-auto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Top Header Overlay */}
        <div className="relative z-10 p-4 bg-gradient-to-b from-[#000000]/90 via-[#000000]/50 to-transparent flex items-center justify-between text-[#FEFEFE] font-mono text-xs pointer-events-auto">
          <span className="px-2.5 py-1 bg-[#FEFEFE] text-[#000000] font-bold text-[9px] uppercase tracking-wider">
            ALH SHORTS ({currentIndex + 1}/{shorts.length})
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`https://www.youtube.com/shorts/${youtubeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-[#000000]/70 hover:bg-[#000000] text-[#FEFEFE] border border-[#333333]"
              title="Open on YouTube"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleShare}
              className="p-1.5 bg-[#000000]/70 hover:bg-[#000000] text-[#FEFEFE] border border-[#333333]"
              title="Share short"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Metadata & Controls Overlay */}
        <div className="relative z-10 p-4 bg-gradient-to-t from-[#000000] via-[#000000]/90 to-transparent text-[#FEFEFE] font-sans pointer-events-auto">
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-[#FEFEFE]">
            <MapPin className="w-3 h-3 text-[#FEFEFE]" />
            <span className="font-bold">{currentShort.society}</span>
          </div>

          <h3 className="text-sm font-bold uppercase tracking-tight text-[#FEFEFE] mb-2 line-clamp-2 leading-snug">
            {currentShort.title}
          </h3>

          <p className="text-[11px] text-[#D4D4D4] line-clamp-2 mb-3 leading-relaxed">
            {currentShort.description}
          </p>

          {/* Connected Property / Society Badges */}
          <div className="flex flex-wrap gap-2 mb-3 font-mono text-[10px]">
            {currentShort.linkedPropertyId && (
              <Link
                href={`/properties/${currentShort.linkedPropertyId}`}
                onClick={() => {
                  trackEvent('video_property_clicked', { videoId: currentShort.id });
                  if (onClose) onClose();
                }}
                className="px-2.5 py-1 bg-[#FEFEFE] text-[#000000] font-bold uppercase flex items-center gap-1 hover:bg-[#E5E5E5] transition-colors"
              >
                <Building2 className="w-3 h-3" /> Linked Plot / Villa
              </Link>
            )}

            {currentShort.linkedSocietySlug && (
              <Link
                href={`/societies/${currentShort.linkedSocietySlug}`}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className="px-2.5 py-1 border border-[#FEFEFE] text-[#FEFEFE] font-bold uppercase hover:bg-[#FEFEFE] hover:text-[#000000] transition-colors"
              >
                Explore Society
              </Link>
            )}
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('video_enquiry_clicked', { videoId: currentShort.id })
              }
              className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-[#000000] font-black text-center uppercase flex items-center justify-center gap-1.5 shadow-lg transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Enquire Rate
            </a>

            <div className="flex gap-1">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex-1 py-2 border border-[#444444] bg-[#222222] hover:bg-[#333333] text-[#FEFEFE] text-center font-bold disabled:opacity-30 transition-colors flex items-center justify-center gap-1"
                aria-label="Previous short"
              >
                <ChevronUp className="w-4 h-4 hidden sm:inline" /> Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === shorts.length - 1}
                className="flex-1 py-2 border border-[#444444] bg-[#222222] hover:bg-[#333333] text-[#FEFEFE] text-center font-bold disabled:opacity-30 transition-colors flex items-center justify-center gap-1"
                aria-label="Next short"
              >
                Next <ChevronDown className="w-4 h-4 hidden sm:inline" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
