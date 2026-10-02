'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CMSDatabase,
  CMSBlogPost,
  CMSProperty,
  CMSFloorPlan,
  CMSMaterialRates,
  CMSVideo,
  CMSInquiry,
  CMSSettings,
} from '@/lib/cms-types';
import {
  INITIAL_BLOG_POSTS,
  INITIAL_MATERIAL_RATES,
  INITIAL_SETTINGS,
  INITIAL_INQUIRIES,
  getInitialCMSDatabase,
} from '@/lib/cms-seed';

interface CMSContextType {
  posts: CMSBlogPost[];
  properties: CMSProperty[];
  floorPlans: CMSFloorPlan[];
  materialRates: CMSMaterialRates;
  videos: CMSVideo[];
  inquiries: CMSInquiry[];
  settings: CMSSettings;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: string | null;

  // Blog Posts
  addPost: (post: Partial<CMSBlogPost>) => Promise<CMSBlogPost>;
  updatePost: (id: string, updates: Partial<CMSBlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;

  // Properties / Listings
  addProperty: (property: Partial<CMSProperty>) => Promise<CMSProperty>;
  updateProperty: (id: string, updates: Partial<CMSProperty>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;

  // Floor Plans
  addFloorPlan: (plan: Partial<CMSFloorPlan>) => Promise<CMSFloorPlan>;
  updateFloorPlan: (id: string, updates: Partial<CMSFloorPlan>) => Promise<void>;
  deleteFloorPlan: (id: string) => Promise<void>;

  // Material & Construction Rates
  updateMaterialRates: (rates: Partial<CMSMaterialRates>) => Promise<void>;

  // Videos
  addVideo: (video: Partial<CMSVideo>) => Promise<CMSVideo>;
  updateVideo: (id: string, updates: Partial<CMSVideo>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;

  // Inquiries / Leads
  addInquiry: (inquiry: Partial<CMSInquiry>) => Promise<CMSInquiry>;
  markInquiryStatus: (id: string, status: 'unread' | 'read' | 'replied') => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // Settings
  updateSettings: (settings: Partial<CMSSettings>) => Promise<void>;

  // Admin Tools
  resetToDefaults: () => Promise<void>;
  exportDatabase: () => CMSDatabase;
  importDatabase: (db: CMSDatabase) => Promise<void>;
  refresh: () => Promise<void>;
}

const CMSContext = createContext<CMSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'alh_website_cms_db_v2';

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<CMSDatabase>(() => {
    // Initial fallback
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (e) {
        console.warn('Could not read local CMS cache', e);
      }
    }
    return getInitialCMSDatabase();
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Sync to API and LocalStorage
  const persistDb = useCallback(async (newDb: CMSDatabase) => {
    setDb(newDb);
    setIsSaving(true);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newDb));
      } catch (e) {
        console.error('LocalStorage write failed:', e);
      }
    }

    try {
      await fetch('/api/cms/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDb),
      });
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.warn('CMS API persistence warning (running offline / local):', error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Fetch from server on initial mount
  const fetchFromServer = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cms/data', { cache: 'no-store' });
      if (res.ok) {
        const data: CMSDatabase = await res.json();
        if (data && data.properties && data.posts) {
          setDb(data);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          }
        }
      }
    } catch (e) {
      console.warn('Using local CMS cache as server request fell back:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFromServer();
  }, [fetchFromServer]);

  // --- BLOG POST CRUD ---
  const addPost = async (partial: Partial<CMSBlogPost>): Promise<CMSBlogPost> => {
    const slug =
      partial.slug ||
      (partial.title || 'new-post')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newPost: CMSBlogPost = {
      id: `post-${Date.now()}`,
      slug,
      title: partial.title || 'Untitled Post',
      excerpt: partial.excerpt || 'Brief summary of the article...',
      content: partial.content || 'Write your article content here...',
      coverImage: partial.coverImage || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1200&auto=format&fit=crop',
      author: partial.author || {
        name: 'Asad Ali',
        role: 'Managing Director',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop',
      },
      category: partial.category || 'Market Intelligence',
      tags: partial.tags || ['Wah Cantt', 'Real Estate'],
      readTimeMinutes: partial.readTimeMinutes || 5,
      status: partial.status || 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      featured: !!partial.featured,
    };

    const nextDb: CMSDatabase = {
      ...db,
      posts: [newPost, ...db.posts],
    };
    await persistDb(nextDb);
    return newPost;
  };

