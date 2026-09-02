import '@/styles/globals.css';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = {
  title: 'Asad Land Holdings — Real Estate Operating System',
  description: 'Enterprise Real Estate CRM for Pakistani market',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
