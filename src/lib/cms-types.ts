import { PropertyItem, SocietyItem, VideoItem, AgentItem } from './website-data';
import { FloorPlanItem } from './floor-plans-data';

export interface CMSBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: 'Market Intelligence' | 'Investment Guide' | 'Construction & Architecture' | 'Legal & Verification' | 'Society Spotlight';
  tags: string[];
  readTimeMinutes: number;
  status: 'published' | 'draft';
  publishedAt: string;
  updatedAt: string;
  views: number;
  featured?: boolean;
}

export interface CMSProperty extends PropertyItem {
  status: 'published' | 'draft';
}

export interface CMSFloorPlan extends FloorPlanItem {
  status: 'published' | 'draft';
}

export interface CMSMaterialRates {
  greyStructureRatePerSqFtPKR: number;
  premiumFinishRatePerSqFtPKR: number;
  executiveFinishRatePerSqFtPKR: number;
  cementBagPKR: number;
  steelTonPKR: number;
  bricks1000PKR: number;
  sandTruckPKR: number;
  crushTruckPKR: number;
  electricCablesBundlePKR: number;
  plumbingPipesPerFtPKR: number;
  paintDrumPKR: number;
  lastUpdated: string;
}

export interface CMSVideo extends VideoItem {
  isShort?: boolean;
  featured?: boolean;
}

export interface CMSInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  propertySlug?: string;
  propertyTitle?: string;
  subject: string;
  message: string;
  source: 'website_contact' | 'property_page' | 'floor_plan' | 'price_alert' | 'valuation';
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface CMSSettings {
  siteTitle: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  officeHours: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  enableAnnouncementBanner: boolean;
  announcementText: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
}

export interface CMSDatabase {
  posts: CMSBlogPost[];
  properties: CMSProperty[];
  floorPlans: CMSFloorPlan[];
  materialRates: CMSMaterialRates;
  videos: CMSVideo[];
  inquiries: CMSInquiry[];
  settings: CMSSettings;
  lastBackupDate?: string;
}
