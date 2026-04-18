import LandingClient from './LandingClient';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-deep">
      <Navbar />
      <LandingClient />
      <BottomNav />
    </div>
  );
}
