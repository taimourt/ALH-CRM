import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { MainLayout } from '@/components/layout/main-layout';
import { PWAProvider } from '@/components/pwa-provider';

export const metadata: Metadata = {
  title: 'Asad Land Holdings — Real Estate Operating System CRM',
  description: 'Enterprise Real Estate CRM & Sales Velocity Operating System for Pakistani property advisories',
  applicationName: 'ALH CRM',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ALH CRM',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <PWAProvider>
          <MainLayout>{children}</MainLayout>
        </PWAProvider>
      </body>
    </html>
  );
}

