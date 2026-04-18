import LandingClient from './LandingClient';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import { getProducts } from '@/app/actions';

export const revalidate = 60; // ISR 60 seconds

export default async function LandingPage() {
  const { data: products } = await getProducts();

  return (
    <div className="min-h-dvh bg-deep">
      <Navbar />
      <LandingClient products={products || []} />
      <BottomNav />
    </div>
  );
}
