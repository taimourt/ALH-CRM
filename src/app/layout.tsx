import '@/styles/globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = {
  title: 'Asad Land Holdings — Real Estate on Real Rates | Wah Cantt & Islamabad',
  description: 'Official platform of Asad Land Holdings. Premium real-estate investment, sales, transparent property valuation, and architectural construction in Wah Cantt, Taxila, and Islamabad.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-CCCJ6MZW6C"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CCCJ6MZW6C');
            `,
          }}
        />
      </head>
      <body className="h-full bg-[#FEFEFE] text-[#000000] antialiased">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