  const updatePost = async (id: string, updates: Partial<CMSBlogPost>) => {
    const nextPosts = db.posts.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    await persistDb({ ...db, posts: nextPosts });
  };

  const deletePost = async (id: string) => {
    const nextPosts = db.posts.filter((p) => p.id !== id);
    await persistDb({ ...db, posts: nextPosts });
  };

  // --- PROPERTIES CRUD ---
  const addProperty = async (partial: Partial<CMSProperty>): Promise<CMSProperty> => {
    const title = partial.title || 'New Property Listing';
    const slug =
      partial.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProperty: CMSProperty = {
      id: `prop-${Date.now()}`,
      slug,
      title,
      society: partial.society || 'Kohistan Enclave',
      societySlug: partial.societySlug || 'kohistan-enclave',
      city: partial.city || 'Wah Cantt',
      location: partial.location || 'GT Road, Wah Cantt',
      propertyType: partial.propertyType || 'RESIDENTIAL_PLOT',
      purpose: partial.purpose || 'INVESTMENT',
      sizeMarla: partial.sizeMarla || 10,
      sizeSqFt: partial.sizeSqFt || (partial.sizeMarla || 10) * 225,
      demandPrice: partial.demandPrice || 16500000,
      marketPrice: partial.marketPrice || partial.demandPrice || 16500000,
      pricePerSqFt: Math.round((partial.demandPrice || 16500000) / ((partial.sizeMarla || 10) * 225)),
      pricePerMarla: Math.round((partial.demandPrice || 16500000) / (partial.sizeMarla || 10)),
      nocStatus: partial.nocStatus || 'Verified RDA Approved',
      devStatus: partial.devStatus || '100% Developed & Ready for Possession',
      possessionStatus: partial.possessionStatus || 'AVAILABLE',
      developmentStatus: partial.developmentStatus || 'DEVELOPED',
      availabilityStatus: partial.availabilityStatus || 'AVAILABLE',
      plotNumber: partial.plotNumber || '',
      sectorBlock: partial.sectorBlock || 'Sector A',
      description: partial.description || 'Prime verified plot with direct owner registry title.',
      features: partial.features || ['Main Boulevard Access', 'Underground Utilities', 'Possession Ready'],
      image: partial.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
      gallery: partial.gallery || [
        partial.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop',
      ],
      createdDate: new Date().toISOString(),
      agentName: partial.agentName || 'Asad Ali',
      agentPhone: partial.agentPhone || '+92 300 5123456',
      isFeatured: !!partial.isFeatured,
      isHotInvestment: !!partial.isHotInvestment,
      status: partial.status || 'published',
    };

    const nextDb: CMSDatabase = {
      ...db,
      properties: [newProperty, ...db.properties],
    };
    await persistDb(nextDb);
    return newProperty;
  };

  const updateProperty = async (id: string, updates: Partial<CMSProperty>) => {
    const nextProperties = db.properties.map((p) => (p.id === id ? { ...p, ...updates } : p));
    await persistDb({ ...db, properties: nextProperties });
  };

  const deleteProperty = async (id: string) => {
    const nextProperties = db.properties.filter((p) => p.id !== id);
    await persistDb({ ...db, properties: nextProperties });
  };

