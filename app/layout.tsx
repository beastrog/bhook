import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Bhook – Midnight Snacks, Reserved Instantly',
  description: 'Browse, reserve, and pickup snacks from your hostel. No app needed – just pay cash.',
  keywords: ['hostel snacks', 'midnight munchies', 'bhook', 'snack delivery hostel'],
  openGraph: {
    title: 'Bhook 🔥',
    description: 'Tonight\'s hunger stops here.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0e17',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
              background: 'rgba(33, 37, 51, 0.95)',
              border: '1px solid rgba(186, 158, 255, 0.2)',
              color: '#e9eaf8',
              backdropFilter: 'blur(20px)',
            },
          }}
        />
      </body>
    </html>
  );
}
