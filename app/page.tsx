import LandingClient from './LandingClient';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-black">
      <Navbar />
      <LandingClient />
    </div>
  );
}
