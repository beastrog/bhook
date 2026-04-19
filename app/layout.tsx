import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { StoreStatusProvider } from '@/components/StoreStatusProvider';
import HydrationProvider from '@/components/HydrationProvider';
import { getSettings } from '@/app/actions';

export const metadata: Metadata = {
  title: 'BHOOKH – Midnight Snack Store',
  description: 'Browse, reserve, and collect snacks from your hostel. No app needed – just pay cash.',
  keywords: ['hostel snacks', 'midnight munchies', 'bhookh', 'snack delivery hostel'],
  openGraph: {
    title: 'BHOOKH 🔥',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const isClosed = settings?.store_status === 'closed';

  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <StoreStatusProvider closed={isClosed}>
          <HydrationProvider>
            {isClosed && (
              <div className="bg-err text-[#000000] text-center text-xs sm:text-sm font-extrabold tracking-tight py-2 px-4 sticky top-0 z-[100] shadow-[0_4px_20px_rgba(248,113,113,0.3)]">
                Store will open at 9:30 PM. Stay Tuned!
              </div>
            )}
            {children}
          </HydrationProvider>
        </StoreStatusProvider>
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