  // --- FLOOR PLANS CRUD ---
  const addFloorPlan = async (partial: Partial<CMSFloorPlan>): Promise<CMSFloorPlan> => {
    const area = partial.totalCoveredAreaSqFt || 2200;
    const newPlan: CMSFloorPlan = {
      id: `fp-${Date.now()}`,
      slug: partial.slug || `fp-${Date.now()}`,
      title: partial.title || 'New Architectural Design',
      subtitle: partial.subtitle || 'Executive modern architectural layout for prime residential plots',
      plotDimensions: partial.plotDimensions || "25' × 45'",
      plotSizeCategory: partial.plotSizeCategory || '5_MARLA',
      architecturalStyle: partial.architecturalStyle || 'MINIMALIST_CUBIC',
      styleLabel: partial.styleLabel || 'Minimalist Cubic Modern',
      totalCoveredAreaSqFt: area,
      groundFloorCoveredAreaSqFt: Math.round(area * 0.5),
      firstFloorCoveredAreaSqFt: Math.round(area * 0.45),
      bedrooms: partial.bedrooms || 3,
      bathrooms: partial.bathrooms || 4,
      carPorchCapacity: partial.carPorchCapacity || '1 Sedan',
      carPorchCount: partial.carPorchCount || 1,
      kitchensCount: partial.kitchensCount || 2,
      hasServantQuarter: partial.hasServantQuarter ?? false,
      hasPowderRoom: partial.hasPowderRoom ?? true,
      hasDirtyKitchen: partial.hasDirtyKitchen ?? true,
      hasIndoorCourtyard: partial.hasIndoorCourtyard ?? false,
      hasTerraceBalcony: partial.hasTerraceBalcony ?? true,
      elevation3dRender: partial.elevation3dRender || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
      gallery: partial.gallery || ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop'],
      boqCostEstimates: partial.boqCostEstimates || {
        greyStructureRatePerSqFt: 2650,
        greyStructureTotalPKR: area * 2650,
        premiumFinishingRatePerSqFt: 2800,
        premiumFinishingTotalPKR: area * 2800,
        executiveSignatureRatePerSqFt: 4300,
        executiveSignatureTotalPKR: area * 4300,
      },
      spatialAnalysis: partial.spatialAnalysis || {
        naturalLightScore: 9.2,
        crossVentilationScore: 8.8,
        circulationEfficiencyPct: 89,
        otsVentilationShaftsCount: 2,
        ventilationDescription: 'Dual open-to-sky ventilation shafts for continuous airflow',
      },
      roomDimensions: partial.roomDimensions || [],
      suitableSocieties: partial.suitableSocieties || ['Kohistan Enclave', 'New City Phase 2'],
      leadArchitect: partial.leadArchitect || 'Engr. Hammad Tariq',
      description: partial.description || 'Standard optimized residential blueprint.',
      keyHighlights: partial.keyHighlights || ['Open Concept Lounge', 'Rooftop Pergola', 'Concealed Ducting'],
      architectRemarks: partial.architectRemarks || 'Optimized for energy efficiency and natural ventilation.',
      status: partial.status || 'published',
    };

    const nextDb: CMSDatabase = {
      ...db,
      floorPlans: [newPlan, ...db.floorPlans],
    };
    await persistDb(nextDb);
    return newPlan;
  };

  const updateFloorPlan = async (id: string, updates: Partial<CMSFloorPlan>) => {
    const nextPlans = db.floorPlans.map((fp) => (fp.id === id ? { ...fp, ...updates } : fp));
    await persistDb({ ...db, floorPlans: nextPlans });
  };

  const deleteFloorPlan = async (id: string) => {
    const nextPlans = db.floorPlans.filter((fp) => fp.id !== id);
    await persistDb({ ...db, floorPlans: nextPlans });
  };

  // --- MATERIAL RATES ---
  const updateMaterialRates = async (rates: Partial<CMSMaterialRates>) => {
    const nextRates: CMSMaterialRates = {
      ...db.materialRates,
      ...rates,
      lastUpdated: new Date().toISOString(),
    };
    await persistDb({ ...db, materialRates: nextRates });
  };

