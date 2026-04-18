import LandingClient from './LandingClient';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { getHotProducts, getSettings } from '@/app/actions';

export const revalidate = 60; // ISR 60 seconds

export default async function LandingPage() {
  const [{ data: hotProducts }] = await Promise.all([getHotProducts(), getSettings()]);

  return (
    <div className="min-h-dvh bg-deep">
      <Navbar />
      <LandingClient hotItems={hotProducts || []} />
      <BottomNav />
    </div>
  );
}
