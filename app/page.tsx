import { getProducts } from '@/app/actions';
import LandingClient from './LandingClient';
import Navbar from '@/components/Navbar';

export default async function LandingPage() {
  const { data: products } = await getProducts();
  const featured = (products || []).slice(0, 8);
  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <LandingClient featuredProducts={featured} />
    </div>
  );
}