  // --- VIDEOS ---
  const addVideo = async (partial: Partial<CMSVideo>): Promise<CMSVideo> => {
    const youtubeId = partial.youtubeId || 'dQw4w9WgXcQ';
    const newVideo: CMSVideo = {
      id: `vid-${Date.now()}`,
      title: partial.title || 'New Video Walkthrough',
      youtubeId,
      thumbnail: partial.thumbnail || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      videoUrl: partial.videoUrl || `https://youtube.com/watch?v=${youtubeId}`,
      society: partial.society || 'Kohistan Enclave',
      publishedDate: partial.publishedDate || new Date().toISOString(),
      duration: partial.duration || '0:58',
      category: partial.category || 'DEVELOPMENT_UPDATE',
      description: partial.description || 'Verified on-ground visual inspection.',
      isShort: partial.isShort ?? true,
      featured: partial.featured ?? true,
    };

    const nextDb: CMSDatabase = {
      ...db,
      videos: [newVideo, ...db.videos],
    };
    await persistDb(nextDb);
    return newVideo;
  };

  const updateVideo = async (id: string, updates: Partial<CMSVideo>) => {
    const nextVideos = db.videos.map((v) => (v.id === id ? { ...v, ...updates } : v));
    await persistDb({ ...db, videos: nextVideos });
  };

  const deleteVideo = async (id: string) => {
    const nextVideos = db.videos.filter((v) => v.id !== id);
    await persistDb({ ...db, videos: nextVideos });
  };

  // --- INQUIRIES ---
  const addInquiry = async (partial: Partial<CMSInquiry>): Promise<CMSInquiry> => {
    const newInquiry: CMSInquiry = {
      id: `inq-${Date.now()}`,
      name: partial.name || 'Website Visitor',
      phone: partial.phone || '',
      email: partial.email || '',
      subject: partial.subject || 'Website Inquiry',
      message: partial.message || '',
      propertySlug: partial.propertySlug || '',
      propertyTitle: partial.propertyTitle || '',
      source: partial.source || 'website_contact',
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    const nextDb: CMSDatabase = {
      ...db,
      inquiries: [newInquiry, ...db.inquiries],
    };
    await persistDb(nextDb);
    return newInquiry;
  };

  const markInquiryStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    const nextInquiries = db.inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq));
    await persistDb({ ...db, inquiries: nextInquiries });
  };

  const deleteInquiry = async (id: string) => {
    const nextInquiries = db.inquiries.filter((inq) => inq.id !== id);
    await persistDb({ ...db, inquiries: nextInquiries });
  };

  // --- SETTINGS ---
  const updateSettings = async (settingsUpdates: Partial<CMSSettings>) => {
    const nextSettings: CMSSettings = {
      ...db.settings,
      ...settingsUpdates,
    };
    await persistDb({ ...db, settings: nextSettings });
  };

  // --- RESET & BACKUP ---
  const resetToDefaults = async () => {
    const initial = getInitialCMSDatabase();
    await persistDb(initial);
  };

  const exportDatabase = (): CMSDatabase => {
    return { ...db };
  };

  const importDatabase = async (importedDb: CMSDatabase) => {
    if (importedDb && importedDb.posts && importedDb.properties) {
      await persistDb(importedDb);
    }
  };

  return (
    <CMSContext.Provider
      value={{
        posts: db.posts || [],
        properties: db.properties || [],
        floorPlans: db.floorPlans || [],
        materialRates: db.materialRates || INITIAL_MATERIAL_RATES,
        videos: db.videos || [],
        inquiries: db.inquiries || [],
        settings: db.settings || INITIAL_SETTINGS,
        isLoading,
        isSaving,
        lastSaved,
        addPost,
        updatePost,
        deletePost,
        addProperty,
        updateProperty,
        deleteProperty,
        addFloorPlan,
        updateFloorPlan,
        deleteFloorPlan,
        updateMaterialRates,
        addVideo,
        updateVideo,
        deleteVideo,
        addInquiry,
        markInquiryStatus,
        deleteInquiry,
        updateSettings,
        resetToDefaults,
        exportDatabase,
        importDatabase,
        refresh: fetchFromServer,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
