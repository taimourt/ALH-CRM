'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  CONSTRUCTION_SERIES_DATA,
  ConstructionEpisode
} from '@/lib/construction-series-data';
import { trackEvent } from '@/lib/analytics';
import {
  Play,
  HardHat,
  CheckCircle2,
  Calculator,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

interface ConstructionSeriesSectionProps {
  className?: string;
}

export const ConstructionSeriesSection: React.FC<ConstructionSeriesSectionProps> = ({
  className = '',
}) => {
  const [activeStage, setActiveStage] = useState<string>('ALL');
  const [selectedEpisode, setSelectedEpisode] = useState<ConstructionEpisode>(
    CONSTRUCTION_SERIES_DATA[0]
  );
  const [isPlayingInline, setIsPlayingInline] = useState<boolean>(false);
  const playlistContainerRef = useRef<HTMLDivElement>(null);

  const stages = [
    { key: 'ALL', label: `All Episodes (${CONSTRUCTION_SERIES_DATA.length})` },
    { key: 'PLANNING', label: '1. Plot & Planning' },
    { key: 'EXCAVATION', label: '2. Soil & PCC' },
    { key: 'STEEL_FOOTING', label: '3. Steel & Footings' },
    { key: 'WALLS_CHUNAI', label: '4. Brick Chunai' },
    { key: 'PLINTH_DPC', label: '5. Plinth Beam & DPC' },
    { key: 'TURNKEY_FINISH', label: '6. Turnkey Handover' },
  ];

  const filteredEpisodes = CONSTRUCTION_SERIES_DATA.filter((ep) => {
    if (activeStage === 'ALL') return true;
    return ep.stageKey === activeStage;
  });

  const handleSelectEpisode = (ep: ConstructionEpisode) => {
    setSelectedEpisode(ep);
    setIsPlayingInline(true);
    trackEvent('video_watched', {
      videoId: ep.videoId,
      isShort: false,
      series: 'plot_say_ghar_tak',
      episodeNumber: ep.episodeNumber,
    });

    setTimeout(() => {
      const el = document.getElementById(`playlist-ep-${ep.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Asad Land Holdings, I am watching your construction series "Plot Say Ghar Tak" (Episode ${selectedEpisode.episodeNumber}: ${selectedEpisode.title}). I want to enquire about turnkey villa construction / BOQ rates in ${selectedEpisode.society}.`
  );

  return (
    <section
      id="plot-say-ghar-tak"
      className={`py-20 bg-[#0E0E0E] text-[#FEFEFE] border-y border-[#262626] relative overflow-hidden ${className}`}
    >
      {/* Background blueprint grid & geometric lines */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FEFEFE_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A1A1A] border border-[#3A3A3A] text-[#FEFEFE] text-[10px] font-mono uppercase tracking-[0.25em] mb-4 shadow">
              <HardHat className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL CIVIL ENGINEERING SERIES</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#FEFEFE] font-sans">
              PLOT SAY GHAR TAK <span className="text-amber-400">.</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#B0B0B0] max-w-3xl leading-relaxed font-sans">
              The definitive 20-part on-ground house construction masterclass by Asad Land Holdings. Follow every structural stage from plot acquisition, soil testing, Grade 60 steel footings, and moisture-proof DPC marble barriers to turnkey smart villa handover in Wah Cantt and Islamabad.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/calculators"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#3A3A3A] text-[#FEFEFE] text-xs font-mono font-bold uppercase tracking-wider transition-colors"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Construction Calculator</span>
            </Link>

            <a
              href={`https://wa.me/923218004186?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-[#000000] text-xs font-mono font-black uppercase tracking-wider transition-colors shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enquire Construction</span>
            </a>
          </div>
        </div>

        {/* Stage Navigation Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar font-mono text-xs">
          {stages.map((st) => (
            <button
              key={st.key}
              onClick={() => setActiveStage(st.key)}
              className={`px-4 py-2 uppercase font-bold text-[11px] whitespace-nowrap transition-all border ${
                activeStage === st.key
                  ? 'bg-amber-400 text-[#000000] border-amber-400 shadow-lg'
                  : 'bg-[#181818] text-[#A0A0A0] border-[#2E2E2E] hover:border-[#444444] hover:text-[#FEFEFE]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* MAIN CINEMA SHOWCASE: Hero Active Player + Right Playlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
          
          {/* Left: 16:9 Large Video Player Canvas */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative aspect-video bg-[#000000] border border-[#333333] shadow-2xl overflow-hidden group">
              {isPlayingInline ? (
                <iframe
                  key={selectedEpisode.videoId}
                  src={`${selectedEpisode.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedEpisode.title}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  onClick={() => setIsPlayingInline(true)}
                  className="relative w-full h-full cursor-pointer overflow-hidden"
                >
                  <img
                    src={selectedEpisode.thumbnail}
                    alt={selectedEpisode.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-black/40 to-transparent" />
                  
                  {/* Central Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 text-[#000000] flex items-center justify-center border-2 border-[#000000] shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-[#000000] ml-1" />
                    </div>
                  </div>

                  {/* Top Badge Overlay */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-3 py-1 bg-[#000000]/90 border border-amber-400 text-amber-400 font-bold uppercase">
                      EPISODE {selectedEpisode.episodeNumber.toString().padStart(2, '0')} • {selectedEpisode.dayText}
                    </span>
                    <span className="px-2.5 py-1 bg-[#000000]/80 border border-[#444444] text-[#FEFEFE] font-bold">
                      {selectedEpisode.duration}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Active Video Header Info */}
            <div className="mt-4 p-6 bg-[#141414] border border-[#262626]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono text-[11px] text-[#A0A0A0]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold uppercase">
                    {selectedEpisode.phase}
                  </span>
                  <span>•</span>
                  <span>{selectedEpisode.society}</span>
                </div>
                <a
                  href={selectedEpisode.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#FEFEFE] hover:text-amber-400 underline"
                >
                  Watch on YouTube <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <h3 className="text-lg sm:text-xl font-bold uppercase text-[#FEFEFE] tracking-tight font-sans mb-3">
                {selectedEpisode.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#C0C0C0] leading-relaxed font-sans mb-6">
                {selectedEpisode.summary}
              </p>

              {/* Engineering Takeaways Box */}
              <div className="border border-[#2E2E2E] bg-[#0A0A0A] p-4">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider block mb-3">
                  CIVIL ENGINEERING & BOQ KEY STANDARDS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
                  {selectedEpisode.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[#D5D5D5]">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Scrollable Episode Playlist Queue (Shows exactly 7 videos in view height, scrolls for remaining) */}
          <div className="lg:col-span-4 flex flex-col border border-[#2E2E2E] bg-[#141414] shadow-2xl">
            {/* Playlist Header */}
            <div className="p-3.5 bg-[#181818] border-b border-[#2E2E2E] flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="font-bold uppercase text-[#FEFEFE]">
                  Episodes Playlist
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-400/10 text-amber-400 border border-amber-400/30 font-bold">
                  {filteredEpisodes.length}
                </span>
              </div>
              <span className="text-[10px] text-[#CCCCCC] font-mono">
                7 in view • Scroll ↓
              </span>
            </div>

            {/* Scrollable Container (h-[532px] shows exactly 7 video rows with smooth scroll) */}
            <div
              ref={playlistContainerRef}
              className="h-[532px] max-h-[532px] overflow-y-auto divide-y divide-[#242424] bg-[#121212] pr-1 [scrollbar-width:thin] [scrollbar-color:#F59E0B_#1A1A1A] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#181818] [&::-webkit-scrollbar-thumb]:bg-amber-400/80 [&::-webkit-scrollbar-thumb:hover]:bg-amber-400 [&::-webkit-scrollbar-thumb]:rounded"
            >
              {filteredEpisodes.map((ep) => {
                const isSelected = selectedEpisode.id === ep.id;

                return (
                  <div
                    key={ep.id}
                    id={`playlist-ep-${ep.id}`}
                    onClick={() => handleSelectEpisode(ep)}
                    className={`h-[76px] px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors select-none ${
                      isSelected
                        ? 'bg-[#222222] border-l-4 border-l-amber-400'
                        : 'hover:bg-[#1A1A1A] border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Video Thumbnail with duration badge */}
                    <div className="relative w-24 h-[58px] flex-shrink-0 bg-[#000000] overflow-hidden border border-[#333333] group">
                      <img
                        src={ep.thumbnail}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <Play className={`w-3.5 h-3.5 ${isSelected ? 'fill-amber-400 text-amber-400 scale-110' : 'fill-[#FEFEFE] text-[#FEFEFE]'}`} />
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 bg-[#000000]/90 text-[#FEFEFE] text-[8px] font-mono px-1">
                        {ep.duration}
                      </span>
                    </div>

                    {/* Episode Meta & Title */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between text-[9px] font-mono mb-0.5">
                        <span className={`font-bold uppercase ${isSelected ? 'text-amber-400' : 'text-amber-400/90'}`}>
                          EP {ep.episodeNumber.toString().padStart(2, '0')} • {ep.dayText}
                        </span>
                        {isSelected && (
                          <span className="text-[8px] font-bold px-1 py-0.2 bg-amber-400 text-slate-950 rounded uppercase">
                            PLAYING
                          </span>
                        )}
                      </div>
                      <h4
                        className={`text-[11px] sm:text-xs font-bold uppercase tracking-tight line-clamp-2 leading-tight ${
                          isSelected ? 'text-amber-400 font-black' : 'text-[#E0E0E0]'
                        }`}
                      >
                        {ep.title}
                      </h4>
                      <span className="text-[9px] text-[#CCCCCC] font-mono block truncate mt-0.5">
                        {ep.phase}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Playlist Footer Counter & Scroll indicator */}
            <div className="p-2.5 bg-[#161616] border-t border-[#262626] flex items-center justify-between text-[10px] font-mono text-[#CCCCCC]">
              <span>Showing 7 of {filteredEpisodes.length} episodes</span>
              <span className="text-amber-400 font-bold">Scroll for more ↓</span>
            </div>
          </div>
        </div>

        {/* BOTTOM CALLOUT: TURNKEY CONSTRUCTION ENGINEERING ADVISORY */}
        <div className="border border-amber-400/40 bg-gradient-to-r from-[#141414] via-[#1A1A1A] to-[#141414] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Turnkey Villa Construction in Wah Cantt & Islamabad</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold uppercase text-[#FEFEFE] font-sans tracking-tight mb-2">
                Turn Your Plot Into An Architectural Asset with Guaranteed BOQ
              </h3>
              <p className="text-xs sm:text-sm text-[#A0A0A0] font-sans leading-relaxed">
                Asad Land Holdings provides in-house civil engineering oversight, certified Grade 60 deformed rebar verification, zero-seepage DPC execution, and turnkey luxury finishing with milestone-based transparent billing.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/calculators"
                className="py-3 px-5 bg-amber-400 hover:bg-amber-500 text-[#000000] font-mono font-bold uppercase text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <Calculator className="w-4 h-4" /> Calculate 2026 BOQ Rates
              </Link>
              <a
                href={`https://wa.me/923218004186?text=${encodeURIComponent(
                  'Hello Asad Land Holdings, I watched the "Plot Say Ghar Tak" construction series and want to schedule an engineering meeting for turnkey house construction.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#3A3A3A] text-[#FEFEFE] font-mono font-bold uppercase text-xs text-center flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" /> Talk to Chief Civil Engineer
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
