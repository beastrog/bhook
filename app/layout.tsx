import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'BHOOK – Midnight Snack Store',
  description: 'Browse, reserve, and collect snacks from your hostel. No app needed – just pay cash.',
  keywords: ['hostel snacks', 'midnight munchies', 'bhook', 'snack delivery hostel'],
  openGraph: {
    title: 'BHOOK 🔥',
    description: "Tonight's hunger stops here.",
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a08',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1a17',
              border: '1px solid rgba(255,255,255,0.06)',
              color: '#f5f5f0',
              fontFamily: "'DM Sans', sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
