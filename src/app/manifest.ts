import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/dashboard',
    name: 'Asad Land Holdings CRM',
    short_name: 'ALH CRM',
    description: 'Enterprise Real Estate CRM & Sales Management Operating System',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'window-controls-overlay', 'minimal-ui'],
    orientation: 'any',
    background_color: '#020617',
    theme_color: '#020617',
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'finance', 'productivity'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Pipeline & Deals',
        short_name: 'Deals',
        description: 'View real estate deals and sales pipeline',
        url: '/deals',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Inbound Leads',
        short_name: 'Leads',
        description: 'View and contact assigned client leads',
        url: '/leads',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Inventory & Plots',
        short_name: 'Properties',
        description: 'Search Kohistan Enclave plots and villas',
        url: '/properties',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Agent Leaderboard',
        short_name: 'Agents',
        description: 'View monthly quotas and sales velocity',
        url: '/agents',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
    ],
  };
}
